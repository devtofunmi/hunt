import React, { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { IoIosArrowDropup } from 'react-icons/io';
import Modal from './ProductModal';
import { Product } from '@/data/mockProducts';

type ProductCardProps = {
  product: Product;
  onUpvote: (id: number) => void;
  onSave: (id: number) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpvote, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <div className="group flex hover:bg-[#262629] cursor-pointer justify-between items-center border border-[#27272a] p-4 rounded-xl hover:shadow-md transition relative">
        <div className="flex items-center gap-4" onClick={() => setIsModalOpen(true)}>
          <div>
            <img
              src={product.logo}
              alt={product.name}
              className="md:w-15 md:h-15 h-10 w-10 rounded-md object-cover"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[15px]">{product.name}</h3>
            <p className="text-[12px] text-gray-400 mt-0 md:mt-1">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal
              onUpvote(product.id);
            }}
            className="flex flex-col items-center text-gray-400 hover:text-[#6E00FF] cursor-pointer transition"
          >
            <IoIosArrowDropup size={20} />
            <span className="text-xs">{product.upvotes}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal
              onSave(product.id);
            }}
            className="text-gray-400 hover:text-[#0096FF] cursor-pointer transition"
          >
            <FiBookmark size={20} fill={product.saved ? "#0096FF" : "none"} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal product={product} onClose={handleModalClose} />
      )}
    </>
  );
};

export default ProductCard;
