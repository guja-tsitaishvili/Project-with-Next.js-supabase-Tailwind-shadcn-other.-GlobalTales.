'use client'

import { useEffect, useState } from 'react'

type Props = {
  onImage?: boolean
  size?: 'base' | 'hero'
  align?: 'left' | 'center' | 'right'
  clampTwo?: boolean
}

export default function RotatingTexts({
  onImage = false,
  size = 'base',
  align = 'center',
  clampTwo = false,
}: Props) {
  const lines = [
    'Discover hidden spots from real people.',
    'Click the map to pin a memory.',
    'Share your favorite cafes, trails, and views.',
    'Plan trips with community places.',
  ]

  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % lines.length)
        setFade(true)
      }, 100)
      return () => clearTimeout(swap)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const color = onImage
    ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
    : 'text-slate-700 dark:text-slate-200'

  const sizeCls =
    size === 'hero'
      ? 'text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl'
      : 'text-base md:text-lg'

  const alignCls =
    align === 'right' ? 'text-right md:text-right'
    : align === 'left' ? 'text-left md:text-left'
    : 'text-center'

  // Clamp to 2 lines (works if Tailwind line-clamp plugin is installed).
  // If you don't use the plugin, the inline styles fallback will still clamp.
  const clampCls = clampTwo ? 'line-clamp-2' : ''

  return (
    <p
      className={[
        // Use the display font variable we set on <main>
        'font-extrabold leading-tight text-balance',
        'transition-opacity duration-300',
        fade ? 'opacity-100' : 'opacity-0',
        color,
        sizeCls,
        alignCls,
        clampCls,
        'font-[var(--font-display)]',
      ].join(' ')}
      style={
        clampTwo
          ? {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }
          : undefined
      }
    >
      {lines[idx]}
    </p>
  )
}
