import { ReactNode } from 'react';

export const RetroButton = ({
  onClick,
  children,
  active = false,
  className = '',
}: {
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 font-bold text-xs md:text-sm focus:outline-none
      ${active
        ? 'bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-black border-l-black border-b-white border-r-white text-gray-700'
        : 'bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black text-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white'}
      ${className}`}
  >
    {children}
  </button>
);
