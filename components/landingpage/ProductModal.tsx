// src/components/Modal.tsx
import { Product } from '@/data/mockProducts';
import React from 'react';
import { FiX } from 'react-icons/fi';


type ModalProps = {
  product: Product | null;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 bg-opacity-50 z-50">
      <div className="bg-[#18181b] text-white p-6 rounded-lg w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer hover:text-gray-600 top-4 right-4 "
        >
          <FiX size={20} />
        </button>
        <div className="flex items-center gap-4">
          <img
            src={product.logo}
            alt={product.name}
            className="h-16 w-16 rounded-md object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
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
      </div>
    </div>
  );
};

export default Modal;
