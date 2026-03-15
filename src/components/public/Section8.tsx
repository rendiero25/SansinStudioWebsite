import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";

interface Section8Data {
  title?: string;
  ctaButton?: { text: string; link: string };
  emailTitle?: string;
  emailPlaceholder?: string;
  emailBtnText?: string;
  targetEmail?: string;
}

const renderStyledText = (text: string) => {
  if (!text) return null;

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    // Split to find _italic underline_
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
        // Formatted matching design: italic block
        return (
          <span
            key={i}
            className="italic font-light text-black/80 underline underline-offset-4 decoration-1"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

    return (
      <span key={lineIndex}>
        {lineContent}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

const Section8 = () => {
  const [data, setData] = useState<Section8Data>({});
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section8");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section8:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const btn = data.ctaButton || { text: "Insights", link: "/insights" };
  const title =
    data.title || "Discover our _industry\nnews & creative insights_";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const mailto = data.targetEmail || "workspace.rendy@gmail.com";
    const mailtoLink = `mailto:${mailto}?subject=Newsletter Subscription&body=Please subscribe this email: ${email}`;
    window.location.href = mailtoLink;
    setEmail(""); // clear after sending
  };

  return (
    <section className="w-full bg-white py-20">
      <div className="container mx-auto px-10 md:px-12 xl:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 lg:gap-20">
          {/* Left: Title + Button */}
          <div className="flex-1 flex flex-col items-start gap-8 w-full">
            {!loaded ? (
              <div className="space-y-3 w-full max-w-[500px]">
                <Skeleton className="w-full h-[30px] lg:h-[50px]" />
                <Skeleton className="w-[70%] h-[30px] lg:h-[50px]" />
              </div>
            ) : (
              <ScrollReveal>
                <h2 className="font-primary text-[23px] lg:text-[42px] font-light text-black leading-[1.2] tracking-[-0.02em] m-0 max-w-[500px]">
                  {renderStyledText(title)}
                </h2>
              </ScrollReveal>
            )}
            {!loaded ? (
              <Skeleton className="w-[120px] h-[45px] rounded-xl" />
            ) : (
              <ScrollReveal delay={0.2}>
                <Link
                  to={btn.link}
                  className="inline-flex items-center justify-center px-6 py-2 bg-transparent text-black font-primary text-[15px] font-bold border border-black/20 rounded-xl hover:bg-black hover:text-white transition-all duration-300 no-underline"
                >
                  {btn.text}
                </Link>
              </ScrollReveal>
            )}
          </div>

          {/* Right: Newsletter Form */}
          <div className="flex-1 w-full max-w-[700px] flex gap-6 items-end">
            {!loaded ? (
              <Skeleton className="w-[60px] h-[30px] hidden sm:block mb-3" />
            ) : (
              <div className="font-primary text-[8px] md:text-[10px] font-bold text-black tracking-widest pb-3 hidden sm:block">
                {data.emailTitle ? (
                  renderStyledText(data.emailTitle.replace(" ", "\n"))
                ) : (
                  <>
                    SUBSCRIBE
                    <br />
                    NEWSLETTER
                  </>
                )}
              </div>
            )}

            <div className="flex-1 flex flex-col sm:flex-row gap-4 items-stretch mb-0.5">
              {!loaded ? (
                <>
                  <Skeleton className="flex-1 h-[50px] rounded-xl" />
                  <Skeleton className="w-[150px] h-[50px] rounded-xl" />
                </>
              ) : (
                <ScrollReveal delay={0.4} direction="up" className="flex-1 flex flex-col sm:flex-row gap-4 items-stretch w-full">
                  <form
                    onSubmit={handleSubscribe}
                    className="flex-1 flex flex-col sm:flex-row gap-4 items-stretch w-full"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={data.emailPlaceholder || "Email..."}
                      className="flex-1 bg-[#F5F5F5] border border-black/5 rounded-xl px-5 py-3.5 text-[15px] font-primary text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-[#A033FF] text-white font-primary font-medium text-[17px] px-8 py-3.5 rounded-xl hover:bg-[#8527DE] transition-colors duration-300 whitespace-nowrap cursor-pointer"
                    >
                      {data.emailBtnText || "Get free guidebook"}
                    </button>
                  </form>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8;
