'use client';

import React from 'react';
import { FiBarChart2, FiEye, FiThumbsUp, FiStar } from 'react-icons/fi';

interface SidebarProps {
  onOpenModal: () => void;
}

const mockStats = {
  totalProducts: 128,
  totalViews: 3045,
  totalUpvotes: 789,
  featuredProducts: 12,
};

const Sidebar: React.FC<SidebarProps> = ({ onOpenModal }) => {
  return (
    <aside>
      <div className="sticky top-24 md:w-[400px] flex flex-col gap-8">
      

        {/* Analytics Panel */}
        <div className="w-full bg-zinc-900 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="text-xl font-semibold text-white flex items-center gap-2">
            <FiBarChart2 className="text-[#0096FF]" />
            Launch Analytics
          </div>

          <div className="grid grid-cols-2 gap-4 text-white">
            <StatCard label="Products" value={mockStats.totalProducts} icon={<FiBarChart2 />} />
            <StatCard label="Views" value={mockStats.totalViews} icon={<FiEye />} />
            <StatCard label="Upvotes" value={mockStats.totalUpvotes} icon={<FiThumbsUp />} />
            <StatCard label="Featured" value={mockStats.featuredProducts} icon={<FiStar />} />
          </div>
        </div>
      </div>
    </aside>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-xl flex items-center gap-4 shadow-inner">
      <div className="text-[#0096FF] text-xl">{icon}</div>
      <div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm text-zinc-400">{label}</div>
      </div>
    </div>
  );
};

export default Sidebar;