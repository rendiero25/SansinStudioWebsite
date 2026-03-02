import Header from "../components/public/Header";
import HeroSection from "../components/public/HeroSection";
import Section2 from "../components/public/Section2";
import Section3 from "../components/public/Section3";
import Section4 from "../components/public/Section4";
import Section5 from "../components/public/Section5";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />

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
