import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import type { Category } from "../../cms/CategorySolutionsEditor";
import Skeleton from "../../Skeleton";
import ScrollReveal from "../../ScrollReveal";

const SolutionCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalButton, setGlobalButton] = useState<{
    text: string;
    link: string;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [openMethodId, setOpenMethodId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [section2, section4] = await Promise.all([
          getSection("solution", "section2"),
          getSection("solution", "section4"),
        ]);

        if (
          section2.content?.categories &&
          section2.content.categories.length > 0
        ) {
          setCategories(section2.content.categories as Category[]);
          setActiveCategoryId(section2.content.categories[0].id); // Set first category as active
        }

        if (section4.content?.ctaButton) {
          setGlobalButton(
            section4.content.ctaButton as { text: string; link: string },
          );
        }
      } catch (err) {
        console.error("Failed to load solution categories:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Attach wheel → horizontal scroll via DOM ID
  useEffect(() => {
    // Wait one tick for React to render the element
    const timer = setTimeout(() => {
      const container = document.getElementById("features-scroll");
      if (!container) return;

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
        // Fill from this element's left edge to the right edge of the window
        container.style.width = `${window.innerWidth - rect.left}px`;
      };

      setBreakoutWidth();
      window.addEventListener("resize", setBreakoutWidth);

      // Store cleanup ref on the element itself
      (
        container as HTMLElement & { __wheelCleanup?: () => void }
      ).__wheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
        window.removeEventListener("resize", setBreakoutWidth);
      };
    }, 50);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById("features-scroll") as
        | (HTMLElement & { __wheelCleanup?: () => void })
        | null;
      if (container && container.__wheelCleanup) {
        container.__wheelCleanup();
      }
    };
  }, [activeCategoryId]); // Re-attach when category changes

  // Wheel → horizontal scroll for method accordion detail rows
  useEffect(() => {
    if (!openMethodId) return;

    // Wait for accordion CSS transition to finish (300ms) before attaching
    const timer = setTimeout(() => {
      const container = document.querySelector(
        `[data-method-scroll="${openMethodId}"]`,
      ) as HTMLElement | null;
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        if (container.scrollWidth <= container.clientWidth) return;
        e.preventDefault();
        e.stopPropagation();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      (
        container as HTMLElement & { __methodWheelCleanup?: () => void }
      ).__methodWheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, 350);

    return () => {
      clearTimeout(timer);
      const container = document.querySelector(
        `[data-method-scroll="${openMethodId}"]`,
      ) as (HTMLElement & { __methodWheelCleanup?: () => void }) | null;
      if (container?.__methodWheelCleanup) {
        container.__methodWheelCleanup();
      }
    };
  }, [openMethodId]);

  if (!loaded) {
    return (
      <section className="w-full bg-white text-black py-15 md:py-25 relative">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-5 xl:gap-20">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-12 w-full">
            <Skeleton className="w-[150px] h-[40px] md:h-[50px] mt-4" />
            <Skeleton className="w-full xl:w-[400px] h-[55px] rounded-xl" />
          </div>
          <div className="flex flex-col xl:flex-row items-start gap-16 w-full">
            <div className="flex flex-col gap-8 w-full xl:w-[40.5%] shrink-0">
              <Skeleton className="w-[80%] h-[40px] md:h-[50px]" />
              <Skeleton className="w-full h-[60px]" />
              <Skeleton className="w-full xl:w-[500px] h-[300px] rounded-xl" />
            </div>
            <div className="flex flex-col gap-8 w-full mt-12 xl:mt-0 min-w-0">
              <Skeleton className="w-full h-[80px] rounded-xl" />
              <Skeleton className="w-full h-[80px] rounded-xl" />
              <Skeleton className="w-full h-[80px] rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!categories || categories.length === 0) return null;

  const toggleMethod = (methodId: string) => {
    setOpenMethodId(openMethodId === methodId ? null : methodId);
  };

  const activeCategory =
    categories.find((cat) => cat.id === activeCategoryId) || categories[0];

  return (
    <section
      className="w-full bg-white text-black mt-30 relative"
      style={{ overflowX: "clip", overflowY: "visible" }}
    >
      <div
        className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-5 xl:gap-20"
        style={{ overflow: "visible" }}
      >
        {/* Top Header & Tabs Area */}
        <ScrollReveal className="flex flex-col xl:flex-row justify-between items-start gap-12 w-full">
          {/* Left Sticky Title "Solutions" */}
          <div className="w-full xl:w-auto shrink-0 xl:sticky xl:top-32 h-auto text-left z-10 mt-4">
            <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0">
              Solutions
            </h2>
          </div>

          {/* Right Tabs */}
          <div className="w-full xl:w-auto pb-4 xl:pb-0 scrollbar-hide">
            <div className="inline-flex w-full flex-col xl:flex-row items-center p-3 m-2 bg-white rounded-xl shadow-md border border-black/5 min-w-max gap-5">
              <span className="uppercase text-black text-sm xl:ml-2 xl:mr-12">
                Category
              </span>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`cursor-pointer flex items-center gap-2 px-9 py-2 rounded-lg font-primary text-[14px] md:text-[15px] font-medium transition-all focus:outline-none whitespace-nowrap ${
                    activeCategoryId === cat.id
                      ? "bg-[#e0e0e0] text-black"
                      : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
                  }`}
                >
                  {cat.categoryIcon?.url && (
                    <img
                      src={cat.categoryIcon.url}
                      alt=""
                      className={`w-4 h-4 object-contain ${activeCategoryId === cat.id ? "opacity-100" : "opacity-60"}`}
                    />
                  )}
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Content Area for Active Category */}
        <div className="flex flex-col xl:flex-row items-start gap-16 w-full animate-[fadeIn_0.5s_ease-out]">
          {/* Left side: Category Details */}
          <ScrollReveal
            delay={0.2}
            direction="right"
            className="flex flex-col gap-8 w-full xl:w-[40.5%] shrink-0"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4">
              {activeCategory.categoryIcon?.url && (
                <img
                  src={activeCategory.categoryIcon.url}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              )}
              <h3 className="font-primary text-[28px] md:text-[36px] font-bold tracking-tight m-0">
                {activeCategory.categoryName}
              </h3>
            </div>

            <p className="font-primary text-[15px] md:text-[17px] 2xl:text-[21px] leading-[1.6] text-black/60 m-0 max-w-[500px]">
              {activeCategory.categoryDesc}
            </p>

            {activeCategory.categoryImage?.url && (
              <div className="w-full xl:w-[500px] h-[300px] rounded-xl overflow-hidden drop-shadow-md relative bg-white mt-4">
                <img
                  src={activeCategory.categoryImage.url}
                  alt={activeCategory.categoryName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </ScrollReveal>

          {/* Right side: Methods */}
          <ScrollReveal
            delay={0.3}
            direction="up"
            className="flex flex-col gap-8 w-full mt-12 xl:mt-0 min-w-0"
          >
            {activeCategory.methods && activeCategory.methods.length > 0 && (
              <div className="flex flex-col gap-4 w-full min-w-0">
                {activeCategory.methods.map((method) => {
                  const isOpen = openMethodId === method.id;
                  return (
                    <div
                      key={method.id}
                      className={`flex flex-col rounded-xl transition-all duration-300 w-full min-w-0 ${isOpen ? "bg-[#D9D9D9] overflow-visible" : "bg-white hover:border-black/20 shadow-sm overflow-hidden"}`}
                    >
                      {/* Accordion Header */}
                      <button
                        className="w-full flex items-center justify-between p-6 bg-transparent border-none cursor-pointer text-left focus:outline-none"
                        onClick={() => toggleMethod(method.id)}
                      >
                        <div className="flex items-center gap-4">
                          {method.methodIcon?.url && (
                            <img
                              src={method.methodIcon.url}
                              alt=""
                              className="w-6 h-6 object-contain opacity-90"
                            />
                          )}
                          <span
                            className={`font-primary text-[24px] font-bold tracking-tight ${isOpen ? "text-black" : "text-black/80"}`}
                          >
                            {method.methodName}
                          </span>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-black text-white rotate-180" : "bg-black/5 text-black"}`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <div
                        className={`px-6 w-full transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100 pb-2 overflow-visible" : "max-h-0 opacity-0 overflow-hidden"}`}
                      >
                        <div className="flex flex-col w-full">
                          {/* Horizontally scrolling row */}
                          <div
                            data-method-scroll={method.id}
                            className="flex overflow-x-auto gap-4 md:gap-4 w-full pb-6 scrollbar-hide"
                          >
                            {method.details?.map((detail) => (
                              <div
                                key={detail.id}
                                className="bg-white p-6 md:p-8 rounded-md w-[300px] md:w-[350px] shrink-0 border border-black/5 shadow-xs snap-start flex flex-col justify-between min-h-[220px]"
                              >
                                <div>
                                  <h5 className="font-primary text-[18px] md:text-[20px] font-bold text-black uppercase m-0 mb-4">
                                    {detail.detailName}
                                  </h5>
                                  <p className="font-primary text-[14px] md:text-[15px] leading-normal text-black/60 m-0 mb-8">
                                    {detail.detailDesc}
                                  </p>
                                </div>

                                {/* Keywords / Tags */}
                                {detail.detailKeywords && (
                                  <div className="flex flex-wrap items-center gap-y-3 mt-auto">
                                    {/* Leading separator */}
                                    <span className="w-[1.5px] h-[14px] bg-black/30 mr-3"></span>
                                    {detail.detailKeywords
                                      .split(",")
                                      .map((kw, i) => (
                                        <span
                                          key={i}
                                          className="text-[10px] font-bold text-black uppercase tracking-wide flex items-center"
                                        >
                                          {kw.trim()}
                                          <span className="w-[1.5px] h-[14px] bg-black/30 mx-3"></span>
                                        </span>
                                      ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Delivery Time Box */}
                          {method.deliveryTime && (
                            <div className="flex pb-6">
                              <div className="bg-white px-16 py-3 rounded-md flex flex-col items-center justify-center gap-1 w-max shadow-xs border border-black/5">
                                <span className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-widest">
                                  Est. Delivery Time
                                </span>
                                <span className="text-[16px] md:text-[20px] font-bold text-black tracking-tight ">
                                  {method.deliveryTime}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollReveal>
        </div>

        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-20 mt-10">
          {/* Approach / Section Title underneath Image */}
          <ScrollReveal
            delay={0.4}
            direction="up"
            className="flex flex-col gap-4 mt-4 xl:mt-8 w-full xl:w-[450px] shrink-0"
          >
            <span className="border-t-3 border-black/50 w-[100px] "></span>
            <h4 className="uppercase font-primary text-[12px] font-medium leading-tight tracking-tight m-0 max-w-[450px]">
              {activeCategory.sectionTitle}
            </h4>
            {activeCategory.sectionDesc && (
              <p className="font-primary text-[35px] text-black leading-tight max-w-[1000px] m-0">
                {activeCategory.sectionDesc}
              </p>
            )}
            {activeCategory.buttonText && activeCategory.buttonLink && (
              <a
                href={activeCategory.buttonLink}
                className="mt-4 inline-flex items-center justify-center px-16 py-2.5 border border-black/30 rounded-lg text-[17px] font-primary font-medium hover:bg-black hover:text-white transition-colors w-max"
              >
                {activeCategory.buttonText}
              </a>
            )}
          </ScrollReveal>

          {/* Features Scroll Row - breaks out of container to right edge */}
          {activeCategory.features && activeCategory.features.length > 0 && (
            <div
              className="w-full xl:w-[calc(100%-480px)] opacity-0 translate-y-8 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]"
              style={{ overflow: "visible" }}
            >
              <div
                id="features-scroll"
                className="flex gap-6 overflow-x-auto cursor-grab active:cursor-grabbing pb-8 pt-4 pl-[2px]"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  overscrollBehavior: "contain",
                  paddingRight: "20px",
                }}
              >
                {activeCategory.features.map((f, i) => {
                  const feature = f as Record<string, unknown>;
                  const featureIcon = feature.icon as
                    | { url: string; publicId: string }
                    | null
                    | undefined;
                  console.log(
                    `Feature ${i}:`,
                    feature.title,
                    "| icon:",
                    featureIcon?.url || "NONE",
                    "| raw icon:",
                    JSON.stringify(feature.icon),
                  );
                  return (
                    <div
                      key={(feature.id as string) || `feature-${i}`}
                      className="flex flex-col gap-10 bg-white rounded-2xl md:rounded-xl p-8 md:p-12 shadow-md transition-shadow duration-300 border border-black/5 w-full xl:w-[420px] shrink-0"
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0">
                        {featureIcon?.url ? (
                          <img
                            src={featureIcon.url}
                            alt={`icon-${i}`}
                            className="w-7 h-7 md:w-15 md:h-15 object-contain"
                          />
                        ) : (
                          <span className="text-[20px] md:text-[22px] font-bold">
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <h5 className="font-primary text-[28px] md:text-[32px] max-w-[200px] font-bold leading-tight tracking-[-0.01em] text-black">
                        {String(feature.title || "")}
                      </h5>

                      <p className="font-primary text-[15px] md:text-[20px] leading-[1.6] text-black/60 -mt-5 flex-1">
                        {String(feature.description || "")}
                      </p>

                      {typeof feature.keywords === "string" &&
                        feature.keywords && (
                          <div className="flex flex-wrap items-center gap-y-3 mt-auto pt-8">
                            {/* Leading separator */}
                            <span className="w-[1.5px] h-[14px] bg-black/30 mr-3"></span>
                            {(feature.keywords as string)
                              .split(",")
                              .map((kw: string, j: number) => (
                                <span
                                  key={j}
                                  className="text-[11px] font-bold text-black uppercase tracking-[0.05em] relative flex items-center"
                                >
                                  {kw.trim()}
                                  <span className="w-[1.5px] h-[14px] bg-black/30 mx-3"></span>
                                </span>
                              ))}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category overall get started button - placed below features matching design */}
      {globalButton && (
        <ScrollReveal
          delay={0.5}
          direction="up"
          className="flex justify-center xl:justify-end mt-8 container mx-auto px-6 md:px-12 xl:px-20"
        >
          <a
            href={globalButton.link}
            className="inline-flex items-center justify-center px-16 py-4 bg-[#8B5CF6] text-white rounded-lg text-[17px] font-primary font-bold hover:bg-[#7C3AED] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            {globalButton.text}
          </a>
        </ScrollReveal>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
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

export default SolutionCategories;
