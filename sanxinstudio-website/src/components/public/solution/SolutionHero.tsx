import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../../services/sectionApi";

interface HeroData {
  bgImage?: { url: string };
  brandLogo?: { url: string };
  title?: string;
}

interface ProjectCategory {
  id: string;
  categoryName: string;
  categoryIcon?: { url: string; publicId: string } | null;
}

interface MiniProject {
  id: string;
  projectName: string;
  categoryIds?: string[];
  categoryId?: string;
  thumbnail?: { url: string } | null;
  mainImage?: { url: string } | null;
  buttonText?: string;
  buttonLink?: string;
}

const renderStyledText = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
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
  const [categories, setCategories] = useState<ProjectCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, catRes, projRes] = await Promise.all([
          getSection("solution", "section1"),
          getSection("projects", "section1"),
          getSection("projects", "section2"),
        ]);

        setData(heroRes.content || {});

        if (catRes?.content?.categories) {
          setCategories(catRes.content.categories as ProjectCategory[]);
        }

        if (projRes?.content?.projects) {
          setProjects((projRes.content.projects as MiniProject[]).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load solution hero and projects:", err);
      }
    };
    fetchData();
  }, []);

  // Attach wheel → horizontal scroll via DOM ID (most reliable approach)
  useEffect(() => {
    if (projects.length === 0) return;

    // Wait one tick for React to render the element
    const timer = setTimeout(() => {
      const container = document.getElementById("solution-projects-scroll") as HTMLElement & { __wheelCleanup?: () => void } | null;
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        if (container.scrollWidth <= container.clientWidth) return;
        e.preventDefault();
        e.stopPropagation();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      container.__wheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, 50);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById("solution-projects-scroll") as (HTMLElement & { __wheelCleanup?: () => void }) | null;
      if (container && container.__wheelCleanup) {
        container.__wheelCleanup();
      }
    };
  }, [projects]);

  // Helper: resolve categoryIds to category objects
  const getCategoriesForProject = (proj: MiniProject): ProjectCategory[] => {
    if (proj.categoryIds && proj.categoryIds.length > 0) {
      return proj.categoryIds
        .map((cid) => categories.find((c) => c.id === cid))
        .filter(Boolean) as ProjectCategory[];
    }
    if (proj.categoryId) {
      const cat = categories.find((c) => c.id === proj.categoryId);
      return cat ? [cat] : [];
    }
    return [];
  };

  const title =
    data.title ||
    "Creative _solutions_\ntailored for the _future_\n_leading companies_";

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 bg-black" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {data.bgImage?.url && (
          <img
            src={data.bgImage.url}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
        )}
      </div>

      <div className="container relative mx-auto px-6 md:px-12 xl:px-20 z-10 w-full" style={{ overflow: 'visible' }}>
        {/* Brand Logo and Title */}
        <div className="w-full text-left opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_forwards]">
          <h1 className="max-w-4xl font-primary text-[40px] md:text-[64px] lg:text-[76px] xl:text-[88px] leading-[1.1] font-normal text-white tracking-[-0.02em] m-0">
            <span className="block md:inline-block md:align-middle mb-4 md:mb-0 mr-0 md:mr-6 md:-translate-y-[8px]">
              {data.brandLogo?.url ? (
                <img
                  src={data.brandLogo.url}
                  alt="Sanxin"
                  className="h-[15px] md:h-[48px] lg:h-[30px] w-auto object-contain"
                />
              ) : (
                ""
              )}
            </span>
            {renderStyledText(title)}
          </h1>
        </div>

        {/* Project Cards — breaks out of container to right edge */}
        <div className="mt-16 md:mt-24 w-full opacity-0 translate-y-8 animate-[fadeUp_1s_ease-out_0.3s_forwards]" style={{ overflow: 'visible' }}>
          <div
            id="solution-projects-scroll"
            className="flex gap-6 md:gap-4 overflow-x-auto cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overscrollBehavior: "contain",
              marginRight: "calc(-50vw + 50%)",
              paddingRight: "20px",
            }}
          >
            {projects.length > 0 ? (
              projects.map((proj) => {
                const bestImage =
                  proj.thumbnail?.url ||
                  proj.mainImage?.url ||
                  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80";

                const projCategories = getCategoriesForProject(proj);

                return (
                  <div
                    key={proj.id}
                    className="w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(50%-16px)] shrink-0 h-[320px] md:h-[350px] rounded-3xl overflow-hidden relative group cursor-pointer snap-start"
                  >
                    {/* Thumbnail */}
                    <img
                      src={bestImage}
                      alt={proj.projectName}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

                    {/* See Project Button — center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Link
                        to={`/projects/${proj.id}`}
                        className="px-7 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-semibold text-[14px] md:text-[15px] rounded-[14px] bg-black/40 backdrop-blur-md hover:bg-black/70 transition-colors no-underline"
                      >
                        See Project
                      </Link>
                    </div>

                    {/* Top Badges — Category icons + names */}
                    <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap gap-2 z-10">
                      {projCategories.length > 0 ? (
                        projCategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 bg-white text-black text-[10px] md:text-[11px] font-bold tracking-wider px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] shadow-sm uppercase"
                          >
                            {cat.categoryIcon?.url && (
                              <img
                                src={cat.categoryIcon.url}
                                alt=""
                                className="w-3.5 h-3.5 object-contain"
                              />
                            )}
                            {cat.categoryName}
                          </span>
                        ))
                      ) : (
                        <span className="bg-white text-black text-[10px] md:text-[11px] font-bold tracking-widest px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] shadow-sm truncate max-w-full uppercase">
                          {proj.projectName || "Project"}
                        </span>
                      )}
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
