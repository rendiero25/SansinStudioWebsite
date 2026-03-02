import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";

interface SubItem {
  id: string;
  icon?: { url: string; publicId: string };
  description?: string;
}

interface SolutionItem {
  id: string;
  icon?: { url: string; publicId: string };
  title?: string;
  subItems?: SubItem[];
}

interface Section5Data {
  title?: string;
  label?: { text: string; link: string };
  solutions?: SolutionItem[];
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

const Section5 = () => {
  const [data, setData] = useState<Section5Data>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section5");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section5:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) return null;

  const labelBtn = data.label || { text: "Solutions", link: "#" };

  return (
    <section className="relative w-full bg-white py-20 md:py-28 overflow-hidden">
      {/* Subtle purple glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7c3aed]/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 container mx-auto px-5 md:px-12">
        <div className="flex flex-col justify-between md:flex-row gap-10 md:gap-10">
          {/* Left: Title + Label */}
          <div className="md:max-w-[450px] shrink-0">
            <h2 className="font-primary text-[28px] md:text-[42px] font-normal text-black leading-[1.15] tracking-[-0.03em] m-0 mb-12">
              {renderStyledText(
                data.title || "Yes, we can make it happen for you, the _future leading company_"
              )}
            </h2>
            <a
              href={labelBtn.link}
              className="inline-flex items-center justify-center px-8 py-2.5 bg-transparent text-black font-primary text-[17px] font-bold border border-black/20 rounded-lg hover:bg-black hover:text-white transition-all duration-300 tracking-[0.01em]"
            >
              {labelBtn.text}
            </a>
          </div>

          {/* Right: Solution Cards */}
          {data.solutions && data.solutions.length > 0 && (
            <div className="flex-1 flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
              {data.solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="snap-start min-w-[280px] w-[300px] flex-shrink-0 bg-white border border-[#E5E5E5] rounded-xl p-7 flex flex-col justify-between min-h-[420px]"
                >
                  <div className="h-full flex flex-col justify-between items-start">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-8">
                      {solution.icon?.url && (
                        <img
                          src={solution.icon.url}
                          alt=""
                          className="w-6 h-6 object-contain opacity-70"
                        />
                      )}
                      <span className="font-['Outfit'] text-[24px] font-medium text-black">
                        {solution.title}
                      </span>
                    </div>

                    {/* Sub Items */}
                    {solution.subItems && solution.subItems.length > 0 && (
                      <div className="flex flex-col gap-3 w-full">
                        {solution.subItems.map((sub) => (
                          <div
                            key={sub.id}
                            className="w-full flex items-center gap-3 bg-[#EEEEEE] rounded-md px-4 py-2.5"
                          >
                            {sub.icon?.url ? (
                              <img
                                src={sub.icon.url}
                                alt=""
                                className="w-4 h-4 object-contain shrink-0 opacity-60"
                              />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-black/20 shrink-0" />
                            )}
                            <span className="font-primary text-[17px] font-medium text-black/70 leading-tight">
                              {sub.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Arrow button at bottom */}
                    <div className="mt-8 pt-4">
                      <button className="w-8 h-8 flex items-center justify-center bg-[#4D4D4D] text-white rounded-full text-[15px] font-bold hover:bg-[#1A1A1A] transition-colors duration-200">
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section5;
