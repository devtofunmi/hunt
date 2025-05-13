'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/mockProducts';
import SkeletonCard from './SkeletonCard';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://prettybio.up.railway.app/products');
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      {loading
        ? Array.from({ length: 5 }).map((_, idx) => <SkeletonCard key={idx} />)
        : products.map(product => (
            <ProductCard key={product.id} product={product} refreshProducts={fetchProducts} />
          ))}
    </div>
  );
};

export default ProductList;
