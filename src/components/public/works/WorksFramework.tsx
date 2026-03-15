import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import Skeleton from "../../Skeleton";
import ScrollReveal from "../../ScrollReveal";

interface FrameworkData {
  sideImageTitle?: string;
  sideImage?: { url: string; publicId: string };
}

const renderStyledText = (text: string) => {
  if (!text) return null;
  if (text.includes("<") && text.includes(">")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return text;
};

const WorksFramework = () => {
  const [data, setData] = useState<FrameworkData>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSection("home", "section4");
        setData(res.content || {});
      } catch (err) {
        console.error("Failed to load framework data:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) {
    return (
      <section className="w-full bg-white py-20">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          <Skeleton className="w-[120px] h-[30px] rounded-md mb-6" />
          <Skeleton className="w-[60%] h-[40px] mb-12" />
          <Skeleton className="w-full h-[600px] rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white mt-30 pb-0">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        {/* Framework Header */}
        <ScrollReveal>
          <div className="inline-flex items-center px-3 py-1 bg-[#EBEBEB] text-black text-[12px] font-bold uppercase rounded-md mb-6 font-primary">
            {renderStyledText(data.sideImageTitle || "")}
          </div>
        </ScrollReveal>

        {/* Framework Image Container */}
        <ScrollReveal delay={0.2} className="relative w-full bg-[#EBEBEB] rounded-xl overflow-hidden border border-black/5 h-[270px] sm:h-[430px] md:h-[510px] shadow-sm">
          <div className="w-full h-full overflow-y-auto scrollbar-hide py-10 md:py-20 px-8 md:px-15">
            <div className="w-full flex justify-center">
              {data.sideImage?.url ? (
                <img 
                  src={data.sideImage.url} 
                  alt="Framework Process" 
                  className="w-full min-h-full object-cover object-contain"
                />
              ) : (
                <div className="py-20 text-black/20 italic">No framework image found...</div>
              )}
            </div>
          </div>
          
          {/* Scroll Indicator Gradient at top and bottom */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-[#EBEBEB] to-transparent pointer-events-none z-10 opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#EBEBEB] to-transparent pointer-events-none z-10 opacity-60" />
        </ScrollReveal>
      </div>

      <style>{`
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

export default WorksFramework;
