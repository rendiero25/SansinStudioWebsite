import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";
import Skeleton from "../Skeleton";
import ScrollReveal from "../ScrollReveal";
import { sanitizeHtml } from "../../utils/sanitize";


interface Section6Data {
  title?: string;
  ctaButton?: { text: string; link: string };
  sideImage?: { url: string; publicId: string };
  imagePanPosition?: number;
}

const renderStyledText = (text: string) => {
  if (!text) return null;

  // If it looks like HTML (from Quill), render it directly
  if (text.includes("<") && text.includes(">")) {
    return <span className="quill-content-title" dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }} />;
  }

  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*[^*]+\*|_[^_]+_)/g);
    const lineContent = parts.map((part, i) => {
      if (part.startsWith("_") && part.endsWith("_")) {
        return (
          <span
            key={i}
            className="italic underline underline-offset-4 decoration-1 text-black"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <span key={i} className="italic">
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

const Section6 = () => {
  const [data, setData] = useState<Section6Data>({});
  const [loaded, setLoaded] = useState(false);

  // Drag-to-scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "section6");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load section6:", err);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Set initial scroll position based on CMS panPosition
  useEffect(() => {
    if (scrollContainerRef.current && loaded && data.sideImage) {
      const container = scrollContainerRef.current;
      const panPosition =
        data.imagePanPosition !== undefined ? data.imagePanPosition : 50;

      // Wait a tiny bit for image to paint so scrollWidth/scrollHeight are accurate
      setTimeout(() => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        container.scrollLeft = maxScrollLeft * (panPosition / 100);
        container.scrollTop = maxScrollTop / 2; // Center vertically by default
      }, 100);
    }
  }, [loaded, data.sideImage, data.imagePanPosition]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = x - startX; // 1:1 scroll speed
    const walkY = y - startY;
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const btn = data.ctaButton || { text: "Works", link: "/works" };
  const sideImage = data.sideImage;

  return (
    <section className="relative w-full bg-white py-20 md:py-32 overflow-hidden">
      <div className="relative z-10 container mx-auto px-10 md:px-12 xl:px-20">
        <div className="flex flex-col xl:flex-row items-start  xl:items-center gap-14 md:gap-20">
          {/* Left: Title + Button */}
          <div className="md:max-w-[500px] shrink-0 w-full flex flex-col items-start text-left text-black">
            {!loaded ? (
              <div className="w-full space-y-3 mb-8">
                <Skeleton className="w-[90%] h-[30px] md:h-[45px]" />
                <Skeleton className="w-[70%] h-[30px] md:h-[45px]" />
              </div>
            ) : (
              <ScrollReveal>
                <h2 className="font-primary text-[23px] md:text-[42px] font-light text-black leading-[1.15] tracking-[-0.03em] m-0 mb-8">
                  {renderStyledText(data.title || "")}
                </h2>
              </ScrollReveal>
            )}
            {!loaded ? (
              <Skeleton className="w-[120px] h-[45px] rounded-[10px] mt-2" />
            ) : (
              <ScrollReveal delay={0.2}>
                <Link
                  to={btn.link}
                  className="inline-flex items-center justify-center px-6 py-2 bg-transparent text-black font-primary text-[15px] font-bold border border-black/20 rounded-xl hover:bg-black hover:text-white transition-all duration-300 tracking-[0.01em] mt-2 no-underline"
                >
                  {btn.text}
                </Link>
              </ScrollReveal>
            )}
          </div>

          {/* Right: Pannable Image */}
          {!loaded ? (
            <Skeleton className="flex-1 w-full relative h-[350px] md:h-[600px] rounded-[20px]" />
          ) : (
            <ScrollReveal direction="left" delay={0.3} className="flex-1 w-full relative h-[350px] md:h-[600px]">
              <div
                ref={scrollContainerRef}
                className={`w-full relative h-[350px] md:h-[600px] overflow-hidden rounded-[20px] bg-[#EEEEEE] select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{ touchAction: "none" }}
              >
                {sideImage?.url && (
                  <div className="w-fit h-fit min-w-[150%] min-h-[150%] flex items-center justify-center p-10">
                    <img
                      src={sideImage.url}
                      alt="Framework Workflow"
                      className="max-w-none pointer-events-none rounded-xl"
                      style={{ width: "120%", height: "auto" }}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section6;
