import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";
import { sanitizeHtml } from "../../utils/sanitize";


interface HeroData {
  brandName?: string;
  brandLogo?: { url: string; publicId: string };
  headline?: string;
  subtitle?: string;
  bgType?: "image" | "video";
  bgImage?: { url: string; publicId: string };
  bgVideo?: { url: string; publicId: string };
  ctaButton?: { text: string; link: string };
  secondaryButton?: { text: string; link: string };
}

const HeroSection = () => {
  const [data, setData] = useState<HeroData>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "hero");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load hero:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const renderHeadline = (text: string) => {
    if (!text) return null;

    // If it looks like HTML (from Quill), render it directly
    if (text.includes("<") && text.includes(">")) {
      return <span className="quill-content-title" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
    }

    // Legacy parser for *word* and _word_
    if (text.includes("*") || text.includes("_")) {
      const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
      return parts.map((part, i) => {
        if (part.startsWith("_") && part.endsWith("_")) {
          return (
            <span key={i} className="hero-underline-italic">
              {part.slice(1, -1)}
            </span>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className="hero-italic">
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      });
    }

    // Fallback: auto-detect "one objective" → italic, "profitable." → italic+underline
    const styledWords: { match: string; className: string }[] = [
      { match: "one objective", className: "hero-italic" },
      { match: "profitable.", className: "hero-underline-italic" },
    ];

    // Build a regex from all styled words
    const escapedMatches = styledWords.map((w) =>
      w.match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`(${escapedMatches.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const styled = styledWords.find(
        (w) => w.match.toLowerCase() === part.toLowerCase(),
      );
      if (styled) {
        return (
          <span key={i} className={styled.className}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const bgUrl = data.bgImage?.url;
  const bgVideoUrl = data.bgVideo?.url;
  const useBgVideo = data.bgType === "video" && bgVideoUrl;
  const ctaButton = data.ctaButton || {
    text: "Get Started",
    link: "/solutions",
  };
  const secondaryButton = data.secondaryButton || {
    text: "Projects",
    link: "/projects",
  };

  return (
    <section className="relative w-full pt-[100px] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Top Content Box */}
      <div className="relative z-10 w-full container mx-auto px-5 md:px-10 xl:px-20 flex flex-col items-center">
        {/* Pills */}
        <ScrollReveal delay={0.1}>
          <div className="flex items-center justify-center gap-2 mb-8 mt-4">
            <span className="bg-blue-300 text-black text-[10px] md:text-[11px] uppercase font-bold px-3 py-1.5 rounded-full">
              4 PROJECTS ON PROGRESS
            </span>
            <span className="bg-black/80 text-white/50 text-[10px] md:text-[11px] uppercase font-bold px-3 py-1.5 rounded-full">
              AVAILABLE IN MAY
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.2} className="w-full relative z-10">
          <div className="text-center w-full mb-6">
            <p className="font-primary text-center text-[38px] sm:text-[50px] md:text-[60px] lg:text-[50px] xl:text-6xl uppercase font-normal text-black leading-[1.1]">
              {renderHeadline(
                data.headline || ""
              )}
            </p>
          </div>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal delay={0.3} className="w-full relative z-10">
          <div className="text-center w-full max-w-[600px] mx-auto mb-10">
            <div className="font-primary text-[18px] font-normal text-black leading-[1.6] [&_p]:m-0">
              <span
                className="quill-content-description"
                dangerouslySetInnerHTML={{
                  __html:
                    sanitizeHtml(data.subtitle || "")
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Buttons */}
        <ScrollReveal delay={0.4} className="w-full relative z-10">
          <div className="flex flex-row items-center justify-center gap-8 lg:gap-4 mb-16">
            <Link
              to={ctaButton.link}
              className="inline-flex items-center justify-center px-6 py-2 bg-[#8E33FF] hover:bg-black text-white rounded-xl font-primary text-[15px] font-semibold transition-all shadow-[0_4px_14px_0_rgba(142,51,255,0.39)] no-underline  sm:w-auto"
            >
              {ctaButton.text}
            </Link>
            <Link
              to={secondaryButton.link}
              className="inline-flex items-center justify-center px-6 py-2 bg-white border border-black/50 hover:bg-black text-black hover:text-white rounded-xl font-primary text-[15px] font-semibold transition-all no-underline sm:w-auto"
            >
              {secondaryButton.text}
            </Link>
          </div>
        </ScrollReveal>

        {/* Background Video/Image Block */}
        <div className="w-full relative z-10">
          <ScrollReveal delay={0.5} className="w-full">
            <div className="rounded-2xl overflow-hidden aspect-3/4 lg:aspect-video">
              {!loaded ? (
                <Skeleton dark className="w-full h-full" />
              ) : useBgVideo ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={bgVideoUrl}
                />
              ) : bgUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={bgUrl}
                  alt="Hero Background"
                  loading="eager"
                />
              ) : (
                ""
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
