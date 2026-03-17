import { useState, useRef } from "react";

interface AccordionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Accordion = ({
  title,
  icon,
  children,
  isOpen: parentIsOpen,
  onToggle,
}: AccordionProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = onToggle !== undefined ? parentIsOpen : internalIsOpen;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div
      className={`border rounded-xl transition-all duration-300 ${
        isOpen ? "bg-[#eeeeee] border-transparent" : "bg-white border-black/10"
      }`}
    >
      <button
        onClick={handleToggle}
        className="cursor-pointer w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className="size-5 lg:size-6 flex items-center justify-center shrink-0">
              <img src={icon} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          <span
            className={`text-[18px] lg:text-[21px] font-bold tracking-tight ${isOpen ? "text-black" : "text-black"}`}
          >
            {title}
          </span>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "bg-black text-white rotate-180" : "bg-black/5 text-black"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5 pt-0 text-[21px] leading-tight text-black max-w-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
