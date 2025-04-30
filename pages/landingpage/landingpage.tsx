import React, { useState } from 'react';
import Footer from '@/components/landingpage/Footer';
import Modal from '@/components/landingpage/Modal';
import Navbar from '@/components/landingpage/Navbar';
import ProductList from '@/components/landingpage/ProductList';
import Sidebar from '@/components/landingpage/Sidebar';
import SVGGeneratorModal from '@/components/landingpage/SVGGeneratorModal';
import { mockProducts } from '@/data/mockProducts';

type Product = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  logo: string;
  upvotes: number;
  saved: boolean;
};

const LandingPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSVGModalOpen, setIsSVGModalOpen] = useState<boolean>(false);

  const handleSeeMore = (): void => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleUpvote = (id: number): void => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, upvotes: product.upvotes + 1 }
          : product
      )
    );
  };

  const handleSave = (id: number): void => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, saved: !product.saved } : product
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#171717] text-white relative">
      <Navbar />

      {/* Mobile Search Input */}
      <div className="w-full pt-[100px] p-6 md:hidden">
        <input
          type="text"
          placeholder="Search a product"
          className="w-full px-4 py-2 border rounded-full border-[#27272a] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          readOnly
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
      />

      {/* Main Section */}
      <section className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductList
          products={products}
          visibleCount={visibleCount}
          onUpvote={handleUpvote}
          onSave={handleSave}
          onSeeMore={handleSeeMore}
        />
        <Sidebar onOpenModal={() => setIsModalOpen(true)} />
      </section>

      {/* What is LaunchHunt */}
      <section id="what" className="py-24 w-full text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What is LaunchHunt?</h2>
          <p className="text-lg md:text-xl text-gray-300">
            Launch Hunt is a platform designed to empower indie developers by helping them discover real-world projects
            similar to the ones they are building. By providing access to a curated collection of successful indie products,
            Launch Hunt enables developers to gain practical insights, learn from proven design patterns, and uncover new
            opportunities for innovation. Whether you're validating an idea, refining your user experience, or simply seeking
            creative inspiration, Launch Hunt helps you move beyond guesswork — allowing you to build, launch, and grow better
            products with greater speed and confidence.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Find Similar Projects',
                description:
                  'Discover indie projects close to your idea and learn how others launched, designed, and structured them.',
              },
              {
                title: 'UI Inspiration Library',
                description:
                  'Browse beautiful UI layouts and real product screenshots to fuel your design and UX decisions.',
              },
              {
                title: 'SVG Background Generator',
                description:
                  'Instantly generate custom SVG backgrounds to make your landing pages and apps stand out.',
              },
            ].map(({ title, description }, index) => (
              <div key={index} className="p-8 rounded-3xl shadow-lg hover:shadow-2xl transition">
                <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </div>
            ))}

            <div className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold mb-4">Learn Faster, Build Better</h3>
              <p>
                Skip the guesswork. Analyze what works, get fresh ideas, and launch products that stand out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Background Generator CTA Section */}
      <section className="py-20 bg-[#1f1f21] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wanna create cool SVG backgrounds for your landing page?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-6">
            Generate stunning, responsive SVGs that instantly level up your design — no design skills needed.
          </p>
          <button
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] rounded-full font-semibold text-white hover:scale-105 transition"
            onClick={() => setIsSVGModalOpen(true)}
          >
            Click here to start
          </button>
        </div>
      </section>

      <SVGGeneratorModal
        isOpen={isSVGModalOpen}
        onClose={() => setIsSVGModalOpen(false)}
      />

      <Footer />
    </main>
  );
};

export default LandingPage;