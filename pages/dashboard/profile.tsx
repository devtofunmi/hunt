'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSettings } from 'react-icons/fi';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import ProductCard from '@/components/landingpage/ProductCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SiBluesky } from 'react-icons/si';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Product } from '@/types';
import LoadingSpinner from '@/components/landingpage/LoadingSpinner';

const Profile: React.FC = () => {
  const { user, loading, accessToken } = useAuth();
  const router = useRouter();
  const [upvotedProducts, setUpvotedProducts] = useState<Product[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [showUpvoted, setShowUpvoted] = useState(true);
  const [showSaved, setShowSaved] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
  if (!user?.id || !accessToken) return;

  const fetchData = async () => {
    try {
      const [upvotedRes, savedRes] = await Promise.all([
        fetch(`https://launchhunt.up.railway.app/products/upvoted`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        fetch(`https://launchhunt.up.railway.app/products/saved`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      if (!upvotedRes.ok || !savedRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const upvotedData = await upvotedRes.json();
      const savedData = await savedRes.json();

      setUpvotedProducts(upvotedData as Product[]);
      setSavedProducts(savedData as Product[]);
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  fetchData();
}, [user?.id, accessToken]);


  const handleUpvote = (id: string) => {
    setUpvotedProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, upvotes: product.upvotes + 1 } : product
      )
    );
  };

  const handleSave = (id: string) => {
    const toggleSave = (products: Product[]) =>
      products.map(product =>
        product.id === id ? { ...product, saved: !product.saved } : product
      );

    setUpvotedProducts(prev => toggleSave(prev));
    setSavedProducts(prev => {
      const isAlreadySaved = prev.some(product => product.id === id);
      const toggledProduct = upvotedProducts.find(p => p.id === id);
      if (!toggledProduct) return prev;
      return isAlreadySaved
        ? prev.filter(product => product.id !== id)
        : [...prev, { ...toggledProduct, saved: true }];
    });
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
            <LoadingSpinner />
          </div>;
  }

  return (
    <div>
      <Navbar />

      <div className="mt-24 flex flex-col items-center px-4 sm:px-6 md:px-8">
        <div className="relative w-full max-w-3xl md:h-[180px] h-[150px] rounded-3xl border border-white/20 bg-[#27272a]">
          <div className="absolute top-[100px] md:top-[120px] left-4 sm:left-10">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-22 h-22 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <span className="text-sm text-gray-400">Profile</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-3xl mt-24 gap-4">
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <Link href="/dashboard/settings">
            <button className="flex items-center cursor-pointer gap-2 rounded-md bg-gradient-to-r from-[#6E00FF] to-[#0096FF] px-2 md:px-4 py-2 text-white">
              <FiSettings />
              Edit your profile
            </button>
          </Link>
        </div>

        <div className="w-full max-w-3xl mt-8">
          <p className="text-md text-gray-400">{user.username || 'No username'}</p>
          <p className="text-md text-gray-400 mt-2">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {user.twitter && <a href={user.twitter}><FaXTwitter size={25} className="text-blue-400" /></a>}
            {user.github && <a href={user.github}><FaGithub size={25} className="text-blue-400" /></a>}
            {user.linkedin && <a href={user.linkedin}><FaLinkedin size={25} className="text-blue-400" /></a>}
            {user.bluesky && <a href={user.bluesky}><SiBluesky size={25} className="text-blue-400" /></a>}
          </div>
        </div>

        <div className="w-full max-w-3xl mt-16">
          <div
            className="flex justify-between items-center cursor-pointer mb-6"
            onClick={() => setShowUpvoted(!showUpvoted)}
          >
            <h2 className="text-lg font-medium">Recently upvoted products</h2>
            <span className="text-sm text-blue-400">
              {showUpvoted ? 'Hide' : 'Show'}
            </span>
          </div>

          {showUpvoted && (
            <div className="flex flex-col gap-4">
              {upvotedProducts.length > 0 ? (
                upvotedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onUpvote={() => handleUpvote(product.id)}
                    onSave={() => handleSave(product.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">No upvoted products yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full max-w-3xl mt-16">
          <div
            className="flex justify-between items-center cursor-pointer mb-6"
            onClick={() => setShowSaved(!showSaved)}
          >
            <h2 className="text-lg font-medium">Saved products</h2>
            <span className="text-sm text-blue-400">
              {showSaved ? 'Hide' : 'Show'}
            </span>
          </div>

          {showSaved && (
            <div className="flex flex-col gap-4">
              {savedProducts.length > 0 ? (
                savedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onUpvote={() => handleUpvote(product.id)}
                    onSave={() => handleSave(product.id)}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400">No saved products yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;