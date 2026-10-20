import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import s from './Hero.module.css'

const BG_GRADIENT = 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 100%)'

const SLIDES = [
  {
    id: 'first',
    navLabel: 'Dream',
    title: 'Dream Big',
    bgUrl: 'https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc1OTY5NTJ8&ixlib=rb-4.0.3&q=85',
    activeClass: s.activeLink0,
  },
  {
    id: 'second',
    navLabel: 'Some',
    title: 'Some journeys we take alone',
    bgUrl: 'https://images.unsplash.com/photo-1489846986031-7cea03ab8fd0?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc1OTY5NTJ8&ixlib=rb-4.0.3&q=85',
    activeClass: s.activeLink1,
  },
  {
    id: 'third',
    navLabel: 'Follow',
    title: 'Follow your own path',
    bgUrl: 'https://images.unsplash.com/photo-1484359755660-c7ed8f31f0cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc1OTcyODB8&ixlib=rb-4.0.3&q=85',
    activeClass: s.activeLink2,
  },
  {
    id: 'fourth',
    navLabel: 'Stay',
    title: 'Stay Hungry',
    bgUrl: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc1OTc3OTJ8&ixlib=rb-4.0.3&q=85',
    activeClass: s.activeLink3,
  },
  {
    id: 'fifth',
    navLabel: 'Win',
    title: 'Win',
    bgUrl: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    activeClass: s.activeLink4,
  },
]

const DIRECTIONS = ['left', 'right', 'up', 'down'] as const

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadPercent, setLoadPercent] = useState(0)

  const currentIndexRef = useRef(-1)
  const animatingRef = useRef(false)

  // Preload all slide images before showing
  useEffect(() => {
    let count = 0
    const total = SLIDES.length

    SLIDES.forEach(slide => {
      const img = new Image()
      img.src = slide.bgUrl
      const onDone = () => {
        count++
        setLoadPercent(Math.round((count / total) * 100))
        if (count >= total) {
          setTimeout(() => {
            setImagesLoaded(true)
          }, 250)
        }
      }
      img.onload = onDone
      img.onerror = onDone
    })
  }, [])

  const calculateDirection = (current: number, target: number) => {
    const sequenceIndex = (target - current + SLIDES.length) % SLIDES.length % 4
    return DIRECTIONS[sequenceIndex]
  }

  const animateSection = useCallback((targetIndex: number, direction: 'left' | 'right' | 'up' | 'down') => {
    if (animatingRef.current || targetIndex === currentIndexRef.current) return
    animatingRef.current = true

    const sections = slideRefs.current.filter((el): el is HTMLDivElement => el !== null)
    const targetSection = sections[targetIndex]
    if (!targetSection) {
      animatingRef.current = false
      return
    }

    let animationProps = {}
    switch (direction) {
      case 'left':
        animationProps = { x: '-100%', autoAlpha: 0 }
        break
      case 'right':
        animationProps = { x: '100%', autoAlpha: 0 }
        break
      case 'up':
        animationProps = { y: '-100%', autoAlpha: 0 }
        break
      case 'down':
        animationProps = { y: '100%', autoAlpha: 0 }
        break
    }

    if (currentIndexRef.current >= 0) {
      const currentSection = sections[currentIndexRef.current]
      if (currentSection) {
        gsap.to(currentSection, {
          ...animationProps,
          autoAlpha: 0,
          duration: 0.85,
          ease: 'power2.inOut',
        })
      }
    }

    gsap.set(targetSection, { x: 0, y: 0, autoAlpha: 0, zIndex: 5 })

    gsap.to(targetSection, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        animatingRef.current = false
        currentIndexRef.current = targetIndex
        setActiveSlide(targetIndex)
      },
    })
  }, [])

  // Mount animation once images are loaded
  useEffect(() => {
    if (imagesLoaded && currentIndexRef.current === -1) {
      animateSection(0, 'right')
    }
  }, [imagesLoaded, animateSection])

  // Scroll lock and slide progression handler
  useEffect(() => {
    if (!imagesLoaded) return

    const handleWheel = (e: WheelEvent) => {
      // Only handle if user is at the top of the page (within the hero section)
      if (window.scrollY > 20) return

      // Moving down
      if (e.deltaY > 15) {
        if (currentIndexRef.current < SLIDES.length - 1) {
          // Trap scroll so page cannot skip to other sections until all images are seen
          e.preventDefault()
          e.stopPropagation()

          if (!animatingRef.current) {
            const nextIndex = currentIndexRef.current + 1
            animateSection(nextIndex, calculateDirection(currentIndexRef.current, nextIndex))
          }
        } else {
          // On final slide (index 4 - "Win"):
          // Allow normal scroll so user can now proceed to the rest of the website!
        }
      } else if (e.deltaY < -15) {
        // Moving up
        if (currentIndexRef.current > 0) {
          e.preventDefault()
          e.stopPropagation()

          if (!animatingRef.current) {
            const prevIndex = currentIndexRef.current - 1
            animateSection(prevIndex, calculateDirection(currentIndexRef.current, prevIndex))
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [imagesLoaded, animateSection])

  const handleNavClick = (index: number) => {
    if (animatingRef.current || index === activeSlide) return
    const dir = calculateDirection(currentIndexRef.current, index)
    animateSection(index, dir)
  }

  const handleScrollDown = () => {
    const nextSection = containerRef.current?.nextElementSibling
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <section ref={containerRef} className={s.heroContainer}>
      {/* Visual Preloader Screen until all images are loaded */}
      <div className={`${s.preloader} ${imagesLoaded ? s.preloaderHidden : ''}`}>
        <div className={s.preloaderLogo}>
          Shakti Sabha
          <span className={s.preloaderDev}>शक्ति सभा</span>
        </div>
        <div className={s.progressBarTrack}>
          <div className={s.progressBarFill} style={{ width: `${loadPercent}%` }} />
        </div>
        <span className={s.preloaderText}>Loading Experience {loadPercent}%</span>
      </div>

      <header className={s.heroHeader}>
        <nav className={s.navLinks}>
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleNavClick(idx)}
              className={`${s.navLink} ${activeSlide === idx ? slide.activeClass : ''}`}
            >
              {slide.navLabel}
            </button>
          ))}
        </nav>
      </header>

      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          id={slide.id}
          ref={el => {
            slideRefs.current[idx] = el
          }}
          className={s.sectionSlide}
        >
          <div className={s.wrapperOuter}>
            <div className={s.wrapperInner}>
              <div
                className={s.background}
                style={{
                  backgroundImage: `${BG_GRADIENT}, url('${slide.bgUrl}')`,
                }}
              >
                <h2 className={s.title}>{slide.title}</h2>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Dots & Counter */}
      <div className={s.slideCounter}>
        <div className={s.slideDots}>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              onClick={() => handleNavClick(i)}
              className={`${s.slideDot} ${activeSlide === i ? s.slideDotActive : ''}`}
            />
          ))}
        </div>
        <span>0{activeSlide + 1} / 0{SLIDES.length}</span>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        className={s.scrollDownIndicator}
        aria-label="Scroll down to content"
      >
        <span>{activeSlide === SLIDES.length - 1 ? 'Explore Site' : 'Scroll'}</span>
        <div className={s.scrollDownLine} />
      </button>
    </section>
  )
}
