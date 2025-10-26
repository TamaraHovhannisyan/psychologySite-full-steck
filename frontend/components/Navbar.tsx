"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { id: "articles", label: "Articles" },
  { id: "self-growth", label: "Self-Growth" },
  { id: "psychology", label: "Psychology" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavClick = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        const offset = -80;
        const top =
          element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6 md:px-10 h-16">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="select-none"
          />
          <span className="text-[#017187] font-semibold text-lg hidden sm:block">
            PsychologySite
          </span>
        </div>

        {!isMobile && (
          <ul className="flex gap-8 font-medium text-[#404040]">
            {navLinks.map((link) => (
              <li
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="hover:text-[#017187] cursor-pointer transition-colors duration-200"
              >
                {link.label}
              </li>
            ))}
          </ul>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#404040]"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {isMobile && (
        <div
          className={`absolute top-16 left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-60 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col px-6 py-3">
            {navLinks.map((link) => (
              <li
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="py-2 text-[#404040] font-medium hover:text-[#017187] cursor-pointer transition-colors duration-200"
              >
                {link.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
