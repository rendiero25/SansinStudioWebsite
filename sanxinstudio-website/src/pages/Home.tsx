import Header from "../components/public/Header";
import HeroSection from "../components/public/HeroSection";
import Section2 from "../components/public/Section2";
import Section3 from "../components/public/Section3";
import Section4 from "../components/public/Section4";
import Section5 from "../components/public/Section5";
import Section6 from "../components/public/Section6";
import Section7 from "../components/public/Section7";
import Section8 from "../components/public/Section8";
import Footer from "../components/public/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <HeroSection />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />

      {/* Footer */}
      <Footer />

      <style>{`
        .home-page {
          background: #ffffff;
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
