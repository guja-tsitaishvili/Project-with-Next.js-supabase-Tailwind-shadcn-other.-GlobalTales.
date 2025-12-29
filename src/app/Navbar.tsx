'use client'
import { useState } from 'react'
import { X, Menu } from 'lucide-react' // optional icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="relative z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-4 fixed top-4 right-4 z-50 text-white"
      >
        <Menu size={28} />
      </button>

      {/* Overlay (darkens background when menu is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        <ul className="flex flex-col mt-20 space-y-6 px-8 text-gray-700 text-lg">
          <li><a href="#">Registration</a></li>
          <li><a href="#">QAF</a></li>
          <li><a href="#">What's New</a></li>
          <li><a href="#">About</a></li>
        </ul>

        <div className="absolute bottom-8 px-8 text-sm text-gray-500 space-y-1">
          <p>Privacy & Cookies</p>
          <p>Terms of Use</p>
        </div>
      </div>
    </nav>
  )
}
