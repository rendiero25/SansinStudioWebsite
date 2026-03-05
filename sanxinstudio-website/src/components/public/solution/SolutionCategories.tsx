import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import type { Category } from "../../cms/CategorySolutionsEditor";

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

  if (!loaded) return null;
  if (!categories || categories.length === 0) return null;

  const toggleMethod = (methodId: string) => {
    setOpenMethodId(openMethodId === methodId ? null : methodId);
  };

  const activeCategory =
    categories.find((cat) => cat.id === activeCategoryId) || categories[0];

  return (
    <section className="w-full bg-white text-black py-24 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col gap-12 md:gap-20">
        {/* Top Header & Tabs Area */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-12 w-full">
          {/* Left Sticky Title "Solutions" */}
          <div className="w-full xl:w-auto shrink-0 xl:sticky xl:top-32 h-auto text-left z-10">
            <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0">
              Solutions
            </h2>
          </div>

          {/* Right Tabs */}
          <div className="w-full xl:w-auto overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
            <div className="inline-flex flex-row items-center p-4 bg-white rounded-xl shadow-2xl border border-black/5 min-w-max gap-12">
              <span className="uppercase text-black/50 text-md ml-2">
                Category
              </span>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`flex items-center gap-2 px-12 py-3 rounded-lg font-primary text-[14px] md:text-[15px] font-medium transition-all focus:outline-none whitespace-nowrap ${
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
        </div>

        {/* Content Area for Active Category */}
        <div className="flex flex-col xl:flex-row items-start gap-16 w-full animate-[fadeIn_0.5s_ease-out]">
          {/* Left side: Category Details */}
          <div className="flex flex-col gap-8 w-full xl:w-[45%] shrink-0">
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
              <div className="w-[450px] h-[300px] overflow-hidden drop-shadow-md relative bg-white mt-4">
                <img
                  src={activeCategory.categoryImage.url}
                  alt={activeCategory.categoryName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right side: Methods */}
          <div className="flex flex-col gap-8 w-full xl:w-[55%] mt-12 xl:mt-0">
            {activeCategory.methods && activeCategory.methods.length > 0 && (
              <div className="flex flex-col gap-4 w-full">
                {activeCategory.methods.map((method) => {
                  const isOpen = openMethodId === method.id;
                  return (
                    <div
                      key={method.id}
                      className={`flex flex-col border border-black/10 rounded-2xl overflow-hidden transition-all duration-300 w-full bg-white shadow-sm ${isOpen ? "bg-[#f0f0f0]" : "hover:border-black/20"}`}
                    >
                      {/* Accordion Header */}
                      <button
                        className="w-full flex items-center justify-between p-6 md:p-8 bg-transparent border-none cursor-pointer text-left focus:outline-none"
                        onClick={() => toggleMethod(method.id)}
                      >
                        <div className="flex items-center gap-4">
                          {method.methodIcon?.url && (
                            <img
                              src={method.methodIcon.url}
                              alt=""
                              className="w-5 h-5 object-contain opacity-80"
                            />
                          )}
                          <span
                            className={`font-primary text-[20px] md:text-[22px] font-medium tracking-tight ${isOpen ? "text-black" : "text-black/80"}`}
                          >
                            {method.methodName}
                          </span>
                        </div>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-black text-white rotate-180" : "bg-black/5 text-black"}`}
                        >
                          <svg
                            width="14"
                            height="14"
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
                        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] opacity-100 pb-8" : "max-h-0 opacity-0"}`}
                      >
                        <div className="px-6 md:px-8 flex flex-col gap-4 w-full">
                          {method.details?.map((detail) => (
                            <div
                              key={detail.id}
                              className="bg-white p-6 md:p-8 rounded-xl w-full border border-black/5 shadow-sm"
                            >
                              <h5 className="font-primary text-[15px] font-bold text-black uppercase tracking-wide m-0 mb-3">
                                {detail.detailName}
                              </h5>
                              <p className="font-primary text-[14px] leading-[1.6] text-black/60 m-0 mb-6">
                                {detail.detailDesc}
                              </p>

                              {/* Keywords / Tags */}
                              {detail.detailKeywords && (
                                <div className="flex flex-wrap gap-x-4 items-center">
                                  {detail.detailKeywords
                                    .split(",")
                                    .map((kw, i) => (
                                      <span
                                        key={i}
                                        className="text-[11px] font-bold text-black/40 uppercase tracking-wider relative flex items-center gap-4"
                                      >
                                        {i > 0 && (
                                          <span className="w-px h-3 bg-black/20 absolute -left-2 top-1/2 -translate-y-1/2"></span>
                                        )}
                                        {kw.trim()}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Delivery Time Box */}
                          {method.deliveryTime && (
                            <div className="bg-white mt-4 p-5 rounded-xl flex flex-col items-center justify-center gap-1 w-max border border-black/5 shadow-sm px-10">
                              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                                Est. Delivery Time
                              </span>
                              <span className="text-[18px] font-bold text-black tracking-tight mt-1">
                                {method.deliveryTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-20">
          {/* Approach / Section Title underneath Image */}
          <div className="flex flex-col gap-4 mt-4 xl:mt-8 w-full xl:w-[400px] shrink-0">
            <span className="border-t border-black/50 w-[50px]"></span>
            <h4 className="uppercase font-primary text-[12px] font-normal leading-tight tracking-tight m-0 max-w-[400px]">
              {activeCategory.sectionTitle}
            </h4>
            {activeCategory.sectionDesc && (
              <p className="font-primary text-[35px] text-black leading-tight max-w-[850px] m-0">
                {activeCategory.sectionDesc}
              </p>
            )}
            {activeCategory.buttonText && activeCategory.buttonLink && (
              <a
                href={activeCategory.buttonLink}
                className="mt-4 inline-flex items-center justify-center px-16 py-2.5 border border-black/30 rounded-xl text-[17px] font-primary font-medium hover:bg-black hover:text-white transition-colors w-max"
              >
                {activeCategory.buttonText}
              </a>
            )}
          </div>

          {/* Features Scroll Row */}
          {activeCategory.features && activeCategory.features.length > 0 && (
            <div className="w-full xl:w-[calc(100%-480px)] overflow-hidden">
              <div className="flex flex-col xl:flex-row gap-6 w-full xl:overflow-x-auto scrollbar-hide snap-x auto-cols-max pb-8 xl:pt-4 pl-[2px] pr-8">
                {activeCategory.features.map((f, i) => {
                  const feature = f as any;
                  return (
                    <div
                      key={i}
                      className="flex flex-col bg-white rounded-2xl md:rounded-[32px] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 border border-black/5 w-full xl:w-[420px] shrink-0 snap-start"
                    >
                      <div className="bg-black text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-8 shrink-0">
                        {feature.icon?.url ? (
                          <img
                            src={feature.icon.url}
                            alt=""
                            className="w-7 h-7 md:w-8 md:h-8 object-contain"
                          />
                        ) : (
                          <span className="text-[20px] md:text-[22px] font-bold">
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <h5 className="font-primary text-[28px] md:text-[32px] font-bold leading-tight tracking-[-0.01em] mb-4 text-black">
                        {String(feature.title || "")}
                      </h5>
                      <p className="font-primary text-[15px] md:text-[16px] leading-[1.6] text-black/60 m-0 flex-1">
                        {String(feature.description || "")}
                      </p>
                      {feature.keywords &&
                        typeof feature.keywords === "string" && (
                          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mt-10 pt-6 border-t border-black/5">
                            {feature.keywords
                              .split(",")
                              .map((kw: string, j: number) => (
                                <span
                                  key={j}
                                  className="text-[11px] font-bold text-black/50 uppercase tracking-[0.05em] relative flex items-center gap-4"
                                >
                                  {j > 0 && (
                                    <span className="w-px h-3 bg-black/20 absolute -left-2 top-1/2 -translate-y-1/2"></span>
                                  )}
                                  {kw.trim()}
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
        <div className="flex justify-end mt-8 container mx-auto px-6 md:px-12 xl:px-20">
          <a
            href={globalButton.link}
            className="inline-flex items-center justify-center px-16 py-4 bg-[#8B5CF6] text-white rounded-xl text-[17px] font-primary font-bold hover:bg-[#7C3AED] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
          >
            {globalButton.text}
          </a>
        </div>
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
