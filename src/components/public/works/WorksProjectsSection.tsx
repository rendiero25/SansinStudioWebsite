import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../../services/sectionApi";
import type { ProjectCategory } from "../../cms/ProjectCategoriesEditor";
import type { ProjectItem } from "../../cms/ProjectItemsEditor";

const WorksProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, projRes] = await Promise.all([
          getSection("projects", "section1"),
          getSection("projects", "section2"),
        ]);
        
        setCategories(catRes?.content?.categories || []);
        
        // Get 5 latest projects
        const allProjects = projRes?.content?.projects || [];
        setProjects(allProjects.slice(0, 5));
      } catch (err) {
        console.error("Failed to load projects for works section:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Wheel → horizontal scroll + Breakout Width
  useEffect(() => {
    if (loading || projects.length === 0 || !scrollRef.current) return;

    const container = scrollRef.current;
    
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

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", setBreakoutWidth);
    };
  }, [loading, projects]);

  // Helper to get category name by ID
  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.categoryName || "Uncategorized";
  };
  
  // Helper to get category icon by ID
  const getCategoryIcon = (id: string) => {
    return categories.find((c) => c.id === id)?.categoryIcon || null;
  };

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="w-full bg-white pb-32" style={{ overflowX: "clip", overflowY: "visible" }}>
      <div className="container mx-auto px-6 md:px-12 xl:px-20" style={{ overflow: "visible" }}>
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0 text-black">
            Projects
          </h2>
        </div>

        {/* Projects Grid/Scroll */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide"
          style={{ paddingRight: "100px", overscrollBehavior: "contain" }}
        >
          {projects.map((project) => {
            const projCategoryIds = project.categoryIds || (project.categoryId ? [project.categoryId] : []);
            
            return (
              <div
                key={project.id}
                className="group relative min-w-[300px] md:min-w-[450px] lg:min-w-[600px] aspect-[16/9] rounded-xl overflow-hidden cursor-pointer shadow-sm border border-black/5"
              >
                {/* Background Image */}
                {project.thumbnail?.url ? (
                  <img
                    src={project.thumbnail.url}
                    alt={project.projectName}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[#1A1A1A]" />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

                {/* "See Project" Button (Centered on hover) */}
                <div className="absolute inset-0 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <Link
                    to={`/projects/${project.id}`}
                    className="px-7 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-semibold text-[14px] md:text-[15px] rounded-[14px] bg-black/40 backdrop-blur-md hover:bg-black/70 transition-colors no-underline"
                  >
                    See Project
                  </Link>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 flex flex-col items-start gap-3 pointer-events-none z-10">
                  {/* Category Badges */}
                  <div className="flex flex-wrap gap-2">
                    {projCategoryIds.map((catId) => (
                      <div
                        key={catId}
                        className="bg-white text-black px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                      >
                        {getCategoryIcon(catId) && (
                          <img
                            src={getCategoryIcon(catId)!.url}
                            alt=""
                            className="w-3.5 h-3.5 object-contain"
                          />
                        )}
                        <span className="text-[12px] font-medium leading-none mt-px uppercase">
                          {getCategoryName(catId)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-white text-[24px] md:text-[28px] font-normal tracking-[-0.02em] m-0 leading-[1.2]">
                    {project.projectName}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redirect Button (Bottom Right) */}
        <div className="flex justify-end mt-5">
          <Link
            to="/projects"
            className="group flex items-center gap-4 px-15 py-2.5 border border-black/20 rounded-lg font-primary text-[15px] font-bold text-black bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
          >
            Projects
          </Link>
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

export default WorksProjectsSection;
