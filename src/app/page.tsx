"use client"
import React from "react"
import RotatingTexts from "@/components/ui/RotatingText/RotatingTexts"
import Image from "next/image"
import {Menu, X } from 'lucide-react'
import {useState} from 'react'
import Link from 'next/link'
import Slideshow from "@/components/slideshow/Slideshow"
// Mobile‑first, responsive login layout for Next.js + Tailwind
// - Title "GlobalTales" centered on top with a nice display style
// - Middle placeholder for an image (you can swap the src later)
// - Minimal auth form (email + password)
// - Extra desktop-only sidebar with space for future content
// - No custom Tailwind colors required; uses defaults and subtle opacity

export default function WelcomePage() {
     const [isOpen, setIsOpen] = useState(false)
  return (
    <main className="relative">
    <section
        className="h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/visData/background/Background.jpg')" }}
      >
         
        <button 
          onClick={() => setIsOpen(true)}
          className="p-4 fixed top-4 right-4 z-50 text-white"
          > 
          <Menu size={28} />
          </button>
       <div className="relative flex items-end justify-center h-full pb-[28%]">
          <Link 
          href="/login-register"
          className="text-white text-3xl font-light tracking-wide">
            join
          </Link>
        </div>
      </section>
        <div  
        className={`fixed inset-0 bg-white transition-transform duration-500 ease-in-out transform z-[60] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        >
                <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={28} />
        </button>
             
               <ul className="flex flex-col items-start mt-20 space-y-6 px-10 text-gray-700 text-lg">
          <li>
            <a href="/login-register">Registration</a></li>
          <li><a href="/QAF">QAF</a></li>
          <li><a href="/whatsnew">What's New</a></li>
          <li><a href="/about">About</a></li>
        </ul>


        <div className="absolute bottom-8 px-10 text-sm text-gray-500 space-y-1">
          <p>Privacy & Cookies</p>
          <p>Terms of Use</p>
        </div>

       </div>
     {/* Scrollable section below the hero */}
<section className="min-h-screen bg-white flex flex-col items-center justify-start px-6 py-16 text-center">
  {/* Title */}
  <h2 className="text-2xl sm:text-3xl font-light text-[#DA89D9] mb-4">
    Explore New Places
  </h2>

  {/* Subtitle */}
  <p className="max-w-md text-gray-600 mb-10 leading-relaxed">
    Explore the outdoors, uncover nature’s hidden gems, and meet new friends
    to share your hiking adventures.
  </p>

  {/* Video placeholder */}
 <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden mb-12">
  <video
    src="/visData/videos/hikingvideo.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover"
  />
</div>
  {/* Text blocks */}
  <div className="text-left w-full max-w-sm space-y-6 text-gray-700">
    <div>
      <h3 className="font-medium">History of Places</h3>
      <p className="text-sm text-gray-500">
        You can see different places' stories and how they looked in the past.
      </p>
    </div>

    <div>
      <h3 className="font-medium">Connect to New People</h3>
      <p className="text-sm text-gray-500">
        Find people with the same interests and plan hiking and adventures with them.
      </p>
    </div>

    <div>
      <h3 className="font-medium">Connect to New People</h3>
      <p className="text-sm text-gray-500">
        Find people with the same interests and plan hiking and adventures with them.
      </p>
    </div>
  </div>
</section>

{/* Section with slideshow placeholder and footer links */}
<section className="min-h-screen bg-white flex flex-col items-center justify-start px-6 py-16 text-center border-t border-gray-200">
  {/* Placeholder for future slideshow */}
    <Slideshow/>

  {/* Divider line */}
  <div className="w-full max-w-xs border-t border-[#d08bff]/40 mb-8"></div>

  {/* Footer-style links */}
  <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700 max-w-xs text-left">
    <div>
      <p className="mb-2 font-medium">ABOUT</p>
      <p>WHAT’S NEW</p>
      <p>STORIES</p>
      <p>CAREERS</p>
    </div>

    <div>
      <p className="mb-2 font-medium">INSTAGRAM</p>
      <p>GET UPDATES</p>
      <p>PRESS</p>
      <p>PRIVACY & COOKIES</p>
    </div>
  </div>
</section>

     
      
    </main>
  )
}
