'use client';

import React, { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

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
  twitter: string;
  github: string;
  linkedin: string;
  bluesky: string;
  id: string;
  username: string;
  image: string;
  bio: string;
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

type ProductPageProps = {
  product: Product | null;
};

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const { accessToken, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!product) return <p className="text-center py-20 text-white">Product not found.</p>;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://launchhunt.up.railway.app/comments/${product.id}`);
      setComments(res.data as Comment[]);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      await axios.post(
        'https://launchhunt.up.railway.app/comments',
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchComments();
    }
  }, [product?.id]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 text-white">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Sidebar (User Info) */}
        <aside className="md:w-1/3">
          <div className="bg-[#1f1f23] p-5 rounded-xl shadow-lg">
            <img src={product.user.image} alt={product.user.username} className="w-16 h-16 rounded-full mb-4" />
            <h3 className="text-xl font-semibold">{product.user.username}</h3>
            <p className="text-sm text-gray-400">{product.user.bio}</p>

            <div className="flex gap-4 mt-4">
              {product.user.twitter && (
                <a href={product.user.twitter}><FaXTwitter className="text-blue-400" /></a>
              )}
              {product.user.github && (
                <a href={product.user.github}><FaGithub className="text-blue-400" /></a>
              )}
              {product.user.linkedin && (
                <a href={product.user.linkedin}><FaLinkedin className="text-blue-400" /></a>
              )}
              {product.user.bluesky && (
                <a href={product.user.bluesky}><SiBluesky className="text-blue-400" /></a>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="md:w-2/3">
          <div className="bg-[#1f1f23] p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <img src={product.logo} alt={product.title} className="w-14 h-14 rounded-md" />
              <div>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-sm text-gray-400">Published on {formatDate(product.createdAt)}</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{product.fullDescription}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-4 mb-4">
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FiExternalLink /> Live Site
                </a>
              )}
              {product.githubUrl && (
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FaGithub /> GitHub
                </a>
              )}
            </div>

            {/* Upvotes */}
            <div className="text-sm text-gray-400">🔥 {product.upvotes} upvotes</div>
          </div>

          {/* Comments Section */}
          <div className="mt-10 bg-[#1f1f23] p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">User Comments</h3>

            {user ? (
              <div className="space-y-2 mb-4">
                <textarea
                  className="w-full p-2 bg-[#171717] rounded text-sm text-white"
                  rows={3}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Login to comment</p>
            )}

            <div className="space-y-4 mt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 items-start">
                  <img src={comment.user.image} alt="user" className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{comment.user.username}</p>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                    <p className="text-gray-500 text-xs mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductPage;