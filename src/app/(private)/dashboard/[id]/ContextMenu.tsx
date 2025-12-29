'use client'
import { useState, ReactNode } from "react";

type ContextMenuProps = {
  children: ReactNode; // the button/icon
  menuItems: { label: string; onClick: () => void }[]; // menu options
}

export default function ContextMenu({ children, menuItems }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false); // close after click
  }

  return (
    <div className="relative inline-block text-left">
      <div onClick={toggleMenu} className="cursor-pointer">
        {children} {/* e.g., the three dots button */}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-50 border border-gray-200">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(item.onClick)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
