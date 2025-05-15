'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBookmark } from 'react-icons/fi';
import { IoIosArrowDropup } from 'react-icons/io';
import Modal from './ProductModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onUpvote: (id: number) => void;
  onSave: (id: number) => void;
}


const ProductCard: React.FC<ProductCardProps> = ({ product, onUpvote, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(product.saved ?? false);
  const [upvotes, setUpvotes] = useState(product.upvotes ?? 0);

  const { user, accessToken } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user && !!accessToken;

  const handleModalClose = () => setIsModalOpen(false);

  const redirectToLogin = () => {
    toast.error('You must be logged in to perform this action.');
    setTimeout(() => router.push('/auth/login'), 1500);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return redirectToLogin();

    try {
      const res = await fetch(`https://launchhunt.up.railway.app/products/${product.id}/upvote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        if (data?.error === 'Already upvoted') {
          toast.info('You already upvoted this product');
        } else {
          throw new Error(data?.error || 'Failed to upvote');
        }
        return;
      }

      setUpvotes((prev) => prev + 1);
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return redirectToLogin();

    try {
      const res = await fetch(`https://launchhunt.up.railway.app/products/${product.id}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();
      setSaved(data.saved);
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  return (
    <>
      <div
        className="group w-full lg:w-[700px] flex hover:bg-[#262629] cursor-pointer justify-between items-center border border-[#27272a] p-2 md:p-4 rounded-xl hover:shadow-md transition relative"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-4">
          <img
            src={product.logo}
            alt={product.title}
            className="md:w-15 md:h-15 h-10 w-10 rounded-md object-cover"
          />
          <div>
            <h3 className="font-semibold text-[15px]">{product.title}</h3>
            <p className="text-[12px] text-gray-400 mt-0 md:mt-1">{product.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mt-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {product.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleUpvote}
            className="flex flex-col cursor-pointer  items-center text-gray-400 hover:text-[#6E00FF] transition"
          >
            <IoIosArrowDropup size={20} />
            <span className="text-xs">{upvotes}</span>
          </button>
          <button
            onClick={handleSave}
            className="text-gray-400  cursor-pointer hover:text-[#0096FF] transition"
          >
            <FiBookmark size={20} fill={saved ? '#0096FF' : 'none'} />
          </button>
        </div>
      </div>

      {isModalOpen && <Modal product={product} onClose={handleModalClose} />}
    </>
  );
};

export default ProductCard;