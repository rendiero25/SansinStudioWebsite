import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import ScrollReveal from "../components/ScrollReveal";

const ComingSoon = () => {
  return (
    <div className="coming-soon-page min-h-screen bg-white font-primary text-black flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[#EEEEEE] rounded-full blur-[120px] -z-10 opacity-60" />

        <ScrollReveal className="flex flex-col items-center text-center max-w-2xl gap-8">
          <div className="bg-black/5 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase text-black/40">
            Insights Section
          </div>
          
          <h1 className="text-[48px] md:text-[72px] lg:text-[92px] leading-[1] font-normal tracking-[-0.04em]">
            Coming <br /> <span className="text-black/20 italic">Soon</span>
          </h1>
          
          <div className="w-16 h-[2px] bg-black/10" />
          
          <p className="text-[18px] md:text-[22px] leading-relaxed text-black/60 max-w-md">
            We are curating high-quality articles and industry perspectives for you. Stay tuned for our launch.
          </p>
          
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => window.history.back()}
              className="cursor-pointer px-10 py-4 bg-black text-white rounded-xl text-[17px] font-medium transition-transform hover:scale-105 active:scale-95"
            >
              Go Back
            </button>
            <a 
              href="/contact"
              className="cursor-pointer px-10 py-4 bg-white border border-black/10 text-black rounded-xl text-[17px] font-medium transition-all hover:bg-black/5"
            >
              Contact Us
            </a>
          </div>
        </ScrollReveal>

        {/* Floating Decorative Elements */}
        <ScrollReveal delay={0.4} className="absolute bottom-20 left-10 md:left-20 pointer-events-none opacity-20">
          <div className="text-[120px] font-bold tracking-tighter leading-none select-none">
            01
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;
