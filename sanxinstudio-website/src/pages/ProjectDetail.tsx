import { useState, useEffect, useRef } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Extract paragraphs from description
  const descriptionLines = currentProject?.description
    ? currentProject.description.split("\n\n").filter(Boolean)
    : [];
  
  // Decide how to split the description if there are multiple paragraphs.
  // The mockup shows one paragraph below the main image, and another below the secondary image.
  const topDescription = descriptionLines.length > 0 ? descriptionLines[0] : "";
  const bottomDescription = descriptionLines.length > 1 ? descriptionLines.slice(1).join("\n\n") : "";

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
    <div className="project-detail-page font-primary bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 max-w-[1440px]">
          
          {/* Row 1: Title and Main Image Layout */}
          <div className="flex flex-col xl:flex-row items-start gap-12 xl:gap-20 mb-20 md:mb-32 mt-8 md:mt-16">
            
            {/* Left Column (Metadata) */}
            <div className="w-full xl:w-[350px] flex flex-col gap-12 shrink-0">
              <h1 className="text-[42px] md:text-[56px] xl:text-[64px] leading-[1.1] font-normal tracking-[-0.02em] m-0">
                {currentProject.projectName.split(' ').map((word, i) => (
                  <span key={i}>
                    {word}{i < currentProject.projectName.split(' ').length - 1 && ' '}
                    {/* Add breaking point optionally if needed, but flex wrap handles it */}
                  </span>
                ))}
              </h1>

              {/* Client and Service Meta */}
              <div className="flex flex-col gap-8 md:gap-10 border-t border-white/10 pt-8">
                {/* Simulated Client from Keywords or Title word 1 if needed, defaulting to generic layout if unknown */}
                {/* The Mockup uses TOZO as client, since we don't have 'client' field we'll use first keyword or first word of title */}
                <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">CLIENT</span>
                  <span className="text-[15px] font-medium text-white/90">
                    {currentProject.keywords ? currentProject.keywords.split(',')[0].trim() : currentProject.projectName.split(' ')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4 items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-relaxed mt-1">PROJECT<br/>SERVICE</span>
                  <div className="flex flex-col gap-4">
                    <p className="text-[15px] font-medium text-white/90 m-0 leading-relaxed">
                      {/* Short summary or generic text based on mockup */}
                      {topDescription && topDescription.length < 100 
                        ? topDescription 
                        : `Showcasing works of ${currentProject.projectName}`}
                    </p>
                    
                    {/* Category Tags */}
                    {projectCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {projectCategories.map((catId) => (
                          <div
                            key={catId}
                            className="bg-white/10 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-wider leading-none mt-px flex items-center gap-1.5">
                              {/* Using generic box icon shape for service tags if no custom icon uploaded */}
                              <span className="w-1.5 h-1.5 bg-white/40 rounded-sm inline-block"></span>
                              {getCategoryName(catId)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Main Image) */}
            <div className="w-full flex-1">
              <div className="w-full aspect-video md:aspect-[16/10] rounded-[24px] overflow-hidden bg-white/5 relative">
                {currentProject.mainImage?.url ? (
                  <img
                    src={currentProject.mainImage.url}
                    alt={`${currentProject.projectName} Main`}
                    className="absolute inset-0 w-full h-full object-cover"
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
              </div>
            </div>
          </div>

          {/* Row 2: Top Description Text */}
          {/* We only render this if topDescription is long enough to not be used as the service summary, 
              or we render the first long chunk. Let's just render the full description cleanly. */}
          {topDescription && topDescription.length >= 100 && (
            <div className="w-full max-w-4xl mx-auto mb-20 md:mb-32">
              <p className="text-[18px] md:text-[22px] leading-[1.6] md:leading-[1.8] text-white/80 font-normal m-0 tracking-[-0.01em]">
                {topDescription}
              </p>
            </div>
          )}
          {/* Fallback if logic above skips it and there's only one description part provided */}
          {topDescription && topDescription.length < 100 && descriptionLines.length === 1 && (
            <div className="w-full max-w-4xl mx-auto mb-20 md:mb-32">
               <p className="text-[18px] md:text-[22px] leading-[1.6] md:leading-[1.8] text-white/80 font-normal m-0 tracking-[-0.01em]">
                {topDescription}
              </p>
            </div>
          )}

          {/* Row 3: Secondary Image with Vertical Scroll */}
          {currentProject.image2?.url && (
            <div className="w-full mb-16 md:mb-24">
              <div 
                ref={scrollContainerRef}
                className="w-full max-w-5xl mx-auto h-[400px] md:h-[600px] lg:h-[700px] rounded-[24px] overflow-y-auto no-scrollbar relative cursor-ns-resize"
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.05)"
                }}
              >
                {/* Optional Scroll instruction tooltip */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[12px] text-white/80 z-10 pointer-events-none flex items-center gap-2 border border-white/10">
                  <span className="animate-bounce">↓</span> Scroll to view full
                </div>
                
                <img
                  src={currentProject.image2.url}
                  alt={`${currentProject.projectName} Details`}
                  className="w-full h-auto object-cover min-h-full" 
                  style={{ display: "block" }}
                />
              </div>
            </div>
          )}

          {/* Row 4: Bottom Description Text (Problem / Additional text) */}
          {bottomDescription && (
            <div className="w-full max-w-4xl mx-auto mb-24 md:mb-32">
              <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] md:gap-8 items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 md:mb-0 mt-2 block">PROBLEM</span>
                  <p className="text-[18px] md:text-[22px] leading-[1.6] md:leading-[1.8] text-white/80 font-normal m-0 tracking-[-0.01em]">
                    {bottomDescription}
                  </p>
              </div>
            </div>
          )}

          {/* Row 5: Call to Action Button */}
          {currentProject.buttonText && currentProject.buttonLink && (
            <div className="w-full flex justify-center mb-32 md:mb-48">
              <a
                href={currentProject.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#a78bfa] hover:bg-[#9333ea] text-white px-10 py-4 md:px-12 md:py-4 rounded-xl font-bold text-[15px] md:text-[16px] tracking-wide transition-colors duration-300 shadow-[0_4px_20px_rgba(167,139,250,0.3)] hover:shadow-[0_6px_30px_rgba(167,139,250,0.5)]"
              >
                {currentProject.buttonText}
              </a>
            </div>
          )}

          {/* Row 6: More Projects Module */}
          {moreProjects.length > 0 && (
            <div className="w-full border-t border-white/10 pt-20">
              <h2 className="text-[28px] md:text-[36px] font-normal tracking-[-0.01em] mb-12">
                More Projects
              </h2>
              
              <div
                id="project-detail-more-scroll"
                className="flex gap-6 md:gap-8 overflow-x-auto cursor-grab active:cursor-grabbing pb-12"
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
                    <Link
                      to={`/projects/${proj.id}`}
                      key={proj.id}
                      className="w-[85%] sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-20px)] shrink-0 aspect-[16/10] rounded-[20px] md:rounded-[24px] overflow-hidden relative group block snap-start bg-white/5"
                    >
                      {/* bg */}
                      {bestFallbackImage && (
                        <img
                          src={bestFallbackImage}
                          alt={proj.projectName}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      )}

                      {/* overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

                      {/* Top Left Badge */}
                      {firstKey && (
                        <div className="absolute top-5 left-5 bg-white text-black text-[10px] md:text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-md pointer-events-none z-10 shadow-sm uppercase">
                          {firstKey}
                        </div>
                      )}

                      {/* Bottom Layout */}
                      <div className="absolute bottom-5 left-5 flex flex-col items-start gap-2.5 pointer-events-none pr-5 z-10 w-full">
                        {pCats.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {pCats.map((catId) => (
                              <div
                                key={catId}
                                className="bg-white/90 text-black px-2.5 py-1 rounded-[4px] flex items-center shadow-sm"
                              >
                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-[1px]">
                                  {getCategoryName(catId)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <h3 className="text-white text-[18px] md:text-[22px] font-normal tracking-[-0.01em] m-0 w-[90%] truncate">
                          {proj.projectName}
                        </h3>
                      </div>
                    </Link>
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
