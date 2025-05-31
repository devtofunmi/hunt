'use client';

import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiExternalLink, FiX } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { SiBluesky } from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';
import UserComment from './UserComment';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string;
  user: {
    id: string;
    username: string;
    image: string;
  };
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
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
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return setFilteredProducts([]);

    const timeout = setTimeout(() => {
      const filtered = products.filter(({ title, shortDescription }) =>
        title.toLowerCase().includes(term) ||
        shortDescription.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, products]);

  useEffect(() => {
    if (selectedProduct?.id) fetchComments(selectedProduct.id);
  }, [selectedProduct?.id]);

  const fetchComments = async (productId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://launchhunt.onrender.com/comments/${productId}`);
      setComments(res.data as Comment[]);
    } catch (err) {
      console.error('Error fetching comments:', err);
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
        { content: newComment, productId: selectedProduct.id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNewComment('');
      fetchComments(selectedProduct.id);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (content: string, parentId: string) => {
    try {
      await axios.post(
        `https://launchhunt.onrender.com/comments`,
        { content, productId: selectedProduct?.id, parentId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (selectedProduct?.id) fetchComments(selectedProduct.id);
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`https://launchhunt.onrender.com/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (selectedProduct?.id) fetchComments(selectedProduct.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId: string) =>
    comments.filter((c) => c.parentId === commentId);

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
                  <h2 className="text-xl md:text-3xl font-bold">{selectedProduct.title}</h2>
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

              {/* Comments Section */}
              <section>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="mb-6 max-h-[40vh] overflow-y-auto">
                    {rootComments.length === 0 ? (
                      <p className="text-gray-400">No comments yet. Be the first!</p>
                    ) : (
                      rootComments.map((comment) => (
                        <UserComment
                          key={comment.id}
                          comment={comment}
                          replies={getReplies(comment.id)}
                          onReply={handleReply}
                          onDelete={handleDelete}
                          currentUserId={user?.id || null}
                        />
                      ))
                    )}
                  </div>
                )}

                 {user ? (
               <div className="flex flex-col gap-2">
                    <textarea
                      rows={3}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full resize-none rounded-md border border-gray-700  px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                      onClick={handleSubmit}
                      disabled={commentLoading}
                      className="border border-gray-700 cursor-pointer hover:bg-gray-700 px-4 py-2 rounded-md text-sm disabled:opacity-50"
                    >
                      {commentLoading ? 'Posting...' : 'Comment'}
                    </button>
                    </div>
                    
                  </div>
              ) : (
                <p className="text-gray-400">Please log in to post comments.</p>
              )}
              </section>
            </div>
             {/* Right */}
                      <div className="md:w-1/3 mb-20 h-fit bg-[#2a2a2e] rounded-xl p-4 shadow-md border border-gray-700">
                        {selectedProduct?.user && (
                          <>
                            <div className="flex items-center gap-4 mb-3">
                              <img
                                src={
                                  selectedProduct.user.image ||
                                  'https://via.placeholder.com/48x48?text=👤'
                                }
                                alt={selectedProduct.title}
                                className="w-12 h-12 rounded-full border border-gray-600"
                              />
                              <div>
                                <h3 className="font-semibold">
                                  {selectedProduct.user.username || 'Unknown'}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {selectedProduct.user.bio || ''}
                                </p>
                              </div>
                            </div>
            
                            <div className="flex gap-3 mt-2">
                              {selectedProduct.user.twitter && (
                                <a
                                  href={selectedProduct.user.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaXTwitter className="text-blue-400" />
                                </a>
                              )}
                              {selectedProduct.user.github && (
                                <a
                                  href={selectedProduct.user.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaGithub className="text-blue-400" />
                                </a>
                              )}
                              {selectedProduct.user.linkedin && (
                                <a
                                  href={selectedProduct.user.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FaLinkedin className="text-blue-400" />
                                </a>
                              )}
                              {selectedProduct.user.bluesky && (
                                <a
                                  href={selectedProduct.user.bluesky}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <SiBluesky className="text-blue-400" />
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;