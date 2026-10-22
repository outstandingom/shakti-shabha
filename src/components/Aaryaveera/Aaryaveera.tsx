import { useEffect, useRef, useCallback } from 'react'
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

/* ─── FIRE CURSOR PARTICLE ─── */
interface FireParticle {
  life: number; lifeSpan: number
  alpha: number; alphaDecay: number
  colour: string
  x: number; y: number
  radius: number; radiusDecay: number
  dirX: number; dirY: number
  speed: number
}

function rnd(min: number, max: number) { return Math.random() * (max - min) + min }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export default function Aaryaveera() {
  const secRef    = useRef<HTMLElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const svgRef    = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -1000, y: -1000, inside: false })
  const rafRef    = useRef<number>(0)

  /* ── SVG PARTICLES ── */
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const NS = 'http://www.w3.org/2000/svg'
    const circles: SVGCircleElement[] = []
    const tweens: gsap.core.Tween[] = []

    function spawnParticle(behind: boolean) {
      const c = document.createElementNS(NS, 'circle')
      const color = pick(PARTICLE_COLORS)
      const r0 = behind ? rnd(2, 22) : rnd(1, 14)
      const cx0 = rnd(230, 370)
      const cy0 = behind ? rnd(360, 420) : rnd(330, 500)

      gsap.set(c, { attr: { cx: cx0, cy: cy0, r: 0 }, fill: color, opacity: 0.9,
        filter: behind ? 'url(#avGlow)' : 'none' })

      if (behind) svg!.insertBefore(c, svg!.firstChild)
      else        svg!.appendChild(c)

      circles.push(c)

      const dur    = rnd(4, 7)
      const driftX = rnd(-40, 40)
      const rise   = rnd(120, 220)

      const tl = gsap.timeline({ repeat: -1, delay: rnd(0, 3) })
      tl.to(c, { attr: { r: r0 }, duration: dur * 0.35, ease: 'power1.out' })
        .to(c, {
            attr: { cy: cy0 - rise, cx: cx0 + driftX, r: 0 },
            opacity: 0,
            duration: dur,
            ease: 'power1.inOut',
          }, `-=${dur * 0.25}`)

      tweens.push(...tl.getChildren() as gsap.core.Tween[])
      return tl
    }

    const timelines: gsap.core.Timeline[] = []
    for (let i = 0; i < 40; i++) timelines.push(spawnParticle(true))
    for (let i = 0; i < 60; i++) timelines.push(spawnParticle(false))

    return () => {
      timelines.forEach(t => t.kill())
      circles.forEach(c => c.parentNode?.removeChild(c))
    }
  }, [])

  /* ── CANVAS MOUSE FIRE ── */
  const fireParticles = useRef<FireParticle[]>([])
  const smokeParticles = useRef<FireParticle[]>([])
  let lastTime = 0
  let fireTimer = 0, smokeTimer = 0

  const FIRE_CFG = {
    max: 300, delay: 12,
    life: [1200, 2000], alpha: [0.35, 0.6], alphaDecay: [0.2, 0.5],
    colour: ['#9C2A00','#9E2F03','#DC143C','#E0550D','#FA9417'],
    radius: [6, 28], radiusDecay: [20, 45],
    dirAngle: [-Math.PI/2 - 0.35, -Math.PI/2 + 0.35],
    speed: [40, 180],
  }
  const SMOKE_CFG = {
    max: 30, delay: 120,
    life: [5000, 9000], alpha: [0.06, 0.18], alphaDecay: [0, 0.03],
    colour: ['#1A1A1A','#0A0A0A','#2B2B2B'],
    radius: [16, 36], radiusDecay: [0, 3],
    dirAngle: [-Math.PI/2 - 0.55, -Math.PI/2 + 0.55],
    speed: [40, 90],
  }

  function makeFP(cfg: typeof FIRE_CFG, x: number, y: number): FireParticle {
    const angle = rnd(cfg.dirAngle[0], cfg.dirAngle[1])
    return {
      life: 0, lifeSpan: rnd(cfg.life[0], cfg.life[1]),
      alpha: rnd(cfg.alpha[0], cfg.alpha[1]),
      alphaDecay: rnd(cfg.alphaDecay[0], cfg.alphaDecay[1]),
      colour: pick(cfg.colour),
      x, y,
      radius: rnd(cfg.radius[0], cfg.radius[1]),
      radiusDecay: rnd(cfg.radiusDecay[0], cfg.radiusDecay[1]),
      dirX: Math.cos(angle), dirY: Math.sin(angle),
      speed: rnd(cfg.speed[0], cfg.speed[1]),
    }
  }

  const drawCanvas = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dt = Math.min(timestamp - lastTime, 50)
    lastTime = timestamp
    fireTimer += dt; smokeTimer += dt

    // clear
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    // spawn fire
    if (mouseRef.current.inside && fireParticles.current.length < FIRE_CFG.max && fireTimer >= FIRE_CFG.delay) {
      fireParticles.current.push(makeFP(FIRE_CFG, mx, my))
      fireTimer -= FIRE_CFG.delay
    }
    // spawn smoke
    if (mouseRef.current.inside && smokeParticles.current.length < SMOKE_CFG.max && smokeTimer >= SMOKE_CFG.delay) {
      smokeParticles.current.push(makeFP(SMOKE_CFG, mx, my))
      smokeTimer -= SMOKE_CFG.delay
    }

    // update + draw smoke
    ctx.globalCompositeOperation = 'source-over'
    smokeParticles.current = smokeParticles.current.filter(p => {
      p.life += dt; p.alpha -= p.alphaDecay * dt / 1000
      p.radius -= p.radiusDecay * dt / 1000
      p.x += p.speed * p.dirX * dt / 1000
      p.y += p.speed * p.dirY * dt / 1000
      if (p.life >= p.lifeSpan || p.alpha <= 0 || p.radius <= 0) return false
      ctx.globalAlpha = p.alpha; ctx.fillStyle = p.colour
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill()
      return true
    })

    // update + draw fire
    ctx.globalCompositeOperation = 'lighter'
    fireParticles.current = fireParticles.current.filter(p => {
      p.life += dt; p.alpha -= p.alphaDecay * dt / 1000
      p.radius -= p.radiusDecay * dt / 1000
      p.x += p.speed * p.dirX * dt / 1000
      p.y += p.speed * p.dirY * dt / 1000
      if (p.life >= p.lifeSpan || p.alpha <= 0 || p.radius <= 0) return false
      ctx.globalAlpha = p.alpha; ctx.fillStyle = p.colour
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill()
      return true
    })

    ctx.globalAlpha = 1
    rafRef.current = requestAnimationFrame(drawCanvas)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const sec = secRef.current
    if (!canvas || !sec) return

    const resize = () => {
      const r = sec.getBoundingClientRect()
      canvas.width  = r.width
      canvas.height = r.height
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true }
    }
    const onLeave = () => { mouseRef.current.inside = false }

    sec.addEventListener('mousemove', onMove)
    sec.addEventListener('mouseleave', onLeave)

    rafRef.current = requestAnimationFrame(drawCanvas)

    return () => {
      window.removeEventListener('resize', resize)
      sec.removeEventListener('mousemove', onMove)
      sec.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [drawCanvas])

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
        opacity: 0.5, scale: 1.12, repeat: -1, yoyo: true, duration: 3.5, ease: 'sine.inOut'
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      {/* Fire cursor canvas */}
      <canvas ref={canvasRef} className={s.fireCanvas} />

      <div ref={glowRef} className={s.glow} />

      <div className={s.inner}>
        {/* LEFT: text + cards */}
        <div className={s.left}>
          <span data-av="eyebrow" className={s.eyebrow}>
            Signature Initiative · Aaryaveera
          </span>
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

        {/* RIGHT: SVG warrior with fire particles */}
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
              {/* Gold gradient on the face */}
              <linearGradient id="faceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#E8C98A" />
                <stop offset="60%"  stopColor="#C9A96E" />
                <stop offset="100%" stopColor="#9A7340" />
              </linearGradient>
              <radialGradient id="glowBg" cx="50%" cy="60%" r="40%">
                <stop offset="0%"   stopColor="#DC143C" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0C0C0D" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow blob */}
            <ellipse cx="300" cy="380" rx="180" ry="200" fill="url(#glowBg)" />

            {/* Warrior face silhouette */}
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

            {/* Decorative sword — vertical centre */}
            <line x1="300" y1="150" x2="300" y2="500"
              stroke="#E8C98A" strokeWidth="1.5" opacity="0.18"
              strokeDasharray="6 8" />

            {/* Label text */}
            <text
              x="300" y="540"
              textAnchor="middle"
              fontFamily="Cinzel, serif"
              fontSize="18"
              fontWeight="700"
              letterSpacing="6"
              fill="#E8C98A"
              opacity="0.9"
            >
              AARYAVEERA
            </text>
            <text
              x="300" y="562"
              textAnchor="middle"
              fontFamily="Noto Sans Devanagari, sans-serif"
              fontSize="13"
              fill="#C9A96E"
              opacity="0.7"
            >
              आर्यवीरा
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
