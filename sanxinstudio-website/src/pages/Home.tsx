import Header from "../components/public/Header";
import HeroSection from "../components/public/HeroSection";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <HeroSection />

      {/* More sections will be added here */}
      <div
        style={{
          padding: "120px 48px",
          background: "#0a0a0a",
          textAlign: "center" as const,
          color: "rgba(255, 255, 255, 0.2)",
          fontFamily: '"IBM Plex Sans", sans-serif',
          fontSize: "14px",
        }}
      >
        More sections coming soon...
      </div>

      <style>{`
        .home-page {
          background: #0a0a0a;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
