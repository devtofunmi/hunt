'use client';

import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';
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

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setFilteredProducts([]);
      setSelectedProduct(null);
    }
  }, [isOpen]);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Search Modal */}
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
                    <p className="text-sm text-gray-400 line-clamp-2">{product.shortDescription}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No products found</p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-60 overflow-y-auto">
          <div className="bg-[#18181b] text-white p-6 rounded-lg w-11/12 max-w-xl relative shadow-xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 cursor-pointer hover:text-gray-400"
            >
              <IoClose size={24} />
            </button>

            <div className="flex flex-col gap-4">
              {/* Product Header */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.logo}
                  alt={selectedProduct.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                  <p className="text-sm text-gray-400">
                    Published on {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>
              </div>

              {/* Product Description */}
              <p className="text-gray-300">{selectedProduct.fullDescription}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProduct.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 mt-4">
                {selectedProduct.link && (
                  <a
                    href={selectedProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
                  >
                    <FiExternalLink /> Live Site
                  </a>
                )}
                {selectedProduct.githubUrl && (
                  <a
                    href={selectedProduct.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4 text-sm text-gray-400">
                <span>🔥 {selectedProduct.upvotes} upvotes</span>
                <span>{selectedProduct.saved ? '💾 Saved' : '📦 Not Saved'}</span>
              </div>

              {/* Divider */}
              <hr className="border-gray-700 my-4" />

              {/* User Info */}
              {selectedProduct.user && (
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProduct.user.image}
                    alt={selectedProduct.user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="font-semibold">{selectedProduct.user.username}</h3>
                      <p className="text-sm text-gray-400">{selectedProduct.user.bio}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {selectedProduct.user.twitter && (
                        <a
                          href={selectedProduct.user.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter"
                        >
                          <FaXTwitter size={15} className="text-blue-400" />
                        </a>
                      )}
                      {selectedProduct.user.github && (
                        <a
                          href={selectedProduct.user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <FaGithub size={15} className="text-blue-400" />
                        </a>
                      )}
                      {selectedProduct.user.linkedin && (
                        <a
                          href={selectedProduct.user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin size={15} className="text-blue-400" />
                        </a>
                      )}
                      {selectedProduct.user.bluesky && (
                        <a
                          href={selectedProduct.user.bluesky}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Bluesky"
                        >
                          <SiBluesky size={15} className="text-blue-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;