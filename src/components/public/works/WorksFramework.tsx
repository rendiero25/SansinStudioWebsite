import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import Skeleton from "../../Skeleton";
import ScrollReveal from "../../ScrollReveal";
import { sanitizeHtml } from "../../../utils/sanitize";

interface FrameworkData {
  sideImageTitle?: string;
  sideImage?: { url: string; publicId: string };
}

const renderStyledText = (text: string) => {
  if (!text) return null;

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span className="quill-content-title" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
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
    <section className="w-full bg-white mt-15 lg:mt-30 pb-0">
      <div className="container mx-auto px-6 md:px-12 xl:px-20">
        {/* Framework Header */}
        <ScrollReveal>
          <div className="inline-flex items-center px-3 py-1 bg-[#EBEBEB] text-black text-[12px] font-bold uppercase rounded-md mb-6 font-primary">
            {renderStyledText(data.sideImageTitle || "")}
          </div>
        </ScrollReveal>

        {/* Framework Image Container - Using Section 4 System */}
        <ScrollReveal delay={0.1} className="relative w-full bg-[#d9d9d9] scrollbar-hide rounded-xl overflow-y-auto overflow-x-auto lg:mb-9 cursor-grab active:cursor-grabbing h-[300px] md:h-[450px]">
          <div className="w-fit lg:w-full flex flex-col items-center px-4 lg:px-8 pt-4 lg:pt-16 min-w-full">
            {!loaded ? (
              <Skeleton className="w-full h-80" dark />
            ) : data.sideImage?.url ? (
              <img 
                src={data.sideImage.url} 
                alt="Our Framework" 
                className="w-auto h-auto lg:w-full block min-h-[300px] lg:min-h-[700px] object-contain max-w-none lg:max-w-full"
              />
            ) : (
              <div className="text-black/20 text-sm font-primary flex items-center justify-center p-8">
                Image not found
              </div>
            )}
          </div>
          {/* Scroll Indicator Gradient */}
          <div className="sticky bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#d9d9d9] to-transparent pointer-events-none opacity-50" />
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
