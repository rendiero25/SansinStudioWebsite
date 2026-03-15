import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface ProjectCategory {
  id: string;
  categoryName: string;
  categoryIcon?: { url: string; publicId: string } | null;
}

interface ProjectItem {
  id: string;
  projectName: string;
  categoryIds?: string[];
  categoryId?: string;
  thumbnail: { url: string; publicId: string } | null;
  mainImage: { url: string; publicId: string } | null;
  keywords: string;
  buttonLink: string;
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

const stripHtml = (html: string) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const Section2 = () => {
  const [title, setTitle] = useState("PROJECTS");
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [section1Res, section2Res] = await Promise.all([
          getSection("projects", "section1"),
          getSection("projects", "section2"),
        ]);

        if (section1Res?.content?.sectionTitle) {
          setTitle(section1Res.content.sectionTitle);
        }

        if (section1Res?.content?.categories) {
          setCategories(section1Res.content.categories as ProjectCategory[]);
        }

        if (section2Res?.content?.projects) {
          // Get the latest 5 projects from the list provided by CMS
          const allProjects = section2Res.content.projects as ProjectItem[];
          setProjects(allProjects.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load projects for section2:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const getCategoriesForProject = (proj: ProjectItem): ProjectCategory[] => {
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

  // Wheel horizontal scroll for the projects container
  useEffect(() => {
    const container = document.getElementById("section2-projects-scroll");
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [projects]);

  return (
    <section className="relative w-full bg-white pt-15 xl:pt-30 overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 xl:px-20">
        <ScrollReveal>
          {/* Section Label Pill */}
          {!loaded ? (
            <Skeleton className="w-[100px] h-[30px] rounded-md mb-8" />
          ) : (
            <div className="inline-flex items-center px-3 py-1 bg-[#EBEBEB] text-black text-[12px] font-bold uppercase rounded-md mb-6 font-primary">
              {renderStyledText(title)}
            </div>
          )}
        </ScrollReveal>

        {/* Projects Horizontal Scroll Container */}
        <div 
          id="section2-projects-scroll"
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {!loaded ? (
            <>
              <Skeleton className="min-w-[300px] md:min-w-[450px] aspect-4/3 rounded-xl shrink-0" />
              <Skeleton className="min-w-[300px] md:min-w-[450px] aspect-4/3 rounded-xl shrink-0" />
            </>
          ) : (
            projects.map((project, index) => {
              const projCategories = getCategoriesForProject(project);
              const imageUrl = project.thumbnail?.url || project.mainImage?.url || "";

              return (
                <ScrollReveal
                  key={project.id}
                  delay={0.2 + index * 0.1}
                  direction="left"
                  className="shrink-0 w-[300px] md:w-[450px]"
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="group relative block w-full rounded-xl overflow-hidden aspect-4/3 md:h-[275px] bg-[#f5f5f5] no-underline border border-black/5"
                  >
                    {/* Background Image */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={stripHtml(project.projectName)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Bottom Gradient Overlay - Always there but deepens on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none z-10 transition-opacity duration-300" />

                    {/* Content Layer (Hidden by default, shows on hover) */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {projCategories.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 bg-white text-black text-[10px] md:text-[12px] font-bold px-3 py-1.5 rounded-md shadow-sm font-primary uppercase"
                          >
                            {cat.categoryIcon?.url && (
                              <img
                                src={cat.categoryIcon.url}
                                alt=""
                                className="w-3 h-3 object-contain"
                              />
                            )}
                            {cat.categoryName}
                          </span>
                        ))}
                      </div>

                      {/* Project Name */}
                      <h3 className="text-white text-xl md:text-2xl font-normal font-primary m-0 leading-tight">
                        {renderStyledText(project.projectName)}
                      </h3>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Section2;
