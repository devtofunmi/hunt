'use client';
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import LoadingSpinner from './LoadingSpinner';

interface ProductListProps {
  products: Product[];
  visibleCount: number;
  onUpvote: (id: number) => void;
  onSave: (id: number) => void;
  onSeeMore: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  visibleCount,
  onUpvote,
  onSave,
  onSeeMore,
}) => {
  return (
    <div className="space-y-4">
      {products.length === 0 ? (
        <div className="flex justify-center items-center w-full lg:w-[700px] h-40">
          <LoadingSpinner />
        </div>
      ) : (
        products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} onUpvote={onUpvote} onSave={onSave} />
        ))
      )}

      {products.length > visibleCount && (
        <div className="text-center mt-4">
          <button
            onClick={onSeeMore}
            className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] px-6 py-2 cursor-pointer rounded-full text-white"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
