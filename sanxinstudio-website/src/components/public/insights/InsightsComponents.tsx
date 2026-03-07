import { Link } from "react-router-dom";
import type { InsightItem } from "../../cms/InsightsItemsEditor";
import type { InsightCategory } from "../../cms/InsightCategoriesEditor";

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
  return (
    <div className="flex items-center bg-white border border-black/5 rounded-xl p-2 gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-x-auto hide-scrollbar mb-12">
      <span className="text-[10px] md:text-[11px] font-bold text-black/40 px-3 uppercase tracking-widest shrink-0">
        CATEGORY FILTER
      </span>
      <button
        onClick={() => onCategoryChange("")}
        className={`px-6 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
          activeCategory === ""
            ? "bg-[#EBEBEB] text-black"
            : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
        }`}
      >
        ALL
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-6 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap uppercase ${
            activeCategory === cat.id
              ? "bg-[#EBEBEB] text-black"
              : "bg-transparent text-black/50 hover:text-black/80 hover:bg-black/5"
          }`}
        >
          {cat.categoryName}
        </button>
      ))}
    </div>
  );
};

// --- Main Insight Card ---
export const MainInsightCard = ({ item }: { item: InsightItem }) => {
  return (
    <Link
      to={`/insights/${item.id}`}
      className="group relative w-full aspect-[16/9] rounded-[24px] overflow-hidden mb-8 block no-underline"
    >
      <img
        src={item.image?.url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      <div className="absolute bottom-8 left-8 right-8 flex flex-col items-start gap-4">
        {item.keywords && item.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
           <span className="text-white/60 text-[11px] font-medium">{item.date}</span>
           <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-normal leading-tight tracking-tight m-0 group-hover:underline underline-offset-4 decoration-white/30">
             {item.title}
           </h3>
        </div>
      </div>
    </Link>
  );
};

// --- Must Read Aside ---
export const MustReadAside = ({ items }: { items: InsightItem[] }) => {
  return (
    <div className="flex flex-col gap-8 sticky top-32">
       {/* Newsletter Box */}
       <div className="bg-[#E5D7FA] p-6 rounded-xl flex items-center justify-between group cursor-pointer">
          <span className="text-sm md:text-[15px] font-semibold text-black leading-snug max-w-[180px]">
            Subscribe to our newsletter for interesting offers
          </span>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
               <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
       </div>

       {/* Must Read List */}
       <div className="flex flex-col gap-6">
          <div className="flex justify-between items-baseline border-b border-black/5 pb-2">
            <h4 className="text-xl md:text-[22px] font-semibold text-black m-0">Must read</h4>
            <span className="text-[11px] text-black/40 font-bold uppercase tracking-widest">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <div className="flex flex-col border-t border-black/5">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/insights/${item.id}`}
                className="py-5 border-b border-black/5 group no-underline"
              >
                <h5 className="text-[15px] font-semibold text-black m-0 mb-1 leading-snug group-hover:text-black/60 transition-colors">
                  {item.title}
                </h5>
                <span className="text-[11px] text-black/40 font-medium">{item.date}</span>
              </Link>
            ))}
          </div>
       </div>
    </div>
  );
};

// --- More Insights Slider ---
export const MoreInsightsSlider = ({ items }: { items: InsightItem[] }) => {
  return (
    <div className="mt-24 md:mt-32 w-full overflow-hidden">
      <h2 className="text-[32px] md:text-[40px] font-normal text-[#0A0A0A] mb-12 tracking-tight">More Insights</h2>
      
      <div 
        id="more-insights-scroll"
        className="flex gap-4 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory pb-8"
        style={{
           marginRight: "calc(-50vw + 50%)",
           marginLeft: "0px",
           paddingRight: "50px"
        }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/insights/${item.id}`}
            className="w-[85%] md:w-[450px] shrink-0 bg-[#EBEBEB] rounded-2xl overflow-hidden flex snap-start group no-underline"
          >
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] text-black/40 font-medium uppercase tracking-wider">{item.date}</span>
                <h4 className="text-[18px] md:text-[20px] font-semibold text-black leading-tight group-hover:text-black/70 transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>
            <div className="w-[120px] md:w-[150px] shrink-0 relative">
              <img
                src={item.image?.url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
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
  );
};

// --- Subscribe Section (Above Footer) ---
export const InsightsSubscribeSection = ({ latestImage }: { latestImage?: string }) => {
  return (
    <div className="container mx-auto px-6 md:px-12 xl:px-20 mb-20 md:mb-32">
      <div className="bg-[#E5D7FA] rounded-[32px] overflow-hidden flex flex-col md:flex-row items-stretch">
         <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black leading-[1.2] tracking-tight mb-10 max-w-[500px]">
              Receive special insightful brand guidebook every month from us!
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email..."
                className="flex-1 px-6 py-4 bg-white/50 border border-black/10 rounded-xl outline-none placeholder:text-black/30 text-black text-[15px]"
              />
              <button className="px-8 py-4 bg-white hover:bg-black hover:text-white text-black font-bold text-[15px] rounded-xl transition-all shadow-sm">
                Get free guidebook
              </button>
            </div>
         </div>
         <div className="w-full md:w-[35%] lg:w-[40%] h-[250px] md:h-auto shrink-0 relative">
            <img 
              src={latestImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80"} 
              alt="Guidebook" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Visual separation logic often seen in these designs */}
            <div className="absolute inset-0 md:bg-gradient-to-r from-[#E5D7FA] via-transparent to-transparent pointer-events-none" />
         </div>
      </div>
    </div>
  );
};
