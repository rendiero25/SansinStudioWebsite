import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSection } from "../../services/sectionApi";
import { Link } from "react-router-dom";

interface SummaryData {
  projects: number;
  projectImages: number;
  categories: number;
  insights: number;
  processes: number;
  processDetails: number;
  solCategories: number;
  solMethods: number;
  allProjectImages: string[];
}

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [summary, setSummary] = useState<SummaryData>({
    projects: 0,
    projectImages: 0,
    categories: 0,
    insights: 0,
    processes: 0,
    processDetails: 0,
    solCategories: 0,
    solMethods: 0,
    allProjectImages: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      console.log("Dashboard: Fetching summary data...");
      try {
        const results = await Promise.allSettled([
          getSection("projects", "section2"),
          getSection("projects", "section1"),
          getSection("insights", "section2"),
          getSection("works", "section2"),
          getSection("solution", "section2"),
        ]);

        const projRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const catRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const insRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const worksRes = results[3].status === 'fulfilled' ? results[3].value : null;
        const solRes = results[4].status === 'fulfilled' ? results[4].value : null;

        const projects = projRes?.content?.projects || [];
        const categories = catRes?.content?.categories || [];
        const insights = insRes?.content?.insights || [];
        const processes = worksRes?.content?.processes || [];
        const solCategories = solRes?.content?.categories || [];

        const projectImages = projects.map((p: { mainImage?: { url: string } }) => p.mainImage?.url).filter(Boolean) as string[];
        
        let processDetailsCount = 0;
        processes.forEach((p: { details?: Record<string, unknown>[] }) => {
          processDetailsCount += (p.details?.length || 0);
        });

        let solMethodsCount = 0;
        solCategories.forEach((c: { methods?: Record<string, unknown>[] }) => {
          solMethodsCount += (c.methods?.length || 0);
        });

        setSummary({
          projects: projects.length,
          projectImages: projectImages.length,
          categories: categories.length,
          insights: insights.length,
          processes: processes.length,
          processDetails: processDetailsCount,
          solCategories: solCategories.length,
          solMethods: solMethodsCount,
          allProjectImages: projectImages,
        });
      } catch (error) {
        console.error("Dashboard: Critical error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Slideshow Logic
  useEffect(() => {
    if (summary.allProjectImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % summary.allProjectImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [summary.allProjectImages]);

  return (
    <div style={styles.container} id="admin-dashboard-root">
      {/* Inject local responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          #admin-dashboard-root {
            height: auto !important;
            overflow: visible !important;
            margin: -72px -16px -100px !important; /* Extremely large negative margin to cover gaps */
            background: #000 !important;
            padding-bottom: 0px !important;
          }
          #admin-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          #admin-dashboard-left {
            height: auto !important;
            overflow: visible !important;
            padding: 110px 24px 64px !important;
          }
          #admin-dashboard-right {
            height: 600px !important;
            margin-bottom: 0px !important;
            padding-bottom: 0px !important;
            background: #000 !important;
          }
          /* Targeting parent main in AdminLayout */
          main { 
            padding-bottom: 0 !important; 
          }
        }
      `}</style>

      <div style={styles.contentGrid} id="admin-dashboard-grid">
        {/* Left Column: Data Summary */}
        <div style={styles.leftCol} id="admin-dashboard-left">
          <div style={styles.wrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>Dashboard</h1>
              <p style={styles.subtitle}>
                Welcome back, <strong>{admin?.name}</strong> 👋
              </p>
            </div>

            <h2 style={styles.sectionTitle}>Data Summary</h2>
            <div style={styles.summaryGrid}>
              <Link to="/admin/projects/section2" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>📁</span>
                  <span style={styles.cardLabel}>All Projects</span>
                </div>
                <div style={styles.cardValue}>
                  {loading ? "..." : summary.projects}
                </div>
                <div style={styles.cardSubValue}>
                  {summary.projectImages} Images
                </div>
              </Link>

              <Link to="/admin/projects/section1" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>🏷️</span>
                  <span style={styles.cardLabel}>Project Categories</span>
                </div>
                <div style={styles.cardValue}>
                  {loading ? "..." : summary.categories}
                </div>
              </Link>

              <Link to="/admin/works/section2" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>🔄</span>
                  <span style={styles.cardLabel}>Works Processes</span>
                </div>
                <div style={styles.cardValue}>
                  {loading ? "..." : summary.processes}
                </div>
                <div style={styles.cardSubValue}>
                  {summary.processDetails} Detail Items
                </div>
              </Link>

              <Link to="/admin/solution/section2" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>🔧</span>
                  <span style={styles.cardLabel}>Solution Categories</span>
                </div>
                <div style={styles.cardValue}>
                  {loading ? "..." : summary.solCategories}
                </div>
                <div style={styles.cardSubValue}>
                  {summary.solMethods} Methods
                </div>
              </Link>

              <Link to="/admin/insights/section2" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>📰</span>
                  <span style={styles.cardLabel}>Total Insights</span>
                </div>
                <div style={styles.cardValue}>
                  {loading ? "..." : summary.insights}
                </div>
              </Link>

              <Link to="/admin/home/hero" style={styles.summaryCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>🎬</span>
                  <span style={styles.cardLabel}>Hero & Home</span>
                </div>
                <div style={styles.cardValue}>Manage</div>
              </Link>
            </div>

            <div style={styles.infoBox}>
              <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                💡 Ringkasan ini mencakup semua konten utama yang dapat Anda kelola melalui CMS Sanxin Studio.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Full-width Slideshow */}
        <div style={styles.rightCol} id="admin-dashboard-right">
          <div style={styles.slideshowContainer}>
            {loading ? (
              <div style={styles.imagePlaceholder}>Loading slideshow...</div>
            ) : summary.allProjectImages.length > 0 ? (
              <div style={styles.slidesWrapper}>
                {summary.allProjectImages.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.slide,
                      opacity: currentSlide === idx ? 1 : 0,
                    }}
                  >
                    <img src={img} alt={`Slide ${idx}`} style={styles.image} />
                  </div>
                ))}
                <div style={styles.imageOverlay}>
                  <div style={styles.overlayText}>
                    <p style={styles.overlayLabel}>Project Showcase</p>
                    <h3 style={styles.overlayTitle}>Our Latest Works</h3>
                  </div>
                  <div style={styles.slideDots}>
                    {summary.allProjectImages.map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          ...styles.dot,
                          background: currentSlide === idx ? "#fff" : "rgba(255,255,255,0.3)",
                          width: currentSlide === idx ? "24px" : "8px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.imagePlaceholder}>
                <span style={{ fontSize: "40px", marginBottom: "20px" }}>🖼️</span>
                No project images available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    margin: "-32px", // Break out of parent padding
    overflow: "hidden",
    fontFamily: "IBM Plex Sans, sans-serif",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    height: "100%",
    alignItems: "stretch",
  },
  leftCol: {
    padding: "64px 48px",
    overflow: "hidden",
    background: "#0f0f13",
  },
  wrapper: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "48px",
  },
  title: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "36px",
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 8px",
    letterSpacing: "-0.04em",
  },
  subtitle: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.45)",
    margin: 0,
  },
  sectionTitle: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.9)",
    margin: "0 0 24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  summaryCard: {
    padding: "28px 24px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "24px",
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  cardIcon: {
    fontSize: "20px",
  },
  cardLabel: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "32px",
    fontWeight: 700,
    color: "#fff",
  },
  cardSubValue: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.25)",
    marginTop: "2px",
  },
  infoBox: {
    fontFamily: "IBM Plex Sans, sans-serif",
    padding: "20px 24px",
    background: "rgba(99, 102, 241, 0.04)",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    borderRadius: "20px",
  },
  rightCol: {
    position: "relative",
    background: "#000",
  },
  slideshowContainer: {
    width: "100%",
    height: "100%",
  },
  slidesWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  slide: {
    position: "absolute",
    inset: 0,
    transition: "opacity 0.8s ease-in-out",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imagePlaceholder: {
    fontFamily: "IBM Plex Sans, sans-serif",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.15)",
    fontSize: "14px",
    background: "#0a0a0e",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "64px 48px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  overlayText: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  overlayLabel: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    margin: 0,
  },
  overlayTitle: {
    fontFamily: "IBM Plex Sans, sans-serif",
    fontSize: "32px",
    fontWeight: 500,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  slideDots: {
    display: "flex",
    gap: "8px",
    paddingBottom: "8px",
  },
  dot: {
    height: "4px",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
};

export default AdminDashboard;
