'use client';
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { Product } from '@/types';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setFilteredProducts([]);
      setSelectedProduct(null);
    }
  }, [isOpen]);

  // Search logic with debounce
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredProducts([]);
      return;
    }

    const debounce = setTimeout(() => {
      const filtered = products.filter((product) => {
        const title = product.title?.toLowerCase() ?? '';
        const description = product.shortDescription?.toLowerCase() ?? '';
        return title.includes(term) || description.includes(term);
      });

      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#18181b] text-white rounded-lg p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer hover:text-gray-400 text-white"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Search Products</h2>

        <input
          type="text"
          placeholder="Type to search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E00FF] bg-[#27272a] text-white"
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="mt-4 max-h-72 overflow-y-auto scrollbar-hide">
          {searchTerm.trim() === '' ? (
            <p className="text-center text-gray-500">Type something to search...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-2 border-[#27272a] border-b cursor-pointer hover:bg-[#2a2a2d]"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.logo}
                  alt={product.title}
                  className="w-8 h-8 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm">{product.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#18181b] text-white rounded-lg p-6 w-11/12 max-w-md relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 cursor-pointer hover:text-gray-400"
            >
              <IoClose size={24} />
            </button>

            <div className="flex flex-col items-center gap-4">
              <img
                src={selectedProduct.logo}
                alt={selectedProduct.title}
                className="w-16 h-16 rounded-md object-cover"
              />
              <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
              <p className="text-gray-400 text-center">{selectedProduct.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProduct.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                <span>🔥 {selectedProduct.upvotes}</span>
                <span>{selectedProduct.saved ? '💾 Saved' : '📦 Not Saved'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;