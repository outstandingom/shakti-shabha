import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './SocialWork.module.css'

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

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export default function SocialWork() {
  const secRef   = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const animating = useRef(false)
  const titleRefs = useRef<(HTMLDivElement | null)[]>([])
  const locRefs   = useRef<(HTMLDivElement | null)[]>([])
  const descRefs  = useRef<(HTMLDivElement | null)[]>([])
  const btnLeft   = useRef<HTMLButtonElement>(null)
  const btnRight  = useRef<HTMLButtonElement>(null)

  const prev = mod(current - 1, CASES.length)
  const next = mod(current + 1, CASES.length)

  const swap = useCallback((dir: 'left' | 'right') => {
    if (animating.current) return
    animating.current = true

    const targetIdx = dir === 'right'
      ? mod(current + 1, CASES.length)
      : mod(current - 1, CASES.length)

    const currentTitle = titleRefs.current[current]
    const currentLoc   = locRefs.current[current]
    const currentDesc  = descRefs.current[current]

    const nextTitle = titleRefs.current[targetIdx]
    const nextLoc   = locRefs.current[targetIdx]
    const nextDesc  = descRefs.current[targetIdx]

    gsap.timeline({
      onComplete: () => {
        animating.current = false
        setCurrent(targetIdx)
      }
    })
      .to([btnLeft.current, btnRight.current], { opacity: 0.4, pointerEvents: 'none', duration: 0.15 })
      .to([currentTitle, currentLoc, currentDesc], { y: -60, opacity: 0, stagger: 0.06, duration: 0.3 }, '-=0.1')
      .fromTo([nextTitle, nextLoc, nextDesc],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.35 }
      )
      .to([btnLeft.current, btnRight.current], { opacity: 1, pointerEvents: 'all', duration: 0.2 })
  }, [current])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sw="header"]', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
      gsap.from('[data-sw="stat"]', {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stats"]', start: 'top 80%' }
      })
    }, secRef)
    return () => ctx.revert()
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
        {/* Blurred BG */}
        <div className={s.bgLayer}>
          {CASES.map((c, i) => (
            <div
              key={i}
              className={`${s.bgImg} ${i === current ? s.bgActive : ''}`}
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

        {/* Cards */}
        <div className={s.cardArea}>
          <button ref={btnLeft} className={s.arrowBtn} onClick={() => swap('left')} aria-label="Previous">
            <svg viewBox="0 0 512 512" fill="none">
              <polyline points="328 112 184 256 328 400" stroke="#fff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={s.cardsWrapper}>
            {[prev, current, next].map((idx, pos) => {
              const c = CASES[idx]
              const cls = pos === 0 ? s.cardPrev : pos === 1 ? s.cardCurrent : s.cardNext
              return (
                <div key={`${idx}-${pos}`} className={`${s.card} ${cls}`}>
                  <img src={c.image} alt={c.title} draggable={false} />
                </div>
              )
            })}
          </div>

          <button ref={btnRight} className={s.arrowBtn} onClick={() => swap('right')} aria-label="Next">
            <svg viewBox="0 0 512 512" fill="none">
              <polyline points="184 112 328 256 184 400" stroke="#fff" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className={s.infoArea}>
          {CASES.map((c, i) => (
            <div key={i} className={`${s.info} ${i === current ? s.infoActive : s.infoHidden}`}>
              <div ref={el => { titleRefs.current[i] = el }} className={s.infoTitle}>{c.title}</div>
              <div ref={el => { locRefs.current[i] = el }} className={s.infoLoc}>{c.location}</div>
              <div ref={el => { descRefs.current[i] = el }} className={s.infoDesc}>{c.description}</div>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className={s.dots}>
          {CASES.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === current ? s.dotActive : ''}`}
              onClick={() => {
                if (!animating.current && i !== current) {
                  const dir = i > current ? 'right' : 'left'
                  // jump directly
                  setCurrent(i)
                }
              }}
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
