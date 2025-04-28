import React from 'react';
import ProductForm from './ProductForm';

const Sidebar = ({ onOpenModal }: { onOpenModal: () => void }) => {
  return (
    <aside className="">
  <div className="sticky top-24 md:w-[400px] flex flex-col gap-8">
    <div className="w-full hidden md:block">
      <input
        type="text"
        placeholder="Search a product"
        className="w-full px-4 py-2 border rounded-full border-[#27272a] cursor-pointer"
        onClick={onOpenModal}
        readOnly
      />
    </div>
    <ProductForm />
  </div>
</aside>

  );
};

export default Sidebar;
