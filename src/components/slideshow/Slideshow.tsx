"use client"
import { useState, useRef, useEffect } from "react"

const images = [
  "/VisData/SlideSHowPic/womanpic.png",
  "/VisData/SlideSHowPic/vajapic.png",
  "/VisData/SlideSHowPic/webpic.jpeg",
  "/VisData/SlideSHowPic/mantakespics.png",
]

export default function Slideshow() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // --- handle swipe on mobile ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        // swipe left → next
        setCurrent((prev) => (prev + 1) % images.length)
      } else {
        // swipe right → prev
        setCurrent((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        )
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* === exact same footprint as your placeholder === */}
      <div
        className="w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[40vw] max-w-lg aspect-[3/4] rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200 mb-6 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}   
      </div>

      {/* === Dots indicator === */}
      <div className="flex space-x-2 mb-12">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              i === current
                ? "bg-gray-800 scale-125"
                : "bg-[#d08bff] opacity-70 hover:opacity-100"
            }`}
          ></span>
        ))}
      </div>
    </div>
  )
}
