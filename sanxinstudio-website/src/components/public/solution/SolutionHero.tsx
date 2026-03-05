import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";

interface HeroData {
  bgImage?: { url: string };
  brandLogo?: { url: string };
  title?: string;
}

interface MiniProject {
  id: string;
  projectName: string;
  thumbnail?: { url: string } | null;
  mainImage?: { url: string } | null;
  buttonText?: string;
  buttonLink?: string;
}

const renderStyledText = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // We want to support _italic underline_ and *bold italic white*
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
        // underlined italics
        return (
          <span
            key={i}
            className="italic underline underline-offset-8px md:underline-offset-12px decoration-2 decoration-white text-white"
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

const SolutionHero = () => {
  const [data, setData] = useState<HeroData>({});
  const [projects, setProjects] = useState<MiniProject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, projRes] = await Promise.all([
          getSection("solution", "section1"),
          getSection("projects", "section2"),
        ]);

        setData(heroRes.content || {});

        if (projRes?.content?.projects) {
          setProjects((projRes.content.projects as MiniProject[]).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load solution hero and projects:", err);
      }
    };
    fetchData();
  }, []);

  const title =
    data.title ||
    "Creative _solutions_\ntailored for the _future_\n_leading companies_";

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 lg:pt-48 pb-20 overflow-hidden bg-black">
      {/* Background with mesh gradient and image overlay */}
      <div className="absolute inset-0 z-0">
        {/* <div className="absolute inset-0 bg-linear-to-br from-[#1a1025] via-[#2d1b4e] to-[#0a0a0a] opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t from-black via-black/80 to-transparent z-10" /> */}
        {data.bgImage?.url && (
          <img
            src={data.bgImage.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="container relative mx-auto px-6 md:px-12 xl:px-20 z-10 w-full">
        {/* Brand Logo and Title Inline */}
        <div className="w-full text-left opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_forwards]">
          <h1 className="w-4xl font-primary text-[48px] md:text-[64px] lg:text-[76px] xl:text-[88px] leading-[1.1] font-normal text-white tracking-[-0.02em] m-0">
            <span className="inline-block align-middle mr-4 md:mr-6 -translate-y-[4px] md:-translate-y-[8px]">
              {data.brandLogo?.url ? (
                <img
                  src={data.brandLogo.url}
                  alt="Sanxin"
                  className="h-[32px] md:h-[48px] lg:h-[30px] w-auto object-contain"
                />
              ) : (
                ""
              )}
            </span>
            {renderStyledText(title)}
          </h1>
        </div>

        {/* Project Cards Placeholder */}
        <div className="mt-16 md:mt-24 w-full flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-stretch opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.3s_forwards]">
          {/* Card 1 */}
          <div className="flex-1 min-w-0 h-[320px] md:h-[370px] rounded-2xl overflow-hidden relative group cursor-pointer bg-linear-to-br from-[#125875] to-[#092B3A] shadow-2xl">
            {/* Dummy Image/Styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-[#3FA8D4]/20 blur-[60px]"></div>
              {/* Concentric rings to simulate the earbud graphic */}
              <div className="w-[40%] aspect-square rounded-full border border-white/5 absolute"></div>
              <div className="w-[60%] aspect-square rounded-full border border-white/5 absolute"></div>
              <div className="w-[80%] aspect-square rounded-full border border-white/5 absolute"></div>
            </div>

            {/* View Project Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-8 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-medium text-[15px] rounded-[14px] bg-transparent group-hover:bg-white/10 transition-colors backdrop-blur-md">
                See Project
              </span>
            </div>

            {/* Top Badges */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap gap-2 md:gap-3">
              <span className="bg-white text-black text-[10px] md:text-[11px] font-bold tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] flex items-center gap-2">
                <span className="w-2 h-4 border-y-[3px] border-x border-black rounded-[1px] block shrink-0 relative">
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-black"></span>
                </span>
                Production
              </span>
              <span className="bg-white text-black text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em] px-3 md:px-4 py-1.5 md:py-2 rounded-[4px]">
                PASSION PROJECT
              </span>
            </div>
          </div>

          {/* Gallery Container (Card 2 Replacement) */}
          <div className="flex-1 min-w-0 h-[320px] md:h-[450px] flex overflow-x-auto scrollbar-hide snap-x gap-4 md:gap-6 pb-2">
            {projects.length > 0 ? (
              projects.map((proj) => {
                const bestImage =
                  proj.thumbnail?.url ||
                  proj.mainImage?.url ||
                  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80";

                return (
                  <div
                    key={proj.id}
                    className="w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(50%-12px)] shrink-0 h-[320px] md:h-[450px] rounded-[32px] overflow-hidden relative group cursor-pointer shadow-2xl snap-start bg-black/20 border border-white/5"
                  >
                    <img
                      src={bestImage}
                      alt={proj.projectName}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* View Project Button */}
                    {proj.buttonLink ? (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <a
                          href={proj.buttonLink}
                          className="px-6 py-3 border-[1.5px] border-white/60 text-white font-primary font-medium text-[13px] md:text-[14px] rounded-[14px] bg-black/40 backdrop-blur-md hover:bg-black/80 transition-colors"
                        >
                          {proj.buttonText || "See Project"}
                        </a>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <span className="px-6 py-3 border-[1.5px] border-white/60 text-white font-primary font-medium text-[13px] md:text-[14px] rounded-[14px] bg-black/40 backdrop-blur-md">
                          {proj.buttonText || "See Project"}
                        </span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap gap-2 z-10 w-[calc(100%-48px)]">
                      <span className="bg-white text-black text-[10px] md:text-[11px] font-bold tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] shadow-sm truncate max-w-full uppercase">
                        {proj.projectName || "Project"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback Dummy Cards
              <>
                <div className="w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(50%-12px)] shrink-0 h-[320px] md:h-[450px] rounded-[32px] overflow-hidden relative group cursor-pointer bg-linear-to-br from-[#E0B259] to-[#D9A136] shadow-2xl snap-start">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-6 py-3 border-[1.5px] border-black/40 text-black font-primary font-medium text-[14px] rounded-[14px] bg-white/20 backdrop-blur-md">
                      See Project
                    </span>
                  </div>
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap gap-2">
                    <span className="bg-white text-black text-[10px] md:text-[11px] uppercase font-bold tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-[4px]">
                      Placeholder 1
                    </span>
                  </div>
                </div>
                <div className="w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(50%-12px)] shrink-0 h-[320px] md:h-[450px] rounded-[32px] overflow-hidden relative group cursor-pointer bg-linear-to-br from-[#8d52c1] to-[#4c2973] shadow-2xl snap-start">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-6 py-3 border-[1.5px] border-white/40 text-white font-primary font-medium text-[14px] rounded-[14px] bg-black/20 backdrop-blur-md">
                      See Project
                    </span>
                  </div>
                  <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap gap-2">
                    <span className="bg-white text-black text-[10px] md:text-[11px] uppercase font-bold tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-[4px]">
                      Placeholder 2
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Spacer for final element padding */}
            {projects.length >= 2 && (
              <div className="w-1 md:w-2 shrink-0"></div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SolutionHero;
