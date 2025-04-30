import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

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

type ModalProps = {
  onClose: () => void;
  onAddProduct: (product: Product) => void;
};

const CreateProductModal: React.FC<ModalProps> = ({ onClose, onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagList = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newProduct: Product = {
      id: 0, // will be replaced in parent
      title,
      logoUrl,
      shortDescription,
      fullDescription,
      liveUrl,
      githubUrl,
      tags: tagList,
    };

    onAddProduct(newProduct);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 ">
      <div className="bg-[#1f1f1f] w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide p-6 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Product</h2>

        <form className="space-y-4 pb-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Short Description</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Full Description</label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Live URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. react, design, indie"
              className="w-full px-4 py-2 bg-[#2a2a2a] rounded-md border border-white/20 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white font-medium py-2 rounded-md transition"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;