import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import { getSection } from "../services/sectionApi";
import type { ProjectCategory } from "../components/cms/ProjectCategoriesEditor";
import type { ProjectItem } from "../components/cms/ProjectItemsEditor";

interface ProjectDetailData {
  categories: ProjectCategory[];
  projects: ProjectItem[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ProjectDetailData>({
    categories: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when loading new project
    window.scrollTo(0, 0);

    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const [catRes, projRes] = await Promise.all([
          getSection("projects", "section1"),
          getSection("projects", "section2"),
        ]);

        setData({
          categories: catRes?.content?.categories || [],
          projects: projRes?.content?.projects || [],
        });
      } catch (err) {
        console.error("Failed to load project detail data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const currentProject = data.projects.find((p) => p.id === id);
  const moreProjects = data.projects.filter((p) => p.id !== id).slice(0, 6); // Up to 6 more projects

  // Helper to get category name by ID
  const getCategoryName = (catId: string) => {
    return data.categories.find((c) => c.id === catId)?.categoryName || "Uncategorized";
  };

  // Helper to get category icon by ID
  const getCategoryIcon = (catId: string) => {
    return data.categories.find((c) => c.id === catId)?.categoryIcon || null;
  };

  // Extract paragraphs from description
  const descriptionLines = currentProject?.description
    ? currentProject.description.split("\n\n").filter(Boolean)
    : [];
  
  // Decide how to split the description if there are multiple paragraphs.
  // The mockup shows one paragraph below the main image.
  const topDescription = descriptionLines.length > 0 ? descriptionLines[0] : "";

  // Extract categories for the specific project
  const projectCategories = currentProject
    ? (currentProject.categoryIds || (currentProject.categoryId ? [currentProject.categoryId] : []))
    : [];

  // Drag-to-scroll logic for horizontal More Projects
  useEffect(() => {
    if (moreProjects.length === 0) return;
    
    // Slight delay for React to render the DOM node
    const timer = setTimeout(() => {
      const container = document.getElementById("project-detail-more-scroll") as HTMLElement & { __wheelCleanup?: () => void } | null;
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
      const container = document.getElementById("project-detail-more-scroll") as (HTMLElement & { __wheelCleanup?: () => void }) | null;
      if (container && container.__wheelCleanup) {
        container.__wheelCleanup();
      }
    };
  }, [moreProjects, loading, id]);

  // Window scroll sync for Secondary Image
  useEffect(() => {
    if (loading || !currentProject?.image2?.url) return;

    const handleScroll = () => {
      const parent = document.getElementById("project-detail-image2-parent");
      const container = document.getElementById("project-detail-image2-container");
      const img = document.getElementById("project-detail-secondary-img");
      
      if (!parent || !container || !img) return;

      const imgNaturalHeight = img.scrollHeight;
      const containerHeight = container.clientHeight;
      
      // If the image hasn't loaded or is shorter than the container, 
      // don't apply the sticky scroll effect.
      if (imgNaturalHeight <= containerHeight) {
        parent.style.height = 'auto';
        img.style.transform = `translateY(0px)`;
        return;
      }
      
      // 1. Set the parent height to the image's full scrollable height
      // This ensures 1px of page scroll = 1px of inner image scroll
      if (parent.style.height !== `${imgNaturalHeight}px`) {
        parent.style.height = `${imgNaturalHeight}px`;
      }

      // 2. Calculate the progress of the container sticking
      const parentRect = parent.getBoundingClientRect();
      const stickyTop = 100; // Header height (70px) + Gap (70px)
      
      const scrolledPastStart = stickyTop - parentRect.top;
      const totalStickyScroll = parentRect.height - containerHeight;
      
      let progress = 0;
      if (totalStickyScroll > 0) {
        progress = scrolledPastStart / totalStickyScroll;
      }
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      // 3. Translate the image upwards by the progress amount
      const maxTranslate = imgNaturalHeight - containerHeight;
      if (maxTranslate > 0) {
        const translateY = progress * maxTranslate;
        img.style.transform = `translateY(-${translateY}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, currentProject?.image2?.url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center font-primary flex-col gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="text-white/60 text-sm">Loading Project...</div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-primary text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-white/60 mb-8">The project you are looking for does not exist.</p>
        <Link to="/projects" className="bg-white text-black px-6 py-3 rounded-lg font-medium">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page font-primary bg-[#0A0A0A] text-white min-h-screen">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          
          {/* Row 1: Main Image Only */}
          <div className="w-full mb-20 md:mb-32 mt-8 md:mt-16">
            <div className="w-full aspect-video md:aspect-[16/9] lg:aspect-[16/10] rounded-lg overflow-hidden relative">
              {currentProject.mainImage?.url ? (
                <img
                  src={currentProject.mainImage.url}
                  alt={`${currentProject.projectName} Main`}
                  className="absolute inset-0 w-full h-full xl:object-cover"
                />
              ) : currentProject.thumbnail?.url ? (
                <img
                  src={currentProject.thumbnail.url}
                  alt={`${currentProject.projectName} Thumbnail`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20">No Main Image</div>
              )}

              {/* Category Tags at Bottom Left */}
              {projectCategories.length > 0 && (
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-wrap gap-2 md:gap-3 z-10">
                  {projectCategories.map((catId, index) => (
                    <div
                      key={catId}
                      className={`${index === 0 ? "bg-white text-black" : "bg-white/80 backdrop-blur-md text-black"} px-4 py-2 md:px-5 md:py-2.5 rounded-md flex items-center shadow-lg`}
                    >
                      <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest leading-none mt-px flex items-center gap-2">
                        {index === 0 && (
                          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0H10V1.5L6 6L10 10.5V12H0V10.5L4 6L0 1.5V0Z" fill="currentColor"/>
                          </svg>
                        )}
                        {getCategoryName(catId)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Top Description Text */}
          {/* We only render this if topDescription is long enough to not be used as the service summary, 
              or we render the first long chunk. Let's just render the full description cleanly. */}
          {topDescription && topDescription.length >= 100 && (
            <div className="self-start w-full max-w-5xl mb-20 md:mb-32">
              <p className="text-[18px] md:text-[24px] leading-[1.6] md:leading-[1.8] text-white/80 font-normal m-0 tracking-[-0.01em]">
                {topDescription}
              </p>
            </div>
          )}
          {/* Fallback if logic above skips it and there's only one description part provided */}
          {topDescription && topDescription.length < 100 && descriptionLines.length === 1 && (
            <div className="self-start w-full max-w-5xl mb-20 md:mb-32">
               <p className="text-[18px] md:text-[24px] leading-[1.6] md:leading-[1.8] text-white/80 font-normal m-0 tracking-[-0.01em]">
                {topDescription}
              </p>
            </div>
          )}

          {/* Row 3: Secondary Image with Window Scroll Sync */}
          {currentProject.image2?.url && (
            <div id="project-detail-image2-parent" className="w-full mb-16 md:mb-20 relative rounded-2xl" style={{ minHeight: "100vh" }}>
              <div 
                id="project-detail-image2-container"
                className="w-full mx-auto h-[calc(100vh-140px)] min-h-[400px] rounded-2xl overflow-hidden sticky top-[100px]"
              >
                <img
                  id="project-detail-secondary-img"
                  src={currentProject.image2.url}
                  alt={`${currentProject.projectName} Details`}
                  className="w-full h-auto object-cover absolute top-0 left-0 transition-transform duration-75" 
                  style={{ display: "block", willChange: "transform" }}
                />
              </div>
            </div>
          )}

          {/* Row 5: Call to Action Button */}
          {(currentProject.buttonText || currentProject.buttonLink) && (
            <div className="w-full flex justify-center">
              <a
                href={currentProject.buttonLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#8A2BE2] hover:bg-white text-white hover:text-black px-10 py-4 md:px-12 md:py-4 rounded-xl font-bold text-[15px] md:text-[16px] tracking-wide transition-colors duration-300"
              >
                {currentProject.buttonText || "View Project"}
              </a>
            </div>
          )}

          {/* Row 6: More Projects Module */}
          {moreProjects.length > 0 && (
            <div className="w-full pt-20">
              <h2 className="font-primary text-[28px] md:text-[36px] font-normal tracking-[-0.01em] mb-12">
                More Projects
              </h2>
              
              <div
                id="project-detail-more-scroll"
                className="flex gap-4 overflow-x-auto cursor-grab active:cursor-grabbing pb-0 xl:pb-12"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  overscrollBehavior: "contain",
                  marginRight: "calc(-50vw + 50%)",
                  paddingRight: "20px",
                }}
              >
                {moreProjects.map((proj) => {
                  const bestFallbackImage = proj.thumbnail?.url || proj.mainImage?.url || "";
                  const firstKey = proj.keywords ? proj.keywords.split(",")[0].trim() : "";
                  const pCats = proj.categoryIds || (proj.categoryId ? [proj.categoryId] : []);

                  return (
                    <div
                      key={proj.id}
                      className="w-[85%] sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-20px)] shrink-0 aspect-[16/10] rounded-lg overflow-hidden relative group snap-start cursor-pointer"
                    >
                      {/* Background Image */}
                      {bestFallbackImage ? (
                        <img
                          src={bestFallbackImage}
                          alt={proj.projectName}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-black" />
                      )}

                      {/* Gradient Overlay for bottom text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

                      {/* See Project Button — center */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <Link
                          to={`/projects/${proj.id}`}
                          className="px-7 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-semibold text-[14px] md:text-[15px] rounded-[14px] bg-black/40 backdrop-blur-md hover:bg-black/70 transition-colors no-underline block"
                        >
                          See Project
                        </Link>
                      </div>

                      {/* Top Left: Keyword Badge */}
                      {firstKey && (
                        <div className="absolute top-6 left-6 bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-lg pointer-events-none z-10 uppercase">
                          {firstKey}
                        </div>
                      )}

                      {/* Bottom Left Content */}
                      <div className="absolute bottom-6 left-6 flex flex-col items-start gap-3 pointer-events-none pr-6 z-10 w-full">
                        
                        {/* Categories Row */}
                        {pCats.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {pCats.map((catId) => (
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
                                <span className="text-[12px] font-medium leading-none mt-px">
                                  {getCategoryName(catId)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Project Title */}
                        <h3 className="text-white text-[24px] md:text-[28px] font-normal tracking-[-0.02em] m-0 leading-[1.2] w-[90%] truncate">
                          {proj.projectName}
                        </h3>
                      </div>
                    </div>
                  );
                })}
                
                {moreProjects.length >= 2 && (
                  <div className="w-1 md:w-2 shrink-0"></div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer with forced black background, overriding default CMS image as requested */}
      <Footer hideCta={true} backgroundImageOverride="none" />

      <style>
        {`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .project-detail-page {
           background-color: #0A0A0A;
        }
      `}
      </style>
    </div>
  );
};

export default ProjectDetail;
