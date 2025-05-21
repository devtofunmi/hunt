'use client';

import React from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';

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
  if (!product) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 overflow-y-auto">
      <div className="bg-[#18181b] text-white p-6 rounded-lg w-11/12 max-w-xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:text-gray-400"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col gap-4">
          {/* Product Header */}
          <div className="flex items-center gap-4">
            <img
              src={product.logo}
              alt={product.title}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <p className="text-sm text-gray-400">Published on {formatDate(product.createdAt)}</p>
            </div>
          </div>

          {/* Product Description */}
          <p className="text-gray-300">{product.fullDescription}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {product.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-4">
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
              >
                <FiExternalLink /> Live Site
              </a>
            )}
            {product.githubUrl && (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
              >
                <FaGithub /> GitHub
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm text-gray-400">
            <span>🔥 {product.upvotes} upvotes</span>
            {/* <span>{product.saved ? '💾 Saved' : '📦 Not Saved'}</span> */}
          </div>

          {/* Divider */}
          <hr className="border-gray-700 my-4" />

          {/* User Info */}
          {product.user && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-11 rounded-full">
                <img
                  src={product.user.image}
                  alt={product.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex justify-between w-full ">
                <div>
                  <h3 className="font-semibold">{product.user.username}</h3>
                  <p className="text-sm text-gray-400">{product.user.bio}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  {product.user.twitter && (
                    <a
                      href={product.user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <FaXTwitter size={15} className="text-blue-400" />
                    </a>
                  )}
                  {product.user.github && (
                    <a
                      href={product.user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <FaGithub size={15} className="text-blue-400" />
                    </a>
                  )}
                  {product.user.linkedin && (
                    <a
                      href={product.user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin size={15} className="text-blue-400" />
                    </a>
                  )}
                  {product.user.bluesky && (
                    <a
                      href={product.user.bluesky}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Bluesky"
                    >
                      <SiBluesky size={15} className="text-blue-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;