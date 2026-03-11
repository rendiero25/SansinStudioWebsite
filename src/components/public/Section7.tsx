import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface Section7Data {
  title?: string;
  description?: string;
}

const renderStyledText = (text: string) => {
  if (!text) return null;

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // We want to support _italic purple underline_ and *bold italic white*
    // The previous regex split on both, but because there are spaces inside `_ _`,
    // `[^*]+` and `[^_]+` work. Let's make sure it handles the arrows properly too.
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
        // Purple underlined italics (as seen in Section 7 design)
        return (
          <span
            key={i}
            className="italic underline underline-offset-4 decoration-1 text-[#b39add]"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        // Bold italics (as seen in Section 7 description)
        return (
          <span key={i} className="italic font-bold">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

    return (
      <span key={lineIndex}>
        {lineContent}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

const Section7 = () => {
  const [data, setData] = useState<Section7Data>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section7");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section7:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Fallback text matching the design if CMS is empty
  const title =
    data.title ||
    "Our real framework is _start → make you win → we also win._ You make profit, we also make our reputation.";
  const description =
    data.description ||
    "In a over-saturated market of agencies, they think about aesthetics. Best output? no, that's a bare minimum, *we focused our energy to your profitability & revenue streams.*";

  return (
    <section className="relative w-full bg-black py-32 md:py-48 text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-20">
          {/* Left: Main Statement (Title) */}
          <div className="md:w-3/5 lg:w-[50%] w-full">
            {!loaded ? (
              <div className="space-y-4">
                <Skeleton dark className="w-full h-[30px] md:h-[50px]" />
                <Skeleton dark className="w-[85%] h-[30px] md:h-[50px]" />
                <Skeleton dark className="w-[70%] h-[30px] md:h-[50px]" />
              </div>
            ) : (
              <ScrollReveal>
                <h2 className="font-primary text-[23px] md:text-[42px] font-light leading-tight tracking-[-0.01em] m-0 text-white/95">
                  {renderStyledText(title)}
                </h2>
              </ScrollReveal>
            )}
          </div>

          {/* Right: Smaller Descriptive Text */}
          <div className="md:w-2/5 lg:w-[32%] md:mt-4 w-full">
            {!loaded ? (
              <div className="space-y-2">
                <Skeleton dark className="w-full h-[16px]" />
                <Skeleton dark className="w-[95%] h-[16px]" />
                <Skeleton dark className="w-[80%] h-[16px]" />
              </div>
            ) : (
              <ScrollReveal delay={0.2} direction="right">
                <p className="font-['IBM_Plex_Sans',sans-serif] text-[15px] md:text-[16px] leading-[1.6] text-white/80 m-0">
                  {renderStyledText(description)}
                </p>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section7;
