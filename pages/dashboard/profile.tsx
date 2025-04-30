import React, { useState } from 'react';
import Image from 'next/image';
import { FiSettings } from 'react-icons/fi';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import { Product } from '@/data/mockProducts';
import ProductCard from '@/components/landingpage/ProductCard';
import Link from 'next/link';

interface User {
  isLoggedIn: boolean;
  name: string;
  image: string;
}

const Profile: React.FC = () => {
  const user: User = {
    isLoggedIn: true,
    name: 'John Doe',
    image: 'https://i.pravatar.cc/150?img=3',
  };

  const [upvotedProducts, setUpvotedProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Completely AI Agent',
      description: 'Instantly find, analyze, and track your competitors with AI.',
      tags: ['Marketing', 'AI', 'Business Intelligence'],
      logo: 'https://logo.clearbit.com/openai.com',
      upvotes: 2,
      saved: false,
    },
    {
      id: 2,
      name: 'Hirenga',
      description: 'Tired of messy hiring? Let AI organize it for you.',
      tags: ['Hiring', 'Productivity', 'AI'],
      logo: 'https://logo.clearbit.com/lever.co',
      upvotes: 1,
      saved: false,
    },
    {
      id: 3,
      name: 'Notclass',
      description: 'Turn YouTube videos into Courses with AI.',
      tags: ['Education', 'YouTube', 'Online Learning'],
      logo: 'https://logo.clearbit.com/udemy.com',
      upvotes: 1,
      saved: false,
    },
  ]);

  const handleUpvote = (id: number) => {
    setUpvotedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, upvotes: product.upvotes + 1 } : product
      )
    );
  };

  const handleSave = (id: number) => {
    setUpvotedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, saved: !product.saved } : product
      )
    );
  };

  return (
    <div>
      <Navbar />

      <div className="mt-24 flex flex-col items-center px-4 sm:px-6 md:px-8">
        {/* Profile Banner */}
        <div className="relative w-full max-w-3xl md:h-[180px] h-[150px] rounded-3xl border border-white/20 bg-[#27272a]">
          <div className="absolute top-[100px] md:top-[120px] left-4 sm:left-10">
            <Image
              src={user.image}
              alt="User"
              width={100}
              height={100}
              className="rounded-full border-2 border-white/20"
            />
          </div>
        </div>

        {/* Name and Settings */}
        <div className="flex items-center  justify-between w-full max-w-3xl mt-24 gap-4">
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <Link href="/dashboard/settings">
            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-[#6E00FF] to-[#0096FF] md:px-4 md:py-2 px-4 py-2 text-white">
              <FiSettings />
              Edit your profile
            </button>
          </Link>
        </div>

        {/* Recently Upvoted */}
        <div className="w-full max-w-3xl mt-16">
          <h2 className="text-lg font-medium mb-6 text-left">Recently upvoted products</h2>
          <div className="flex flex-col gap-4">
            {upvotedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpvote={handleUpvote}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;



