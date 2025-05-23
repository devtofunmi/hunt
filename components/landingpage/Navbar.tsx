'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiSettings,
  FiUser,
  FiPlus,
} from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { BiMenu } from 'react-icons/bi';
import { useAuth } from '@/context/AuthContext';
import { CiCirclePlus } from 'react-icons/ci';
import { FaCirclePlus } from 'react-icons/fa6';

const DEFAULT_IMAGE = 'https://pin.it/6DztDvLU0';

interface UserDropdownProps {
  dropdownOpen: boolean;
  toggleDropdown: () => void;
  onLogout: () => void;
  loading: boolean;
}

const SkeletonAvatar = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gray-500/50 rounded-full animate-pulse" />
    <div className="w-16 h-4 bg-gray-500/50 rounded-md animate-pulse" />
  </div>
);

const UserDropdown: React.FC<UserDropdownProps> = ({
  dropdownOpen,
  toggleDropdown,
  onLogout,
  loading,
}) => {
  const { user } = useAuth();

  if (loading) return <SkeletonAvatar />;

  return (
    <div className="relative flex items-center gap-3">
      <Link
        href="/dashboard/createproduct"
        className="flex items-center gap-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white px-3 py-1 rounded-full hover:opacity-90 transition"
      >
        <FaCirclePlus size={16} /> Submit
      </Link>

      <button className="flex items-center cursor-pointer" onClick={toggleDropdown}>
        <img
          src={user?.image || DEFAULT_IMAGE}
          alt="User"
          className="rounded-full w-10 h-10 object-cover"
        />
        {dropdownOpen ? (
          <FiChevronUp size={16} className="ml-1 text-white" />
        ) : (
          <FiChevronDown size={16} className="ml-1 text-white" />
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-12 w-42 bg-[#2f2f2f] text-white rounded-xl shadow-md overflow-hidden z-50">
          <div className="flex flex-col justify-center p-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 rounded-md hover:bg-[#424242] text-sm"
            >
              <FiUser className="mr-2" /> Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-2 rounded-md hover:bg-[#424242] text-sm"
            >
              <FiSettings className="mr-2" /> Settings
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center px-4 py-2 rounded-md hover:bg-[#424242] text-sm"
            >
              <FiBox className="mr-2" /> My Products
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-left rounded-md hover:bg-[#424242] hover:text-red-400 text-sm"
            >
              <FiLogOut className="mr-2 text-red-400" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 py-4 px-3 md:px-6 shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between text-center items-center">
        {/* Logo */}
        <div
          className="md:text-xl text-lg font-bold text-white text-center cursor-pointer"
          onClick={() => router.push('/')}
        >
          LaunchHunt
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 items-center">
          <li>
            <a
              href="#what"
              className="text-white hover:text-[#0096FF] transition"
            >
              What is LaunchHunt?
            </a>
          </li>
          <li>
            <a
              href="#features"
              className="text-white hover:text-[#0096FF] transition"
            >
              Features
            </a>
          </li>
          {isLoggedIn || loading ? (
            <UserDropdown
              dropdownOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
              onLogout={logout}
              loading={loading}
            />
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
          {(isLoggedIn || loading) && (
            <UserDropdown
              dropdownOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
              onLogout={logout}
              loading={loading}
            />
          )}
          <button
            className="text-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
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
          {!isLoggedIn && !loading && (
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
};

export default Navbar;