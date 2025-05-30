'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBookmark } from 'react-icons/fi';
import { IoIosArrowDropup } from 'react-icons/io';
import Modal from './ProductModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Product } from '@/types';
// import Image from 'next/image'; // Uncomment if switching to next/image

interface ProductCardProps {
  product: Product;
  onUpvote: (id: number) => void;
  onSave: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpvote, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState<boolean | null>(null);
  const [upvotes, setUpvotes] = useState(product.upvotes ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const { user, accessToken } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user && !!accessToken;

  const handleModalClose = () => setIsModalOpen(false);

  const redirectToLogin = () => {
    toast.error('You must be logged in to perform this action.');
    setTimeout(() => router.push('/auth/login'), 1500);
  };

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!isLoggedIn) return;

      try {
        const res = await fetch(`https://launchhunt.up.railway.app/products/${product.id}/saved`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSaved(data.saved);
        }
      } catch (err) {
        console.error('Error checking saved status', err);
      }
    };

    checkSavedStatus();
  }, [accessToken, isLoggedIn, product.id]);

   const handleUpvote = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!isLoggedIn) return redirectToLogin();

  if (isUpvoting) return;
  setIsUpvoting(true);

  try {
    const res = await fetch(`https://launchhunt.up.railway.app/products/${product.id}/upvote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      if (text.includes('Already upvoted')) {
        toast.info('You already upvoted this product');
      } else {
        throw new Error(text || 'Failed to upvote');
      }
      return;
    }

    setUpvotes((prev) => prev + 1);
  } catch (err: any) {
    toast.error(err.message || 'Failed to upvote');
  } finally {
    setIsUpvoting(false);
  }
};


  const handleSave = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!isLoggedIn) return redirectToLogin();

  if (isSaving) return;

  const prevSaved = saved;
  setSaved(!prevSaved); // optimistic UI
  setIsSaving(true);

  try {
    const res = await fetch(`https://launchhunt.up.railway.app/products/${product.id}/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      setSaved(prevSaved); // revert UI
      const text = await res.text(); // try reading plain text
      throw new Error(text || 'Failed to toggle save');
    }

    const data = await res.json();
    setSaved(data.saved);
  } catch (err: any) {
    setSaved(prevSaved); // revert UI
    toast.error(err.message || 'Failed to save product');
  } finally {
    setIsSaving(false);
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
              {product.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            aria-label="Upvote product"
            onClick={handleUpvote}
            className="flex flex-col cursor-pointer items-center text-gray-400 hover:text-[#6E00FF] transition disabled:opacity-50"
            disabled={isUpvoting}
          >
            <IoIosArrowDropup size={20} />
            <span className="text-xs">{upvotes}</span>
          </button>

          {/* {saved !== null && ( */}
            <button
              aria-label="Save product"
              onClick={handleSave}
              disabled={isSaving}
              className="text-gray-400 cursor-pointer hover:text-[#0096FF] transition disabled:opacity-50"
            >
              <FiBookmark size={20} fill={saved ? '#0096FF' : 'none'} />
            </button>
          {/* )} */}
        </div>
      </div>

      {isModalOpen && <Modal product={product} onClose={handleModalClose} />}
    </>
  );
};

export default ProductCard;