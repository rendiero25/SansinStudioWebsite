import { useState, useEffect, useRef } from "react";
import { getSection } from "../../../services/sectionApi";

interface HeroData {
  title?: string;
  description?: string;
  brandLogo?: { url: string };
  mainImage?: { url: string; publicId: string };
  imagePanPosition?: number;
  bgImage?: { url: string };
}

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

const renderStyledText = (text: string, brandLogoUrl?: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // Split by _underline_, *italic*, and {logo} placeholders
    const parts = line.split(/(\*[^*]+\*|_[^_]+_|\{logo\})/g);
    const lineContent = parts.map((part, i) => {
      if (part === "{logo}" && brandLogoUrl) {
        return (
          <span
            key={i}
            className="inline-block align-middle mx-2 md:mx-3 -translate-y-[2px] md:-translate-y-[4px]"
          >
            <img
              src={brandLogoUrl}
              alt="Sanxin"
              className="h-[24px] md:h-[32px] lg:h-[28px] w-auto object-contain"
            />
          </span>
        );
      }
      if (part.startsWith("_") && part.endsWith("_")) {
        return (
          <span
            key={i}
            className="italic underline underline-offset-[8px] md:underline-offset-[12px] decoration-2 decoration-white text-white"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

    return (
      <span key={lineIndex}>
        {lineContent}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

// Category badge color palette
const BADGE_COLORS = [
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-black" },
  { bg: "bg-rose-500", text: "text-white" },
];

const WorksHero = () => {
  const [heroData, setHeroData] = useState<HeroData>({});
  const [timeline, setTimeline] = useState<TimelineData>({});

  // Drag-to-scroll state for pannable image
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [dragScrollTop, setDragScrollTop] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s1, s2] = await Promise.all([
          getSection("works", "section1"),
          getSection("works", "section2"),
        ]);
        setHeroData(s1.content || {});
        setTimeline(s2.content || {});
      } catch (err) {
        console.error("Failed to load works hero:", err);
      }
    };
    fetchData();
  }, []);

  const title =
    heroData.title ||
    "_Redefining_ your brand\nthrough our {logo} way of\n_creative development_";

  const processes = timeline.processes || [];

  // Set initial scroll position based on CMS panPosition
  useEffect(() => {
    if (scrollContainerRef.current && heroData.mainImage) {
      const container = scrollContainerRef.current;
      const panPosition =
        heroData.imagePanPosition !== undefined
          ? heroData.imagePanPosition
          : 50;

      setTimeout(() => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        container.scrollLeft = maxScrollLeft * (panPosition / 100);
        container.scrollTop = maxScrollTop / 2;
      }, 100);
    }
  }, [heroData.mainImage, heroData.imagePanPosition]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setDragScrollLeft(scrollContainerRef.current.scrollLeft);
    setDragScrollTop(scrollContainerRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    scrollContainerRef.current.scrollLeft = dragScrollLeft - walkX;
    scrollContainerRef.current.scrollTop = dragScrollTop - walkY;
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col pt-32 pb-12 overflow-hidden bg-black">
      {/* Keyframes for fade-up animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Background with gradient and optional image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" />
        {heroData.bgImage?.url && (
          <img
            src={heroData.bgImage.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
        )}
      </div>

      <div className="container relative mx-auto px-6 md:px-12 xl:px-20 z-10 w-full">
        {/* Title Section */}
        <div className="w-full text-left opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_forwards]">
          <h1 className="max-w-5xl font-primary text-[42px] md:text-[60px] lg:text-[72px] xl:text-[84px] leading-[1.1] font-normal text-white tracking-[-0.02em] m-0">
            {renderStyledText(title, heroData.brandLogo?.url)}
          </h1>
        </div>

        {/* Framework Section */}
        {processes.length > 0 && (
          <div className="mt-16 opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.3s_forwards]">
            {/* Section Label */}
            <div className="flex flex-col items-start gap-3 mb-8 w-[200px]">
              <span className="w-[100px] border-t-2 border-white/50"></span>

              <span className="text-[10px] md:text-[11px] max-w-[100px] font-normal text-white uppercase leading-tight whitespace-pre-line">
                {heroData.description}
              </span>
            </div>
          </div>
        )}

        {/* Pannable Image (drag to scroll like Section6) */}
        {heroData.mainImage?.url && (
          <div className="mt-2 w-full opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.5s_forwards]">
            <div
              ref={scrollContainerRef}
              className={`w-full h-[350px] md:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl bg-[#EEEEEE] select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              style={{ touchAction: "none" }}
            >
              <div className="w-fit h-fit min-w-[125%] min-h-[125%] flex items-center justify-center p-10">
                <img
                  src={heroData.mainImage.url}
                  alt="Works showcase"
                  className="max-w-none pointer-events-none rounded-xl"
                  style={{ width: "120%", height: "auto" }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gradient fade to white at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-linear-to-t from-white via-white/80 to-transparent z-[5]" />
    </section>
  );
};

export default WorksHero;
