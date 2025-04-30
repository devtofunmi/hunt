import React, { useState } from 'react';
import Footer from '@/components/landingpage/Footer';
import Navbar from '@/components/landingpage/Navbar';
import { FiPlus } from 'react-icons/fi';
import CreateProductModal from '@/components/dashboard/CreateProductModal';

type Product = {
  id: number;
  title: string;
  logoUrl: string;
  shortDescription: string;
  fullDescription?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
};

const ProductsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mockProducts, setMockProducts] = useState<Product[]>([
    {
      id: 1,
      title: 'DevSparq',
      logoUrl: 'https://dummyimage.com/100x100/000/fff&text=DS',
      shortDescription: 'Discover indie dev tools easily',
      tags: ['react', 'design'],
      liveUrl: 'https://devsparq.netlify.app',
    },
  ]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleAddProduct = (product: Product) => {
    setMockProducts((prev) => [...prev, { ...product, id: prev.length + 1 }]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 mt-20">
        <div className="max-w-5xl mx-auto">
          {mockProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Your Products</h2>
                <button
                  onClick={toggleModal}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-[#6E00FF] to-[#0096FF] md:px-4 md:py-2 px-4 py-2 text-white">
                  <FiPlus />
                  Create New Product
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <div key={product.id} className="bg-[#1f1f1f] p-5 rounded-lg shadow">
                    <img
                      src={product.logoUrl}
                      alt={product.title}
                      className="w-12 h-12 mb-4 rounded"
                    />
                    <h3 className="text-lg font-medium mb-2">{product.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{product.shortDescription}</p>
                    {product.liveUrl && (
                      <a
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6E00FF] text-sm hover:underline"
                      >
                        Visit Site →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <h1 className="md:text-2xl text-xl font-semibold mb-4">
                🤔 You haven’t added any products yet
              </h1>
              <p className="text-gray-400 mb-6">
                Start by sharing something you built with the world.
              </p>
              <button
                onClick={toggleModal}
                className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white font-medium px-5 py-2 rounded-md transition"
              >
                <FiPlus />
                Create New Product
              </button>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && <CreateProductModal onClose={toggleModal} onAddProduct={handleAddProduct} />}
      <Footer />
    </div>
  );
};

export default ProductsPage;