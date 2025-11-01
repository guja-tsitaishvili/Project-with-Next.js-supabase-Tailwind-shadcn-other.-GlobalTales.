import React from "react"
import RotatingTexts from "@/components/ui/RotatingText/RotatingTexts"
import Image from "next/image"
// Mobile‑first, responsive login layout for Next.js + Tailwind
// - Title "GlobalTales" centered on top with a nice display style
// - Middle placeholder for an image (you can swap the src later)
// - Minimal auth form (email + password)
// - Extra desktop-only sidebar with space for future content
// - No custom Tailwind colors required; uses defaults and subtle opacity

export default function WelcomePage() {
  return (
    <main className="min-h-dvh grid grid-rows-[auto,1fr] bg-gradient-to-b from-background to-muted">
      {/* Top bar / Title */}
      <header className="sticky top-0 z-10 ">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="relative h-14 flex items-center text-foreground">
          <h1 className="absolute left-1/2 -translate-x-1/2 select-none tracking-tight font-semibold leading-none text-2xl sm:text-3xl md:text-4xl">
            <span className="font-extrabold [letter-spacing:-0.02em] text-[#2f2fbd]">Global</span>
            <span className="ml-1 font-extrabold italic [letter-spacing:-0.02em]">Tales</span>
          </h1>
           <a
        href="/login-register"
        className="ml-auto text-sm  px-3 py-1  bg-primary text-primary-foreground hover:bg-primary/90 "
      >login</a>
        </div>
                </div>

      </header>

      {/* Content area */}
      <section className="mx-auto w-full max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-1 py-8 sm:py-10 md:py-12">
       

     {/* --- HERO (put this inside the section where you left the comment) --- */}
<div className="relative overflow-visible text-card-foreground">
  {/* Background image */}
  <div
    className="w-full h-[65vh] md:h-[80vh] bg-center bg-cover"
    style={{ backgroundImage: "url('/VisData/fotocollage.webp')" }}
  />

  {/* Optional subtle scrim for readability */}
  <div className="pointer-events-none absolute inset-0 
  md:bg-gradient-to-t md:from-black/40 md:via-black/10 md:to-transparent">
</div>


  {/* GREEN RIBBON that starts in white area and enters image */}

{/* RIBBON WRAPPER */}
{/* RIBBON WRAPPER */}
<div
  className="
    absolute top-1/2 left-0 -translate-y-1/2
    -translate-x-6 sm:-translate-x-1
    lg:-translate-x-14 xl:-translate-x-25 2xl:-translate-x-[14rem]
    z-10
  "
>
  {/* GREEN BOX — give it real width on desktop */}
  <div
    className="
    pointer-events-auto text-white rounded-2xl
    px-4 py-3 sm:px-6 sm:py-4
    max-w-[96vw]
    sm:max-w-none sm:w-[40rem]
    xl:w-[52rem]
    2xl:w-[56rem]
    2xl:[&>p]:line-clamp-2
    2xl:[&>p]:leading-tight
    2xl:[&>p]:text-balance
    flex justify-center sm:justify-start   /* 👈 add this line */
  "
  >
    <RotatingTexts onImage size="hero" align="left" />
  </div>
</div>


</div>



        <aside className="hidden lg:block">
          <div className="h-full rounded-1xl   dark:border-white/10 bg-white/60 dark:bg-slate-950/40 p-6">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold tracking-tight mb-2">Welcome to GlobalTales</h2>
              <p className="text-sm opacity-80 mb-6">
                This space is reserved for desktop screens. Add your future widgets here:
                onboarding tips, recently featured locations, map previews, or community stats.
              </p>

              <ul className="grid gap-3">
                <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/60">
                  <div className="font-medium">Interactive Map Teaser</div>
                  <p className="text-sm opacity-75">Show a small preview of clicks → create post with coordinates.</p>
                </li>
                <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/60">
                  <div className="font-medium">Community Highlights</div>
                  <p className="text-sm opacity-75">Spotlight trending places, curated by users.</p>
                </li>
                <li className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/60">
                  <div className="font-medium">Why Join?</div>
                  <p className="text-sm opacity-75">Save favorites, post recommendations, and explore the world.</p>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      {/* Footer (optional, hidden on mobile) */}
      <footer className="hidden md:block border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-screen-xl px-4 py-6 text-xs opacity-70">
          © {new Date().getFullYear()} GlobalTales — All rights reserved.
        </div>
      </footer>
    </main>
  )
}
