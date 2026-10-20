import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import s from './Hero.module.css'

const GIRL_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 1',
    heightClass: s.h_4_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 2',
    heightClass: s.h_6_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 3',
    heightClass: s.h_8_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 4',
    heightClass: s.h_10_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 5 (center)',
    heightClass: s.h_11_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 6',
    heightClass: s.h_10_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 7',
    heightClass: s.h_8_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 8',
    heightClass: s.h_6_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 9',
    heightClass: s.h_4_12,
  },
]

export default function Hero() {
  const secRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])

  useEffect(() => {
    const images = imgRefs.current.filter((img): img is HTMLImageElement => img !== null)
    const content = contentRef.current

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      images.forEach(img => {
        gsap.set(img, { width: '100%', y: '50vh' })
      })
      if (content) {
        gsap.set(content, { opacity: 1, y: 0 })
      }
      return
    }

    const centerIndex = Math.floor(images.length / 2)
    const STAGGER = 0.2
    const DURATION = 1

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Phase 1: expand widths from the center outward
      images.forEach((image, index) => {
        const delay = Math.abs(index - centerIndex) * STAGGER
        tl.to(
          image,
          {
            width: '100%',
            duration: DURATION,
            ease: 'power2.inOut',
          },
          delay
        )
      })

      const maxDelay = Math.max(
        ...images.map((_, index) => Math.abs(index - centerIndex) * STAGGER)
      )
      const totalFirstAnimationTime = maxDelay + DURATION

      // Phase 2: drop images downward, center outward (to 50vh so no overlap with shifted text)
      images.forEach((image, index) => {
        const delay = totalFirstAnimationTime + Math.abs(index - centerIndex) * STAGGER
        tl.to(
          image,
          {
            y: '50vh',
            duration: DURATION,
            ease: 'power2.out',
          },
          delay
        )
      })

      // Phase 3: fade in hero content cleanly above the photos
      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION,
            ease: 'power2.out',
          },
          totalFirstAnimationTime + 0.4
        )
      }
    }, secRef)

    return () => ctx.revert()
  }, [])

  const handleExplore = () => {
    const nextEl = secRef.current?.nextElementSibling
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <section ref={secRef} className={s.heroSection}>
      <div ref={contentRef} className={s.heroContent}>
        <h1 className={s.title}>
          Discover the world <br /> through people
        </h1>
        <button
          type="button"
          onClick={handleExplore}
          className={s.ctaBtn}
        >
          Start Exploring
        </button>
      </div>

      <div className={s.heroImages}>
        {GIRL_IMAGES.map((item, idx) => (
          <div key={idx} className={s.col}>
            <img
              ref={el => {
                imgRefs.current[idx] = el
              }}
              src={item.src}
              alt={item.alt}
              className={`${s.imgItem} ${item.heightClass}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
