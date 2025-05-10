'use client';
import React from 'react';
import Analytics from './Analytics';

interface SidebarProps {
  onOpenModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenModal }) => {
  return (
    <aside>
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
        <Analytics onOpenModal={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>
    </aside>
  );
};

export default Sidebar;