"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 py-4 px-6 shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-white cursor-pointer" onClick={() => router.push("/")}>
          LaunchHunt
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 items-center">
          <li>
            <a href="#what" className="text-white hover:text-[#0096FF] transition">
              What is LaunchHunt?
            </a>
          </li>
          <li>
            <a href="#features" className="text-white hover:text-[#0096FF] transition">
              Features
            </a>
          </li>
          <li>
            <a
              href=""
              className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white px-5 py-2 rounded-md hover:opacity-90 transition"
            >
              Login
            </a>
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden cursor-pointer text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoMdClose size={28} /> : <BiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 space-y-4">
          <a
            href="#what"
            className="block py-2 text-white hover:text-[#0096FF] transition"
            onClick={() => setIsOpen(false)}
          >
            What is LaunchHunt?
          </a>
          <a
            href="#features"
            className="block py-2 text-white hover:text-[#0096FF] transition"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href=""
            className="block py-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-center rounded-md text-white hover:opacity-90 transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
}

