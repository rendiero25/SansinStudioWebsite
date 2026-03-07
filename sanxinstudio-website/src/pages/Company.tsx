import Header from "../components/public/Header";
import Footer from "../components/public/Footer";

const Company = () => {
  return (
    <div className="company-page">
      <Header />
      <main className="pt-[100px] min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Company</h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Learn more about Sanxin Studio, our mission, and our team.
          </p>
          <div className="mt-20 p-10 border border-dashed border-black/10 rounded-2xl bg-black/[0.02]">
             <p className="text-black/40 italic">Company details coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .company-page {
          background: #ffffff;
          color: #000;
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default Company;
