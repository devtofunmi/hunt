'use client';

import React, { useEffect, useState } from 'react';
import {
  FiX,
  FiExternalLink,
} from 'react-icons/fi';
import {
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';

import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

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

// Move fetchComments to component scope so it can be reused
const fetchComments = async () => {
  if (!product?.id) return;
  setLoading(true);
  try {   
    const response = await axios.get(`https://launchhunt.onrender.com/comments/${product.id}`);
    setComments(response.data as Comment[]);
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.log("Fetching comments for productId:", product.id);
  }
  finally {
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

  return (
   <div className="fixed top-0 bottom-0 h-screen inset-0 flex justify-center bg-[#171717] z-50 overflow-y-auto ">
  <div className=" text-white w-full  p-6 relative">
    <button
      onClick={onClose}
      className="absolute top-2 cursor-pointer right-4 text-white hover:text-gray-400"
      aria-label="Close modal"
    >
      <FiX size={24} />
    </button>

    {/* Header */}
    <div className="flex flex-col md:flex-row gap-6 mt-12 max-w-5xl mx-auto">
      {/* Left Column */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={product.logo}
            alt={product.title}
            className="w-16 h-16 rounded-xl border border-gray-700"
          />
          <div>
            <h2 className="text-3xl font-bold">{product.title}</h2>
            <p className="text-sm text-gray-400">
              Published on {formatDate(product.createdAt)}
            </p>
          </div>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">{product.fullDescription}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, i) => (
            <span key={i} className="bg-gray-700 text-xs px-3 py-1 rounded-full uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
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

        <div className="text-sm text-gray-400 mb-2">🔥 {product.upvotes} upvotes</div>
         {/* Comments */}
    <div className="mt-10">
      {/* <h3 className="text-xl font-semibold mb-4">User Comments</h3> */}

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
              className="border border-gray-700 cursor-pointer hover:bg-gray-700 px-4 py-1.5 rounded-full text-sm"
              onClick={handleSubmit}
              disabled={loading}
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

      {/* Right Column */}
      <div className="md:w-1/3 h-fit bg-[#2a2a2e] rounded-xl p-4 shadow-md border border-gray-700">
        <div className="flex items-center gap-4 mb-3">
          <img
            src={product.user.image}
            alt={product.user.username}
            className="w-12 h-12 rounded-full border border-gray-600"
          />
          <div>
            <h3 className="font-semibold">{product.user.username}</h3>
            <p className="text-sm text-gray-400">{product.user.bio}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          {product.user.twitter && (
            <a href={product.user.twitter} target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="text-blue-400" />
            </a>
          )}
          {product.user.github && (
            <a href={product.user.github} target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-blue-400" />
            </a>
          )}
          {product.user.linkedin && (
            <a href={product.user.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-blue-400" />
            </a>
          )}
          {product.user.bluesky && (
            <a href={product.user.bluesky} target="_blank" rel="noopener noreferrer">
              <SiBluesky className="text-blue-400" />
            </a>
          )}
        </div>
        
      </div>
      
    </div>

   
  </div>
</div>

  );
};

export default ProductModal;