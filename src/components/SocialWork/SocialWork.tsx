import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  getStoredPhotos,
  getStoredCategories,
  getRandomCategoryPhoto,
  fetchAllPhotos,
  GALLERY_UPDATE_EVENT,
} from '../../data/galleryStore'
import s from './SocialWork.module.css'

gsap.registerPlugin(ScrollTrigger)

interface SlideData {
  title: string
  subtitle: string
  description: string
  stat: string
  image: string
}

const SLIDE_CATEGORY_KEYWORDS: string[][] = [
  ['mardini', 'lathi', 'defense', 'combat'],
  ['shakti-bhava', 'consciousness', 'survivor', 'healing'],
  ['shakti-varta', 'seminar', 'discourse', 'research'],
  ['mardini', 'sword', 'martial', 'aaryaveera'],
  ['community', 'tribal', 'outreach', 'youth'],
]

const SLIDES: SlideData[] = [
  {
    title: 'Village Defense Camp',
    subtitle: 'Nagpur, Maharashtra',
    description: '340+ women trained in Lathi-Kaushal and tactical neighborhood defense.',
    stat: '340+ Trained',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Survivor Circle',
    subtitle: 'Amravati, Maharashtra',
    description: 'Breaking silence on domestic trauma with confidential psychological pods.',
    stat: '1,200+ Healed',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Shakti Varta Seminar',
    subtitle: 'Pune, Maharashtra',
    description: 'Academic research, white papers, and epigraphical discourse on Vedic heroines.',
    stat: '45+ Papers',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sword Training Camp',
    subtitle: 'Wardha, Maharashtra',
    description: 'Revival of ancient Bharatiya martial arts and mental fear-eradication.',
    stat: '600+ Warriors',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Youth Leadership',
    subtitle: 'Yavatmal, Maharashtra',
    description: 'Shakti Sabha character and leadership academy for girls 14–20, guided by the Aaryaveera worldview.',
    stat: '15,000+ Cadets',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
  },
]

// How many full copies of the list we render (3 is enough for a clean infinite row)
const COPIES = 3

// Shortest circular offset of `index` from `current` on a ring of `total` items
function getCircularOffset(index: number, current: number, total: number) {
  let diff = index - current
  const half = total / 2
  while (diff > half) diff -= total
  while (diff < -half) diff += total
  return diff
}

interface RowCardProps {
  slide: SlideData
  offset: number
  isWrapping: boolean
  step: number
  onSelect: () => void
}

