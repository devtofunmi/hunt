import { useState, ChangeEvent } from "react";
import { FiUpload, FiSave } from "react-icons/fi";
import { FaTwitter, FaGithub, FaLinkedin, FaCloud } from "react-icons/fa";
import Navbar from "@/components/landingpage/Navbar";
import Footer from "@/components/landingpage/Footer";

const SettingsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Profile Settings</h2>

          {/* Username */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Username<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your unique username"
              className="w-full rounded-md border border-white/20 bg-[#1f1f1f] px-4 py-2 focus:outline-none"
            />
          </div>

          {/* Upload */}
          <div className="mb-6 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-[#6E00FF] cursor-pointer">
              <FiUpload />
              Choose File
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <span className="text-sm text-gray-300">
              {selectedFile ? selectedFile.name : "No file selected"}
            </span>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Biography</label>
            <textarea
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full rounded-md border border-white/20 bg-[#1f1f1f] px-4 py-2 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { label: "Bluesky", icon: <FaCloud className="text-blue-400" />, placeholder: "https://bsky.app/profile/..." },
              { label: "Twitter", icon: <FaTwitter className="text-blue-400" />, placeholder: "https://twitter.com/..." },
              { label: "Github", icon: <FaGithub />, placeholder: "https://github.com/..." },
              { label: "LinkedIn", icon: <FaLinkedin className="text-blue-300" />, placeholder: "https://linkedin.com/in/..." },
            ].map((field, index) => (
              <div key={index}>
                <label className="block mb-1 text-sm">{field.label}</label>
                <div className="flex items-center gap-2 bg-[#1f1f1f] border border-white/20 rounded-md px-3 py-2">
                  {field.icon}
                  <input
                    type="url"
                    placeholder={field.placeholder}
                    className="bg-transparent w-full outline-none text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#6E00FF] to-[#0096FF] cursor-pointer text-white transition px-5 py-2 rounded-md font-medium">
              <FiSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;


