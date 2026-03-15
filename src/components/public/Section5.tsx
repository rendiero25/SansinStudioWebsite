import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface SubItem {
  id: string;
  icon?: { url: string; publicId: string };
  description?: string;
}

interface SolutionItem {
  id: string;
  icon?: { url: string; publicId: string };
  title?: string;
  subItems?: SubItem[];
}

interface Section5Data {
  title?: string;
  label?: { text: string; link: string };
  solutions?: SolutionItem[];
}

const renderStyledText = (text: string) => {
  if (!text) return null;

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <span
          key={i}
          className="italic underline underline-offset-4 decoration-1"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={i} className="italic">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const Section5 = () => {
  const [data, setData] = useState<Section5Data>({});
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section5");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section5:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Prevent default wheel on native event to stop page scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const preventScroll = (e: WheelEvent) => {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      if (!hasOverflow) return;

      // Always prevent page scroll when hovering over the cards
      e.preventDefault();
      e.stopPropagation();

      // Convert vertical scroll to horizontal
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", preventScroll, { passive: false });
    return () => container.removeEventListener("wheel", preventScroll);
  }, [loaded]);

  const labelBtn = data.label || { text: "Solutions", link: "/solutions" };

  return (
    <section
      className="relative w-full bg-white py-20 md:py-28"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      {/* Subtle purple glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" />

      <div
        className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20"
        style={{ overflow: "visible" }}
      >
        <div
          className="flex flex-col justify-between xl:flex-row gap-10 md:gap-20"
          style={{ overflow: "visible" }}
        >
          {/* Left: Title + Label */}
          <div className="md:max-w-[450px] shrink-0 w-full">
            {!loaded ? (
              <div className="space-y-4 mb-12">
                <Skeleton className="w-full h-[30px] md:h-[45px]" />
                <Skeleton className="w-[80%] h-[30px] md:h-[45px]" />
                <Skeleton className="w-[90%] h-[30px] md:h-[45px]" />
              </div>
            ) : (
              <ScrollReveal>
                <h2 className="font-primary text-[23px] md:text-[42px] font-light text-black leading-[1.15] tracking-[-0.03em] m-0 mb-12">
                  {renderStyledText(
                    data.title ||
                      "Yes, we can make it happen for you, the _future leading company_",
                  )}
                </h2>
              </ScrollReveal>
            )}

            {!loaded ? (
              <Skeleton className="w-[120px] h-[45px] rounded-lg" />
            ) : (
              <ScrollReveal delay={0.2}>
                <Link
                  to={labelBtn.link}
                  className="inline-flex items-center justify-center px-6 py-2 bg-transparent text-black font-primary text-[15px] font-bold border border-black/20 rounded-xl hover:bg-black hover:text-white transition-all duration-300 tracking-[0.01em] no-underline"
                >
                  {labelBtn.text}
                </Link>
              </ScrollReveal>
            )}
          </div>

          {/* Right: Solution Cards — breaks out of container to right edge */}
          {!loaded ? (
            <div
              className="flex-1 flex gap-10 overflow-x-auto pb-6 scrollbar-hide snap-x pointer-events-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                marginRight: "calc(-50vw + 50%)",
                paddingRight: "20px",
              }}
            >
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="snap-start min-w-[340px] w-[330px] xl:w-[380px] shrink-0 bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col justify-between min-h-[500px]"
                >
                  <div className="h-full flex flex-col justify-between items-start w-full">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-8 w-full">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-[150px] h-[28px]" />
                    </div>

                    {/* Sub Items */}
                    <div className="flex flex-col gap-3 w-full">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="w-full h-[45px] rounded-md" />
                      ))}
                    </div>

                    {/* Arrow button at bottom */}
                    <div className="mt-8 pt-4">
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            data.solutions && data.solutions.length > 0 && (
              <div
                ref={scrollRef}
                className="flex-1 flex gap-10 overflow-x-auto pb-6 scrollbar-hide snap-x cursor-grab active:cursor-grabbing"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  marginRight: "calc(-50vw + 50%)",
                  paddingRight: "20px",
                  overscrollBehavior: "contain",
                }}
              >
                {data.solutions.map((solution, index) => (
                  <ScrollReveal
                    key={solution.id}
                    delay={0.3 + index * 0.1}
                    direction="right"
                    className="snap-start min-w-[340px] w-[330px] xl:w-[380px] shrink-0 bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col justify-between min-h-[500px]"
                  >
                    <div className="h-full flex flex-col justify-between items-start">
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3 mb-8">
                        {solution.icon?.url && (
                          <img
                            src={solution.icon.url}
                            alt=""
                            className="w-6 h-6 object-contain opacity-70"
                          />
                        )}
                        <span className="font-['Outfit'] text-[24px] font-medium text-black">
                          {solution.title}
                        </span>
                      </div>

                      {/* Sub Items */}
                      {solution.subItems && solution.subItems.length > 0 && (
                        <div className="flex flex-col gap-3 w-full">
                          {solution.subItems.map((sub) => (
                            <div
                              key={sub.id}
                              className="w-full flex items-center gap-3 bg-[#EEEEEE] rounded-md px-4 py-2.5 overflow-hidden"
                            >
                              {sub.icon?.url ? (
                                <img
                                  src={sub.icon.url}
                                  alt=""
                                  className="w-4 h-4 object-contain shrink-0 opacity-60"
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-black/20 shrink-0" />
                              )}
                              <span className="font-primary text-[17px] font-medium text-black/70 leading-tight">
                                {sub.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Arrow button at bottom */}
                      <div className="mt-8 pt-4">
                        <button className="w-8 h-8 flex items-center justify-center bg-[#4D4D4D] text-white rounded-full text-[15px] font-bold hover:bg-[#1A1A1A] transition-colors duration-200">
                          ›
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Section5;
