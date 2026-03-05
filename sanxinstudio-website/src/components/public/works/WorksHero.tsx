import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";

interface HeroData {
  title?: string;
  description?: string;
  brandLogo?: { url: string };
  mainImage?: { url: string };
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

  return (
    <section className="relative w-full min-h-screen flex flex-col pt-32 lg:pt-48 pb-12 overflow-hidden bg-black">
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
            className="absolute inset-0 w-full h-full object-cover"
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
          <div className="mt-16 md:mt-24 opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.3s_forwards]">
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] leading-tight">
                SANXIN
                <br />
                FRAMEWORK
              </span>
            </div>
          </div>
        )}

        {/* Main Image from CMS (like home Section 5 style) */}
        {heroData.mainImage?.url && (
          <div className="bg-gray-500 mt-12 md:mt-16 w-full opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.5s_forwards]">
            <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
              <img
                src={heroData.mainImage.url}
                alt="Works showcase"
                className="w-full h-auto object-cover"
              />
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
