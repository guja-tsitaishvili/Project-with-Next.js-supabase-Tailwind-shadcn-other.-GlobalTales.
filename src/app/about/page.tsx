"use client"

import React from "react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-black text-gray-800 dark:text-gray-100">
      {/* Hero Section */}

      {/* About Content */}
      <section className="py-20 px-6 md:px-16 max-w-5xl mx-auto leading-relaxed space-y-12">
        <article className="space-y-6">
          <h2 className="text-3xl font-semibold">What is GlobalTales?</h2>
          <p>
            <strong>GlobalTales</strong> is an interactive storytelling platform where travelers, adventurers, and
            everyday explorers can share their unique experiences from around the world. Each post is anchored to a
            location on a global map, creating a living mosaic of personal stories that together tell the world’s human
            narrative.
          </p>
          <p>
            Built with <span className="font-medium">Next.js, Supabase, Tailwind CSS</span>, and an interactive map
            powered by Leaflet, GlobalTales bridges technology with storytelling. Users can upload photos, add captions,
            and mark their adventures directly on the map — crafting a digital travel diary that others can explore.
          </p>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p>
            GlobalTales was born from a simple idea: to connect people through the beauty of shared journeys. Whether
            you’re hiking through the Caucasus, wandering the streets of Paris, or capturing a sunset in Bali — every
            experience matters. Our mission is to make those experiences visible, memorable, and connected.
          </p>
          <p>
            We believe stories can transcend borders and unite people. That’s why GlobalTales emphasizes authenticity,
            curiosity, and creativity. Every story on the map is a thread in the global tapestry of human adventure.
          </p>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Create an account:</strong> Sign up and personalize your profile with an avatar and bio.
            </li>
            <li>
              <strong>Share your story:</strong> Upload images, write your experience, and place it on the map.
            </li>
            <li>
              <strong>Explore the globe:</strong> Discover others’ stories by zooming through the interactive world map.
            </li>
            <li>
              <strong>Connect:</strong> Comment, react, and be inspired by travelers around the world.
            </li>
          </ul>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-semibold">The Vision</h2>
          <p>
            GlobalTales is more than just a website — it’s a growing community of explorers and creators who see the
            world as one shared story. In the future, we aim to introduce features like AI-powered story curation,
            personalized travel recommendations, and collaborative storytelling, allowing multiple users to create
            connected tales across places and timelines.
          </p>
        </article>

        <article className="space-y-6">
          <h2 className="text-3xl font-semibold">Created By</h2>
          <p>
            GlobalTales is crafted by <strong>Elguja Tsitaishvili (guja)</strong>, a passionate developer and student at
            <strong> Kutaisi International University</strong>, combining a love for technology, geography, and human
            stories. It began as a side project — an idea to turn memories into an interactive digital atlas — and is
            steadily evolving into a platform for dreamers, storytellers, and travelers worldwide.
          </p>
        </article>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} GlobalTales — Connecting People Through Stories.
        </p>
      </footer>
    </main>
  )
}
