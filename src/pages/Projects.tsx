import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import { getSection } from "../services/sectionApi";
import type { ProjectCategory } from "../components/cms/ProjectCategoriesEditor";
import type { ProjectItem } from "../components/cms/ProjectItemsEditor";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";

interface ProjectsData {
  categories: ProjectCategory[];
  projects: ProjectItem[];
  title: string;
  footerBg: string;
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

const Projects = () => {
  const [data, setData] = useState<ProjectsData>({
    categories: [],
    projects: [],
    title: "Projects",
    footerBg: "",
  });
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const [section1Res, section2Res, section3Res] = await Promise.all([
          getSection("projects", "section1"),
          getSection("projects", "section2"),
          getSection("projects", "section3"),
        ]);

        const categories = section1Res?.content?.categories || [];

        setData({
          title: section1Res?.content?.sectionTitle || "Projects",
          categories: categories,
          projects: section2Res?.content?.projects || [],
          footerBg: section3Res?.content?.backgroundImage?.url || "",
        });

        // Handle category navigation from Works page
        const state = location.state as { categoryName?: string };
        if (state?.categoryName) {
          const targetCategory = categories.find(
            (c: ProjectCategory) =>
              c.categoryName
                .toLowerCase()
                .includes(state.categoryName!.toLowerCase()) ||
              state
                .categoryName!.toLowerCase()
                .includes(c.categoryName.toLowerCase()),
          );
          if (targetCategory) {
            setActiveCategory(targetCategory.id);
            setCurrentPage(1);
            setLoading(false);
            return;
          }
        }

        // Default to showing "All Projects" when no specific category is selected
        setActiveCategory("");
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to load projects data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsData();
  }, [location.state]);

  const filteredProjects = activeCategory
    ? data.projects.filter(
        (proj) =>
          proj.categoryId === activeCategory ||
          (proj.categoryIds && proj.categoryIds.includes(activeCategory)),
      )
    : data.projects;

  // Pagination Logic
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Helper to get category name by ID
  const getCategoryName = (id: string) => {
    return (
      data.categories.find((c) => c.id === id)?.categoryName || "Uncategorized"
    );
  };

  // Helper to get category icon by ID
  const getCategoryIcon = (id: string) => {
    return data.categories.find((c) => c.id === id)?.categoryIcon || null;
  };

  return (
    <div className="projects-page font-primary">
      <Header />

      <main className="pt-32 pb-24 min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          {/* Row 1: Title */}
          <div className="lg:sticky lg:top-[70px] lg:z-40 mb-8 flex flex-col xl:flex-row justify-between items-center">
            <ScrollReveal className="w-full xl:w-auto overflow-hidden">
              <h1
                className={`text-[32px] md:text-[42px] font-normal tracking-[-0.02em] text-[#0A0A0A] m-0 leading-none transition-all duration-300 ${
                  isScrolled
                    ? "opacity-0 invisible h-0 w-0 overflow-hidden"
                    : "opacity-100 visible h-auto w-auto"
                }`}
              >
                {renderStyledText(data.title)}
              </h1>
            </ScrollReveal>

            {/* Row 2: Sticky Category Filter Pills */}
            <ScrollReveal delay={0.2} direction="left" className="py-4 sm:mx-0 sm:px-0 w-full xl:w-auto">
              <div className="flex justify-start lg:justify-end">
                <div className="flex flex-col lg:flex-row w-full lg:w-auto items-center bg-white shadow-md border border-black/5 rounded-xl p-4 m-2 xl:m-0 xl:p-2 gap-2 overflow-x-auto max-w-full hide-scrollbar">
                  <span className="text-sm uppercase text-black/50 px-3 shrink-0 mb-4 lg:mb-0">
                    CATEGORY
                  </span>

                  <button
                    onClick={() => {
                      setActiveCategory("");
                      setCurrentPage(1);
                    }}
                    className={`cursor-pointer flex items-center gap-2 mb-3 lg:mb-0 px-9 py-2 rounded-lg text-[14px] md:text-[15px] font-medium transition-colors shrink-0 ${
                      activeCategory === ""
                        ? "bg-[#e0e0e0] text-black"
                        : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
                    }`}
                  >
                    All Projects
                  </button>

                  {data.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setCurrentPage(1); // Reset page on category change
                      }}
                      className={`cursor-pointer flex items-center gap-2 mb-3 lg:mb-0 px-9 py-2 rounded-lg text-[14px] md:text-[15px] font-medium transition-colors shrink-0 ${
                        activeCategory === cat.id
                          ? "bg-[#e0e0e0] text-black"
                          : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
                      }`}
                    >
                      {cat.categoryIcon && (
                        <img
                          src={cat.categoryIcon.url}
                          alt=""
                          className={`w-4 h-4 object-contain ${activeCategory === cat.id ? "opacity-100" : "opacity-60"}`}
                        />
                      )}
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-5 md:gap-y-5">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="w-full aspect-video rounded-xl" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="w-full py-20 text-center text-gray-500">
              No projects found in this category.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-5 md:gap-y-5">
                {paginatedProjects.map((project) => {
                  // Extract first keyword for top left badge
                  const firstKeyword = project.keywords
                    ? project.keywords.split(",")[0].trim()
                    : "";

                  // Gather all category IDs for this project
                  const projCategoryIds =
                    project.categoryIds ||
                    (project.categoryId ? [project.categoryId] : []);

                  return (
                    <ScrollReveal
                      key={project.id}
                      className="group relative w-full aspect-16/10 md:aspect-4/3 lg:aspect-16/10 rounded-xl overflow-hidden cursor-pointer"
                    >
                      {/* Background Image */}
                      {project.mainImage?.url ? (
                        <img
                          src={project.mainImage.url}
                          alt={stripHtml(project.projectName)}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-[#1A1A1A]" />
                      )}

                      {/* Gradient Overlay for bottom text readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />

                      {/* See Project Button — center */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <Link
                          to={`/projects/${project.id}`}
                          className="px-7 py-3.5 border-[1.5px] border-white/60 text-white font-primary font-semibold text-[14px] md:text-[15px] rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/70 transition-colors no-underline"
                        >
                          See Project
                        </Link>
                      </div>

                      {/* Top Left: Keyword Badge */}
                      {firstKeyword && (
                        <div className="absolute top-6 left-6 bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-lg pointer-events-none z-10">
                          {firstKeyword}
                        </div>
                      )}

                      {/* Bottom Left Content */}
                      <div className="absolute bottom-6 left-6 flex flex-col items-start gap-3 pointer-events-none pr-6 z-10">
                        {/* Categories Row */}
                        {projCategoryIds.length > 0 && (
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
                                <span className="text-[12px] font-medium leading-none mt-px">
                                  {getCategoryName(catId)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Project Title */}
                        <h3 className="text-white text-[24px] md:text-[28px] font-normal tracking-[-0.02em] m-0 leading-[1.2]">
                          {renderStyledText(project.projectName)}
                        </h3>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors bg-white border border-[#EBEBEB] text-[#0A0A0A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-[14px] font-medium text-black/60">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors bg-white border border-[#EBEBEB] text-[#0A0A0A] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer showCTA={false} backgroundImageOverride={data.footerBg} />

      <style>
        {`
        .projects-page {
          background: #ffffff;
          color: #0a0a0a;
          min-height: 100vh;
          /* overflow-x: hidden; */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
      </style>
    </div>
  );
};

const stripHtml = (html: string) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default Projects;
