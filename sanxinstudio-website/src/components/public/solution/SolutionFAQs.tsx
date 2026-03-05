import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import type { ListItem } from "../../cms/ItemListEditor";
import { Link } from "react-router-dom";

interface FaqData {
  title?: string;
  faqs?: ListItem[];
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: { url: string };
}

interface FooterData {
  backgroundImage?: { url: string };
  email?: string;
  logo?: { url: string };
  socialTitle?: string;
  socialLinks?: SocialLink[];
  copyright?: string;
}

const SolutionFAQs = () => {
  const [data, setData] = useState<FaqData>({});
  const [footerData, setFooterData] = useState<FooterData>({});
  const [loaded, setLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqSection, footerSection] = await Promise.all([
          getSection("faq", "content"),
          getSection("home", "footer"),
        ]);
        setData(faqSection.content || {});
        setFooterData(footerSection.content || {});
      } catch (err) {
        console.error("Failed to load FAQs or Footer:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) return null;
  const faqs = data.faqs || [];
  if (faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const email = footerData.email || "reach_us@sanxin.com";

  return (
    <footer
      className="w-full relative overflow-hidden bg-black"
      style={
        footerData.backgroundImage?.url
          ? {
              backgroundImage: `url(${footerData.backgroundImage.url})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Fallback gradient if no image */}
      {!footerData.backgroundImage?.url && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      )}

      <div className="container relative mx-auto px-6 md:px-12 xl:px-20 max-w-[1440px] z-10">
        {/* FAQ Container Box (Acting as CTA in Footer) */}
        <div className="w-full flex flex-col bg-white rounded-[24px] border border-black/10 overflow-hidden shadow-xl mb-24 md:mb-32 mt-[-60px] relative z-20">
          {/* FAQ Header & Intro */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8 p-8 md:p-12 pb-8 border-b border-black/10">
            <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0 shrink-0">
              {data.title || "FAQs"}
            </h2>
            <p className="font-primary text-[14px] md:text-[15px] text-black/60 m-0 max-w-[500px] leading-[1.6]">
              Think of the Foundation as the "Source Code" of your brand. If the
              source code is messy, the output will always be buggy.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="flex flex-col w-full px-8 md:px-12 pb-12">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-col border-b border-black/10 last:border-0"
                >
                  <button
                    className="w-full text-left py-4 md:py-5 bg-transparent border-none cursor-pointer flex items-center gap-4 focus:outline-none hover:opacity-80 transition-opacity"
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="w-6 h-6 rounded-full bg-black/3 flex items-center justify-center shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-black/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <span
                      className={`font-primary text-[16px] md:text-[18px] tracking-tight text-black transition-all ${isOpen ? "font-bold" : "font-medium"}`}
                    >
                      {String(faq.question)}
                    </span>
                  </button>

                  <div
                    className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-10 pr-4">
                      <p className="font-primary text-[15px] leading-[1.6] text-black/60 m-0">
                        {String(faq.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Links & Contact */}
        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-16 lg:gap-8 border-b border-white/10 pb-24 md:pb-32">
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
              <Link
                to="/works"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Works
              </Link>
              <Link
                to="/solutions"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Services
              </Link>
            </div>
            <div className="flex flex-col gap-5">
              <Link
                to="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Payments
              </Link>
              <Link
                to="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Company
              </Link>
            </div>
            <div className="flex flex-col gap-5 sm:flex">
              <Link
                to="#"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                Insights
              </Link>
              <Link
                to="/solutions"
                className="font-primary text-[18px] md:text-[20px] text-white/60 hover:text-white transition-colors"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: Logo, Socials */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12 py-16">
          <div className="w-full md:w-auto h-auto max-w-[300px] shrink-0">
            {/* Logo using text or image */}
            {footerData.logo?.url ? (
              <img
                src={footerData.logo.url}
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
            <p className="font-primary text-[14px] text-white/80 m-0 max-w-[150px] leading-[1.3]">
              Visit us on other
              <br />
              platforms
            </p>
            <div className="flex flex-wrap items-center gap-6 2xl:gap-4 w-[70%]">
              {/* Fallback mock icons if no social links in CMS */}
              {(footerData.socialLinks || Array(5).fill(null)).map(
                (item, i) => (
                  <a
                    key={item?.id || i}
                    href={item?.url || "#"}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
                  >
                    {item?.icon?.url ? (
                      <img
                        src={item.icon.url}
                        alt={item.platform}
                        className="w-4 h-4 object-contain brightness-0 invert"
                      />
                    ) : (
                      <span className="text-white text-[10px] uppercase font-bold">
                        {["IG", "X", "FB", "TK", "IN", "YT"][i] || "Scl"}
                      </span>
                    )}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full pt-8 pb-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-primary text-[12px] md:text-[14px] text-white/40 m-0">
            {footerData.copyright ||
              "Copyright Sanxin 2026. All rights reserved."}
          </p>
          <div className="font-primary text-[12px] md:text-[14px] text-white/40">
            Jakarta, ID
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SolutionFAQs;
