'use client';

import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiExternalLink, FiX } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    image: string;
  };
};

type SocialLink = {
  platform: string;
  url: string;
};

type User = {
  id: string;
  username: string;
  image: string;
  bio: string;
  twitter: string;
  github: string;
  linkedin: string;
  bluesky: string;
  socialLinks: SocialLink[];
};

type Product = {
  id: string;
  title: string;
  fullDescription: string;
  shortDescription: string;
  logo: string;
  tags: string[];
  upvotes: number;
  saved?: boolean;
  githubUrl?: string;
  link?: string;
  createdAt: string;
  user: User;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { accessToken, user } = useAuth();

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

    const timeout = setTimeout(() => {
      const filtered = products.filter(({ title = '', shortDescription = '' }) => {
        return (
          title.toLowerCase().includes(term) ||
          shortDescription.toLowerCase().includes(term)
        );
      });
      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, products]);

  useEffect(() => {
    if (selectedProduct?.id) fetchComments(selectedProduct.id);
  }, [selectedProduct?.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchComments = async (productId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://launchhunt.onrender.com/comments/${productId}`);
      setComments(res.data as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !selectedProduct?.id) return;

    setCommentLoading(true);
    try {
      await axios.post(
        `https://launchhunt.onrender.com/comments`,
        {
          content: newComment,
          productId: selectedProduct.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewComment('');
      fetchComments(selectedProduct.id);
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Search Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-[#18181b] text-white rounded-lg p-6 w-11/12 max-w-md relative">
          <button onClick={onClose} className="absolute cursor-pointer top-4 right-4 hover:text-gray-400">
            <IoClose size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Search Products</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E00FF] bg-[#27272a] text-white"
            autoFocus
          />
          <div className="mt-4 max-h-72 overflow-y-auto scrollbar-hide">
            {searchTerm.trim() === '' ? (
              <p className="text-center text-gray-500">Type something to search...</p>
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="flex items-center gap-4 p-2 border-b border-[#27272a] cursor-pointer hover:bg-[#2a2a2d]"
                >
                  <img src={product.logo} alt={product.title} className="w-8 h-8 rounded-md object-cover" />
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#171717] h-screen overflow-y-auto z-50 p-6 text-white">
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute cursor-pointer top-4 right-4 text-white hover:text-gray-400"
          >
            <FiX size={24} />
          </button>

          <div className="flex flex-col md:flex-row gap-6 mt-12 max-w-5xl mx-auto">
            {/* Left column */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedProduct.logo}
                  alt={selectedProduct.title}
                  className="w-16 h-16 rounded-xl border border-gray-700"
                />
                <div>
                  <h2 className="text-3xl font-bold">{selectedProduct.title}</h2>
                  <p className="text-sm text-gray-400">
                    Published on {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{selectedProduct.fullDescription}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProduct.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-700 text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mb-6 flex-wrap">
                {selectedProduct.link && (
                  <a
                    href={selectedProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  >
                    <FiExternalLink /> Live Site
                  </a>
                )}
                {selectedProduct.githubUrl && (
                  <a
                    href={selectedProduct.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
              </div>

              <div className="text-sm text-gray-400 mb-6">🔥 {selectedProduct.upvotes} upvotes</div>

              {/* Comments */}
              <div className="mt-8">
                {user ? (
                  <div className="space-y-2 mb-6">
                    <textarea
                      className="w-full bg-[#171717] border border-gray-700 p-3 rounded-md text-sm"
                      rows={3}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="border border-gray-700 hover:bg-gray-700 px-4 py-1.5 rounded-full text-sm"
                      >
                        {commentLoading ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 mb-4">Login to comment</p>
                )}

                <div className="space-y-4">
                  {loading ? (
                    <p className="flex justify-center"><LoadingSpinner /></p>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 items-start">
                        <img
                          src={comment.user.image}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full border border-gray-600"
                        />
                        <div>
                          <p className="text-sm font-semibold">{comment.user.username}</p>
                          <p className="text-sm text-gray-300">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

            {/* Right column */}
            <div className="md:w-1/3 h-fit bg-[#2a2a2e] rounded-xl p-4 shadow-md border border-gray-700">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={selectedProduct.user.image}
                  alt={selectedProduct.user.username}
                  className="w-12 h-12 rounded-full border border-gray-600"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedProduct.user.username}</h3>
                  <p className="text-sm text-gray-400">{selectedProduct.user.bio}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4 text-gray-400">
                {selectedProduct.user.twitter && (
                  <a href={selectedProduct.user.twitter} target="_blank" rel="noopener noreferrer">
                    <FaXTwitter />
                  </a>
                )}
                {selectedProduct.user.github && (
                  <a href={selectedProduct.user.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                )}
                {selectedProduct.user.linkedin && (
                  <a href={selectedProduct.user.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
                {selectedProduct.user.bluesky && (
                  <a href={selectedProduct.user.bluesky} target="_blank" rel="noopener noreferrer">
                    <SiBluesky />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;