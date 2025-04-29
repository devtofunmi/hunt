import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaRocket, FaDesktop, FaCog } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API call
    if (username === 'admin' && password === 'password') {
      // Redirect to dashboard or homepage on successful login
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Logo */}
      <div className="bg-white/10 md:bg-transparent text-xl backdrop-blur-md md:backdrop-blur-0 border-b border-white/20 md:border-none py-4 px-6 shadow-md w-full fixed top-0 left-0 z-50">
        <Link href="/"> LaunchHunt</Link>         
        </div>
      {/* Left side (form) */}
      <div className="w-full md:w-3/5 bg-[#171717] text-white flex flex-col justify items-left px-5 md:px-20 py-20">
        <h1 className="text-3xl font-semibold mt-10">Welcome back!</h1>

        <p className="mt-5 text-gray-400">Log in to explore real-world projects</p>

        <form onSubmit={handleLogin} className="space-y-5 w-full max-w-md mt-10">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF] transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 animate-fade-in">
          Don't have an account?
          <Link href="/auth/signup" className="text-[#6E00FF] cursor-pointer hover:underline ml-1 transition">

          <button className="text-white cursor-pointer hover:underline ml-1 transition">Sign Up</button>
          </Link>
        </p>
      </div>

      {/* Right side (info) */}
      <div className="flex w-full md:w-2/5 flex-col bg-[#262629] text-white md:px-10 px-5 py-20">
        <h2 className="text-3xl font-bold md:mt-5 mt-0 mb-4">Welcome to LaunchHunt</h2>
        <p className="text-gray-300 mb-8">
        LaunchHunt empowers indie developers by providing a comprehensive platform to discover
         innovative project inspirations, explore refined UI designs, and easily generate custom SVG backgrounds. Unlock creativity, enhance your projects, and fuel your next breakthrough idea with LaunchHunt.
        </p>
              <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <FaRocket className="text-[#6E00FF] text-xl" />
            <span className=" text-gray-300">Discover Projects Aligned with Your Vision</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaDesktop className="text-[#6E00FF] text-xl" />
            <span className=" text-gray-300">Explore High-Quality UI Designs from Industry Leaders</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCog className="text-[#6E00FF] text-xl" />
            <span className=" text-gray-300">Effortlessly Generate Custom SVG Backgrounds</span>
          </div>
        </div>

      </div>
    </main>
  );
};

export default LoginPage;

