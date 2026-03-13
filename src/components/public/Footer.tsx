import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

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

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const parts = text.split(/(_[^_]+_)/g);
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
    return <span key={i}>{part}</span>;
  });
};

const Footer = ({
  showCTA = true,
  customCTA,
  email: emailProp,
  showBackgroundImage = true,
  backgroundImageOverride,
}: {
  showCTA?: boolean;
  customCTA?: React.ReactNode;
  email?: string;
  showBackgroundImage?: boolean;
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

  const email = emailProp || data.email || "reach_us@sanxin.com";
  const ctaBtn = data.ctaButton || {
    text: "Set a discovery meet",
    link: "/contact",
  };

  return (
    <footer className="w-full font-primary bg-black">
      <div className="relative overflow-hidden w-full">
        {/* Background Image/Gradient Layer */}
        {showBackgroundImage && (backgroundImageOverride || data.backgroundImage?.url) ? (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={backgroundImageOverride || data.backgroundImage?.url}
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>
        ) : ("")}

        <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20 pt-0 xl:pt-20">
          
          {/* CTA */}
          {customCTA ? (
            <div className="mb-24">{customCTA}</div>
          ) : (
            showCTA && (
              <ScrollReveal direction="up" className="relative w-full bg-[#D3B4F6] rounded-xl overflow-hidden flex flex-col mb-24 shadow-2xl">
                {/* Top: Image Area */}
                {!loaded ? (
                  <Skeleton className="w-full h-[300px] md:h-[450px]" />
                ) : (
                  <div className="w-full h-[300px] md:h-[450px] relative">
                    <img
                      src={
                        data.ctaImage?.url ||
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                      }
                      alt="Discovery meeting"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Bottom: Text Area */}
                <div className="w-full p-8 flex flex-col xl:flex-row justify-between items-center gap-10">
                  {!loaded ? (
                    <div className="w-full max-w-[800px] space-y-3">
                      <Skeleton className="w-[90%] h-[30px] md:h-[50px]" />
                      <Skeleton className="w-[70%] h-[30px] md:h-[50px]" />
                    </div>
                  ) : (
                    <h2 className="text-[16px] sm:text-[30px] md:text-[38px] lg:text-[42px] font-light leading-[1.1] text-black m-0 max-w-[800px]">
                      {renderStyledText(
                        data.ctaHeading ||
                          "",
                      )}
                    </h2>
                  )}

                  <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
                    {!loaded ? (
                      <>
                        <Skeleton className="w-[150px] h-[16px]" />
                        <Skeleton className="w-[200px] h-[55px] rounded-xl" />
                      </>
                    ) : (
                      <>
                        {data.ctaNote && (
                          <p className="text-[12px] md:text-[13px] font-medium text-black/60 m-0 italic text-center lg:text-right max-w-[250px]">
                            {data.ctaNote}
                          </p>
                        )}
                        <Link
                          to={ctaBtn.link}
                          className="bg-white text-black px-10 py-4 rounded-xl font-bold text-[15px] md:text-[17px] no-underline shadow-sm hover:bg-black hover:text-white transition-all duration-300 whitespace-nowrap"
                        >
                          {ctaBtn.text}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )
          )}

          {/* 2. Reach Us Section */}
          <ScrollReveal delay={0.2} direction="up" className="flex flex-col lg:flex-row justify-between items-start xl:items-end gap-12 lg:gap-8 mb-32">
            {/* Left: Contact Info */}
            <div className="flex flex-col gap-6">
              <p className="text-[14px] md:text-[15px] font-medium text-white/80 m-0 leading-tight w-[180px]">
                {data.contactTitle ||
                  "Want to discover more with us? please do"}
              </p>
              <a
                href={`mailto:${email}`}
                className="text-[32px] md:text-[49px] font-normal text-white/40 hover:text-white transition-colors m-0 tracking-tight leading-none no-underline"
              >
                {email}
              </a>
            </div>

            {/* Right: Nav Links (3 Columns) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 xl:gap-24">
              <div className="flex flex-col gap-5">
                <Link
                  to="/works"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline"
                >
                  Works
                </Link>
                <Link
                  to="/solutions"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline"
                >
                  Solutions
                </Link>
              </div>
              <div className="flex flex-col gap-5">
                <Link
                  to="/payments"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline flex items-center gap-2"
                >
                  Payments
                </Link>
                <Link
                  to="/company"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline"
                >
                  Company
                </Link>
              </div>
              <div className="flex flex-col gap-5">
                <Link
                  to="/insights"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline"
                >
                  Insights
                </Link>
                <Link
                  to="/faqs"
                  className="text-[20px] md:text-[24px] text-white/40 hover:text-white transition-colors no-underline"
                >
                  FAQs
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* 3. Branding and Socials */}
          <ScrollReveal delay={0.4} direction="up" className="w-full flex flex-col md:flex-row justify-between items-start xl:items-end gap-12 mb-16">
            <div className="shrink-0 max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
              {data.logo?.url ? (
                <img
                  src={data.logo.url}
                  alt="Sanxin"
                  className="w-full h-auto object-contain select-none"
                />
              ) : (
                <h1 className="text-[80px] md:text-[150px] lg:text-[180px] font-normal text-white tracking-[-0.05em] m-0 leading-[0.7] select-none">
                  sanxin
                </h1>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14">
              <p className="text-[13px] md:text-[14px] font-medium text-white m-0 leading-tight">
                Visit us on other
                <br />
                platforms
              </p>

              <div className="flex flex-col gap-5">
                {data.socialLinks && data.socialLinks.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-4 max-w-[500px] justify-start md:justify-end">
                    {data.socialLinks.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                      >
                        {s.icon?.url ? (
                          <img
                            src={s.icon.url}
                            alt={s.platform}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-white text-[10px]">
                            {s.platform.slice(0, 2)}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Fallback Static Socials */}
                    <div className="flex items-center gap-4">
                      {[
                        {
                          platform: "Instagram",
                          icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
                        },
                        {
                          platform: "X",
                          icon: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_white.svg",
                        },
                        {
                          platform: "Threads",
                          icon: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Threads_logo.svg",
                        },
                        {
                          platform: "TikTok",
                          icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
                        },
                      ].map((s) => (
                        <a
                          key={s.platform}
                          href="#"
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all p-2.5"
                        >
                          <img
                            src={s.icon}
                            alt={s.platform}
                            className="w-full h-full object-contain invert brightness-200"
                          />
                        </a>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      {[
                        {
                          platform: "Behance",
                          icon: "https://cdn-icons-png.flaticon.com/512/1051/1051221.png",
                        },
                        {
                          platform: "Dribbble",
                          icon: "https://cdn-icons-png.flaticon.com/512/1051/1051225.png",
                        },
                        {
                          platform: "LinkedIn",
                          icon: "https://cdn-icons-png.flaticon.com/512/1051/1051233.png",
                        },
                      ].map((s) => (
                        <a
                          key={s.platform}
                          href="#"
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all p-2.5"
                        >
                          <img
                            src={s.icon}
                            alt={s.platform}
                            className="w-full h-full object-contain invert brightness-200"
                          />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 4. Bottom Strip (Outside the background wrapper) */}
      <div className="w-full bg-white py-5 relative z-20">
        <div className="container mx-auto px-10 md:px-12 xl:px-20 flex flex-row justify-between items-center text-black font-medium text-[12px] md:text-[14px]">
          <p className="m-0 ">
            {data.copyright || "Copyright Sanxin 2026. All rights reserved."}
          </p>
          <p className="m-0 ">Jakarta, ID</p>
        </div>
      </div>

      <style>{`
        footer a, footer button {
          cursor: pointer;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
