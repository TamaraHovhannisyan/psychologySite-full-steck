"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { id: "articles", label: "Հոդվածներ" },
  { id: "self-growth", label: "Ինքնազարգացում" },
  { id: "psychology", label: "Հոգեբանություն" },
  { id: "contact", label: "Կոնտակտ" },
];

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-[#F7F8F9]  px-10  flex justify-between items-center h-14 relative z-50">
      <div className=" ">
        <Image
          src="/logo.png"
          alt="Logo"
          width={70}
          height={70}
          className="inline-block"
        />
      </div>

      {!isMobile && (
        <ul className="flex gap-6 font-medium text-[#404040]">
          {navLinks.map((link) => (
            <li key={link.id} className="hover:text-[#017187] cursor-pointer">
              {link.label}
            </li>
          ))}
        </ul>
      )}

      {isMobile && (
        <button onClick={toggleMenu} className="p-2 z-50">
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      )}

      {isMobile && isMenuOpen && (
        <ul className="absolute top-16 right-4 w-full bg-white  rounded-xl  py-2 text-left px-5">
          {navLinks.map((link) => (
            <li
              key={link.id}
              onClick={toggleMenu}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-[#404040] font-medium "
            >
              {link.label}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
