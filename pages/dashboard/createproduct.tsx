'use client';

import React, { useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoClose, IoEyeOutline } from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/drirsnp0c/image/upload';
const CLOUDINARY_PRESET = 'users_avater';

const isValidURL = (url: string) => {
  try {
    if (!url) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
    return data.secure_url as string;
  } catch (err) {
    console.error(err);
    toast.error('Failed to upload image.');
    return null;
  }
};

const CreateProduct = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [logo, setLogo] = useState<string>('');
  const [logoName, setLogoName] = useState<string>('');
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    link: '',
    githubUrl: '',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickImage = () => fileInputRef.current?.click();

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoName(file.name);
    const secureUrl = await uploadToCloudinary(file);
    if (secureUrl) {
      setLogo(secureUrl);
      toast.success('Image uploaded successfully!');
    }
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.shortDescription.trim()) return 'Short description is required.';
    if (!isValidURL(form.link)) return 'Live URL is not valid.';
    if (!isValidURL(form.githubUrl)) return 'GitHub URL is not valid.';
    return null;
  };

  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a product.');
      return;
    }

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const productData = {
      title: form.title,
      fullDescription: form.fullDescription,
      shortDescription: form.shortDescription,
      logo: logo,
      tags: form.tags.split(',').map(tag => tag.trim()),
      upvotes: 0,
      githubUrl: form.githubUrl,
      link: form.link,
      user: {
        id: user.id,
        name: user.name,
        image: user.image || '',
        bio: user.username || '',
        github: user.github || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        bluesky: user.bluesky || '',
       
      },
    };

    try {
      setLoading(true);

      const res = await fetch('https://launchhunt.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error('Failed to submit product');

      toast.success('Product submitted!');
      router.push('/');
    } catch (err) {
      toast.error('Failed to create product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <ToastContainer position="top-right" />
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 flex flex-col gap-20 mt-28">
        <div className="grid md:grid-cols-3 gap-10">
          <aside className="space-y-4 md:sticky md:top-28 self-start">
            <h1 className="text-2xl font-bold mb-10">Submit a New Product 🚀</h1>

            <section className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <h2 className="font-semibold text-lg mb-2">💡 Tips for a great submission</h2>
              <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                <li>Keep your title short and catchy</li>
                <li>Use a high-quality logo</li>
                <li>Write a clear, concise short description</li>
                <li>Add useful links (live, GitHub)</li>
              </ul>
            </section>

            <div className="mx-auto bg-[#1a1a1a] rounded-md p-4 hidden md:block max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                {logo && (
                  <img
                    src={logo}
                    alt="logo"
                    className="md:w-15 md:h-15 h-10 w-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-[15px]">{form.title}</h3>
                  <p className="text-[12px] text-gray-400 mt-0 md:mt-1">{form.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 mt-2 transition-opacity">
                    {form.tags
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="md:hidden cursor-pointer fixed bottom-4 right-4 bg-white text-black rounded-full shadow-lg p-3 z-50"
            >
              <IoEyeOutline size={22} />
            </button>

            {isPreviewOpen && (
              <div className="fixed inset-0 z-50 bg-black/70 flex items-center md:hidden">
                <div className="w-full mx-5  bg-[#1a1a1a] rounded-md p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-white/20 py-2">
                    <button onClick={() => setIsPreviewOpen(false)}>
                      <IoClose size={22} className="cursor-pointer text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    {logo && (
                      <img
                        src={logo}
                        alt="logo"
                        className="md:w-15 md:h-15 h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-[15px]">{form.title}</h3>
                      <p className="text-[12px] text-gray-400 mt-0 md:mt-1">{form.shortDescription}</p>
                      <div className="flex flex-wrap gap-2 mt-2 transition-opacity">
                        {form.tags
                          .split(',')
                          .map(tag => tag.trim())
                          .filter(Boolean)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8">
            <div className="space-y-2">
              <div
                onClick={pickImage}
                className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer"
              >
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-400">Upload Logo</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Description *</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                required
                rows={3}
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Description</label>
              <textarea
                name="fullDescription"
                value={form.fullDescription}
                onChange={handleChange}
                rows={5}
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Live Link</label>
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g., open-source, ai, productivity"
                className="w-full bg-[#1f1f1f] p-3 rounded border focus:border-[#6E00FF] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] w-full cursor-pointer hover:bg-[#5a00cc] transition-colors px-6 py-3 rounded font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Product'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProduct;