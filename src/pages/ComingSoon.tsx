import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import ScrollReveal from "../components/ScrollReveal";

const ComingSoon = () => {
  return (
    <div className="font-primary text-white flex flex-col">
      <Header />
      
      <main className="bg-linear-to-b from-[#060C1A] to-white flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 relative z-10">
        {/* Animated Background Elements - Adjusted for dark theme */}
        <ScrollReveal className="flex flex-col items-center text-center max-w-2xl gap-8">
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase text-white/40 border border-white/5">
            Insights Section
          </div>
          
          <h1 className="text-[48px] md:text-[72px] leading-none font-normal tracking-[-0.04em] text-white quill-content-title">
            Coming Soon
          </h1>
          
          <div className="w-16 h-[2px] bg-white/10" />
          
          <p className="text-[18px] md:text-[22px] leading-relaxed text-white max-w-md">
            We are curating high-quality articles and industry perspectives for you. Stay tuned for our launch.
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => window.history.back()}
              className="cursor-pointer px-6 py-2 bg-black text-white rounded-xl text-[15px] font-medium transition-all hover:scale-105 hover:bg-white hover:text-black active:scale-95"
            >
              Go Back
            </button>
            <a 
              href="/contact"
              className="cursor-pointer px-6 py-2 bg-transparent border border-white text-black rounded-xl text-[15px] font-medium transition-all hover:bg-white hover:text-black"
            >
              Contact Us
            </a>
          </div>
        </ScrollReveal>

        {/* Floating Decorative Elements */}
        
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;
