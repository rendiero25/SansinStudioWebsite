import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface RoadblockCard {
  id: string;
  category?: string;
  title?: string;
  description?: string;
  image?: { url: string; publicId: string };
}

interface Section3Data {
  title?: string;
  bgImage?: { url: string; publicId: string };
  cards?: RoadblockCard[];
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

const Section3 = () => {
  const [data, setData] = useState<Section3Data>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section3");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section3:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative w-full bg-[#0D0D0D] pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background image overlay */}
      {data.bgImage?.url && (
        <div className="absolute top-0 inset-x-0 h-[800px] z-0 pointer-events-none">
          <img
            src={data.bgImage.url}
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0a0a0a]/40 to-[#0D0D0D]" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20">
        {/* Title */}
        {!loaded ? (
          <div className="max-w-[600px] mb-12 md:mb-16 space-y-3">
            <Skeleton dark className="w-[90%] h-[30px] md:h-[50px]" />
            <Skeleton dark className="w-[70%] h-[30px] md:h-[50px]" />
            <Skeleton dark className="w-[85%] h-[30px] md:h-[50px]" />
          </div>
        ) : (
          <ScrollReveal>
            <h2 className="font-primary text-[23px] md:text-[42px] font-light text-white leading-[1.15] tracking-[-0.03em] m-0 max-w-[600px] mb-12 md:mb-16">
              {renderStyledText(
                data.title ||
                  "Most companies might face these specific _roadblocks_ for years.",
              )}
            </h2>
          </ScrollReveal>
        )}

        {/* Roadblock Cards */}
        {!loaded ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-black/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col px-2 py-2 min-h-[400px]"
              >
                <div className="px-5 pt-5 mb-2">
                  <Skeleton dark className="w-[80px] h-[20px] rounded-md" />
                </div>
                <div className="px-5 pt-4">
                  <Skeleton dark className="w-full h-[200px] rounded-xl" />
                </div>
                <div className="p-5 pt-4 flex flex-col flex-1 mt-2 space-y-4">
                  <Skeleton dark className="w-[80%] h-[28px]" />
                  <div className="space-y-2 mt-4">
                    <Skeleton dark className="w-full h-[16px]" />
                    <Skeleton dark className="w-[90%] h-[16px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          data.cards && data.cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.cards.map((card, index) => (
                <ScrollReveal
                  key={card.id}
                  delay={0.2 + index * 0.1}
                  direction="up"
                  className="bg-black/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col px-2 py-2"
                >
                  {/* Category label */}
                  {card.category && (
                    <div className="px-5 pt-5 mb-2">
                      <span className="inline-block text-[10px] bg-white font-semibold uppercase text-black rounded-md px-3 py-1 font-primary">
                        {card.category}
                      </span>
                    </div>
                  )}

                  {/* Card image */}
                  {card.image?.url && (
                    <div className="px-5 pt-4">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        <img
                          src={card.image.url}
                          alt={card.title || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Card content */}
                  <div className="p-5 pt-4 flex flex-col flex-1">
                    {card.title && (
                      <h3 className="font-primary text-[18px] md:text-[28px] font-normal text-white m-0 mt-2 mb-7 leading-tight">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="font-primary text-[14px] text-white leading-[1.6] m-0">
                        {card.description}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Section3;