function RowCard({ slide, offset, isWrapping, step, onSelect }: RowCardProps) {
  const abs = Math.abs(offset)
  const active = offset === 0

  const scale = abs === 0 ? 1 : abs === 1 ? 0.88 : 0.78
  const opacity = abs > 2 ? 0 : abs === 2 ? 0.5 : 1

  return (
    <div
      className={s.slide}
      data-active={active ? 'true' : 'false'}
      style={{
        transform: `translate(-50%, -50%) translateX(${offset * step}px) scale(${scale})`,
        opacity,
        zIndex: 100 - abs,
        pointerEvents: abs <= 2 ? 'auto' : 'none',
        transition: isWrapping ? 'none' : undefined,
      }}
      onClick={!active && abs <= 2 ? onSelect : undefined}
      aria-hidden={abs > 2}
    >
      <div className={s.slideContent}>
        <div
          className={s.slideImage}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        <div className={s.slideGradient} />
        <div className={s.slideContentInner}>
          <h2 className={s.slideTitle}>{slide.title}</h2>
          <h3 className={s.slideSubtitle}>{slide.subtitle}</h3>
          <p className={s.slideDescription}>{slide.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function SocialWork() {
  const [slides, setSlides] = useState<SlideData[]>(SLIDES)
  const total = slides.length

  // 3 copies of the list → the wrap point is far off-screen, so it is invisible
  const loopSlides = useMemo(() => {
    const arr: SlideData[] = []
    for (let c = 0; c < COPIES; c++) {
      for (const sl of slides) arr.push(sl)
    }
    return arr
  }, [slides])

  const loopLen = loopSlides.length

  const [pos, setPos] = useState(0)
  const prevPosRef = useRef(0)

  const [dims, setDims] = useState({ step: 328, cardW: 300 })

  const secRef = useRef<HTMLElement>(null)

  // Responsive card sizing
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      let cardW = 300
      let gap = 28
      if (vw < 520) {
        cardW = 200
        gap = 14
      } else if (vw < 768) {
        cardW = 240
        gap = 18
      } else if (vw < 1100) {
        cardW = 270
        gap = 24
      }
      setDims({ step: cardW + gap, cardW })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Core movement helpers -----------------------------------------------------
  const moveBy = (delta: number) => {
    setPos(prev => {
      prevPosRef.current = prev
      return ((prev + delta) % loopLen + loopLen) % loopLen
    })
  }

  const handleNext = () => moveBy(1)
  const handlePrev = () => moveBy(-1)

  // Clicking a card in the row → bring it to the centre
  const handleSelectCard = (loopIdx: number) => {
    setPos(prev => {
      prevPosRef.current = prev
      const off = getCircularOffset(loopIdx, prev, loopLen)
      return ((prev + off) % loopLen + loopLen) % loopLen
    })
  }

  // Dot click → move the shortest distance to that logical slide
  const handleDot = (logicalIdx: number) => {
    setPos(prev => {
      prevPosRef.current = prev
      const cur = ((prev % total) + total) % total
      let delta = logicalIdx - cur
      while (delta > total / 2) delta -= total
      while (delta < -total / 2) delta += total
      return ((prev + delta) % loopLen + loopLen) % loopLen
    })
  }

  // Load photos from DB / gallery store ---------------------------------------
  useEffect(() => {
    const randomizeCategoryPhotos = () => {
      const allPhotos = getStoredPhotos()
      const categories = getStoredCategories()

      setSlides(
        SLIDES.map((slide, idx) => {
          const kw = SLIDE_CATEGORY_KEYWORDS[idx] || ['all']
          const randomPhoto = getRandomCategoryPhoto(kw, slide.image, allPhotos, categories)
          return { ...slide, image: randomPhoto.url }
        })
      )
    }

    randomizeCategoryPhotos()
    fetchAllPhotos().then(() => randomizeCategoryPhotos()).catch(() => {})

    window.addEventListener(GALLERY_UPDATE_EVENT, randomizeCategoryPhotos)
    window.addEventListener('storage', randomizeCategoryPhotos)

    return () => {
      window.removeEventListener(GALLERY_UPDATE_EVENT, randomizeCategoryPhotos)
      window.removeEventListener('storage', randomizeCategoryPhotos)
    }
  }, [])

  // Intro GSAP animations ------------------------------------------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sw="header"]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' },
      })

      gsap.from('[data-sw="stage"]', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stage"]', start: 'top 85%' },
      })
    }, secRef)

    return () => ctx.revert()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopLen])

  const activeLogical = ((pos % total) + total) % total

  const trackStyle = { '--card-w': `${dims.cardW}px` } as CSSProperties
  const viewportHeight = Math.round(dims.cardW * (4 / 3) + 100)

  return (
    <section ref={secRef} className={s.section}>
      {/* Section Header */}
      <div data-sw="header" className={s.carouselHeader}>
        <span className={s.eyebrow}>12 Years · 3 Streams · 1 Mission</span>
        <h2 className={s.carouselTitle}>Where Shakti Sabha Has Stood</h2>
        <p className={s.carouselSub}>जहाँ हम खड़े हैं — धरातलीय सामाजिक कार्य</p>
      </div>

      {/* Infinite horizontal gallery stage */}
      <div data-sw="stage" className={s.carouselWrap}>
        <div className={s.viewportWrap}>
          <div className={s.rowViewport} style={{ height: viewportHeight }}>
            <div className={s.rowTrack} style={trackStyle}>
              {loopSlides.map((slide, i) => {
                const currentOffset = getCircularOffset(i, pos, loopLen)
                const previousOffset = getCircularOffset(i, prevPosRef.current, loopLen)
                // Only true when a slide actually wraps off-screen → snap it instantly
                const isWrapping = Math.abs(currentOffset - previousOffset) > 2

                return (
                  <RowCard
                    key={i}
                    slide={slide}
                    offset={currentOffset}
                    isWrapping={isWrapping}
                    step={dims.step}
                    onSelect={() => handleSelectCard(i)}
                  />
                )
              })}
            </div>
          </div>

          <button
            type="button"
            className={`${s.navBtn} ${s.btnPrev}`}
            onClick={handlePrev}
            aria-label="Previous Slide"
            title="Previous Slide"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className={`${s.navBtn} ${s.btnNext}`}
            onClick={handleNext}
            aria-label="Next Slide"
            title="Next Slide"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className={s.dotsRow}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${s.dot} ${activeLogical === idx ? s.dotActive : ''}`}
              onClick={() => handleDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className={s.ctaRow}>
          <Link to="/social-work" className={s.exploreLink}>
            Explore Full Social Work Archive &amp; Field Reports →
          </Link>
        </div>
      </div>
    </section>
  )
}
