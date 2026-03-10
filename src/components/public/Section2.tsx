import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";

interface Section2Data {
  title?: string;
  description?: string;
  items?: Array<{
    id: string;
    title: string;
  }>;
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

const Section2 = () => {
  const [data, setData] = useState<Section2Data>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section2");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section2:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) return null;

  return (
    <section className="relative w-full bg-white py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-10 md:px-12 xl:px-20">
        {/* Title */}
        <h2 className="font-primary text-[23px] md:text-[42px] font-light text-black leading-[1.15] tracking-[-0.03em] m-0 w-full lg:max-w-[600px]">
          {renderStyledText(data.title || "")}
        </h2>

        {/* Description label + Feature items */}
        <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-20 -mx-5 px-5 md:mx-0 md:px-0">
          {/* Small label on the left */}
          {data.description && (
            <div className="flex items-center pt-0 md:pt-3 shrink-0">
              <p className="text-[12px] md:text-[13px] font-semibold text-black/60 md:text-black uppercase m-0 md:max-w-[70px] font-primary tracking-wider">
                {data.description}
              </p>
            </div>
          )}

          {/* Feature item cards - horizontal row */}
          {data.items && data.items.length > 0 && (
            <div className="flex-1 w-full flex gap-4 md:gap-5 overflow-x-auto pb-8 md:p-3 scrollbar-hide snap-x">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  className="snap-start min-w-[200px] md:min-w-[180px] flex-1 bg-white shadow-md border-2 border-black/5 rounded-[20px] px-8 md:px-8 py-20 md:py-12 flex items-center justify-center text-center text-[18px] md:text-[17px] font-bold text-black font-primary leading-[1.4] hover:bg-[#eaeaea] transition-all duration-300 overflow-hidden"
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section2;
