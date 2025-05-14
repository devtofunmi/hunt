"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landingpage/Navbar";
import { FiSave } from "react-icons/fi";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";
import { IoEyeOutline, IoClose } from "react-icons/io5";

const socialFields = [
  { label: "bluesky", icon: <SiBluesky />, placeholder: "https://bsky.app/profile" },
  { label: "twitter", icon: <FaXTwitter />, placeholder: "https://twitter.com/username" },
  { label: "github", icon: <FaGithub />, placeholder: "https://github.com/username" },
  { label: "linkedin", icon: <FaLinkedin />, placeholder: "https://linkedin.com/in/username" },
];

const Page = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logo, setLogo] = useState<string>("");
  const [logoName, setLogoName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    bluesky: "",
    twitter: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const pickImage = () => fileInputRef.current?.click();

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoName(file.name);
    const secureUrl = await uploadToCloudinary(file);
    if (secureUrl) {
      setLogo(secureUrl);
      toast.success("Image uploaded successfully!");
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "users_avater");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/drirsnp0c/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSelectedFile(data.secure_url);
        return data.secure_url;
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async () => {
  setLoading(true);

  // Dynamically build only non-empty fields
  const updateData: Record<string, any> = {};

  if (username.trim()) updateData.username = username.trim();
  if (bio.trim()) updateData.bio = bio.trim();
  if (selectedFile) updateData.image = selectedFile;

  // Add only non-empty social links
  const nonEmptySocialLinks = Object.fromEntries(
    Object.entries(socialLinks).filter(([_, val]) => val.trim())
  );

  if (Object.keys(nonEmptySocialLinks).length > 0) {
    updateData.socialLinks = nonEmptySocialLinks;
  }

  try {
    const res = await fetch("https://launchhunt.up.railway.app/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(updateData),
    });

    const contentType = res.headers.get("Content-Type");
    const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(typeof data === "string" ? data : data.message || "Something went wrong");
    }

    toast.success("Profile updated successfully!");

    // Reset only the fields that were updated
    if (updateData.username) setUsername("");
    if (updateData.bio) setBio("");
    if (updateData.image) {
      setSelectedFile("");
      setLogo("");
      setLogoName("");
    }
    if (updateData.socialLinks) {
      setSocialLinks({
        bluesky: "",
        twitter: "",
        github: "",
        linkedin: "",
      });
    }
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Failed to update profile.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen text-white relative">
      <ToastContainer position="top-right" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20 mt-5 flex flex-col md:flex-row-reverse gap-20 ">
        <main className="flex-1 space-y-6">
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
            <label className="text-sm text-white/60 mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your unique username"
              className="w-full rounded-md border border-white/20 bg-[#1f1f1f] px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full rounded-md border border-white/20 bg-[#1f1f1f] px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <h3 className="text-sm text-white/60 mb-1">Social Links</h3>
            <div className="space-y-3">
              {socialFields.map((field) => (
                <div
                  key={field.label}
                  className="bg-[#1f1f1f] border border-white/20 flex items-center px-3 py-2 rounded-md gap-2"
                >
                  <span className="text-white text-lg">{field.icon}</span>
                  <input
                    type="url"
                    placeholder={field.placeholder}
                    value={socialLinks[field.label as keyof typeof socialLinks]}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [field.label]: e.target.value })
                    }
                    className="bg-transparent w-full outline-none text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-[#6E00FF] to-[#0096FF] flex items-center justify-center gap-2 cursor-pointer w-full transition text-white py-3 px-6 rounded font-semibold disabled:opacity-50"
            >
              <FiSave />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </main>

        <aside className="w-full md:w-[250px] md:sticky md:top-28 self-start hidden md:block space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-sm text-white/80 space-y-3">
            <h2 className="font-semibold text-white text-sm">Tips for a Great Profile</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Choose a clear and professional profile image.</li>
              <li>Keep your username short and memorable.</li>
              <li>Write a concise and engaging bio.</li>
              <li>Add links to platforms where you’re active.</li>
            </ul>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-md space-y-3 border border-white/10">
            {logo && (
              <img
                src={logo}
                alt="Preview Logo"
                className="w-16 h-16 rounded-full object-cover mx-auto"
              />
            )}
            <p className="text-lg font-semibold text-center">{username || "Your Name"}</p>
            <p className="text-sm text-white/60 text-center">{bio || "Short bio goes here..."}</p>
            <div className="flex justify-center gap-3 mt-3">
              {Object.entries(socialLinks).map(([key, val]) =>
                val ? (
                  <a
                    key={key}
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition text-xl"
                  >
                    {socialFields.find((field) => field.label === key)?.icon}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsPreviewOpen(true)}
        className="md:hidden cursor-pointer fixed bottom-4 right-4 bg-white text-black rounded-full shadow-lg p-3 z-50"
      >
        <IoEyeOutline size={22} />
      </button>

      {/* Mobile Drawer Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center md:hidden">
          <div className="w-[300px] mx-auto bg-[#1a1a1a] rounded-md p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <button onClick={() => setIsPreviewOpen(false)}>
                <IoClose size={22} className="cursor-pointer text-white" />
              </button>
            </div>

            {logo && (
              <img
                src={logo}
                alt="Preview Logo"
                className="w-16 h-16 rounded-full object-cover mx-auto"
              />
            )}
            <p className="text-lg font-semibold text-center">{username || "Your Name"}</p>
            <p className="text-sm text-white/60 text-center">{bio || "Short bio goes here..."}</p>
            <div className="flex justify-center gap-3 mt-3">
              {Object.entries(socialLinks).map(([key, val]) =>
                val ? (
                  <a
                    key={key}
                    href={val}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition text-xl"
                  >
                    {socialFields.find((field) => field.label === key)?.icon}
                  </a>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
