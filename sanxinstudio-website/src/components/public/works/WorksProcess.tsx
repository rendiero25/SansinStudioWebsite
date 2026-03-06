import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";

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

      (
        container as HTMLElement & { __processWheelCleanup?: () => void }
      ).__processWheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
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

  if (!loaded) return null;

  const processes = timeline.processes || [];
  if (processes.length === 0) return null;

  const activeProcess =
    processes.find((p) => p.id === activeProcessId) || processes[0];

  const btn1 = buttons.button1Name || "Approach";
  const btn2 = buttons.button2 || { text: "Get started", link: "/contact" };

  return (
    <section
      className="w-full bg-white py-20 md:py-32 relative"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      <div
        className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-16"
        style={{ overflow: "visible" }}
      >
        {/* Section Title */}
        <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0">
          {timeline.sectionTitle || "Our Process"}
        </h2>

        {/* Main Content: Left Tabs + Right Cards */}
        <div className="flex flex-col xl:flex-row items-start gap-10 xl:gap-16 w-full">
          {/* Left Side: Tabs + Delivery Time */}
          <div className="flex flex-col gap-8 w-full xl:w-[280px] shrink-0">
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
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-white text-black/70 border-black/10 hover:border-black/30 hover:bg-black/5"
                    }`}
                  >
                    {process.processIcon?.url && (
                      <img
                        src={process.processIcon.url}
                        alt=""
                        className={`w-5 h-5 object-contain ${isActive ? "brightness-0 invert" : "opacity-70"}`}
                      />
                    )}
                    {process.processTitle}
                  </button>
                );
              })}
            </div>

            {/* Est. Delivery Time */}
            {timeline.deliveryTime && (
              <div className="bg-white px-8 py-4 rounded-xl flex flex-col items-center justify-center gap-1 w-full xl:w-[280px] shadow-sm border border-black/8">
                <span className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  Est. Delivery Time
                </span>
                <span className="text-[18px] md:text-[22px] font-bold text-black tracking-tight">
                  {timeline.deliveryTime}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Detail Cards (horizontal scroll) */}
          <div
            className="flex-1 w-full min-w-0"
            style={{ overflow: "visible" }}
          >
            <div
              data-process-scroll={activeProcessId}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {activeProcess.details?.map((detail, i) => (
                <div
                  key={detail.id}
                  className="bg-white p-8 md:p-10 rounded-2xl w-[300px] md:w-[380px] shrink-0 border border-black/8 shadow-sm flex flex-col justify-between min-h-[280px] transition-shadow duration-300 hover:shadow-md"
                >
                  {/* Icon */}
                  <div className="flex flex-col gap-6">
                    {detail.detailIcon?.url ? (
                      <img
                        src={detail.detailIcon.url}
                        alt=""
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/5 flex items-center justify-center">
                        <span className="text-[18px] font-bold text-black/30">
                          {i + 1}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="font-primary text-[22px] md:text-[26px] font-bold text-black leading-tight tracking-tight m-0">
                      {detail.detailTitle}
                    </h4>

                    {/* Description */}
                    <p className="font-primary text-[14px] md:text-[15px] leading-[1.6] text-black/50 m-0">
                      {detail.detailDesc}
                    </p>
                  </div>

                  {/* Keywords / Tags */}
                  {detail.detailKeywords && (
                    <div className="flex flex-wrap items-center gap-0 mt-8">
                      {detail.detailKeywords.split(",").map((kw, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-bold text-black uppercase tracking-wide flex items-center"
                        >
                          <span className="w-[1.5px] h-[14px] bg-black/30 mx-3 first:hidden"></span>
                          {j > 0 && (
                            <span className="w-[1.5px] h-[14px] bg-black/30 mr-3"></span>
                          )}
                          {kw.trim()}
                        </span>
                      ))}
                      {/* Trailing separator */}
                      <span className="w-[1.5px] h-[14px] bg-black/30 ml-3"></span>
                    </div>
                  )}
                </div>
              ))}

              {/* Next card arrow indicator */}
              {activeProcess.details && activeProcess.details.length > 1 && (
                <div className="flex items-center shrink-0 pr-4">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button className="cursor-pointer px-12 py-3 border border-black/20 rounded-xl font-primary text-[15px] font-bold text-black bg-white hover:bg-black hover:text-white transition-all duration-300 min-w-[180px]">
            {btn1}
          </button>
          <a
            href={btn2.link}
            className="inline-flex items-center justify-center px-12 py-3 bg-[#8B5CF6] text-white rounded-xl font-primary text-[15px] font-bold hover:bg-[#7C3AED] transition-all duration-300 min-w-[180px] text-center"
          >
            {btn2.text}
          </a>
        </div>
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
