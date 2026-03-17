import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSection } from "../../../services/sectionApi";
import Skeleton from "../../Skeleton";
import ScrollReveal from "../../ScrollReveal";

interface ProcessDetail {
  id: string;
  detailTitle: string;
  detailDesc: string;
  detailIcon?: { url: string } | null;
  detailKeywords?: string;
}

interface Process {
  id: string;
  processTitle: string;
  processIcon?: { url: string } | null;
  details: ProcessDetail[];
}

interface TimelineData {
  sectionTitle?: string;
  deliveryTime?: string;
  processes?: Process[];
}

interface ButtonData {
  button1Name?: string;
  button2?: { text: string; link: string };
}

const WorksProcess = () => {
  const [timeline, setTimeline] = useState<TimelineData>({});
  const [buttons, setButtons] = useState<ButtonData>({});
  const [loaded, setLoaded] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApproach = () => {
    const processes = timeline.processes || [];
    const activeProcess = processes.find((p) => p.id === activeProcessId);
    if (activeProcess) {
      navigate("/projects", { state: { categoryName: activeProcess.processTitle } });
    } else {
      navigate("/projects");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s2, s3] = await Promise.all([
          getSection("works", "section2"),
          getSection("works", "section3"),
        ]);
        const timelineData = s2.content || {};
        setTimeline(timelineData);
        setButtons(s3.content || {});

        // Set first process as active
        if (timelineData.processes && timelineData.processes.length > 0) {
          setActiveProcessId(timelineData.processes[0].id);
        }
      } catch (err) {
        console.error("Failed to load works process:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Wheel → horizontal scroll for process detail cards
  useEffect(() => {
    if (!activeProcessId) return;

    const timer = setTimeout(() => {
      const container = document.querySelector(
        `[data-process-scroll="${activeProcessId}"]`,
      ) as HTMLElement | null;
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        if (container.scrollWidth <= container.clientWidth) return;
        e.preventDefault();
        e.stopPropagation();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      // Calculate explicit width to exactly hit the right screen edge
      const setBreakoutWidth = () => {
        if (!container.parentElement) return;
        const rect = container.parentElement.getBoundingClientRect();
        container.style.width = `${window.innerWidth - rect.left}px`;
      };

      setBreakoutWidth();
      window.addEventListener("resize", setBreakoutWidth);

      (
        container as HTMLElement & { __processWheelCleanup?: () => void }
      ).__processWheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", setBreakoutWidth);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = document.querySelector(
        `[data-process-scroll="${activeProcessId}"]`,
      ) as (HTMLElement & { __processWheelCleanup?: () => void }) | null;
      if (container?.__processWheelCleanup) {
        container.__processWheelCleanup();
      }
    };
  }, [activeProcessId]);

  if (!loaded) {
    return (
      <section className="w-full bg-white mt-20 md:mt-32 relative">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-16">
          <Skeleton className="w-[200px] h-[40px] md:h-[50px]" />
          
          <div className="flex flex-col xl:flex-row xl:gap-16 w-full">
            <div className="flex flex-col justify-between gap-8 w-full xl:w-[280px] shrink-0">
              <div className="flex flex-col gap-3">
                <Skeleton className="w-full h-[48px] rounded-xl" />
                <Skeleton className="w-full h-[48px] rounded-xl" />
                <Skeleton className="w-full h-[48px] rounded-xl" />
              </div>
              <Skeleton className="w-full h-[80px] rounded-xl" />
            </div>
            
            <div className="flex-1 flex gap-5 overflow-hidden mt-15 xl:mt-0">
              <Skeleton className="w-[300px] md:w-[380px] shrink-0 min-h-[280px] rounded-2xl" />
              <Skeleton className="w-[300px] md:w-[380px] shrink-0 min-h-[280px] rounded-2xl" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4">
            <Skeleton className="w-[180px] h-[48px] rounded-xl" />
            <Skeleton className="w-[180px] h-[48px] rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const processes = timeline.processes || [];
  if (processes.length === 0) return null;

  const activeProcess =
    processes.find((p) => p.id === activeProcessId) || processes[0];

  const btn1 = buttons.button1Name || "Approach";
  const btn2 = buttons.button2 || { text: "Get started", link: "/contact" };

  return (
    <section
      className="w-full bg-white mt-20 md:mt-30 relative"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      <div
        className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-16"
        style={{ overflow: "visible" }}
      >
        {/* Section Title */}
        <ScrollReveal>
          <h2 className="font-primary text-[32px] md:text-[42px] uppercase font-normal tracking-[-0.02em] m-0">
            {timeline.sectionTitle || ""}
          </h2>
        </ScrollReveal>

        {/* Main Content: Left Tabs + Right Cards */}
        <div className="flex flex-col xl:flex-row xl:gap-16 w-full">
          {/* Left Side: Tabs + Delivery Time */}
          <ScrollReveal delay={0.2} direction="right" className="flex flex-col justify-between gap-8 w-full xl:w-[280px] shrink-0 self-stretch">
            {/* Process Tabs */}
            <div className="flex flex-col gap-3 w-full xl:w-[280px]">
              {processes.map((process) => {
                const isActive = activeProcessId === process.id;
                return (
                  <button
                    key={process.id}
                    onClick={() => setActiveProcessId(process.id)}
                    className={`cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-primary text-[14px] md:text-[15px] font-medium transition-all duration-200 focus:outline-none border w-full ${
                      isActive
                        ? "bg-[#e0e0e0] text-black"
                        : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
                    }`}
                  >
                    {process.processIcon?.url && (
                      <img
                        src={process.processIcon.url}
                        alt=""
                        className={`w-5 h-5 object-contain ${isActive ? "opacity-100" : "opacity-60"}`}
                      />
                    )}
                    {process.processTitle}
                  </button>
                );
              })}
            </div>

            {/* Est. Delivery Time */}
            {timeline.deliveryTime && (
              <div className="bg-white px-8 py-2 rounded-xl flex flex-col items-center justify-center gap-1 w-full xl:w-[280px] shadow-sm border border-black/8">
                <span className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  Est. Delivery Time
                </span>
                <span className="text-[18px] md:text-[22px] font-bold text-black tracking-tight">
                  {timeline.deliveryTime}
                </span>
              </div>
            )}
          </ScrollReveal>

          {/* Right Side: Detail Cards (horizontal scroll) */}
          <div
            className="flex-1 w-full min-w-0 mt-15 xl:mt-0"
            style={{ overflow: "visible" }}
          >
            <div
              data-process-scroll={activeProcessId}
              className="flex gap-5 overflow-x-auto scrollbar-hide pr-[2px]"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                overscrollBehavior: "contain",
                paddingRight: "40px",
              }}
            >              {activeProcess.details?.map((detail, i) => (
                <div key={detail.id} className="flex items-center gap-5 shrink-0">
                  <ScrollReveal
                    delay={0.3 + i * 0.1}
                    direction="up"
                    className="bg-white p-8 md:p-10 rounded-2xl w-[260px] md:w-[380px] shrink-0 border border-black/8 shadow-sm flex flex-col justify-between h-[300px] md:h-[360px] transition-shadow duration-300 hover:shadow-md"
                  >
                    {/* Icon */}
                    <div className="flex flex-col gap-3 lg:gap-6">
                      {detail.detailIcon?.url ? (
                        <img
                          src={detail.detailIcon.url}
                          alt=""
                          className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                          <span className="text-[18px] font-bold text-black/30">
                            {i + 1}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h4 className="font-primary text-[22px] md:text-[26px] font-bold text-black leading-tight tracking-tight m-0 line-clamp-2">
                        {detail.detailTitle}
                      </h4>

                      {/* Description */}
                      <p className="font-primary text-[14px] md:text-[15px] leading-[1.6] text-black/50 m-0 line-clamp-4">
                        {detail.detailDesc}
                      </p>
                    </div>

                    {/* Keywords / Tags */}
                    {detail.detailKeywords && (
                      <div className="flex flex-wrap items-center gap-y-3 mt-4 lg:mt-8">
                        {/* Leading separator */}
                        <span className="w-[1.5px] h-[10px] lg:h-[14px] bg-black/30 mr-1.5 lg:mr-3"></span>
                        {detail.detailKeywords.split(",").map((kw, j) => (
                          <span
                            key={j}
                            className="text-[6px] lg:text-[8px] font-bold text-black uppercase tracking-wide flex items-center"
                          >
                            {kw.trim()}
                            <span className="w-[1.5px] h-[10px] lg:h-[14px] bg-black/30 mx-1.5 lg:mx-3"></span>
                          </span>
                        ))}
                      </div>
                    )}
                  </ScrollReveal>

                  {/* Arrow between items */}
                  {i < (activeProcess.details?.length || 0) - 1 && (
                    <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] shrink-0 self-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <ScrollReveal delay={0.4} direction="up" className="flex flex-row items-center justify-center lg:justify-end gap-4 lg:gap-8 mt-4">
          <button 
            onClick={handleApproach}
            className="cursor-pointer px-6 py-2 border border-black/20 rounded-xl font-primary text-[15px] font-bold text-black bg-white hover:bg-black hover:text-white transition-all duration-300"
          >
            {btn1}
          </button>
          <a
            href={btn2.link}
            className="inline-flex items-center justify-center px-6 py-2 bg-[#8B5CF6] text-white rounded-xl font-primary text-[15px] font-bold hover:bg-[#7C3AED] transition-all duration-300 text-center"
          >
            {btn2.text}
          </a>
        </ScrollReveal>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default WorksProcess;
