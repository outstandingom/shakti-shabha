import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Aaryaveera.module.css'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { icon: '⚔',  title: 'Self-Defense & Training',  text: 'Aaryaveera Camps and Warrior Certification. The trained body is the first declaration of freedom.' },
  { icon: '🔥', title: 'Character & Leadership',    text: 'Courses that build the Aaryaveera spirit — noble, fearless, anchored in Dharma and cultural roots.' },
  { icon: '◎',  title: 'Dialogue & Research',       text: '"Aaryaveera Dialogues" under Shakti Varta — honest discourse on true masculinity, Paurush, and Dharma.' },
]

const COLORS = ['#CC230C','#E0550D','#C8433E','#FA9417','#F7A958','#F4BEA2','#D57A84']

function rnd(a: number, b: number) { return gsap.utils.random(a, b) }
function pickColor()               { return COLORS[Math.floor(Math.random() * COLORS.length)] }

export default function Aaryaveera() {
  const secRef  = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  /* ── Exact CodePen particle animation (no physics2D — pure GSAP attr tweens) ── */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const NS          = 'http://www.w3.org/2000/svg'
    const allCircles: SVGCircleElement[] = []
    const mainTl      = gsap.timeline({ paused: true })
    const NUM         = 100

    /* Helper: clone a new SVG circle */
    function mkCircle() {
      const c = document.createElementNS(NS, 'circle')
      c.setAttribute('cx', '0')
      c.setAttribute('cy', '0')
      c.setAttribute('r',  '0')
      allCircles.push(c)
      return c
    }

    /* ── GROUP 1: BEHIND (50 particles, float downward with glow) ── */
    for (let i = 0; i < NUM / 2; i++) {
      const p           = mkCircle()
      svg.insertBefore(p, svg.firstChild)

      const startR  = rnd(2, 32)
      const startCX = rnd(200, 300)
      const startCY = 400
      const driftX  = rnd(-30, 60)   // simulate angle 0–90 (rightward drift)
      const dur     = rnd(8, 10)

      gsap.set(p, {
        attr:   { cx: startCX, cy: startCY, r: 0 },
        filter: 'url(#avGlow)',
        fill:   pickColor(),
        opacity: 1,
      })

      // grow → drift down + shrink (matches original tl structure)
      const tl = gsap.timeline({ repeat: 3 })
      tl.to(p, { attr: { r: startR }, duration: dur / 2 })
        .to(p, {
            attr: { cy: 700, cx: startCX + driftX, r: 0 },
            opacity: 0.8,
            duration: dur,
            ease: 'power1.inOut',
          }, `-=${dur / 2}`)

      mainTl.add(tl, i / 10)
    }

    /* ── GROUP 2: IN FRONT (100 particles, float downward, no glow) ── */
    for (let i = 0; i < NUM; i++) {
      const p       = mkCircle()
      svg.appendChild(p)

      const startR  = rnd(1, 20)
      const startCX = rnd(250, 350)
      const startCY = rnd(350, 500)
      const driftX  = rnd(-60, 0)   // angle 0 to -90 (leftward drift)
      const dur     = rnd(10, 12)

      gsap.set(p, {
        attr:   { cx: startCX, cy: startCY, r: 0 },
        fill:   pickColor(),
        opacity: 1,
      })

      const tl = gsap.timeline({ repeat: 3 })
      tl.to(p, { attr: { r: startR }, duration: dur / 2 })
        .to(p, {
            attr: { cy: 650, cx: startCX + driftX, r: 0 },
            opacity: 0.6,
            duration: dur,
            ease: 'power1.in',
          }, `-=${dur / 2}`)

      mainTl.add(tl, i / 8)
    }

    /* ── GROUP 3: TOP OF HEAD (100 particles, float UPWARD) ── */
    for (let i = 0; i < NUM; i++) {
      const p       = mkCircle()
      svg.insertBefore(p, svg.firstChild)

      // Skip one color index (original does colorArray.length-1)+1
      const colorIdx = Math.floor(Math.random() * (COLORS.length - 1)) + 1
      const startR   = rnd(2, 10)
      const startCX  = rnd(250, 350)
      const startCY  = rnd(190, 210)
      const driftX   = rnd(0, 30)   // cx += 30 max, angle 0–90 rightward
      const dur      = rnd(6, 10)

      gsap.set(p, {
        attr:   { cx: startCX, cy: startCY, r: startR },
        fill:   COLORS[colorIdx],
        opacity: 1,
      })

      // gravity: -20 → particles shoot UPWARD off the top of head
      const t = gsap.fromTo(
        p,
        { attr: { r: startR }, opacity: 1 },
        {
          attr:    { r: 0, cx: startCX + driftX, cy: startCY - rnd(80, 180) },
          opacity: 0,
          duration: dur,
          repeat:  3,
          ease:    'power2.out',
        }
      )

      mainTl.add(t, i / 6)
    }

    /* ── Driver: loop mainTimeline over 12s, repeat forever ── */
    const allTl = gsap.timeline({ repeat: -1, yoyo: false })
    allTl.timeScale(1.1)
    allTl.to(mainTl, {
      time:     mainTl.duration(),
      duration: 12,
      ease:     'none',
    })

    return () => {
      allTl.kill()
      mainTl.kill()
      allCircles.forEach(c => c.parentNode?.removeChild(c))
    }
  }, [])

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: secRef.current, start: 'top 70%', toggleActions: 'play none none none' }
      })
      tl.from('[data-av="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 })
        .from('[data-av="title"]',   { y: '110%', duration: 1, ease: 'power4.out' }, '-=0.2')
        .from('[data-av="sub"]',     { opacity: 0, y: 14, duration: 0.5 }, '-=0.4')
        .from('[data-av="motto"]',   { opacity: 0, duration: 0.5 }, '-=0.3')
        .from('[data-av="card"]',    { opacity: 0, y: 24, stagger: 0.1, duration: 0.5 }, '-=0.2')
        .from('[data-av="cta"]',     { opacity: 0, y: 12, duration: 0.4 }, '-=0.1')
        .from('[data-av="svgwrap"]', { opacity: 0, scale: 0.9, duration: 0.8, ease: 'power3.out' }, '-=0.8')

      gsap.to(glowRef.current, {
        opacity: 0.55, scale: 1.12, repeat: -1, yoyo: true, duration: 3.5, ease: 'sine.inOut'
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div ref={glowRef} className={s.glow} />

      <div className={s.inner}>
        {/* LEFT: text + cards */}
        <div className={s.left}>
          <span data-av="eyebrow" className={s.eyebrow}>Signature Initiative · Aaryaveera</span>
          <div className={s.titleClip}>
            <span data-av="title" className={s.title}>AARYAVEERA</span>
          </div>
          <span data-av="sub"   className={s.sub}>आर्यवीरा · The Warrior Spirit</span>
          <span data-av="motto" className={s.motto}>"Shakti Se Shanti — From Strength, Peace"</span>
          <p className={s.poweredBy}>Powered by PrintingTask</p>

          <div className={s.grid}>
            {CARDS.map(c => (
              <div key={c.title} data-av="card" className={s.card}>
                <div className={s.icon}>{c.icon}</div>
                <div className={s.cardTitle}>{c.title}</div>
                <p className={s.cardText}>{c.text}</p>
              </div>
            ))}
          </div>

          <div data-av="cta" className={s.cta}>
            <Link to="/aaryaveera" className={s.btnWarriorGold}>Full Aaryaveera Programme</Link>
            <Link to="/courses"    className={s.btnWarriorOutline}>Enroll in a Course</Link>
          </div>
        </div>

        {/* RIGHT: SVG warrior — exact CodePen structure */}
        <div data-av="svgwrap" className={s.svgWrap}>
          <svg
            ref={svgRef}
            className={s.mainSVG}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
            overflow="visible"
          >
            <defs>
              {/* Exact glow filter from reference */}
              <filter id="avGlow" y="-50%" height="180%"
                colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Gold gradient on the face */}
              <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#E8C98A" />
                <stop offset="55%"  stopColor="#C9A96E" />
                <stop offset="100%" stopColor="#9A7340" />
              </linearGradient>
              {/* Crimson bg glow */}
              <radialGradient id="bgGlow" cx="50%" cy="65%" r="42%">
                <stop offset="0%"   stopColor="#DC143C" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0C0C0D" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* bg radial glow */}
            <ellipse cx="300" cy="390" rx="190" ry="210" fill="url(#bgGlow)" />

            {/* Exact face path from reference — gold gradient instead of #000 */}
            <path
              fill="url(#faceGrad)"
              filter="url(#avGlow)"
              d="M250.1,477.1c0,0,17.9-37.5,28.3-47.5c8.3-8,10.9-12.4,40.4,0
                c29.5,12.4,38.1,8.5,45.1,3.1c7-5.4,8.2-19.8,6.9-23.8c-1.3-4.1,3.4-9.3,6.3-9
                c2.9,0.3,7.7-3.1,8-6.6s0.4-3.2-0.9-8.6c2.8-1,16.2-3.4,9.3-15
                c-6.8-11.7,3.8-15.1,3.8-15.1s19.2-0.2,19.4-11.7c0.2-11.5-17.1-33.2-17.9-40.6
                c-0.8-7.4,3.5-18.1,3.5-18.1s15.1-38.8-3.5-75.7c-18.6-36.9-69.1-52-88.2-53.6
                c-40-3.3-86.6,12.4-103.7,65.3s-4.2,92.3-4.7,108.8c-1.6,56-45.6,91.3-45.6,91.3
                L250.1,477.1z"
            />

            {/* Labels */}
            <text x="300" y="548" textAnchor="middle"
              fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
              letterSpacing="6" fill="#E8C98A" opacity="0.9">
              AARYAVEERA
            </text>
            <text x="300" y="570" textAnchor="middle"
              fontFamily="Noto Sans Devanagari, sans-serif"
              fontSize="13" fill="#C9A96E" opacity="0.7">
              आर्यवीरा
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
