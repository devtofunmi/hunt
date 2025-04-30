'use client';

import React from 'react';
import SVGGenerator from '../SVGGenerator';
import { GrClose } from 'react-icons/gr';

interface SVGGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SVGGeneratorModal: React.FC<SVGGeneratorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center text-[#171717]">
      <div className="bg-[#18181b] rounded-xl w-[85%] md:w-full max-w-3xl p-2 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
          aria-label="Close modal"
        >
          <GrClose size={20} />
        </button>
        <SVGGenerator />
      </div>
    </div>
  );
};

export default SVGGeneratorModal;
