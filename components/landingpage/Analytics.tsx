'use client';

import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiEye, FiThumbsUp, FiStar } from 'react-icons/fi';

interface SidebarProps {
  onOpenModal: () => void;
}

interface Stats {
  totalProducts: number;
  totalViews: number;
  totalUpvotes: number;
  featuredProducts: number;
}


const Sidebar: React.FC<SidebarProps> = ({ onOpenModal }) => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalViews: 0,
    totalUpvotes: 0,
    featuredProducts: 0,
  });

  useEffect(() => {
  const trackHomepageView = async () => {
    try {
      const res = await fetch('https://launchhunt.up.railway.app/analytics/view/homepage', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to track homepage view');
    } catch (error) {
      console.error('Error tracking homepage view:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('https://launchhunt.up.railway.app/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const trackAndUpdate = async () => {
    await trackHomepageView(); // increment view on server
    await fetchStats();        // get updated stats after increment
  };

  trackAndUpdate();
}, []);




  return (
    <aside>
      <div className="sticky top-24 md:w-[400px] flex flex-col gap-8">
        {/* Analytics Panel */}
        <div className="w-full bg-[#171717] rounded-2xl p-6 shadow-lg space-y-6">
          <div className="text-xl font-semibold text-white flex items-center gap-2">
            <FiBarChart2 className="text-[#0096FF]" />
            Launch Analytics
          </div>

          <div className="grid grid-cols-2 gap-4 text-white">
            <StatCard label="Products" value={stats.totalProducts} icon={<FiBarChart2 />} />
            <StatCard label="Views" value={stats.totalViews} icon={<FiEye />} />
            <StatCard label="Upvotes" value={stats.totalUpvotes} icon={<FiThumbsUp />} />
            <StatCard label="Featured" value={stats.featuredProducts} icon={<FiStar />} />
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
    <div className="bg-[#282828] p-4 rounded-xl flex items-center gap-4 shadow-inner">
      <div className="text-[#0096FF] text-xl">{icon}</div>
      <div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm text-zinc-400">{label}</div>
      </div>
    </div>
  );
};

export default Sidebar;