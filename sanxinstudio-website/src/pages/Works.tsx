import Header from "../components/public/Header";
import WorksHero from "../components/public/works/WorksHero";
import WorksProcess from "../components/public/works/WorksProcess";
import Footer from "../components/public/Footer";

const Works = () => {
  return (
    <div className="works-page">
      <Header />

      <main>
        <WorksHero />
        <WorksProcess />
      </main>

      <Footer />

      <style>
        {`
        .works-page {
          background: #ffffff;
          color: #0a0a0a;
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
      `}
      </style>
    </div>
  );
};

export default Works;
