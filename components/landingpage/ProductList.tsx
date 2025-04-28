import React from 'react';
import ProductCard from './ProductCard';

type Product = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  logo: string;
  upvotes: number;
  saved: boolean;
};

type ProductListProps = {
  products: Product[];
  visibleCount: number;
  onUpvote: (id: number) => void;
  onSave: (id: number) => void;
  onSeeMore: () => void;
};

const ProductList: React.FC<ProductListProps> = ({ products, visibleCount, onUpvote, onSave, onSeeMore }) => {
  return (
    <div className="md:col-span-2 md:mt-20">
      <h2 className="text-2xl font-bold mb-6 leading[30px]">Find what others built. Create<br /> something better.</h2>
      <div className="flex flex-col gap-6">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} onUpvote={onUpvote} onSave={onSave} />
        ))}
      </div>
      {visibleCount < products.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onSeeMore}
            className="px-6 py-2 w-full cursor-pointer rounded-md text-white bg-gradient-to-r from-[#6E00FF] to-[#0096FF] hover:opacity-90 transition"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
