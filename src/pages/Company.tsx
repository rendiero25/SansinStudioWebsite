import { useState, useEffect } from "react";
import Header from "../components/public/Header";
import SolutionFAQs from "../components/public/solution/SolutionFAQs";
import { getSection } from "../services/sectionApi";
import Accordion from "../components/public/company/Accordion";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";
import Footer from "../components/public/Footer";
import { sanitizeHtml } from "../utils/sanitize";


interface Section1Data {
  title?: string;
  description1?: string;
  vision?: string;
  mission?: string;
  detailsTitle?: string;
  detailsDescription?: string;
  image?: { url: string };
  items?: {
    id: string;
    name: string;
    icon?: { url: string };
    subItems?: {
      id: string;
      name: string;
      icon?: { url: string };
      link?: string;
      category?: string;
    }[];
  }[];
}

interface Section2Data {
  title?: string;
  image?: { url: string };
}

interface HeroData {
  bgType?: "image" | "video";
  bgImage?: { url: string };
  bgVideo?: { url: string };
}

const Company = () => {
  const [section1, setSection1] = useState<Section1Data | null>(null);
  const [section2, setSection2] = useState<Section2Data | null>(null);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection1Accordion, setOpenSection1Accordion] = useState<
    string | null
  >(null);
  const [openSection2Accordion, setOpenSection2Accordion] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s1, s2, hero] = await Promise.all([
          getSection("company", "section1"),
          getSection("company", "section2"),
          getSection("home", "hero"),
        ]);
        setSection1(s1.content || {});
        setSection2(s2.content || {});
        setHeroData(hero.content || {});
      } catch (err) {
        console.error("Failed to fetch company data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="company-page bg-white min-h-screen font-primary text-black">
        <Header />
        <main className="mt-32 pb-20 px-6 md:px-12 xl:px-20 overflow-x-hidden container mx-auto">
          {/* Top Image Skeleton */}
          <div className="w-full aspect-video rounded-[24px] overflow-hidden mb-16">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
            <div className="flex flex-col gap-8">
              <Skeleton className="w-[80%] h-12" />
              <div className="space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-[70%] h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full h-16 rounded-xl" />
              <Skeleton className="w-full h-16 rounded-xl" />
            </div>
          </div>

          {/* Details Section Skeleton */}
          <div className="bg-[#A7A7A7] rounded-[32px] p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <div className="flex flex-col gap-8">
                <Skeleton className="w-24 h-6 rounded-md opacity-20" />
                <Skeleton className="w-full h-12 opacity-20" />
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-16 rounded-xl opacity-20" />
                <Skeleton className="w-full h-16 rounded-xl opacity-20" />
                <Skeleton className="w-full h-16 rounded-xl opacity-20" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="company-page bg-white min-h-screen font-primary text-black">
      <Header />

      <main className="pt-23 lg:pt-30 pb-10 overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          {/* 1. Top Image/Video */}
          <ScrollReveal delay={0.1} className="aspect-3/4 lg:aspect-video rounded-2xl overflow-hidden mb-16 relative bg-[#EEEEEE]">
            {heroData?.bgType === "video" && heroData?.bgVideo?.url ? (
              <video
                src={heroData.bgVideo.url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : heroData?.bgImage?.url ? (
              <img
                src={heroData.bgImage.url}
                alt="Company"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : section1?.image?.url ? (
              <img
                src={section1.image.url}
                alt="Company"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-[#EEEEEE]" />
            )}
          </ScrollReveal>

          {/* 2. Middle Section: Title & Description | Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-15 mb-15 xl:mb-24 items-start">
            <ScrollReveal delay={0.2} className="flex flex-col gap-4 lg:gap-8">
              <h1 
                className="text-[28px] sm:text-[32px] lg:text-[40px] xl:text-[42px] font-normal quill-content-title"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1?.title || "") }}
              />
              <div 
                className="text-[16px] sm:text-[17px] md:text-[18px] font-normal text-black/80 max-w-xl quill-content-description"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1?.description1 || "") }}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3} direction="right" className="flex flex-col gap-4">
              <Accordion
                title="Vision"
                isOpen={openSection1Accordion === "Vision"}
                onToggle={() =>
                  setOpenSection1Accordion(
                    openSection1Accordion === "Vision" ? null : "Vision"
                  )
                }
              >
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1?.vision || "") }} className="text-[16px] sm:text-[22px] md:text-[25px] lg:text-[16px] quill-content-description"/>
              </Accordion>

              <Accordion
                title="Mission"
                isOpen={openSection1Accordion === "Mission"}
                onToggle={() =>
                  setOpenSection1Accordion(
                    openSection1Accordion === "Mission" ? null : "Mission"
                  )
                }
              >
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1?.mission || "") }} className="text-[16px] sm:text-[22px] md:text-[25px] lg:text-[16px] quill-content-description"/>
              </Accordion>
            </ScrollReveal>
          </div>

          {/* 3. Details Section (Gray Background) */}
          <ScrollReveal delay={0.4} className="bg-[#A7A7A7] rounded-xl p-8 md:p-10 mb-15 xl:mb-24 overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-12 lg:gap-24 items-stretch">
              <div className="flex flex-col justify-between items-start gap-4 lg:gap-8">
                {/* Details Label */}
                <div className="inline-flex items-center gap-1.5 bg-white/50 text-black text-[10px] md:text-[12px] font-bold px-3 py-1.5 rounded-md shadow-sm font-primary uppercase">
                  <h2
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1?.detailsTitle || "") }}
                  />
                </div>

                {section1?.detailsDescription && (
                  <div 
                    className="text-[25px] md:text-[45px] leading-tight text-white max-w-2xl m-0 quill-content-title"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(section1.detailsDescription) }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                {section1?.items?.map((item) => (
                  <Accordion
                    key={item.id}
                    title={item.name}
                    icon={item.icon?.url}
                    isOpen={openSection2Accordion === item.id}
                    onToggle={() =>
                      setOpenSection2Accordion(
                        openSection2Accordion === item.id ? null : item.id
                      )
                    }
                  >
                    <div className="flex flex-col gap-6 py-2">
                      {item.subItems && item.subItems.some((s) => s.category) ? (
                        <div className="flex flex-col gap-8">
                          {["Social media account", "Creative work account"].map((cat) => {
                            const filtered = item.subItems?.filter((s) => s.category === cat);
                            if (!filtered || filtered.length === 0) return null;
                            return (
                              <div key={cat} className="flex flex-col gap-4">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-black/30">
                                  {cat}
                                </span>
                                <div className="flex flex-wrap gap-4"> 
                                  {filtered.map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-3">
                                      {sub.icon?.url && (
                                        <img src={sub.icon.url} alt="" className="w-5 h-5 object-contain" />
                                      )}
                                      {sub.link ? (
                                        <a
                                          href={sub.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-text-black hover:text-indigo-600 font-medium transition-colors"
                                        >
                                          {sub.name}
                                        </a>
                                      ) : (
                                        <span className="text-black font-medium">{sub.name}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {item.subItems?.map((sub) => (
                            <div key={sub.id} className="flex items-center gap-4">
                              {sub.icon?.url && (
                                <div className="size-3 lg:size-4 flex items-center justify-center">
                                  <img src={sub.icon.url} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-black font-medium text-[16px] lg:text-[22px]">{sub.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Accordion>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 4. Privacy Policies Section */}
        {section2?.image?.url && (
          <section className="mt-15 xl:mt-30 bg-linear-to-b from-[#D9D9D9] to-transparant pt-10 lg:pt-15">
            <div className="container mx-auto px-6 md:px-12 xl:px-20">
              <ScrollReveal className="flex flex-col items-center mb-10 lg:mb-16">
                <h2 className="text-[32px] md:text-[40px] font-normal tracking-[-0.03em] text-center">
                  {section2.title || "Privacy Policies"}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="relative overflow-hidden">
                <div className="bg-linear-to-b from-[#D9D9D9] to-transparant max-h-[300px] overflow-y-auto custom-scrollbar rounded-xl scrollbar-hide">
                  <img 
                    src={section2.image.url} 
                    alt="Privacy Policy" 
                    className="w-full h-auto object-contain block rounded-lg"
                  />
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}
      </main>

      <Footer customCTA={<SolutionFAQs />} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Company;
