import { useRef, useEffect } from "react";

interface PannableImageProps {
  src: string;
  alt?: string;
  panPosition?: number;
  className?: string;
}

const PannableImage = ({
  src,
  alt,
  panPosition = 0,
  className = "",
}: PannableImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && src) {
      const container = containerRef.current;

      const timer = setTimeout(() => {
        const maxScrollTop = container.scrollHeight - container.clientHeight;
        container.scrollTop = maxScrollTop * (panPosition / 100);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [src, panPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide ${className}`}
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE/Edge */,
      }}
    >
      {/* Hide scrollbar for Chrome/Safari/Webkit */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="w-full h-fit flex flex-col items-center">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-w-none rounded-xl"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default PannableImage;
