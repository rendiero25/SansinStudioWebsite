import { useState, useEffect } from "react";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import { getSection } from "../services/sectionApi";
import type { InsightItem } from "../components/cms/InsightsItemsEditor";
import type { InsightCategory } from "../components/cms/InsightCategoriesEditor";
import {
  InsightCategoryFilter,
  MainInsightCard,
  MustReadAside,
  MoreInsightsSlider,
  InsightsSubscribeSection,
} from "../components/public/insights/InsightsComponents";

const Insights = () => {
  const [categories, setCategories] = useState<InsightCategory[]>([]);
  const [allPosts, setAllPosts] = useState<InsightItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          getSection("insights", "categories"),
          getSection("insights", "posts"),
        ]);

        if (catRes?.content?.categories) {
          setCategories(catRes.content.categories as InsightCategory[]);
        }
        if (postRes?.content?.insights) {
          setAllPosts(postRes.content.insights as InsightItem[]);
        }
      } catch (err) {
        console.error("Failed to load insights data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Horizontal scroll logic for "More Insights"
  useEffect(() => {
    if (loading || allPosts.length === 0) return;

    const timer = setTimeout(() => {
      const container = document.getElementById("more-insights-scroll") as HTMLElement & { __wheelCleanup?: () => void };
      if (!container) return;

      const handleWheel = (e: WheelEvent) => {
        if (container.scrollWidth <= container.clientWidth) return;
        e.preventDefault();
        e.stopPropagation();
        container.scrollLeft += e.deltaY;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });
      container.__wheelCleanup = () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = document.getElementById("more-insights-scroll") as (HTMLElement & { __wheelCleanup?: () => void }) | null;
      if (container && container.__wheelCleanup) {
        container.__wheelCleanup();
      }
    };

    return () => clearTimeout(timer);
  }, [loading, allPosts]);

  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.categoryIds?.includes(activeCategory))
    : allPosts;

  const featuredPosts = filteredPosts.slice(0, 3);
  const mustReadPosts = allPosts.slice(0, 5); // Take first 5 for "Must Read"
  const moreInsights = allPosts.slice(0, 6); // Take first 6 for bottom slider
  const latestPostImage = allPosts[0]?.image?.url;

  if (loading) {
     return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <div className="insights-page font-primary">
      <Header />
      
      <main className="pt-32 pb-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          
          {/* Page Title & Filter */}
          <div className="flex flex-col gap-8 mb-16">
            <h1 className="text-[32px] md:text-[42px] font-normal text-[#0A0A0A] m-0 leading-none tracking-tight">
              Insights
            </h1>
            <InsightCategoryFilter 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
          </div>

          {/* Main Content Layout: 2 Columns */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Featured Posts */}
            <div className="w-full lg:w-[65%] flex flex-col">
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post) => (
                  <MainInsightCard key={post.id} item={post} />
                ))
              ) : (
                <div className="py-20 text-center text-black/30 border border-dashed border-black/10 rounded-3xl">
                  No post found in this category.
                </div>
              )}
            </div>

            {/* Right Column: Must Read & Mini Subscribe */}
            <aside className="w-full lg:w-[35%]">
              <MustReadAside items={mustReadPosts} />
            </aside>
          </div>

          {/* Bottom Section: More Insights Slider */}
          <MoreInsightsSlider items={moreInsights} />
        </div>
      </main>

      {/* Big Subscribe Section before Footer */}
      <InsightsSubscribeSection latestImage={latestPostImage} />

      {/* Footer without CTA */}
      <Footer hideCta={true} />

      <style>{`
        .insights-page {
          background: #ffffff;
          color: #0A0A0A;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Insights;
