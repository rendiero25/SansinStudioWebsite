import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";
import { Link } from "react-router-dom";
import type { Category } from "../cms/CategorySolutionsEditor";

interface Section3Data {
  sectionLabel?: string;
  description?: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CategoryCard = ({
  cat,
  isExpanded,
  onToggle,
}: {
  cat: Category;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-xl overflow-hidden ${
        isExpanded
          ? "w-[300px] md:w-[350px] bg-[#d9d9d9] cursor-pointer"
          : "w-[300px] md:w-[350px] cursor-pointer hover:shadow-lg bg-white"
      } h-[450px] flex flex-col p-8`}
      onClick={!isExpanded ? onToggle : undefined}
    >
      {/* Shared Header: Icon + Title - Hidden when expanded to avoid double title */}
      <div className={`flex items-center gap-3 z-10 transition-all duration-300 ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        {cat.categoryIcon?.url && (
          <img
            src={cat.categoryIcon.url}
            alt=""
            className="w-8 h-8 object-contain"
          />
        )}
        <h3 className="font-primary text-[28px] md:text-[32px] font-medium tracking-tight text-[#111] m-0">
          {cat.categoryName}
        </h3>
      </div>

      {/* Cross-fade Content Container */}
      <div className="relative flex-1">
        {/* UNEXPANDED CONTENT */}
        <div
          className={`absolute inset-0 flex flex-col transition-all duration-400 ${isExpanded ? "opacity-0 pointer-events-none translate-x-[-20px]" : "opacity-100 translate-x-0"}`}
        >
          <div className="flex flex-col justify-center gap-3 h-full">
            {cat.methods?.slice(0, 3).map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-3 bg-[#EAEAEA] rounded-md px-4 py-3"
              >
                {method.methodIcon?.url && (
                  <img
                    src={method.methodIcon.url}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="font-primary text-[14px] md:text-[15px] font-medium text-[#111]">
                  {method.methodName}
                </span>
              </div>
            ))}
            {cat.methods && cat.methods.length > 3 && (
              <div className="text-[13px] text-black/50 pl-2">
                +{cat.methods.length - 3} more methods
              </div>
            )}
          </div>

          <div className="mt-auto">
            <div className="w-10 h-10 bg-black hover:bg-blue-500 rounded-full flex items-center justify-center text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hover:shadow-xl"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* EXPANDED CONTENT */}
        <div
          className={`absolute -top-[70px] inset-x-0 bottom-0 flex flex-col transition-all duration-400 delay-100 ${!isExpanded ? "opacity-0 pointer-events-none translate-x-[20px]" : "opacity-100 translate-x-0"}`}
        >
          {/* Scrollable Container for everything: Title, Description, and Methods */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide min-h-0">
            {/* Expanded Header: Icon + Title */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
              {cat.categoryIcon?.url && (
                <img
                  src={cat.categoryIcon.url}
                  alt=""
                  className="w-8 h-8 object-contain"
                />
              )}
              <h3 className="font-primary text-[28px] md:text-[32px] font-medium tracking-tight text-[#111] m-0">
                {cat.categoryName}
              </h3>
            </div>

            <p className="font-primary text-[14px] font-medium leading-[1.4] text-black w-full m-0 mb-6 shrink-0">
              {cat.categoryDesc}
            </p>

            <div className="flex flex-col gap-4 pb-4">
              {cat.methods?.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-lg p-4 flex flex-col shadow-sm border border-black/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {method.methodIcon?.url && (
                      <img
                        src={method.methodIcon.url}
                        alt=""
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    <span className="font-primary text-[16px] md:text-[18px] font-medium text-[#111]">
                      {method.methodName}
                    </span>
                  </div>
                  {method.details && method.details.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {method.details.slice(0, 3).map((detail) => (
                        <div
                          key={detail.id}
                          className="bg-[#EAEAEA] text-[#111] text-[8px] font-bold px-2 py-1.5 rounded uppercase"
                        >
                          {detail.detailName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-row justify-between items-center gap-4 z-20 pt-4 border-t border-black/5 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="w-10 h-10 bg-black hover:bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {cat.buttonLink ? (
              <a
                href={cat.buttonLink}
                className="bg-white hover:bg-white/90 text-[#111] font-primary font-bold text-[14px] md:text-[15px] py-2 px-6 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                {cat.buttonText || "Approach"}
              </a>
            ) : ("")}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const Section3 = () => {
  const [data, setData] = useState<Section3Data>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [section3Res, solutionCatRes] = await Promise.all([
          getSection("home", "section3"),
          getSection("solution", "section2"),
        ]);

        setData(section3Res.content || {});

        if (solutionCatRes?.content?.categories) {
          setCategories(solutionCatRes.content.categories as Category[]);
        }
      } catch (err) {
        console.error("Failed to load section3 data:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Wheel horizontal scroll for the cards container
  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setTimeout(() => {
      const container = document.getElementById("home-solution-scroll");
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        // Check if we are hovering over a vertical scrollable area
        const target = e.target as HTMLElement;
        const isInfoScroll = target.closest(".custom-scrollbar");
        
        if (isInfoScroll) {
          // Check if it's actually scrollable vertically
          if (isInfoScroll.scrollHeight > isInfoScroll.clientHeight) {
            return; // Let it scroll vertically normally
          }
        }

        if (container.scrollWidth <= container.clientWidth) return;
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      (
        container as HTMLElement & { __wheelCleanup?: () => void }
      ).__wheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById("home-solution-scroll");
      if (
        container &&
        (container as HTMLElement & { __wheelCleanup?: () => void })
          .__wheelCleanup
      ) {
        (container as HTMLElement & { __wheelCleanup?: () => void })
          .__wheelCleanup!();
      }
    };
  }, [categories, expandedId]); // Re-attach if expanded bounds change

  return (
    <section
      className="container mx-auto px-6 md:px-12 xl:px-20 mt-6 relative overflow-hidden rounded-3xl"
      style={{ overflowX: "clip" }}
    >
      <div className="bg-[#E1C6FF] p-10 rounded-xl" style={{ overflow: "visible" }}>
        <div className="flex flex-col xl:flex-row items-stretch justify-between gap-16 xl:gap-24 w-full h-full">
          {/* LEFT PANEL */}
          <ScrollReveal className="flex flex-col justify-between xl:w-[425px] shrink-0 xl:sticky z-10 self-stretch">
            {!loaded ? (
              <div className="flex flex-col gap-6 w-full">
                <Skeleton className="w-[100px] h-[30px] rounded" />
                <Skeleton className="w-[80%] h-[20px]" />
                <Skeleton className="w-full h-[150px]" />
                <Skeleton className="w-[150px] h-[50px] rounded-xl mt-8" />
              </div>
            ) : (
              <>
                <div className="flex flex-col xl:flex-row gap-4 md:gap-10 items-start mb-16 md:mb-24">
                  <div className="inline-flex items-center px-3 py-1 bg-[#EBEBEB] text-black text-[12px] font-bold uppercase rounded-md mb-6 font-primary">
                    {data.sectionLabel || ""}
                  </div>
                  <p className="font-primary text-[14px] text-[#111] leading-tight max-w-[280px] m-0 font-medium">
                    {data.description ||
                      "See how our solutions to maximize your brand/company performance"}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-start gap-10">
                  <h2 className="font-primary text-[30px] lg:text-[42px] font-normal uppercase text-black leading-[1.1] tracking-[-0.02em] m-0">
                    {renderStyledText(
                      data.title || "",
                    )}
                  </h2>

                  {data.buttonText && (
                    <Link
                      to={data.buttonLink || "/solution"}
                      className="inline-flex items-center justify-center px-6 py-2 bg-white text-[#111] font-primary font-bold text-[15px] rounded-lg hover:bg-[#111] hover:text-white transition-colors duration-300 w-max shadow-sm"
                    >
                      {data.buttonText}
                    </Link>
                  )}
                </div>
              </>
            )}
          </ScrollReveal>

          {/* RIGHT PANEL - SCROLLING CARDS */}
          <ScrollReveal
            delay={0.2}
            direction="left"
            className="w-full xl:w-[calc(100%-425px-6rem)] min-w-0 xl:pr-10"
            style={{ overflow: "visible" }}
          >
            {!loaded ? (
              <div className="flex gap-6 overflow-hidden">
                <Skeleton className="w-[280px] md:w-[320px] h-[450px] md:h-[550px] rounded-3xl shrink-0" />
                <Skeleton className="w-[280px] md:w-[320px] h-[450px] md:h-[550px] rounded-3xl shrink-0" />
              </div>
            ) : (
              <div
                id="home-solution-scroll"
                className="flex gap-6 overflow-x-auto cursor-grab active:cursor-grabbing pb-4"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  marginRight: "-2.5rem", // Match p-10 (40px)
                  paddingRight: "2.5rem"
                }}
              >
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    isExpanded={expandedId === cat.id}
                    onToggle={() =>
                      setExpandedId(expandedId === cat.id ? null : cat.id)
                    }
                  />
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

// Add styles for the scrollable method list
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

// Inject styles once
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

export default Section3;
