import Header from "../components/public/Header";
import WorksProcess from "../components/public/works/WorksProcess";
import WorksFramework from "../components/public/works/WorksFramework";
import Section2 from "../components/public/Section2";
import SolutionFAQs from "../components/public/solution/SolutionFAQs";
import Footer from "../components/public/Footer";

const Works = () => {
  return (
    <div className="works-page font-primary">
      <Header />

      <main>
        <WorksProcess />
        <WorksFramework />
        <Section2 />
        <Footer customCTA={<SolutionFAQs />} />
      </main>

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
