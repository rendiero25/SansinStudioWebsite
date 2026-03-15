import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSection } from "../../services/sectionApi";

interface HeaderData {
  logo?: { url: string; publicId: string };
  ctaButton?: { text: string; link: string };
}

const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Works", href: "/works" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  { label: "Company", href: "/company" },
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
      className={`fixed top-0 inset-x-0 z-1000 transition-all duration-300 ease ${
        scrolled
          ? "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          : "bg-white"
      }`}
    >
      {/* Main Header Container */}
      <div className="w-full">
        <div className="container mx-auto flex items-center justify-between h-[70px] px-10 md:px-12 xl:px-20">
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center no-underline">
            {data.logo?.url ? (
              <img
                src={data.logo.url}
                alt="Sanxin Studio"
                className="h-[35px] w-auto object-cover"
              />
            ) : (
              ""
            )}
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-15 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-black hover:font-black no-underline text-[17px] font-medium font-primary transition-colors tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block shrink-0">
            <Link
              to={ctaButton.link}
              className="inline-flex items-center justify-center px-6 py-2 bg-black hover:bg-[#333] text-white no-underline text-[15px] font-medium font-primary rounded-xl transition-all hover:-translate-y-[px] tracking-tight"
            >
              {ctaButton.text}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[2px] bg-black rounded-sm transition-transform duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-black rounded-sm transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-black rounded-sm transition-transform duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-1100 bg-white flex-col transition-all duration-400 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        } flex`}
      >
        {/* Top bar inside mobile menu (Logo + Close X) */}
        <div className="w-full flex items-center justify-between h-[75px] px-5 border-b border-black/5">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 flex items-center no-underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            {data.logo?.url ? (
              <img
                src={data.logo.url}
                alt="Sanxin Studio"
                className="h-[35px] w-auto object-contain"
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
          </Link>

          {/* Close Menu Button (X) */}
          <button
            className="bg-transparent border-none cursor-pointer p-2 -mr-2 flex items-center justify-center text-black"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[#4D4D4D] hover:text-black no-underline text-[22px] font-medium font-primary transition-colors tracking-tight"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact Button at the bottom */}
        <div className="px-6 pb-12 w-full max-w-[400px] mx-auto">
          <Link
            to={ctaButton.link}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-full px-8 py-4 bg-[#0a0a0a] text-white no-underline text-[17px] font-medium font-primary rounded-xl transition-all"
          >
            {ctaButton.text}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
