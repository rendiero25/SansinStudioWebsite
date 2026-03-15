import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import { getSection } from "../services/sectionApi";
import type { ProjectCategory } from "../components/cms/ProjectCategoriesEditor";
import type { ProjectItem } from "../components/cms/ProjectItemsEditor";
import Skeleton from "../components/Skeleton";
import Section2 from "../components/public/Section2";

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
  const moreProjects = data.projects.filter((p) => p.id !== id);

  // Helper to get category name by ID
  const getCategoryName = (catId: string) => {
    return data.categories.find((c) => c.id === catId)?.categoryName || "Uncategorized";
  };
  // Extract categories for the specific project
  const projectCategories = currentProject
    ? (currentProject.categoryIds || (currentProject.categoryId ? [currentProject.categoryId] : []))
    : [];

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
      <div className="project-detail-page font-primary bg-[#0A0A0A] text-white min-h-screen">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 md:px-12 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-32 mt-8 md:mt-16">
               <div className="flex flex-col gap-8">
                  <Skeleton dark className="w-full h-[60px]" />
                  <Skeleton dark className="w-full h-[150px]" />
                  <div className="flex gap-4">
                     <Skeleton dark className="w-[120px] h-[40px] rounded-lg" />
                     <Skeleton dark className="w-[120px] h-[40px] rounded-lg" />
                  </div>
               </div>
               <Skeleton dark className="w-full aspect-video rounded-3xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-primary text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-white/60 mb-8">The project you are looking for does not exist.</p>
        <Link to="/projects" className="bg-white text-black px-6 py-3 rounded-lg font-medium">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page font-primary bg-black text-white min-h-screen">
      <Header />

      <main className="pt-15 xl:pt-32">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          
          {/* Header Layout: Text Details Left, Image Right */}
          <div className="flex flex-col xl:flex-row justify-between gap-10 mb-20 md:mb-32 mt-8 md:mt-16">
            
            {/* Left Column: Title, Brand, Summary, Badges */}
            <div className="flex flex-col justify-between pt-4">
              <div className="flex flex-col gap-10">
                {/* Project Title */}
                <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-normal leading-[1.1] tracking-[-0.03em] m-0">
                  {renderStyledText(currentProject.projectName)}
                </h1>

                {/* Details Section */}
                <div className="flex flex-col gap-8">
                  {/* Brand Row */}
                  <div className="flex flex-row items-start gap-6 md:gap-12">
                    <span className="text-[10px] md:text-[11px] font-bold text-white uppercase w-24 shrink-0 pt-1.5">
                      Brand
                    </span>
                    <div className="text-[16px] md:text-[23px] text-white font-medium">
                      {renderStyledText(currentProject.brand || "—")}
                    </div>
                  </div>

                  {/* Summary Row */}
                  <div className="flex flex-row items-start gap-6 md:gap-12">
                    <span className="text-[10px] md:text-[11px] font-bold text-white uppercase w-24 shrink-0 pt-1.5">
                      Project Summary
                    </span>
                    <div className="text-[16px] md:text-[23px] text-white leading-relaxed max-w-md">
                      {renderStyledText(currentProject.projectSummary || "—")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Badges */}
              <div className="flex flex-wrap items-center gap-3 mt-12 md:mt-20">
                {/* Static Production Badge */}
                {projectCategories.map((catId) => (
                   <div
                      key={catId}
                      className="bg-white text-black px-5 py-2.5 rounded-lg flex items-center shadow-lg"
                    >
                      <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest leading-none mt-px flex items-center gap-2">
                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0H10V1.5L6 6L10 10.5V12H0V10.5L4 6L0 1.5V0Z" fill="currentColor"/>
                        </svg>
                        {getCategoryName(catId)}
                      </span>
                    </div>
                ))}
              </div>
            </div>

            {/* Right Column: Main Image */}
            <div className="w-full">
              <div className="w-full h-[650px] rounded-xl overflow-hidden relative shadow-2xl border border-white/5">
                {currentProject.mainImage?.url ? (
                  <img
                    src={currentProject.mainImage.url}
                    alt={`${stripHtml(currentProject.projectName)} Main`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 bg-white/5 italic">No Main Image Available</div>
                )}
              </div>
            </div>

          </div>

          {/* Row 3: Secondary Image with Window Scroll Sync */}
          {currentProject.image2?.url && (
            <div id="project-detail-image2-parent" className="w-full mb-16 md:mb-10 relative rounded-2xl" style={{ minHeight: "100vh" }}>
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
                className="inline-flex items-center justify-center bg-[#8A2BE2] hover:bg-white text-white hover:text-black px-10 py-4 md:px-12 md:py-4 rounded-lg font-bold text-[15px] md:text-[16px] tracking-wide transition-colors duration-300"
              >
                {currentProject.buttonText || "View Project"}
              </a>
            </div>
          )}

        </div>
      </main>

      {/* Row 6: More Projects Module (Reusing Section2) */}
      {moreProjects.length > 0 && (
        <Section2
          showLabel={false}
          isDark={true}
          customTitle="More Projects"
        />
      )}

      {/* Footer with forced black background, overriding default CMS image as requested */}
      <Footer showCTA={false} showBackgroundImage={false} />

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
           background-color: #0d0d0d;
        }
      `}
      </style>
    </div>
  );
};

export default ProjectDetail;
