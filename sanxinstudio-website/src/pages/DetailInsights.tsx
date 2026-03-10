import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/public/Header";
import { getSection } from "../services/sectionApi";
import type { InsightItem } from "../components/cms/InsightsItemsEditor";
import {
  MoreInsightsSlider,
  InsightsSubscribeSection,
  SuccessModal,
} from "../components/public/insights/InsightsComponents";
import { InsightsFooter } from "../components/public/insights/InsightsFooter";

const DetailInsights = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<InsightItem | null>(null);
  const [allPosts, setAllPosts] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const postRes = await getSection("insights", "posts");
        if (postRes?.content?.insights) {
          const insights = postRes.content.insights as InsightItem[];
          setAllPosts(insights);
          const foundPost = insights.find((p) => p.id === id);
          setPost(foundPost || null);
        }
      } catch (err) {
        console.error("Failed to load insight detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-primary text-black">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/insights" className="text-purple-600 hover:underline">
          Back to Insights
        </Link>
      </div>
    );
  }

  const moreInsights = allPosts.filter((p) => p.id !== id).slice(0, 5);
  const latestPostImage = allPosts[0]?.image?.url;

  return (
    <div className="insights-detail-page font-primary bg-white text-black min-h-screen">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 xl:px-20">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-black hover:text-black transition-colors mb-10 group cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="text-[18px] font-medium uppercase tracking-wider">
              Back
            </span>
          </button>

          {/* Row 1: Title, Date & Keywords */}
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
            <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-normal leading-tight tracking-tight max-w-[800px] m-0">
              {post.title}
            </h1>

            <div className="flex flex-col items-start gap-3 shrink-0">
              <span className="text-[14px] md:text-[16px] text-black font-normal">
                {post.date}
              </span>
              <div className="flex flex-wrap gap-2">
                {post.keywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-[#E0E0E0] text-black text-[12px] md:text-[13px] font-bold px-4 py-1.5 rounded-md uppercase tracking-wider"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Image */}
          <div className="w-full aspect-video lg:aspect-21/9 rounded-[24px] overflow-hidden mb-6 shadow-lg shadow-black/5">
            <img
              src={
                post.image?.url ||
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Row 3: Content/Description */}
          <div className="max-w-full mx-auto w-full overflow-hidden">
            <div
              className="insight-content text-[17px] md:text-[20px] leading-relaxed text-black font-normal whitespace-pre-wrap wrap-break-word"
              dangerouslySetInnerHTML={{ __html: post.description || "" }}
            />
          </div>
        </div>
      </main>

      <InsightsFooter
        latestImage={latestPostImage}
        items={allPosts.slice(0, 5)}
      />

      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <style>{`
        .insight-content p {
          margin-bottom: 1.5rem;
        }
        .insight-content img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 2rem 0;
        }
        .insight-content h2, .insight-content h3 {
          font-weight: bold;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .insight-content h2 { font-size: 2rem; }
        .insight-content h3 { font-size: 1.5rem; }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DetailInsights;
