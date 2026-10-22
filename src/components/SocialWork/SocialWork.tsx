import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** Signed shortest distance of item i from the current item (e.g. -2..2 for 5 items). */
function offsetOf(i: number, current: number, total: number) {
  const half = Math.floor(total / 2)
  return mod(i - current + half, total) - half
}

export default function SocialWork() {
  const secRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const infoRefs = useRef<(HTMLDivElement | null)[]>([])
  const btnLeft = useRef<HTMLButtonElement>(null)
  const btnRight = useRef<HTMLButtonElement>(null)

  const animating = useRef(false)
  const currentRef = useRef(0)
  // `from` = the card that just left the centre (kept on top while it slides away)
  const [pos, setPos] = useState({ current: 0, from: -1 })

  const textsOf = (i: number) =>
    infoRefs.current[i]?.querySelectorAll('[data-text]') ?? []

  /* ---------- navigation ---------- */
  const goTo = useCallback((target: number) => {
    const from = currentRef.current
    if (animating.current || target === from) return
    animating.current = true
    currentRef.current = target

    // cards + background move via CSS transitions as soon as the state changes
    setPos({ current: target, from })

    // clear any hover tilt
    cardsRef.current?.style.setProperty('--tilt', '0deg')
    gsap.set(
      infoRefs.current.filter((el): el is HTMLDivElement => !!el),
      { rotateY: 0 }
    )

    const buttons = [btnLeft.current, btnRight.current]
    const out = infoRefs.current[from]?.querySelectorAll('[data-text]') ?? []
    const into = infoRefs.current[target]?.querySelectorAll('[data-text]') ?? []

    gsap
      .timeline({ onComplete: () => { animating.current = false } })
      .to(buttons, { duration: 0.2, opacity: 0.5, pointerEvents: 'none' })
      .to(out, { duration: 0.4, stagger: 0.1, y: -120, opacity: 0 })
      .fromTo(
        into,
        { opacity: 0, y: 40 },
        { duration: 0.4, stagger: 0.1, y: 0, opacity: 1 }
      )
      .to(buttons, { duration: 0.2, opacity: 1, pointerEvents: 'all' })
  }, [])

  const step = (dir: 1 | -1) => goTo(mod(currentRef.current + dir, CASES.length))

  /* ---------- hover tilt on the centre card ---------- */
  const onTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const angle = Math.atan2(e.clientX - cx, 0) * (35 / Math.PI)
    cardsRef.current?.style.setProperty('--tilt', `${angle}deg`)
    const info = infoRefs.current[currentRef.current]
    if (info) gsap.set(info, { rotateY: angle })
  }

  const onTiltReset = () => {
    cardsRef.current?.style.setProperty('--tilt', '0deg')
    const info = infoRefs.current[currentRef.current]
    if (info) gsap.set(info, { rotateY: 0 })
  }

  /* ---------- intro: plays once when the carousel scrolls into view ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current
    const cards = cardsRef.current
    if (!stage || !cards) return

    const buttons = [btnLeft.current, btnRight.current]
    const firstTexts = infoRefs.current[0]?.querySelectorAll('[data-text]') ?? []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(firstTexts, { opacity: 1, y: 0 })
        return
      }

      animating.current = true
      stage.dataset.intro = 'true' // disables the CSS transition while GSAP drives the cards

      gsap.set(cards.children, { '--card-translateY-offset': '100vh' })
      gsap.set(firstTexts, { y: 40, opacity: 0 })
      gsap.set(buttons, { opacity: 0, pointerEvents: 'none' })

      ScrollTrigger.create({
        trigger: stage,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap
            .timeline({
              onComplete: () => {
                delete stage.dataset.intro
                animating.current = false
              },
            })
            .to(cards.children, {
              delay: 0.15,
              duration: 0.5,
              stagger: { ease: 'power4.inOut', from: 'end', amount: 0.1 },
              '--card-translateY-offset': '0vh',
            })
            .to(firstTexts, {
              delay: 0.5,
              duration: 0.4,
              stagger: 0.1,
              opacity: 1,
              y: 0,
            })
            .to(buttons, { duration: 0.4, opacity: 1, pointerEvents: 'all' }, '-=0.4')
        },
      })
    }, secRef)

    return () => {
      ctx.revert()
      delete stage.dataset.intro
      animating.current = false
    }
  }, [])

  /* ---------- header + stats reveal ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-sw="header"]', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' },
      })
      gsap.from('[data-sw="stat"]', {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-sw="stats"]', start: 'top 80%' },
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  const cardClass = (off: number) =>
    off === 0 ? s.cardCurrent
      : off === -1 ? s.cardPrev
      : off === 1 ? s.cardNext
      : off < 0 ? s.cardHiddenPrev
      : s.cardHiddenNext

  const bgClass = (off: number) =>
    off === 0 ? s.bgCurrent : off < 0 ? s.bgPrev : s.bgNext

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

      <div className={s.carouselWrap}>
        {/* Blurred, sliding background */}
        <div className={s.bgLayer} aria-hidden="true">
          {CASES.map((c, i) => {
            const off = offsetOf(i, pos.current, CASES.length)
            return (
              <div
                key={c.title}
                className={`${s.bgImage} ${bgClass(off)}`}
                style={{ zIndex: off === 0 ? 2 : 1 }}
              >
                <img src={c.bg} alt="" />
              </div>
            )
          })}
        </div>

        <div className={s.content}>
          {/* Header */}
          <div data-sw="header" className={s.carouselHeader}>
            <span className={s.eyebrow}>12 Years · 3 Streams · 1 Mission</span>
            <h2 className={s.carouselTitle}>Where Shakti Sabha Has Stood</h2>
            <p className={s.carouselSub}>जहाँ हम खड़े हैं</p>
          </div>

          {/* Stage: cards + overlaid info */}
          <div ref={stageRef} className={s.stage}>
            <div className={s.cardList}>
              <button
                ref={btnLeft}
                className={`${s.arrowBtn} ${s.arrowLeft}`}
                onClick={() => step(-1)}
                aria-label="Previous"
              >
                <svg viewBox="0 0 512 512" fill="none" aria-hidden="true">
                  <polyline
                    points="328 112 184 256 328 400"
                    stroke="#fff" strokeWidth="48"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div ref={cardsRef} className={s.cardsWrapper}>
                {CASES.map((c, i) => {
                  const off = offsetOf(i, pos.current, CASES.length)
                  return (
                    <div
                      key={c.title}
                      className={`${s.card} ${cardClass(off)}`}
                      style={{ zIndex: i === pos.from ? 50 : off === 0 ? 30 : 20 }}
                      onPointerMove={off === 0 ? onTilt : undefined}
                      onPointerLeave={off === 0 ? onTiltReset : undefined}
                      onClick={Math.abs(off) === 1 ? () => goTo(i) : undefined}
                    >
                      <div className={s.cardImage}>
                        <img src={c.image} alt={c.title} draggable={false} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                ref={btnRight}
                className={`${s.arrowBtn} ${s.arrowRight}`}
                onClick={() => step(1)}
                aria-label="Next"
              >
                <svg viewBox="0 0 512 512" fill="none" aria-hidden="true">
                  <polyline
                    points="184 112 328 256 184 400"
                    stroke="#fff" strokeWidth="48"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={s.infoList}>
              <div className={s.infoWrapper}>
                {CASES.map((c, i) => (
                  <div
                    key={c.title}
                    ref={el => { infoRefs.current[i] = el }}
                    className={s.info}
                    aria-hidden={i !== pos.current}
                  >
                    <h3 data-text className={`${s.text} ${s.name}`}>{c.title}</h3>
                    <p data-text className={`${s.text} ${s.loc}`}>{c.location}</p>
                    <p data-text className={`${s.text} ${s.desc}`}>{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className={s.dots}>
            {CASES.map((c, i) => (
              <button
                key={c.title}
                className={`${s.dot} ${i === pos.current ? s.dotActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${c.title}`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className={s.ctaRow}>
            <Link to="/social-work" className={s.ctaBtn}>Full Impact Archive →</Link>
            <Link to="/events" className={s.ctaGhost}>Upcoming Camps →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
