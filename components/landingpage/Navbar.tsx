"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiBox, FiChevronDown, FiChevronUp, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BiMenu } from "react-icons/bi";


// Mock user data
const user = {
  isLoggedIn: false,
  name: "John Doe",
  image: "https://i.pravatar.cc/150?img=3",
};

const UserDropdown = ({ dropdownOpen, toggleDropdown }: {
  dropdownOpen: boolean;
  toggleDropdown: () => void;
}) => (
  <div className="relative">
    <button className="flex cursor-pointer items-center gap-2 text-white" onClick={toggleDropdown}>
      <Image
        src={user.image}
        alt="User"
        width={32}
        height={32}
        className="rounded-full"
      />
      <span>{user.name.split(" ")[0]}</span>
      {dropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
    </button>

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-[#2f2f2f] text-white rounded-lg shadow-md overflow-hidden z-50">
        <Link href="/profile" className="flex items-center px-4 py-2 hover:bg-[#171717] text-sm text-white">
          <FiUser className="mr-2" /> Profile
        </Link>
        <Link href="/settings" className="flex items-center px-4 py-2 hover:bg-[#171717] text-sm text-white">
          <FiSettings className="mr-2" /> Settings
        </Link>
        <Link href="/products" className="flex items-center px-4 py-2 hover:bg-[#171717] text-sm text-white">
          <FiBox className="mr-2" /> Products
        </Link>
        <button
          onClick={() => alert("Logged out")}
          className="flex items-center px-4 py-2 w-full text-left hover:bg-red-500 cursor-pointer text-sm text-white"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    )}
  </div>
);

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 py-4 px-6 shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
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

          {user.isLoggedIn ? (
            <UserDropdown dropdownOpen={dropdownOpen} toggleDropdown={toggleDropdown} />
          ) : (
            <li>
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white px-5 py-2 rounded-md hover:opacity-90 transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Right Side */}
        <div className="flex items-center gap-3 md:hidden">
          {user.isLoggedIn && (
            <UserDropdown dropdownOpen={dropdownOpen} toggleDropdown={toggleDropdown} />
          )}
          <button className="text-white cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <IoMdClose size={28} /> : <BiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
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
          {!user.isLoggedIn && (
            <Link
              href="/auth/login"
              className="block py-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-center rounded-md text-white hover:opacity-90 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

