import Header from "../components/public/Header";
import SolutionHero from "../components/public/solution/SolutionHero";
import SolutionCategories from "../components/public/solution/SolutionCategories";
import SolutionFAQs from "../components/public/solution/SolutionFAQs";

const Solution = () => {
  return (
    <div className="solution-page">
      <Header />

      <main>
        <SolutionHero />
        <SolutionCategories />
        {/* FAQs section and global Footer */}
        <SolutionFAQs />
      </main>

      <style>{`
        .solution-page {
          background: #ffffff;
          color: #0a0a0a;
          min-height: 100vh;
          overflow-x: clip;
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

export default Solution;
