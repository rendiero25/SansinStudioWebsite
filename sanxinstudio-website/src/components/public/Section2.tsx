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
  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <span key={i} className="italic underline underline-offset-4 decoration-1">
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
      <div className="container mx-auto px-5 md:px-12">
        {/* Title */}
        <h2 className="font-primary text-[28px] md:text-[42px] font-normal text-black leading-[1.15] tracking-[-0.03em] m-0 max-w-[600px]">
          {renderStyledText(
            data.title || "Turn your technical _breakthrough_ into a _high-growth asset._"
          )}
        </h2>

        {/* Description label + Feature items */}
        <div className="mt-14 md:mt-20 flex items-center gap-20">
          {/* Small label on the left */}
          {data.description && (
            <div className="flex items-center pt-3 shrink-0">
              <p className="text-[12px] font-semibold text-black uppercase m-0 max-w-[50px] font-primary">
                {data.description}
              </p>
            </div>
          )}

          {/* Feature item cards - horizontal row */}
          {data.items && data.items.length > 0 && (
            <div className="flex-1 flex gap-5 overflow-x-auto p-5 scrollbar-hide">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[130px] flex-1 bg-white shadow-lg border-[1px] border-black/5 rounded-2xl px-10 py-12 flex items-center justify-center text-center text-[13px] md:text-[17px] font-bold text-[#0a0a0a] font-primary leading-[1.45] hover:bg-[#eaeaea] transition-colors duration-200"
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
