import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";

interface HeroData {
  brandName?: string;
  headline?: string;
  subtitle?: string;
  bgType?: "image" | "video";
  bgImage?: { url: string; publicId: string };
  bgVideo?: { url: string; publicId: string };
  ctaButton?: { text: string; link: string };
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

    // First try: *word* → italic, _word_ → italic + underline (markdown-style)
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
    link: "#services",
  };

  return (
    <section
      className={`relative w-full h-screen min-h-[600px] max-md:min-h-[85vh] flex items-end overflow-hidden bg-[#0a0a0a] transition-opacity duration-700 ease-in-out ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {useBgVideo ? (
          <video
            className="w-full h-full object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
            src={bgVideoUrl}
          />
        ) : bgUrl ? (
          <img
            className="w-full h-full object-cover object-top"
            src={bgUrl}
            alt=""
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/15 via-[#0a0a0a]/5 via-30% to-[#0a0a0a]/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-5 md:px-[48px] pb-[40px] md:pb-[72px]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-7 md:gap-12">
          {/* Left: headline area */}
          <div className="md:max-w-[680px] 2xl:max-w-[900px] shrink-0">
            <p className="font-['Outfit'] text-[32px] md:text-[54px] 2xl:text-[95px] font-light text-white leading-[1.1] tracking-[-0.03em] m-0">
              {data.brandName && (
                <span className="font-['Outfit'] text-[16px] md:text-[20px] 2xl:text-[30px] font-semibold text-white tracking-[0.06em] lowercase align-middle mr-1.5">
                  {data.brandName}
                </span>
              )}{" "}
              {renderHeadline(
                data.headline ||
                  "A branding agency with *one objective*: To make you _profitable._",
              )}
            </p>
          </div>

          {/* Right: subtitle + CTA */}
          <div className="flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-6 md:pb-2 shrink-0 w-full md:w-auto md:max-w-[240px]">
            {data.subtitle && (
              <p className="flex-1 md:flex-none font-primary text-[14px] font-normal text-[#FEFEFE] leading-[1.65] m-0 tracking-[0.01em]">
                {data.subtitle}
              </p>
            )}
            <a
              href={ctaButton.link}
              className="inline-flex items-center justify-center min-w-[130px] md:min-w-[250px] px-6 md:px-8 py-3 md:py-[14px] bg-white hover:bg-white text-black rounded-xl hover:text-[#0a0a0a] font-primary text-[12px] md:text-[17px] font-bold border border-white/25 hover:border-white transition-all duration-300 tracking-[0.02em]"
            >
              {ctaButton.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
