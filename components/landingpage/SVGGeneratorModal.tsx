// components/landingpage/SVGGeneratorModal.tsx
import React from "react";
import SVGGenerator from "../SVGGenerator";
import { FaClosedCaptioning } from "react-icons/fa";
import { GrClose } from "react-icons/gr";


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SVGGeneratorModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center text-[#171717]">
      <div className="bg-[#18181b]  rounded-xl w-[85%] md:w-full max-w-3xl p-2 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-black"
        >
          <GrClose size={20} />
        </button>
        {/* <h2 className="text-md md:text-lg font-bold mb-4">SVG Background Generator</h2> */}
        <SVGGenerator />
      </div>
    </div>
  );
};

export default SVGGeneratorModal;
