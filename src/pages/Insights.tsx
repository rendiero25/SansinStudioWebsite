import { useState, useEffect } from "react";
import Header from "../components/public/Header";
import { getSection } from "../services/sectionApi";
import type { InsightItem } from "../components/cms/InsightsItemsEditor";
import type { InsightCategory } from "../components/cms/InsightCategoriesEditor";
import {
  InsightCategoryFilter,
  MainInsightCard,
  MustReadAside,
  NewsletterBox,
  InsightsSubscribeSection,
  Pagination,
  SuccessModal,
} from "../components/public/insights/InsightsComponents";
import { InsightsFooter } from "../components/public/insights/InsightsFooter";
import Skeleton from "../components/Skeleton";
import ScrollReveal from "../components/ScrollReveal";

const Insights = () => {
  const [categories, setCategories] = useState<InsightCategory[]>([]);
  const [allPosts, setAllPosts] = useState<InsightItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    // ... (fetch logic remains same)
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

  // Filter change resets to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.categoryIds?.includes(activeCategory))
    : allPosts;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const mustReadPosts = allPosts.slice(0, 5); // Take first 5 for "Must Read"
  const latestPostImage = allPosts[0]?.image?.url;
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="insights-page font-primary bg-white min-h-screen">
        <Header />
        <main className="pt-32">
          <div className="bg-white pb-24">
            <div className="container mx-auto px-6 md:px-12 xl:px-20">
              <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">
                <div className="w-full lg:w-[68%] flex flex-col">
                  <div className="flex flex-col gap-8 mb-12">
                     <Skeleton className="w-[150px] h-[40px] md:h-[50px]" />
                     <div className="flex gap-4">
                        <Skeleton className="w-[100px] h-[35px] rounded-lg" />
                        <Skeleton className="w-[100px] h-[35px] rounded-lg" />
                        <Skeleton className="w-[100px] h-[35px] rounded-lg" />
                     </div>
                  </div>
                  <div className="flex flex-col gap-12">
                     <Skeleton className="w-full h-[250px] rounded-3xl" />
                     <Skeleton className="w-full h-[250px] rounded-3xl" />
                     <Skeleton className="w-full h-[250px] rounded-3xl" />
                  </div>
                </div>
                <aside className="w-full lg:w-[32%] flex flex-col relative min-h-full gap-12">
                   <Skeleton className="w-full h-[180px] rounded-3xl" />
                   <Skeleton className="w-full h-[500px] rounded-3xl" />
                </aside>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="insights-page font-primary">
      <Header />

      <main className="pt-32">
        <div className="bg-white pb-24">
          <div className="container mx-auto px-6 md:px-12 xl:px-20">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">
              {/* Left Column: Title, Filter, Posts */}
              <div className="w-full lg:w-[68%] flex flex-col">
                <ScrollReveal className="flex flex-col gap-8 mb-12">
                  <h1 className="text-[32px] md:text-[42px] font-normal text-[#0A0A0A] m-0 leading-none tracking-tight">
                    Insights
                  </h1>
                  <InsightCategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </ScrollReveal>

                <div className="flex flex-col">
                  {currentPosts.length > 0 ? (
                    <div className="flex flex-col max-h-[1600px] overflow-y-auto pr-4 hide-scrollbar">
                      {currentPosts.map((post) => (
                        <MainInsightCard key={post.id} item={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-black/30 border border-dashed border-black/10 rounded-3xl">
                      No post found in this category.
                    </div>
                  )}

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>

              {/* Right Column: Subscribe & Must Read */}
              <aside className="w-full lg:w-[32%] flex flex-col relative min-h-full">
                <ScrollReveal delay={0.2} direction="left">
                  <NewsletterBox />
                </ScrollReveal>
                <ScrollReveal delay={0.4} direction="left" className="sticky top-25 z-20 mt-12">
                  <MustReadAside items={mustReadPosts} />
                </ScrollReveal>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-20">
        <InsightsSubscribeSection
          latestImage={latestPostImage}
          onSubscribe={() => setShowModal(true)}
        />
      </div>

      <InsightsFooter
        latestImage={latestPostImage}
        items={allPosts.slice(0, 5)}
      />

      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <style>{`
        .insights-page {
          background: #ffffff;
          color: #0A0A0A;
          min-height: 100vh;
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
