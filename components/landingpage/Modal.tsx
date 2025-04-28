import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
};

type Product = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  logo: string;
  upvotes: number;
  saved: boolean;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, products }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#18181b] text-white rounded-lg p-6 w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer hover:text-gray-600 text-white"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Search Products</h2>
        <input
          type="text"
          placeholder="Type to search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E00FF]"
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Scrollable container */}
        <div className="mt-4 max-h-72 overflow-y-auto">
          {searchTerm === '' ? (
            <p className="text-center text-gray-600">Type something to search...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-2 border-[#27272a] border-b">
                <img
                  src={product.logo}
                  alt={product.name}
                  className="w-8 h-8 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm md:text-md">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
