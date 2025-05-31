'use client';

import React, { useEffect, useState } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import UserComment from './UserComment';

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

type SocialLink = {
  platform: string;
  url: string;
};

type User = {
  twitter?: string;
  github?: string;
  linkedin?: string;
  bluesky?: string;
  id: string;
  username?: string;
  image?: string;
  bio?: string;
  socialLinks?: SocialLink[];
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
  user?: User;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { accessToken, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  if (!product) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchComments = async () => {
    if (!product?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://launchhunt.onrender.com/comments/${product.id}`
      );
      setComments(response.data as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [product?.id]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await axios.post(
        'https://launchhunt.onrender.com/comments',
        {
          content: newComment,
          productId: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewComment('');
      fetchComments();
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
        { content, productId: product.id, parentId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchComments();
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`https://launchhunt.onrender.com/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId: string) => comments.filter((c) => c.parentId === commentId);

  return (
    <div className="fixed top-0 bottom-0 h-screen inset-0 flex justify-center bg-[#171717] z-50 overflow-y-auto">
      <div className="text-white w-full p-6 relative max-w-7xl">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-4 text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6 mt-12 max-w-5xl mx-auto">
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={product.logo}
                alt={product.title}
                className="w-16 h-16 rounded-xl border border-gray-700 object-contain"
              />
              <div>
                <h2 className="text-xl md:text-3xl font-bold">{product.title}</h2>
                <p className="text-sm text-gray-400">
                  Published on {formatDate(product.createdAt)}
                </p>
              </div>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{product.fullDescription}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, i) => (
                <span
                  key={tag + i}
                  className="bg-gray-700 text-xs px-3 py-1 rounded-full uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                  <FiExternalLink /> Live Site
                </a>
              )}
              {product.githubUrl && (
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                  <FaGithub /> GitHub
                </a>
              )}
            </div>

            <div className="text-sm text-gray-400 mb-6">🔥 {product.upvotes} upvotes</div>

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
                        onReply={handleReply}
                        onDelete={handleDelete}
                        currentUserId={user?.id || null}
                      />
                    ))
                  )}
                </div>
              )}

              {user ? (
                <div className="flex mt-5 flex-col gap-2">
                  <textarea
                    rows={3}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full resize-none rounded-md border border-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
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
          <aside className="md:w-1/3 mb-20 h-fit bg-[#2a2a2e] rounded-xl p-4 shadow-md border border-gray-700">
            {product.user && (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={product.user.image || 'https://via.placeholder.com/48x48?text=👤'}
                    alt={product.user.username || 'User'}
                    className="w-12 h-12 rounded-full border border-gray-600 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{product.user.username || 'Unknown'}</h3>
                    <p className="text-sm text-gray-400">{product.user.bio || ''}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  {product.user.twitter && (
                    <a href={product.user.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <FaTwitter className="text-blue-400" />
                    </a>
                  )}
                  {product.user.github && (
                    <a href={product.user.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <FaGithub className="text-blue-400" />
                    </a>
                  )}
                  {product.user.linkedin && (
                    <a href={product.user.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <FaLinkedin className="text-blue-400" />
                    </a>
                  )}
                  {product.user.bluesky && (
                    <a href={product.user.bluesky} target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                      <SiBluesky className="text-blue-400" />
                    </a>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
