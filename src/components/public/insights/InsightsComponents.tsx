import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import type { InsightItem } from "../../cms/InsightsItemsEditor";
import type { InsightCategory } from "../../cms/InsightCategoriesEditor";
import ScrollReveal from "../../ScrollReveal";

// --- Category Filter ---
export const InsightCategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: InsightCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="flex items-center bg-white border border-black/3 rounded-xl py-3 px-3 md:px-4 gap-3 shadow-md relative overflow-hidden">
      {/* Decorative Purple Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[5px] md:w-[10px] bg-[#D3B4F6]" />

      {/* Label - Two Lines */}
      <div className="flex flex-col shrink-0 ml-2 md:ml-4 mr-2 md:mr-4">
        <span className="text-[7.5px] md:text-[10px] font-normal text-black leading-[1.1] uppercase tracking-widest">
          CATEGORY
        </span>
        <span className="text-[7.5px] md:text-[10px] font-normal text-black leading-[1.1] uppercase tracking-widest">
          FILTER
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-2 md:gap-3 overflow-x-auto hide-scrollbar flex-1"
      >
        <button
          onClick={() => onCategoryChange("")}
          className={`cursor-pointer px-5 md:px-8 py-2 md:py-2.5 rounded-[6px] text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap border-0 uppercase ${
            activeCategory === ""
              ? "bg-black text-white"
              : "bg-[#E0E0E0] text-black/80 hover:bg-[#D0D0D0]"
          }`}
        >
          ALL
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`cursor-pointer px-5 md:px-8 py-2 md:py-2.5 rounded-[6px] text-[10px] md:text-[14px] font-bold transition-all whitespace-nowrap border-0 uppercase ${
              activeCategory === cat.id
                ? "bg-black text-white"
                : "bg-[#E0E0E0] text-black/80 hover:bg-[#D9D9D9]"
            }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Newsletter Box ---
export const NewsletterBox = () => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  return (
    <div
      onClick={() => {
        setIsClicked(true);
        const footer = document.getElementById("insights-footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className={`p-6 rounded-xl flex gap-2 items-center justify-between group cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/10 mb-2 ${
        isClicked
          ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          : "bg-[#D8B8F4]"
      }`}
    >
      <span className="text-sm md:text-[21px] font-medium text-black leading-snug">
        Subscribe to our newsletter for interesting offers
      </span>

      <div className="w-10 h-7 rounded-full bg-white flex items-center justify-center transition-transform group-hover:bg-black group-hover:text-white">
        <svg
          width="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

// --- Main Insight Card ---
export const MainInsightCard = ({ item }: { item: InsightItem }) => {
  return (
    <ScrollReveal className="w-full mb-8">
      <Link
        to={`/insights/${item.id}`}
        className="group relative w-full aspect-16/10 rounded-xl overflow-hidden block no-underline shadow-xl shadow-black/5 shrink-0"
      >
        <img
          src={
            item.image?.url ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
          }
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent opacity-80" />

        <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start gap-4">
          {item.keywords && item.keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {item.keywords.slice(0, 3).map((kw, i) => (
                <span
                  key={i}
                  className="bg-white/90 backdrop-blur-sm text-black text-[14px] font-black px-3 py-1.5 rounded-md uppercase"
                >
                  {kw}
                </span>
              ))}

              <span className="text-white/50 text-[14px] font-normal ml-2">
                {item.date}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h3 className="text-white text-xl md:text-2xl lg:text-[34px] font-normal leading-tight tracking-tight m-0 max-w-[800px] transition-all group-hover:text-white/90">
              {item.title}
            </h3>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
};

// --- Must Read Aside ---
export const MustReadAside = ({ items }: { items: InsightItem[] }) => {
  return (
    <div className="flex flex-col bg-white p-6 rounded-xl relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-full after:w-screen after:bg-white shadow-lg">
      <div className="flex justify-between items-baseline pb-3">
        <h4 className="text-xl md:text-[28px] font-medium text-black m-0 tracking-tight">
          Must read
        </h4>

        <span className="text-[14px] text-black font-normal uppercase ">
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`/insights/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-5 group no-underline border-2 border-black/20 p-4 rounded-lg transition-colors hover:bg-[#D9D9D9] hover:border-transparent"
          >
            <h5 className="text-[15px] font-semibold text-black m-0 mb-1 leading-snug group-hover:text-black transition-colors">
              {item.title}
            </h5>

            <span className="text-[14px] text-black font-normal">
              {item.date}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

// --- More Insights Slider ---
export const MoreInsightsSlider = ({
  items,
  darkVariant = false,
}: {
  items: InsightItem[];
  darkVariant?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY * 3;
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="mt-8 w-full flex flex-col xl:flex-row gap-10 items-start">
      <div className="shrink-0">
        <h2
          className={`xl:w-[250px] text-[32px] md:text-[40px] font-normal mb-8 xl:mb-0 tracking-tight leading-tight ${
            darkVariant ? "text-black" : "text-[#0A0A0A]"
          }`}
        >
          More Insights
        </h2>
      </div>

      <div className="flex-1 min-w-0 w-full relative overflow-visible">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          id="more-insights-scroll"
          className="relative flex gap-6 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory pb-12"
          style={{
            marginRight: "calc(50% - 50vw)",
            paddingRight: "50px",
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/insights/${item.id}`}
              className="w-[85%] md:w-[600px] lg:w-[750px] shrink-0 rounded-xl overflow-hidden flex flex-col md:flex-row snap-start group no-underline shadow-sm hover:shadow-md transition-all h-[180px] md:h-[230px]"
            >
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-[#EEEEEE]">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] md:text-[14px] text-black font-medium">
                    {item.date}
                  </span>
                  <h4 className="text-[18px] md:text-[22px] lg:text-[28px] font-normal text-black leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="w-[140px] md:w-[250px] shrink-0 relative">
                <img
                  src={
                    item.image?.url ||
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                  }
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
          {/* End Spacer */}
          <div className="w-1 md:w-10 shrink-0" />
        </div>
      </div>
    </div>
  );
};

// --- Subscribe Section (Above Footer) ---
export const InsightsSubscribeSection = ({
  latestImage,
  onSubscribe,
}: {
  latestImage?: string;
  onSubscribe?: () => void;
}) => {
  return (
    <div className="container mx-auto px-6 md:px-12 xl:px-20 mb-20 md:mb-32">
      <div className="bg-[#D8B8F4] rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch">
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black leading-[1.2] tracking-tight mb-10 max-w-[500px]">
            Receive special insightful brand guidebook every month from us!
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Email..."
              className="flex-1 px-6 py-4 bg-white border-black/10 rounded-xl outline-none placeholder:text-black/30 text-black text-[15px]"
            />
            <button
              onClick={onSubscribe}
              className="px-8 py-4 bg-white hover:bg-black hover:text-white text-black font-bold text-[15px] rounded-xl transition-all shadow-sm"
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
    </div>
  );
};

// --- Success Modal ---
export const SuccessModal = ({
  isOpen,
  onClose,
  title = "Email Submitted",
  message = "You'll get your guidebook immediately",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="bg-white rounded-xl p-8 shadow-2xl relative w-full max-w-[500px] flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="w-12 h-12 rounded-[12px] bg-[#7526BF] flex items-center justify-center mb-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h3 className="text-[24px] md:text-[32px] font-bold text-black mb-3">
          {title}
        </h3>
        <p className="text-[14px] md:text-[16px] text-black font-normal">
          {message}
        </p>
      </div>
    </div>
  );
};

// --- Pagination Component ---
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M15 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
            currentPage === page
              ? "bg-black text-white shadow-lg shadow-black/20"
              : "text-black/40 hover:bg-gray-100 hover:text-black"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M9 18l6-6-6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
