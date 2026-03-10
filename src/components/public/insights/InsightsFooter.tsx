import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../../services/sectionApi";

import { MoreInsightsSlider, SuccessModal } from "./InsightsComponents";
import type { InsightItem } from "../../cms/InsightsItemsEditor";

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

export const InsightsFooter = ({
  latestImage,
  items,
}: {
  latestImage?: string;
  items: InsightItem[];
}) => {
  const [footerData, setFooterData] = useState<FooterData>({});
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const footerSection = await getSection("home", "footer");
        setFooterData(footerSection.content || {});
      } catch (err) {
        console.error("Failed to load Footer data:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) return null;

  const email = footerData.email || "reach_us@sanxin.com";

  return (
    <footer
      id="insights-footer"
      className="w-full relative overflow-hidden bg-black xl:mt-32"
      style={
        footerData.backgroundImage?.url
          ? {
              backgroundImage: `url(${footerData.backgroundImage.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="container relative mx-auto px-6 md:px-12 xl:px-20 w-full z-10 xl:pt-16">
        {/* More Insights Slider */}
        <div className="mb-24 md:mb-32">
          <MoreInsightsSlider items={items} darkVariant={true} />
        </div>

        {/* Subscribe Section (Instead of FAQ) */}
        <div className="w-full bg-[#D8B8F4] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch mb-24 md:mb-32 shadow-2xl relative z-20">
          <div className="flex-1 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black leading-[1.2] tracking-tight mb-10 max-w-[500px]">
              Receive special insightful brand guidebook every month from us!
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email..."
                className="flex-1 px-6 py-4 bg-white/50 border border-black/10 rounded-xl outline-none placeholder:text-black/30 text-black text-[15px]"
              />

              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer px-8 py-4 bg-white hover:bg-black hover:text-white text-black font-bold text-[15px] rounded-xl transition-all shadow-sm"
              >
                Get free guidebook
              </button>
              
            </div>
          </div>
          <div className="w-full md:w-[35%] lg:w-[40%] h-[250px] md:h-auto shrink-0 relative">
            <img
              src={
                latestImage ||
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"
              }
              alt="Guidebook"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Middle: Links & Contact */}
        <div className="w-full flex flex-col xl:flex-row justify-between items-start gap-16 lg:gap-8 border-b border-white/10 pb-24 md:pb-32">
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
                to="/insights"
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
            <p className="font-primary text-[14px] text-white m-0 w-[200px] leading-[1.3]">
              Visit us on other
              <br />
              platforms
            </p>
            <div className="flex flex-wrap items-center xl:justify-end gap-6 2xl:gap-4 w-[70%]">
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
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/50"></div>
                    )}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-6 mt-8">
        <div className="container mx-auto px-5 md:px-12 xl:px-32 2xl:px-0 max-w-[1440px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-primary text-[11px] font-bold text-black m-0">
            {footerData.copyright ||
              "Copyright Sanxin 2026. All rights reserved."}
          </p>
          <p className="font-primary text-[11px] font-bold text-black m-0">
            Jakarta, ID
          </p>
        </div>
      </div>

      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </footer>
  );
};
