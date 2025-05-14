'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';

type Product = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  logo: string;
  upvotes: number;
  saved?: boolean;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-[#18181b] text-white p-6 rounded-lg w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:text-gray-400"
        >
          <FiX size={24} />
        </button>
        <div className="flex flex-col items-center gap-4">
          <img
            src={product.logo}
            alt={product.name}
            className="w-16 h-16 rounded-md object-cover"
          />
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-400 text-center">{product.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <span>🔥 {product.upvotes}</span>
            <span>{product.saved ?? false ? '💾 Saved' : '📦 Not Saved'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

