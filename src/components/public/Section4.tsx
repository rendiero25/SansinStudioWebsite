import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface Section4Data {
  title?: string;
  description?: string;
  bgImage?: { url: string; publicId: string };
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section4");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section4:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative w-full overflow-hidden h-[500px] flex items-center">
      {/* Background: dark top fading to purple bottom */}
      <div className="absolute inset-0 z-0" />

      {/* Optional BG image */}
      {data.bgImage?.url && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.bgImage.url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12">
          {/* Title */}
          {!loaded ? (
            <div className="w-[80%] md:w-[60%] space-y-3">
              <Skeleton dark className="w-full h-[30px] md:h-[45px]" />
              <Skeleton dark className="w-[80%] h-[30px] md:h-[45px]" />
            </div>
          ) : (
            <ScrollReveal className="w-[80%] md:w-[60%]">
              <h2 className="font-primary text-[23px] md:text-[35px] font-light text-white leading-[1.15] tracking-[-0.02em] m-0">
                {renderStyledText(
                  data.title ||
                    "Got _similar problems_? we'll help you to _fix it._",
                )}
              </h2>
            </ScrollReveal>
          )}

          {/* Description text on the right */}
          {!loaded ? (
            <div className="w-full max-w-[330px] space-y-2 mt-4 md:mt-0">
              <Skeleton dark className="w-[90%] h-[16px]" />
              <Skeleton dark className="w-full h-[16px]" />
              <Skeleton dark className="w-[70%] h-[16px]" />
            </div>
          ) : (
            data.description && (
              <ScrollReveal delay={0.2} direction="right" className="w-full max-w-[330px] mt-4 md:mt-0">
                <p className="font-primary text-[14px] text-white leading-[1.7] m-0 max-w-[330px]">
                  {data.description}
                </p>
              </ScrollReveal>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Section4;
