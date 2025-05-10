'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaRocket, FaDesktop, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'Weak' | 'Medium' | 'Strong' | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const evaluatePasswordStrength = (pwd: string): 'Weak' | 'Medium' | 'Strong' | '' => {
    if (!pwd) return '';
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

    if (pwd.length >= 10 && hasLower && hasUpper && hasNumber && hasSymbol) return 'Strong';
    if (pwd.length >= 6 && ((hasLower && hasUpper) || (hasNumber && hasSymbol))) return 'Medium';
    return 'Weak';
  };

  useEffect(() => {
    const strength = evaluatePasswordStrength(password);
    setPasswordStrength(strength);

    if (password) {
      toast.dismiss('strength');
      toast.info(`Password Strength: ${strength}`, {
        toastId: 'strength',
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  }, [password]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (passwordStrength === 'Weak') {
      toast.error('Password too weak. Please use a stronger password.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('https://hunt.up.railway.app/auth/signup', {
        username,
        email,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success('Signup successful! Redirecting...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }catch (err: any) {
      console.error(err.response || err);
      toast.error('Something went wrong on the server. Please try again later.');
    }
    
     finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Header */}
      <div className="bg-white/10 md:bg-transparent text-xl backdrop-blur-md md:backdrop-blur-0 border-b border-white/20 md:border-none py-4 px-6 shadow-md w-full fixed top-0 left-0 z-50">
        <Link href="/">LaunchHunt</Link>
      </div>

      {/* Left (Form) */}
      <div className="w-full md:w-3/5 bg-[#171717] text-white flex flex-col px-5 md:px-20 py-20">
        <h1 className="text-3xl font-semibold mt-10">Welcome</h1>
        <p className="mt-5 text-gray-400">
          Find inspiration. Build better. <br /> Join LaunchHunt today.
        </p>

        <form onSubmit={handleSignup} className="space-y-5 w-full max-w-md mt-10">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-white rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E00FF] transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            disabled={loading}
            className={`w-full cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] py-3 rounded-xl font-semibold transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-sm text-gray-400">
          Already have an account?
          <Link href="/auth/login" className="text-[#6E00FF] ml-1 hover:underline transition">
            Login
          </Link>
        </p>
      </div>

      {/* Right (Benefits) */}
      <div className="flex w-full md:w-2/5 flex-col bg-[#262629] text-white px-5 md:px-10 py-20">
        <h2 className="text-3xl font-bold md:mt-5 mb-4">Welcome to LaunchHunt</h2>
        <p className="text-gray-300 mb-8">
          LaunchHunt empowers indie developers by providing a platform to discover
          project inspirations, explore UI designs, and generate custom SVG backgrounds.
        </p>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <FaRocket className="text-[#6E00FF] text-xl" />
            <span className="text-gray-300">Discover Projects Aligned with Your Vision</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaDesktop className="text-[#6E00FF] text-xl" />
            <span className="text-gray-300">Explore High-Quality UI Designs</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCog className="text-[#6E00FF] text-xl" />
            <span className="text-gray-300">Generate Custom SVG Backgrounds</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;