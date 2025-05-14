import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse flex justify-between items-center border border-[#27272a] p-2 md:p-4 rounded-xl bg-[#1f1f1f]">
      <div className="flex items-center gap-4 w-full">
        {/* Image Skeleton */}
        <div className="w-10 md:w-15 md:h-15 h-10 bg-gray-700 rounded-md" />

        {/* Text Content */}
        <div className="flex-1">
          {/* Name */}
          <div className="w-32 md:w-48 h-4 bg-gray-700 rounded" />
          {/* Description */}
          <div className="w-40 md:w-64 h-3 mt-2 bg-gray-700 rounded" />
          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <div className="w-12 h-3 bg-gray-700 rounded" />
            <div className="w-12 h-3 bg-gray-700 rounded" />
            <div className="w-12 h-3 bg-gray-700 rounded hidden md:block" />
          </div>
        </div>
      </div>

      {/* Action Icons (Upvote & Save) */}
      <div className="flex flex-col items-center gap-3 ml-4">
        <div className="w-5 h-5 bg-gray-700 rounded" />
        <div className="w-5 h-5 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;