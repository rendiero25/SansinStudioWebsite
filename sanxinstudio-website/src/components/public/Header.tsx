import { useState, useEffect } from "react";
import { getSection } from "../../services/sectionApi";

interface HeaderData {
  logo?: { url: string; publicId: string };
  ctaButton?: { text: string; link: string };
}

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Works", href: "#works" },
  { label: "Projects", href: "#projects" },
  { label: "Insights", href: "#insights" },
  { label: "Company", href: "#company" },
];

const Header = () => {
  const [data, setData] = useState<HeaderData>({});
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const section = await getSection("home", "header");
        setData(section.content || {});
      } catch (err) {
        console.error("Failed to load header:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ctaButton = data.ctaButton || { text: "Contact us", link: "/contact" };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[1000] transition-all duration-300 ease bg-white ${scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]" : ""}`}
    >
      {/* Main Header Container */}
      <div className="w-full px-6 max-md:px-4">
        <div className="container mx-auto flex items-center justify-between h-[52px]">
          {/* Logo */}
          <a href="/" className="flex-shrink-0 flex items-center no-underline">
            {data.logo?.url ? (
              <img
                src={data.logo.url}
                alt="Sanxin Studio"
                className="h-[26px] w-auto object-contain"
              />
            ) : (
              <svg
                className="w-8 h-8"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 4L32 12V28L20 36L8 28V12L20 4Z" fill="#1a1a1a" />
                <path d="M20 10L27 15V25L20 30L13 25V15L20 10Z" fill="#fff" />
              </svg>
            )}
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#1a1a1a]/70 hover:text-[#1a1a1a] no-underline text-[13px] font-normal font-primary transition-colors tracking-tight"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block flex-shrink-0">
            <a
              href={ctaButton.link}
              className="inline-flex items-center justify-center px-5 py-2 bg-[#1a1a1a] hover:bg-[#333] text-white no-underline text-[12.5px] font-medium font-primary rounded-full transition-all hover:-translate-y-[1px] tracking-tight"
            >
              {ctaButton.text}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[2px] bg-[#1a1a1a] rounded-sm transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-[#1a1a1a] rounded-sm transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-[#1a1a1a] rounded-sm transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden flex-col w-full bg-white px-6 py-3 pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
          mobileMenuOpen ? "flex" : "hidden"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[#1a1a1a]/70 hover:text-[#1a1a1a] no-underline text-[14px] font-primary py-3 border-b border-black/5 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href={ctaButton.link}
          className="inline-flex items-center justify-center w-full mt-3 px-5 py-3 bg-[#1a1a1a] hover:bg-[#333] text-white no-underline text-[12.5px] font-medium font-primary rounded-full transition-all tracking-tight"
        >
          {ctaButton.text}
        </a>
      </div>
    </header>
  );
};

export default Header;
