import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Aaryaveera.module.css'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    icon: '⚔',
    title: 'Self-Defense & Training',
    text: 'Aaryaveera Camps and Warrior Certification. The trained body is the first declaration of freedom.',
  },
  {
    icon: '🔥',
    title: 'Character & Leadership',
    text: 'Courses that build the Aaryaveera spirit — noble, fearless, anchored in Dharma and cultural roots.',
  },
  {
    icon: '◎',
    title: 'Dialogue & Research',
    text: '"Aaryaveera Dialogues" under Shakti Varta — honest discourse on true masculinity, Paurush, and Dharma.',
  },
]

const PARTICLE_COLORS = ['#CC230C','#E0550D','#C8433E','#FA9417','#F7A958','#F4BEA2','#D57A84']
const rnd = (min: number, max: number) => Math.random() * (max - min) + min
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export default function Aaryaveera() {
  const secRef  = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  /* ── SVG fire particles ── */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const NS = 'http://www.w3.org/2000/svg'
    const timelines: gsap.core.Timeline[] = []
    const circles: SVGCircleElement[] = []

    function spawn(behind: boolean) {
      const c = document.createElementNS(NS, 'circle')
      const color = pick(PARTICLE_COLORS)
      const r0  = behind ? rnd(2, 22) : rnd(1, 14)
      const cx0 = rnd(220, 380)
      const cy0 = behind ? rnd(350, 430) : rnd(320, 510)

      gsap.set(c, {
        attr: { cx: cx0, cy: cy0, r: 0 },
        fill: color,
        opacity: 0.9,
        filter: behind ? 'url(#avGlow)' : 'none',
      })

      if (behind) svg!.insertBefore(c, svg!.firstChild)
      else        svg!.appendChild(c)
      circles.push(c)

      const dur    = rnd(4, 7)
      const driftX = rnd(-45, 45)
      const rise   = rnd(130, 230)

      const tl = gsap.timeline({ repeat: -1, delay: rnd(0, 4) })
      tl.to(c, { attr: { r: r0 }, duration: dur * 0.35, ease: 'power1.out' })
        .to(c, {
          attr: { cy: cy0 - rise, cx: cx0 + driftX, r: 0 },
          opacity: 0,
          duration: dur,
          ease: 'power1.inOut',
        }, `-=${dur * 0.25}`)

      timelines.push(tl)
    }

    for (let i = 0; i < 40; i++) spawn(true)
    for (let i = 0; i < 65; i++) spawn(false)

    return () => {
      timelines.forEach(t => t.kill())
      circles.forEach(c => c.parentNode?.removeChild(c))
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

        {/* RIGHT: SVG warrior with GSAP fire particles */}
        <div data-av="svgwrap" className={s.svgWrap}>
          <svg
            ref={svgRef}
            className={s.mainSVG}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 600"
            overflow="visible"
          >
            <defs>
              <filter id="avGlow" x="-50%" y="-50%" width="200%" height="200%"
                colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#E8C98A" />
                <stop offset="60%"  stopColor="#C9A96E" />
                <stop offset="100%" stopColor="#9A7340" />
              </linearGradient>
              <radialGradient id="glowBg" cx="50%" cy="60%" r="40%">
                <stop offset="0%"   stopColor="#DC143C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0C0C0D" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="300" cy="390" rx="185" ry="205" fill="url(#glowBg)" />

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

            <line x1="300" y1="145" x2="300" y2="505"
              stroke="#E8C98A" strokeWidth="1.5" opacity="0.15"
              strokeDasharray="6 9" />

            <text x="300" y="542" textAnchor="middle"
              fontFamily="Cinzel, serif" fontSize="18" fontWeight="700"
              letterSpacing="6" fill="#E8C98A" opacity="0.9">
              AARYAVEERA
            </text>
            <text x="300" y="564" textAnchor="middle"
              fontFamily="Noto Sans Devanagari, sans-serif" fontSize="13"
              fill="#C9A96E" opacity="0.7">
              आर्यवीरा
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
