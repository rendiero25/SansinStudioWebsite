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
          // Get the latest 2 projects
          setProjects((section2Res.content.projects as ProjectItem[]).slice(0, 2));
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

  return (
    <section className="relative w-full bg-white pt-15 xl:pt-30 overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 xl:px-20">
        <ScrollReveal>
          {/* Section Label Pill */}
          {!loaded ? (
            <Skeleton className="w-[100px] h-[30px] rounded-md mb-8" />
          ) : (
            <div className="inline-flex items-center px-3 py-1 bg-[#EBEBEB] text-[#111111] text-[16px] font-bold uppercase rounded-md mb-6 font-primary">
              {renderStyledText(title)}
            </div>
          )}
        </ScrollReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {!loaded ? (
            <>
              <Skeleton className="w-full aspect-4/3 rounded-3xl" />
              <Skeleton className="w-full aspect-4/3 rounded-3xl" />
            </>
          ) : (
            projects.map((project, index) => {
              // Parse keywords into an array, e.g. "Production, Interaction" -> ["Production", "Interaction"]
              const keywordList = project.keywords
                ? project.keywords.split(",").map((k) => k.trim()).filter(Boolean)
                : [];
                
              const projCategories = getCategoriesForProject(project);

              const imageUrl = project.thumbnail?.url || project.mainImage?.url || "";

              return (
                <ScrollReveal
                  key={project.id}
                  delay={0.2 + index * 0.1}
                  className="w-full"
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="group relative block w-full rounded-xl overflow-hidden aspect-4/3 md:aspect-auto md:h-[350px] bg-[#f5f5f5] no-underline"
                  >
                    {/* Background Image */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={stripHtml(project.projectName)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none z-10" />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 z-10" />

                    {/* See Project Button — center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <span className="px-7 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-semibold text-[14px] md:text-[15px] rounded-md bg-black/40 backdrop-blur-md hover:bg-black/70 transition-colors">
                        See Project
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end z-20 pointer-events-none">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4 pointer-events-auto">
                        {projCategories.length > 0 ? (
                          projCategories.map((cat) => (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-1.5 bg-white text-black text-[10px] md:text-[16px] font-bold px-3 md:px-10 py-1.5 md:py-1 rounded-[4px] shadow-sm font-primary"
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
                          // Fallback to keywords if no category
                          keywordList.map((kw, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 bg-white text-black text-[10px] md:text-[11px] font-bold tracking-wider px-3 md:px-4 py-1.5 md:py-2 rounded-[4px] shadow-sm uppercase font-primary"
                            >
                              {kw}
                            </span>
                          ))
                        )}
                      </div>

                      {/* Project Name */}
                      <h3 className="text-white text-2xl md:text-3xl font-normal font-primary m-0 pr-10 pointer-events-auto">
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
