import { useState, useEffect } from "react";
import Header from "../components/public/Header";
import SolutionFAQs from "../components/public/solution/SolutionFAQs";
import { getSection } from "../services/sectionApi";
import Accordion from "../components/public/company/Accordion";
import PannableImage from "../components/public/company/PannableImage";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";

interface Section1Data {
  title?: string;
  description1?: string;
  description2?: string;
  vision?: string;
  mission?: string;
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
  description?: string;
  image?: { url: string };
  imagePanPosition?: number;
}

const Company = () => {
  const [section1, setSection1] = useState<Section1Data | null>(null);
  const [section2, setSection2] = useState<Section2Data | null>(null);
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
        const [s1, s2] = await Promise.all([
          getSection("company", "section1"),
          getSection("company", "section2"),
        ]);
        setSection1(s1.content || {});
        setSection2(s2.content || {});
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
      <div className="company-page bg-white min-h-screen font-primary">
        <Header />
        <main className="pt-32 pb-20 overflow-x-hidden">
          <div className="container mx-auto px-6 md:px-12 xl:px-20 overflow-visible">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24 md:mb-32">
              <div className="flex flex-col gap-8">
                <Skeleton className="w-[80%] h-[40px] md:h-[50px]" />
                <div className="space-y-3 w-full max-w-xl">
                   <Skeleton className="w-full h-[20px]" />
                   <Skeleton className="w-full h-[20px]" />
                   <Skeleton className="w-[80%] h-[20px]" />
                </div>
              </div>
              <div className="flex flex-col gap-4 max-md:w-full">
                <Skeleton className="w-full h-[60px] rounded-xl" />
                <Skeleton className="w-full h-[60px] rounded-xl" />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32 md:mb-48">
               <div className="lg:col-span-5 flex flex-col justify-between gap-10 lg:h-[800px]">
                 <div className="space-y-3 w-full max-w-2xl">
                    <Skeleton className="w-full h-[20px]" />
                    <Skeleton className="w-full h-[20px]" />
                    <Skeleton className="w-[85%] h-[20px]" />
                 </div>
                 <div className="flex flex-col gap-4 max-md:w-full">
                    <Skeleton className="w-full h-[60px] rounded-xl" />
                    <Skeleton className="w-full h-[60px] rounded-xl" />
                    <Skeleton className="w-full h-[60px] rounded-xl" />
                 </div>
               </div>
               <div className="lg:col-span-7 relative h-[400px] lg:h-[800px]">
                 <Skeleton className="w-full h-full rounded-xl" />
               </div>
            </div>
          </div>
          {/* Row 3 - Section 2 */}
          <div className="bg-[#d9d9d9]/20">
            <div className="container mx-auto px-6 md:px-12 xl:px-20 pt-15 flex flex-col lg:flex-row gap-10 md:gap-16">
               <div className="flex flex-col items-start gap-8 lg:gap-20 w-full lg:w-1/2 shrink-0">
                 <Skeleton className="w-[80%] h-[40px] md:h-[50px] mt-15 xl:mt-0" />
                 <div className="space-y-3 w-full max-w-6xl">
                    <Skeleton className="w-full h-[20px]" />
                    <Skeleton className="w-full h-[20px]" />
                    <Skeleton className="w-[70%] h-[20px]" />
                 </div>
               </div>
               <div className="w-full h-[400px] md:h-[700px]">
                 <Skeleton className="w-full h-full rounded-xl" />
               </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="company-page bg-white min-h-screen font-primary">
      <Header />

      <main className="pt-32 pb-20 overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 overflow-visible">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24 md:mb-32">
            <ScrollReveal delay={0.1} className="flex flex-col gap-8">
              <h1 className="text-[32px] lg:text-[40px] leading-[1.1] font-normal tracking-[-0.03em] max-w-xl">
                {section1?.title || "Default Title"}
              </h1>
              <p className="text-[17px] md:text-[20px] font-normal leading-relaxed text-black max-w-xl">
                {section1?.description1}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} direction="right" className="flex flex-col gap-4 max-md:w-full">
              <div className="cursor-pointer">
                <Accordion
                  title="Vision"
                  isOpen={openSection1Accordion === "Vision"}
                  onToggle={() =>
                    setOpenSection1Accordion(
                      openSection1Accordion === "Vision" ? null : "Vision",
                    )
                  }
                >
                  {section1?.vision}
                </Accordion>
              </div>

              <div className="cursor-pointer">
                <Accordion
                  title="Mission"
                  isOpen={openSection1Accordion === "Mission"}
                  onToggle={() =>
                    setOpenSection1Accordion(
                      openSection1Accordion === "Mission" ? null : "Mission",
                    )
                  }
                >
                  {section1?.mission}
                </Accordion>
              </div>
            </ScrollReveal>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32 md:mb-48">
            <div className="lg:col-span-5 flex flex-col justify-between gap-10 lg:h-[800px]">
              <ScrollReveal delay={0.1}>
                <p className="text-[17px] md:text-[20px] leading-relaxed text-black max-w-2xl">
                  {section1?.description2}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3} className="flex flex-col gap-4 max-md:w-full">
                {section1?.items?.map((item) => (
                  <Accordion
                    key={item.id}
                    title={item.name}
                    icon={item.icon?.url}
                    isOpen={openSection2Accordion === item.id}
                    onToggle={() =>
                      setOpenSection2Accordion(
                        openSection2Accordion === item.id ? null : item.id,
                      )
                    }
                  >
                    <div className="flex flex-col gap-6 py-2">
                      {/* If categorized subItems exist, group them */}
                      {item.subItems &&
                      item.subItems.some((s) => s.category) ? (
                        <div className="flex flex-col gap-8">
                          {[
                            "Social media account",
                            "Creative work account",
                          ].map((cat) => {
                            const filtered = item.subItems?.filter(
                              (s) => s.category === cat,
                            );
                            if (!filtered || filtered.length === 0) return null;
                            return (
                              <div key={cat} className="flex flex-col gap-4">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-black/30">
                                  {cat}
                                </span>

                                <div className="flex flex-wrap gap-4">
                                  {filtered.map((sub) => (
                                    <div
                                      key={sub.id}
                                      className="flex items-center gap-3"
                                    >
                                      {sub.icon?.url && (
                                        <img
                                          src={sub.icon.url}
                                          alt=""
                                          className="w-5 h-5 object-contain"
                                        />
                                      )}
                                      {sub.link ? (
                                        <a
                                          href={sub.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-black hover:text-indigo-600 font-medium transition-colors"
                                        >
                                          {sub.name}
                                        </a>
                                      ) : (
                                        <span className="text-black font-medium">
                                          {sub.name}
                                        </span>
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
                            <div
                              key={sub.id}
                              className="flex items-center gap-4"
                            >
                              {sub.icon?.url && (
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <img
                                    src={sub.icon.url}
                                    alt=""
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <span className="text-black font-medium">
                                {sub.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Accordion>
                ))}
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2} direction="left" className="lg:col-span-7 relative h-[400px] lg:h-[800px]">
              <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:right-[-15vw] rounded-xl overflow-hidden">
                {section1?.image?.url ? (
                  <img
                    src={section1.image.url}
                    alt="Company"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EEEEEE]" />
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Row 3 - Section 2 */}
        <div className="bg-linear-to-b from-[#d9d9d9]/50 to-transparent">
          <div className="container mx-auto px-6 md:px-12 xl:px-20 pt-15 flex flex-col lg:flex-row gap-10 md:gap-16 ">
            <ScrollReveal className="flex flex-col items-start gap-8 lg:gap-20">
              <h2 className="text-[32px] mt-15 xl:mt-0 md:text-[42px] font-normal tracking-tight m-0 leading-tight">
                {section2?.title}
              </h2>

              <p className="text-[15px] md:text-[21px] leading-relaxed text-black max-w-6xl m-0">
                {section2?.description}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" className="rounded-xl overflow-hidden bg-[#EEEEEE] h-[400px] md:h-[700px] w-full">
              {section2?.image?.url ? (
                <PannableImage
                  src={section2.image.url}
                  panPosition={section2.imagePanPosition}
                  className="h-full"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </ScrollReveal>
          </div>
        </div>
      </main>

      <SolutionFAQs />
    </div>
  );
};

export default Company;
