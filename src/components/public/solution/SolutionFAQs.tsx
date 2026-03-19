import { useState, useEffect } from "react";
import { getSection } from "../../../services/sectionApi";
import type { ListItem } from "../../cms/ItemListEditor";
import Skeleton from "../../Skeleton";
import ScrollReveal from "../../ScrollReveal";

interface FaqData {
  title?: string;
  faqs?: ListItem[];
}

const SolutionFAQs = () => {
  const [data, setData] = useState<FaqData>({});
  const [loaded, setLoaded] = useState(false); // Added missing loaded state
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Added missing openIndex state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const faqSection = await getSection("faq", "content");
        setData(faqSection.content || {});
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  if (!loaded) {
    return (
      <div className="w-full relative py-20">
        <div className="container relative mx-auto px-6 md:px-12 xl:px-20 w-full z-10">
          <div className="w-full flex flex-col bg-white rounded-xl border border-black/20 overflow-hidden shadow-xl">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 pb-6 border-b border-black/20">
              <Skeleton className="w-[150px] h-[40px]" />
              <Skeleton className="w-full max-w-[550px] h-[40px]" />
            </div>
            <div className="w-full px-8 md:px-12 py-12 space-y-4">
              <Skeleton className="w-full h-[60px]" />
              <Skeleton className="w-full h-[60px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const faqs = data.faqs || [];
  if (faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="w-full relative mt-30">
      <div className="w-full z-10">
        {/* FAQ Container Box */}
        <ScrollReveal
          direction="up"
          className="w-full flex flex-col bg-white rounded-xl border border-black/20 overflow-hidden shadow-xl relative z-20"
        >
          {/* FAQ Header & Intro */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 pb-6 border-b border-black/20">
            <h2 className="font-primary text-[32px] md:text-[42px] font-normal tracking-[-0.02em] m-0 shrink-0">
              FAQs
            </h2>

            {data.title && (
              <p className="hidden lg:block font-primary text-[14px] md:text-[18px] text-black/60 max-w-[550px] leading-[1.6]">
                {data.title}
              </p>
            )}
          </div>

          {/* FAQ Accordion List */}
          <div className="flex flex-col w-full px-8 md:px-12 pb-12 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-col border-b border-black/20 last:border-0"
                >
                  <button
                    className="w-full text-left py-4 md:py-5 bg-transparent border-none cursor-pointer flex items-center gap-4 focus:outline-none hover:opacity-80 transition-opacity"
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="size-6 md:size-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-black/80 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <span
                      className={`font-primary text-[16px] md:text-[20px] tracking-tight text-black transition-all ${isOpen ? "font-bold" : "font-medium"}`}
                    >
                      {String(faq.question)}
                    </span>
                  </button>

                  <div
                    className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pl-10 md:pl-12 pr-4">
                      <p className="font-primary text-[15px] md:text-[18px] leading-[1.6] text-black/80 font-normal m-0">
                        {String(faq.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default SolutionFAQs;
