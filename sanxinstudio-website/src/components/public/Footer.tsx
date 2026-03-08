import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: { url: string };
}

interface FooterData {
  backgroundImage?: { url: string };
  ctaImage?: { url: string; publicId: string };
  ctaHeading?: string;
  ctaButton?: { text: string; link: string };
  ctaNote?: string;
  contactTitle?: string;
  email?: string;
  logo?: { url: string };
  socialTitle?: string;
  socialLinks?: SocialLink[];
  copyright?: string;
}

const renderStyledText = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // We want to support _italic purple underline_ and *bold italic white*
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
        // Purple underlined italics
        return (
          <span
            key={i}
            className="italic underline underline-offset-4 decoration-[1px] text-[#5D2E8C]"
          >
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

const Footer = ({
  hideCta = false,
  backgroundImageOverride,
}: {
  hideCta?: boolean;
  backgroundImageOverride?: string;
}) => {
  const [data, setData] = useState<FooterData>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "footer");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load footer:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) return null;

  const bgImage =
    backgroundImageOverride ||
    data.backgroundImage?.url ||
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80";
  const ctaHeading =
    data.ctaHeading ||
    "Lets create your _profitable plan_\nthrough our _discovery meet_ session.";
  const ctaBtn = data.ctaButton || {
    text: "Set a discovery meet",
    link: "/contact",
  };
  const ctaNote =
    data.ctaNote || "*Please pay attention to our\nschedule availability";
  const email = data.email || "reach_us@sanxin.com";

  // Render smaller note text with breaks
  const renderNoteText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <footer
      className="w-full relative overflow-hidden pt-5 xl:pt-20 bg-[#0A0A0A]"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fallback gradient if no image */}
      {!bgImage && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      )}

      <div className="container relative mx-auto px-10 md:px-12 xl:px-20 z-10">
        {/* Top: CTA Card */}
        {!hideCta && (
          <div className="w-full flex flex-col rounded-3xl overflow-hidden drop-shadow-2xl mb-24 md:mb-32">
            {/* Card Top: Image */}
            <div className="w-full h-[250px] md:h-[400px] relative">
              <img
                src={data.ctaImage?.url || bgImage}
                alt="Discovery Session"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Bottom: Text & Button */}
            <div className="w-full bg-[#E5D7FA] p-8 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <h2 className="font-primary text-[28px] md:text-[42px] font-normal text-black leading-[1.1] tracking-[-0.02em] m-0 max-w-[700px]">
                {renderStyledText(ctaHeading)}
              </h2>

              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                <p className="font-primary text-[12px] md:text-[14px] max-w-[180px] text-black italic text-left md:text-right m-0">
                  {renderNoteText(ctaNote)}
                </p>
                <a
                  href={ctaBtn.link}
                  className="inline-block bg-white text-black font-primary font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-black hover:text-white transition-colors duration-300"
                >
                  {ctaBtn.text}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Middle: Links & Contact */}
        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-16 lg:gap-8 pb-24 md:pb-32">
          {/* Left: Want to discover... */}
          <div className="flex flex-col gap-4">
            <p className="font-primary text-[15px] md:text-[16px] text-white/80 m-0 leading-[1.3] max-w-[200px]">
              Want to discover more
              <br />
              with us? please do
            </p>
            <a
              href={`mailto:${email}`}
              className="font-primary text-[32px] md:text-[46px] font-medium text-white/80 hover:text-white transition-colors m-0 tracking-[-0.02em]"
            >
              {email}
            </a>
          </div>

          {/* Right: Nav Links */}
          <div className="flex grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24 lg:gap-32">
            <div className="flex flex-col gap-5">
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Works
              </a>
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Services
              </a>
            </div>
            <div className="flex flex-col gap-5">
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Payments
              </a>
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Company
              </a>
            </div>
            <div className="flex flex-col gap-5 sm:flex">
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Insights
              </a>
              <a
                href="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                FAQs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom: Logo, Socials */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12 py-16">
          <div className="w-full md:w-auto h-auto max-w-[300px] shrink-0">
            {/* Logo using text or image */}
            {data.logo?.url ? (
              <img
                src={data.logo.url}
                alt="Sanxin Studio"
                className="h-[60px] md:h-[80px] w-auto object-contain brightness-0 invert"
              />
            ) : (
              <h1 className="font-primary text-[60px] md:text-[100px] font-bold text-white tracking-[-0.04em] m-0 leading-none">
                sanxin
              </h1>
            )}
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-8 md:gap-16">
            <p className="font-primary text-[14px] text-white m-0 w-[200px] leading-[1.3]">
              Visit us on other
              <br />
              platforms
            </p>
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-6 2xl:gap-4 w-[70%]">
              {/* Fallback mock icons if no social links in CMS */}
              {(data.socialLinks || Array(5).fill(null)).map((item, i) => (
                <a
                  key={item?.id || i}
                  href={item?.url || "#"}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  {item?.icon?.url ? (
                    <img
                      src={item.icon.url}
                      alt={item.platform}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white/50"></div> // Placeholder circle
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Very Bottom Strip */}
      <div className="w-full bg-white py-6 mt-8">
        <div className="container mx-auto px-5 md:px-12 xl:px-32 2xl:px-0 max-w-[1440px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-primary text-[11px] font-bold text-black m-0">
            {data.copyright || "Copyright Sanxin 2026. All rights reserved."}
          </p>
          <p className="font-primary text-[11px] font-bold text-black m-0">
            Jakarta, ID
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
