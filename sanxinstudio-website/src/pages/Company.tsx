import { useState, useEffect } from "react";
import Header from "../components/public/Header";
import SolutionFAQs from "../components/public/solution/SolutionFAQs";
import { getSection } from "../services/sectionApi";
import Accordion from "../components/public/company/Accordion";
import PannableImage from "../components/public/company/PannableImage";

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

  if (loading) return null;

  return (
    <div className="company-page bg-white min-h-screen font-primary">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 xl:px-20 overflow-visible">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start mb-24 md:mb-32">
            <div className="flex flex-col gap-8">
              <h1 className="text-[40px] md:text-[56px] lg:text-[68px] leading-[1.1] font-normal tracking-[-0.03em] max-w-xl">
                {section1?.title || "Default Title"}
              </h1>
              <p className="text-[17px] md:text-[20px] leading-relaxed text-black/60 max-w-lg">
                {section1?.description1}
              </p>
            </div>
            <div className="flex flex-col gap-4 max-md:w-full">
              <Accordion title="Vision">
                {section1?.vision}
              </Accordion>
              <Accordion title="Mission">
                {section1?.mission}
              </Accordion>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-32 md:mb-48">
            <div className="flex flex-col gap-10">
              <p className="text-[17px] md:text-[20px] leading-relaxed text-black/60 max-w-lg">
                {section1?.description2}
              </p>
              
              <div className="flex flex-col gap-4 max-md:w-full">
                {section1?.items?.map((item) => (
                  <Accordion 
                    key={item.id} 
                    title={item.name} 
                    icon={item.icon?.url}
                  >
                    <div className="flex flex-col gap-6 py-2">
                      {/* If categorized subItems exist, group them */}
                      {item.subItems && item.subItems.some(s => s.category) ? (
                        <div className="flex flex-col gap-8">
                          {["Social media account", "Creative work account"].map((cat) => {
                            const filtered = item.subItems?.filter(s => s.category === cat);
                            if (!filtered || filtered.length === 0) return null;
                            return (
                              <div key={cat} className="flex flex-col gap-4">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-black/30">
                                  {cat}
                                </span>
                                <div className="grid grid-cols-1 gap-4">
                                  {filtered.map(sub => (
                                    <div key={sub.id} className="flex items-center gap-3">
                                      {sub.icon?.url && (
                                        <img src={sub.icon.url} alt="" className="w-5 h-5 object-contain" />
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
                                <div className="w-5 h-5 flex items-center justify-center">
                                  <img src={sub.icon.url} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-black font-medium">{sub.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Accordion>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[600px]">
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
          </div>

          {/* Row 3 - Section 2 */}
          <div className="flex flex-col gap-10 md:gap-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-20">
              <h2 className="text-[32px] md:text-[42px] font-normal tracking-tight m-0 leading-tight">
                {section2?.title}
              </h2>
              <p className="text-[15px] md:text-[17px] leading-relaxed text-black/60 max-w-xl m-0">
                {section2?.description}
              </p>
            </div>
            
            <div className="rounded-[32px] overflow-hidden bg-[#EEEEEE] h-[400px] md:h-[650px] w-full">
              {section2?.image?.url ? (
                <PannableImage 
                  src={section2.image.url} 
                  panPosition={section2.imagePanPosition} 
                  className="h-full"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          </div>

        </div>
      </main>

      <SolutionFAQs />
    </div>
  );
};

export default Company;
