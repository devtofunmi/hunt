import React from 'react';

const ProductForm = () => {
  return (
    <div className="p-6 rounded-lg bg-[#262629]">
      <h3 className="text-lg font-semibold mb-4">Submit Your Project</h3>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="px-4 py-2 border border-[#aaaac2] rounded-md"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="px-4 py-2 border border-[#aaaac2] rounded-md"
          rows={3}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          className="px-4 py-2 border border-[#aaaac2] rounded-md"
          required
        />
        <input
          type="text"
          name="logo"
          placeholder="Logo URL"
          className="px-4 py-2 border border-[#aaaac2] rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#6E00FF] to-[#0096FF] text-white rounded-md hover:opacity-90 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
