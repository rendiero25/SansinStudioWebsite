import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal";

interface Section4Data {
  title?: string;
  description?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  sideImage?: { url: string; publicId: string };
  sideImageTitle?: string;
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

const Section4 = () => {
  const [data, setData] = useState<Section4Data>({});
  const [frameworkImg, setFrameworkImg] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeS4 = await getSection("home", "section4");
        
        setData(homeS4.content || {});
        if (homeS4.content?.sideImage?.url) {
          setFrameworkImg(homeS4.content.sideImage.url);
        }
      } catch (err) {
        console.error("Failed to load Section 4 data:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative w-full pt-15 xl:pt-30 mb-30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 xl:px-20 flex flex-col items-center">
        
        {/* Title Section */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-primary text-[26px] lg:text-[42px] font-normal uppercase text-black leading-[1.1] tracking-[-0.02em] m-0">
            {loaded ? renderStyledText(data.title || "") : <Skeleton className="w-[80%] h-12 mx-auto" />}
          </h2>
        </ScrollReveal>

        {/* Black Framework Card */}
        <ScrollReveal delay={0.1} className="relative w-full bg-[#111] rounded-xl overflow-hidden flex flex-col p-4 md:p-10 shadow-2xl">
          
          {data.sideImageTitle && (
            <div className="inline-flex w-fit items-center px-3 py-1 bg-[#EBEBEB] text-black text-[12px] font-bold uppercase rounded-md mb-6 font-primary">
              {renderStyledText(data.sideImageTitle)}
            </div>
          )}

          {/* Vertical & Horizontal Scroll Area for Image */}
          <div className="relative w-full h-[300px] md:h-[450px] bg-[#d9d9d9] scrollbar-hide rounded-xl overflow-y-auto overflow-x-auto mb-5 lg:mb-9 cursor-grab active:cursor-grabbing">
            <div className="w-fit lg:w-full flex flex-col items-center px-4 lg:px-8 pt-4 lg:pt-16 min-w-full">
              {!loaded ? (
                <Skeleton className="w-full h-80" dark />
              ) : frameworkImg ? (
                <img 
                  src={frameworkImg} 
                  alt="Our Framework" 
                  className="w-auto h-auto lg:w-full block min-h-[300px] lg:min-h-[700px] object-contain max-w-none lg:max-w-full"
                />
              ) : (
                <div className="text-black/20 text-sm font-primary flex items-center justify-center p-8">
                  Image not found in Works Section 1
                </div>
              )}
            </div>
            {/* Scroll Indicator Gradient */}
            <div className="sticky bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#d9d9d9] to-transparent pointer-events-none opacity-50" />
          </div>

          {/* Description Text */}
          <div className="flex flex-col items-start gap-4">
            {!loaded ? (
              <div className="w-full space-y-3">
                <Skeleton dark className="w-full h-4" />
                <Skeleton dark className="w-[80%] h-4" />
              </div>
            ) : (
              <div className="font-primary text-white text-[13px] sm:text-[20px] md:text-[23px] leading-normal lg:leading-tight max-w-4xl wrap-break-word description-quill-content">
                {renderStyledText(data.description || "")}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Action Buttons */}
        <ScrollReveal delay={0.2} direction="up" className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {!loaded ? (
            <>
              <Skeleton className="w-32 h-14 rounded-xl" />
              <Skeleton className="w-32 h-14 rounded-xl" />
            </>
          ) : (
            <>
              {data.button1Text && (
                <Link 
                  to={data.button1Link || "/works"}
                  className="px-6 py-2 bg-[#111] text-white font-primary font-bold text-[15px] rounded-xl hover:bg-black transition-all hover:scale-[1.02]"
                >
                  {data.button1Text}
                </Link>
              )}
              {data.button2Text && (
                <Link 
                  to={data.button2Link || "/projects"}
                  className="px-6 py-2 bg-white border border-[#111]/10 text-[#111] font-primary font-bold text-[15px] rounded-xl hover:bg-gray-50 transition-all hover:scale-[1.02] shadow-sm"
                >
                  {data.button2Text}
                </Link>
              )}
            </>
          )}
        </ScrollReveal>

      </div>

      <style>{`
        .description-quill-content p {
          margin: 0;
        }
        .description-quill-content span {
          display: inline;
        }
        .side-image-title-quill p {
          margin: 0;
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

export default Section4;
