import { useState, useRef, useEffect } from "react";

interface PannableImageProps {
  src: string;
  alt?: string;
  panPosition?: number;
  className?: string;
}

const PannableImage = ({ src, alt, panPosition = 50, className = "" }: PannableImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (containerRef.current && src) {
      const container = containerRef.current;
      
      const timer = setTimeout(() => {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        container.scrollLeft = maxScrollLeft * (panPosition / 100);
        container.scrollTop = maxScrollTop / 2;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [src, panPosition]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className="w-fit h-fit min-w-[150%] min-h-[150%] flex items-center justify-center p-10 md:p-20">
        <img
          src={src}
          alt={alt}
          className="max-w-none pointer-events-none rounded-xl"
          style={{ width: "125%", height: "auto" }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default PannableImage;
