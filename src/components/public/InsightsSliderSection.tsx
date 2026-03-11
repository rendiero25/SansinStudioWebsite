import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import type { InsightItem } from "../cms/InsightsItemsEditor";
import type { InsightCategory } from "../cms/InsightCategoriesEditor";
import Skeleton from "../Skeleton";

const InsightsSliderSection = () => {
  const [posts, setPosts] = useState<InsightItem[]>([]);
  const [categories, setCategories] = useState<InsightCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes] = await Promise.all([
          getSection("insights", "posts"),
          getSection("insights", "categories"),
        ]);

        if (postRes?.content?.insights) {
          setPosts(postRes.content.insights as InsightItem[]);
        }
        if (catRes?.content?.categories) {
          setCategories(catRes.content.categories as InsightCategory[]);
        }
      } catch (err) {
        console.error("Failed to load insights for slider:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  // Auto-slide every 8 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [handleNext, posts.length]);

  if (!loaded) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] xl:h-[700px] bg-black overflow-hidden flex flex-col justify-end pb-16 md:pb-24">
         <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20 h-full flex flex-col justify-end">
            <div className="flex flex-row w-full justify-between items-center mb-8">
               <Skeleton dark className="w-8 h-8 md:w-12 md:h-12 rounded-full" />
               <Skeleton dark className="w-8 h-8 md:w-12 md:h-12 rounded-full" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <Skeleton dark className="w-[80px] h-[24px] rounded-md" />
               <Skeleton dark className="w-[120px] h-[24px] rounded-md" />
            </div>
            <div className="max-w-[900px] space-y-3">
               <Skeleton dark className="w-full h-[35px] md:h-[50px]" />
               <Skeleton dark className="w-[80%] h-[35px] md:h-[50px]" />
            </div>
         </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];
  
  // Maps category IDs to their names
  const postCategories = (currentPost.categoryIds || [])
    .map(id => categories.find(c => c.id === id)?.categoryName)
    .filter(Boolean);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] xl:h-[700px] bg-black overflow-hidden group">
      {/* Background with Fade Transition */}
      <div className="absolute inset-0 z-0">
        {posts.map((post, idx) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={post.image?.url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay matching mockup */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20 h-full flex flex-col justify-end pb-16 md:pb-24">
        
        {/* Navigation Buttons - Positioned relative to content */}
        <div className="flex flex-row w-full justify-between items-center gap-4 mb-8">
          <button
            onClick={handlePrev}
            className="w-8 h-8 md:w-12 md:h-12 bg-white/15 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="black" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 md:w-12 md:h-12 bg-white/15 rounded-full flex items-center justify-center text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" color="black" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Categories & Date */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {postCategories.map((cat, i) => (
            <span
              key={i}
              className="bg-white text-black text-[10px] md:text-[12px] font-black px-4 py-1.5 rounded-md uppercase tracking-wide font-primary"
            >
              {cat}
            </span>
          ))}
          <span className="text-white/60 text-[12px] md:text-[14px] font-medium ml-2 font-primary">
            {currentPost.date}
          </span>
        </div>

        {/* Title / Headline */}
        <Link
          to={`/insights/${currentPost.id}`}
          className="no-underline group/title max-w-[900px]"
        >
          <h2 className="font-primary text-[28px] md:text-[44px] xl:text-[56px] font-normal leading-tight md:leading-[1.1] text-white m-0 tracking-tight transition-all group-hover/title:text-white/80">
            {currentPost.title}
          </h2>
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default InsightsSliderSection;
