import { useEffect, useReducer, useRef, useState } from 'react'
import {
  getStoredPhotos,
  getStoredCategories,
  getRandomCategoryPhoto,
  fetchAllPhotos,
  GALLERY_UPDATE_EVENT
} from '../../data/galleryStore'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './SocialWork.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/* 1. useReducer & Slides Data Model                                   */
/* ------------------------------------------------------------------ */

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
  ['community', 'tribal', 'outreach', 'youth']
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
    description: 'Aaryaveera character certification and leadership academy for girls 14–20.',
    stat: '15,000+ Cadets',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
  },
]

const STATS = [
  { count: '12+', label: 'Years of Impact' },
  { count: '50K+', label: 'Women Reached' },
  { count: '200+', label: 'Villages Served' },
  { count: '3', label: 'Active Programmes' },
]

interface SlidesState {
  slideIndex: number
}

type SlidesAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; index: number }

const initialState: SlidesState = {
  slideIndex: 0,
}

function slidesReducer(state: SlidesState, event: SlidesAction): SlidesState {
  if (event.type === 'NEXT') {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % SLIDES.length,
    }
  }
  if (event.type === 'PREV') {
    return {
      ...state,
      slideIndex: state.slideIndex === 0 ? SLIDES.length - 1 : state.slideIndex - 1,
    }
  }
  if (event.type === 'GOTO') {
    return {
      ...state,
      slideIndex: event.index,
    }
  }
  return state
}

/* ------------------------------------------------------------------ */
/* 2. useTilt Hook (Mouse Coordinates & 3D Tilt on Hover)             */
/* ------------------------------------------------------------------ */

function useTilt(active: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !active) return

    const el = ref.current
    let rect: DOMRect | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return
      if (!rect) {
        rect = el.getBoundingClientRect()
      }
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      el.style.setProperty('--px', String(px))
      el.style.setProperty('--py', String(py))
    }

    const handleMouseLeave = () => {
      rect = null
      el.style.setProperty('--px', '0.5')
      el.style.setProperty('--py', '0.5')
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [active])

  return ref
}

/* ------------------------------------------------------------------ */
/* 3. Slide Component (Offset, 3D Perspective, & Tilt)                */
/* ------------------------------------------------------------------ */

interface SlideProps {
  slide: SlideData
  offset: number
  onSelect: () => void
}

function Slide({ slide, offset, onSelect }: SlideProps) {
  const active = offset === 0
  const ref = useTilt(active)

  return (
    <div
      ref={ref}
      className={s.slide}
      data-active={active ? 'true' : 'false'}
      style={
        {
          '--offset': offset,
          '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
        } as React.CSSProperties
      }
      onClick={!active ? onSelect : undefined}
    >
      {/* Ambient background with parallax offset */}
      <div
        className={s.slideBackground}
        style={{
          backgroundImage: `url('${slide.image}')`,
        }}
      />

      {/* 3D Tilted Card Content */}
      <div className={s.slideContent}>
        {/* Slightly blurred image layer */}
        <div
          className={s.slideImage}
          style={{
            backgroundImage: `url('${slide.image}')`,
          }}
        />
        <div className={s.slideGradient} />

        {/* Crystal-sharp text on top */}
        <div className={s.slideContentInner}>
          <div className={s.slideBadge}>{slide.stat}</div>
          <h2 className={s.slideTitle}>{slide.title}</h2>
          <h3 className={s.slideSubtitle}>{slide.subtitle}</h3>
          <p className={s.slideDescription}>{slide.description}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Main SocialWork Component (Section 4)                            */
/* ------------------------------------------------------------------ */

export default function SocialWork() {
  const [state, dispatch] = useReducer(slidesReducer, initialState)
  const [slides, setSlides] = useState<SlideData[]>(SLIDES)
  const secRef = useRef<HTMLElement>(null)

  /* Dynamically load & randomize photos according to categories from Admin Dashboard / DB */
  useEffect(() => {
    const randomizeCategoryPhotos = () => {
      const allPhotos = getStoredPhotos()
      const categories = getStoredCategories()

      setSlides(prev =>
        SLIDES.map((slide, idx) => {
          const kw = SLIDE_CATEGORY_KEYWORDS[idx] || ['all']
          const randomPhoto = getRandomCategoryPhoto(kw, slide.image, allPhotos, categories)
          return {
            ...slide,
            image: randomPhoto.url
          }
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

  /* Intro GSAP scroll animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sw="header"]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' },
      })
      gsap.from('[data-sw="stat"]', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stats"]', start: 'top 80%' },
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

  /* Keyboard arrow navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        dispatch({ type: 'PREV' })
      } else if (e.key === 'ArrowRight') {
        dispatch({ type: 'NEXT' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      {/* ── Stats Row ────────────────────────────────────────────── */}
      <div data-sw="stats" className={s.statsRow}>
        {STATS.map((st, i) => (
          <div key={i} data-sw="stat" className={s.statBox}>
            <div className={s.statCount}>{st.count}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Section Header ───────────────────────────────────────── */}
      <div data-sw="header" className={s.carouselHeader}>
        <span className={s.eyebrow}>12 Years · 3 Streams · 1 Mission</span>
        <h2 className={s.carouselTitle}>Where Shakti Sabha Has Stood</h2>
        <p className={s.carouselSub}>जहाँ हम खड़े हैं — धरातलीय सामाजिक कार्य</p>
      </div>

      {/* ── Keyframers 3D Carousel (useReducer + offset + tilt) ──── */}
      <div data-sw="stage" className={s.carouselWrap}>
        <div className={s.slidesContainer}>
          <div className={s.slides}>
            <button
              type="button"
              className={`${s.navBtn} ${s.btnPrev}`}
              onClick={() => dispatch({ type: 'PREV' })}
              aria-label="Previous Slide"
              title="Previous Slide"
            >
              ‹
            </button>

            {[...SLIDES, ...SLIDES, ...SLIDES].map((slide, i) => {
              const offset = SLIDES.length + (state.slideIndex - i)
              // Only render slides within visible range (-2 to 2) for maximum smoothness
              if (Math.abs(offset) > 2) return null
              return (
                <Slide
                  key={`${slide.title}-${i}`}
                  slide={slide}
                  offset={offset}
                  onSelect={() => dispatch({ type: 'GOTO', index: i % SLIDES.length })}
                />
              )
            })}

            <button
              type="button"
              className={`${s.navBtn} ${s.btnNext}`}
              onClick={() => dispatch({ type: 'NEXT' })}
              aria-label="Next Slide"
              title="Next Slide"
            >
              ›
            </button>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className={s.dotsRow}>
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`${s.dot} ${state.slideIndex === idx ? s.dotActive : ''}`}
              onClick={() => dispatch({ type: 'GOTO', index: idx })}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA to complete Social Work archive */}
        <div className={s.ctaRow}>
          <Link to="/social-work" className={s.exploreLink}>
            Explore Full Social Work Archive & Field Reports →
          </Link>
        </div>
      </div>
    </section>
  )
}
