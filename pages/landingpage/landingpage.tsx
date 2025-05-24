'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '@/components/landingpage/Footer';
import Navbar from '@/components/landingpage/Navbar';
import ProductList from '@/components/landingpage/ProductList';
import Sidebar from '@/components/landingpage/Sidebar';
import SVGGeneratorModal from '@/components/landingpage/SVGGeneratorModal';
import { Product } from '@/types';
import Modal from '@/components/landingpage/Modal';

const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'Product Designer',
    quote:
      'LaunchHunt gave me a huge head start by showing me real products similar to my idea. It’s like having a mentor who shows you the way!',
  },
  {
    name: 'James Osei',
    role: 'Indie Hacker',
    quote:
      'I stopped overthinking and finally launched thanks to LaunchHunt. The product examples were just what I needed!',
  },
  {
    name: 'Amina Bako',
    role: 'Frontend Developer',
    quote:
      'The SVG generator and UI library saved me hours. LaunchHunt is a must-have for any solo builder.',
  },
  {
    name: 'Carlos Mendes',
    role: 'Startup Founder',
    quote:
      'LaunchHunt made competitive research so much easier. No fluff—just real-world examples.',
  },
];

const LandingPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSVGModalOpen, setIsSVGModalOpen] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Rotate testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Show welcome modal after login
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const showModal = localStorage.getItem('showWelcomeModal');
      if (showModal === 'true') {
        setShowWelcomeModal(true);
        localStorage.removeItem('showWelcomeModal');
      }
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://launchhunt.up.railway.app/products');
        const data = await res.json();
        const mappedProducts = data.map((product: any) => ({
          ...product,
          id: typeof product.id === 'string' ? product.id : String(product.id),
          saved: typeof product.saved === 'boolean' ? product.saved : false,
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleUpvote = (id: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        String(product.id) === String(id)
          ? { ...product, upvotes: product.upvotes + 1 }
          : product
      )
    );
  };

  const handleSave = (id: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        String(product.id) === String(id)
          ? { ...product, saved: !product.saved }
          : product
      )
    );
  };

  const scrollToMain = () => {
    mainRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#171717] text-white relative">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-46 px-2 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Find what others built. Create something better.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            LaunchHunt helps you discover real-world indie products similar to your ideas.<br /> Validate faster. Build smarter.
          </p>
          <button
            className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] rounded-full text-md font-semibold hover:scale-105 transition"
            onClick={scrollToMain}
          >
            Explore Projects
          </button>
        </div>
      </section>

      {/* Mobile Search Input */}
      <div className="w-full mt-20 px-6 md:hidden">
        <input
          type="text"
          placeholder="Search a product"
          className="w-full px-4 py-2 border rounded-full border-[#27272a] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          readOnly
        />
      </div>
      {/* Modal */}     
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} products={products.length > 0 ? products : []} />

      {/* Main Section */}
      <section
        ref={mainRef}
        className="p-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:pt-28"
      >
        <ProductList
          products={products}
          visibleCount={visibleCount}
          onUpvote={handleUpvote}
          onSave={handleSave}
          onSeeMore={handleSeeMore}
        />
        <div className="mt-20 md:mt-0">
           <Sidebar onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </section>

      {/* What is LaunchHunt */}
      <section id="what" className="py-24 w-full text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What is LaunchHunt?</h2>
          <p className="text-lg md:text-xl text-gray-300">
            LaunchHunt empowers indie developers by showcasing real-world projects similar to yours. Gain practical insights, validate your ideas, and build confidently using proven examples.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Find Similar Projects',
                description: 'See how others built products like yours and what worked for them.',
              },
              {
                title: 'UI Inspiration Library',
                description: 'Explore curated layouts and visuals from real-world indie launches.',
              },
              {
                title: 'SVG Background Generator',
                description: 'Create stunning custom backgrounds in seconds.',
              },
              {
                title: 'Learn Faster, Build Better',
                description: 'Study, plan, and launch with more clarity and less guesswork.',
                isGradient: true,
              },
            ].map(({ title, description, isGradient }, index) => (
              <div
                key={index}
                className={`p-8 rounded-3xl shadow-lg hover:shadow-2xl transition ${
                  isGradient ? 'bg-gradient-to-r from-[#6E00FF] to-[#0096FF]' : 'bg-[#1f1f21]'
                }`}
              >
                <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                <p className="text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-18 bg-[#1f1f21]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">What people are saying</h2>

          <div className="relative h-40 overflow-hidden max-w-3xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="absolute w-full"
              >
                <p className="text-gray-300 italic mb-4 text-lg">"{testimonials[index].quote}"</p>
                <h4 className="font-semibold text-white text-xl">{testimonials[index].name}</h4>
                <p className="text-sm text-gray-400">{testimonials[index].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 text-center bg-[#171717] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Success Stories</h2>
          <p className="text-lg text-gray-400 mb-12">
            Indie founders, designers, and devs have used LaunchHunt to launch faster and smarter. You can too.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-[#1f1f21] p-6 rounded-xl border border-gray-700">
              <h4 className="font-semibold text-xl mb-2">Pivoted to Profit</h4>
              <p className="text-gray-400">
                “We avoided building the wrong thing by analyzing products on LaunchHunt. Now we’re at $2k MRR.”
              </p>
            </div>
            <div className="bg-[#1f1f21] p-6 rounded-xl border border-gray-700">
              <h4 className="font-semibold text-xl mb-2">Idea to MVP in 10 Days</h4>
              <p className="text-gray-400">
                “I got inspired by 3 projects and merged ideas. Users loved the unique combo. Thanks LH!”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Generator CTA */}
      <section className="py-20 bg-[#1f1f21] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wanna create cool SVG backgrounds for your landing page?
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-6">
            Generate stunning, responsive SVGs that instantly level up your<br /> design — no design skills needed.
          </p>
          <button
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] rounded-full font-semibold text-white hover:scale-105 transition"
            onClick={() => setIsSVGModalOpen(true)}
          >
            Open SVG Generator
          </button>
        </div>
      </section>

      {/* Modals */}
       <SVGGeneratorModal
        isOpen={isSVGModalOpen}
        onClose={() => setIsSVGModalOpen(false)}
      />

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#171717] p-6 rounded-xl shadow-lg w-86 md:w-96 relative">
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute cursor-pointer top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold mb-4 text-[#6E00FF] mt-5">Welcome to LaunchHunt!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                You've successfully logged in. Start exploring amazing developer projects now!
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default LandingPage;