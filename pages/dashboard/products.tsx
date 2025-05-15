'use client';

import React, { useEffect, useState } from 'react';
import Footer from '@/components/landingpage/Footer';
import Navbar from '@/components/landingpage/Navbar';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { accessToken, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>('https://launchhunt.up.railway.app/products/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProducts(res.data);
      } catch (err) {
        toast.error('Failed to load products.');
      } finally {
        setLoadingProducts(false);
      }
    };

    if (accessToken) {
      fetchProducts();
    } else {
      setLoadingProducts(false);
    }
  }, [accessToken]);

  if (authLoading || loadingProducts) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Link href="/dashboard/createproduct">
              <button className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white px-2 md:px-4 py-2 rounded-md">
                <FiPlus className="hidden md:block" />
                Create New Product
              </button>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
          ) : (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
              <h1 className="md:text-2xl text-xl font-semibold mb-4">
                🤔 You haven’t added any products yet
              </h1>
              <p className="text-gray-400 mb-6">
                Start by sharing something you built with the world.
              </p>
              
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ProductsPage;