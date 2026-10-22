import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './SocialWork.module.css'

gsap.registerPlugin(ScrollTrigger)

const CASES = [
  {
    title: 'Village Defense Camp',
    location: 'Nagpur, Maharashtra',
    description: '340 women trained in Lathi-Kaushal',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
    bg: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1920&auto=format&fit=crop&q=50',
  },
  {
    title: 'Survivor Circle',
    location: 'Amravati, Maharashtra',
    description: 'Breaking silence on PTSD & trauma',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    bg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&auto=format&fit=crop&q=50',
  },
  {
    title: 'Shakti Varta Seminar',
    location: 'Pune, Maharashtra',
    description: 'Research & discourse on women warriors',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
    bg: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1920&auto=format&fit=crop&q=50',
  },
  {
    title: 'Sword Training Camp',
    location: 'Wardha, Maharashtra',
    description: 'Ancient Bharatiya martial arts revival',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    bg: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1920&auto=format&fit=crop&q=50',
  },
  {
    title: 'Youth Leadership Program',
    location: 'Yavatmal, Maharashtra',
    description: 'Aaryaveera certification for girls 14–20',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=50',
  },
]

const STATS = [
  { count: '12+', label: 'Years of Impact' },
  { count: '50K+', label: 'Women Reached' },
  { count: '200+', label: 'Villages Served' },
  { count: '3', label: 'Active Programmes' },
]

type Pos = 'current' | 'prev' | 'next' | 'hiddenLeft' | 'hiddenRight'

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** Where a card sits relative to the current one. Drives CSS via data-pos. */
function getPos(index: number, current: number, total: number): Pos {
  const d = mod(index - current, total)
  if (d === 0) return 'current'
  if (d === 1) return 'next'
  if (d === total - 1) return 'prev'
  return d <= total / 2 ? 'hiddenRight' : 'hiddenLeft'
}

export default function SocialWork() {
  const secRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const btnLeft = useRef<HTMLButtonElement>(null)
  const btnRight = useRef<HTMLButtonElement>(null)
  const infoRefs = useRef<(HTMLDivElement | null)[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const animating = useRef(false)

  // `current` drives cards + background (CSS transitions, instant).
  // `infoIndex` drives the text block, which swaps midway through a GSAP timeline.
  const [current, setCurrent] = useState(0)
  const [infoIndex, setInfoIndex] = useState(0)

  const resetTilt = useCallback(() => {
    stageRef.current?.style.setProperty('--tilt', '0deg')
  }, [])

  const goTo = useCallback(
    (target: number) => {
      if (animating.current || target === current) return
      animating.current = true
      resetTilt()

      const buttons = [btnLeft.current, btnRight.current].filter(Boolean)
      const outTexts = infoRefs.current[infoIndex]?.querySelectorAll('[data-sw-text]') ?? []
      const inTexts = infoRefs.current[target]?.querySelectorAll('[data-sw-text]') ?? []

      // Cards and background animate through CSS transitions as soon as state changes
      setCurrent(target)

      tlRef.current = gsap
        .timeline({
          onComplete: () => {
            animating.current = false
          },
        })
        .to(buttons, { opacity: 0.5, pointerEvents: 'none', duration: 0.2 })
        .to(outTexts, { y: -120, opacity: 0, stagger: 0.1, duration: 0.4 }, '<')
        // Swap which info block is displayed, synchronously, so the next tween can see it
        .call(() => {
          flushSync(() => setInfoIndex(target))
        })
        .fromTo(
          inTexts,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
        )
        .to(buttons, { opacity: 1, pointerEvents: 'all', duration: 0.2 })
    },
    [current, infoIndex, resetTilt]
  )

  const next = () => goTo(mod(current + 1, CASES.length))
  const prev = () => goTo(mod(current - 1, CASES.length))

  /* Mouse-follow tilt on the current card (the info text tilts with it via --tilt) */
  const handleTilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2)
    const clamped = Math.max(-1, Math.min(1, nx))
    stageRef.current?.style.setProperty('--tilt', `${clamped * 15}deg`)
  }

  /* Intro animations */
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
        y: 80,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stage"]', start: 'top 90%' },
      })
    }, secRef)

    return () => {
      ctx.revert()
      tlRef.current?.kill()
    }
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      {/* Stats row */}
      <div data-sw="stats" className={s.statsRow}>
        {STATS.map((st, i) => (
          <div key={i} data-sw="stat" className={s.statBox}>
            <div className={s.statCount}>{st.count}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Carousel area */}
      <div className={s.carouselWrap}>
        {/* Blurred background — every image stays mounted so it can transition */}
        <div className={s.bgLayer} aria-hidden="true">
          {CASES.map((c, i) => (
            <div
              key={i}
              className={s.bgImg}
              data-pos={getPos(i, current, CASES.length)}
            >
              <img src={c.bg} alt="" />
            </div>
          ))}
        </div>

        {/* Header */}
        <div data-sw="header" className={s.carouselHeader}>
          <span className={s.eyebrow}>12 Years · 3 Streams · 1 Mission</span>
          <h2 className={s.carouselTitle}>Where Shakti Sabha Has Stood</h2>
          <p className={s.carouselSub}>जहाँ हम खड़े हैं</p>
        </div>

        {/* Stage: cards, info text and arrows */}
        <div data-sw="stage" ref={stageRef} className={s.stage}>
          <div className={s.cardList}>
            <div className={s.cardsWrapper}>
              {CASES.map((c, i) => {
                const pos = getPos(i, current, CASES.length)
                const isCurrent = pos === 'current'
                return (
                  <div
                    key={i} /* stable key: the same element persists, so CSS can animate it */
                    className={s.card}
                    data-pos={pos}
                    onPointerMove={isCurrent ? handleTilt : undefined}
                    onPointerLeave={isCurrent ? resetTilt : undefined}
                    onClick={pos === 'prev' || pos === 'next' ? () => goTo(i) : undefined}
                  >
                    <img src={c.image} alt={c.title} draggable={false} />
                  </div>
                )
              })}
            </div>
          </div>

          <div className={s.infoList} aria-live="polite">
            <div className={s.infoWrapper}>
              {CASES.map((c, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    infoRefs.current[i] = el
                  }}
                  className={`${s.info} ${i === infoIndex ? s.infoActive : ''}`}
                  aria-hidden={i !== infoIndex}
                >
                  <div data-sw-text className={`${s.text} ${s.infoTitle}`}>{c.title}</div>
                  <div data-sw-text className={`${s.text} ${s.infoLoc}`}>{c.location}</div>
                  <div data-sw-text className={`${s.text} ${s.infoDesc}`}>{c.description}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            ref={btnLeft}
            className={`${s.arrowBtn} ${s.btnLeft}`}
            onClick={prev}
            aria-label="Previous"
          >
            <svg viewBox="0 0 512 512" fill="none">
              <polyline points="328 112 184 256 328 400" stroke="#fff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            ref={btnRight}
            className={`${s.arrowBtn} ${s.btnRight}`}
            onClick={next}
            aria-label="Next"
          >
            <svg viewBox="0 0 512 512" fill="none">
              <polyline points="184 112 328 256 184 400" stroke="#fff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className={s.dots}>
          {CASES.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === current ? s.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to case ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className={s.ctaRow}>
          <Link to="/social-work" className={s.ctaBtn}>Full Impact Archive →</Link>
          <Link to="/events" className={s.ctaGhost}>Upcoming Camps →</Link>
        </div>
      </div>
    </section>
  )
}
