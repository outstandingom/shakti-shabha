import { useEffect, useRef, useCallback } from 'react'

/* ─── Types ─── */
interface Particle {
  life: number; lifeSpan: number
  alpha: number; alphaDecay: number
  colour: string
  x: number; y: number
  radius: number; radiusDecay: number
  dirX: number; dirY: number
  speed: number
}

/* ─── Helpers ─── */
const rnd = (min: number, max: number) => Math.random() * (max - min) + min
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/* ─── Configs ─── */
const FIRE = {
  max: 400, delay: 10,
  life:       [1200, 2000] as [number,number],
  alpha:      [0.35, 0.65] as [number,number],
  alphaDecay: [0.18, 0.50] as [number,number],
  colour: ['#9C2A00','#9E2F03','#DC143C','#E0550D','#FA9417','#C8433E'],
  radius:      [7, 30] as [number,number],
  radiusDecay: [20, 48] as [number,number],
  dirAngle: [-Math.PI / 2 - 0.35, -Math.PI / 2 + 0.35] as [number,number],
  speed:      [45, 190] as [number,number],
}

const SMOKE = {
  max: 40, delay: 110,
  life:       [5000, 9000] as [number,number],
  alpha:      [0.05, 0.18] as [number,number],
  alphaDecay: [0, 0.03]    as [number,number],
  colour: ['#1A1A1A','#0A0A0A','#2B2B2B'],
  radius:      [18, 38] as [number,number],
  radiusDecay: [0, 3]   as [number,number],
  dirAngle: [-Math.PI / 2 - 0.6, -Math.PI / 2 + 0.6] as [number,number],
  speed:      [40, 90] as [number,number],
}

function makeParticle(cfg: typeof FIRE | typeof SMOKE, x: number, y: number): Particle {
  const angle = rnd(cfg.dirAngle[0], cfg.dirAngle[1])
  return {
    life: 0, lifeSpan: rnd(cfg.life[0], cfg.life[1]),
    alpha: rnd(cfg.alpha[0], cfg.alpha[1]),
    alphaDecay: rnd(cfg.alphaDecay[0], cfg.alphaDecay[1]),
    colour: pick(cfg.colour),
    x, y,
    radius: rnd(cfg.radius[0], cfg.radius[1]),
    radiusDecay: rnd(cfg.radiusDecay[0], cfg.radiusDecay[1]),
    dirX: Math.cos(angle),
    dirY: Math.sin(angle),
    speed: rnd(cfg.speed[0], cfg.speed[1]),
  }
}

export default function FireCursor() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouse      = useRef({ x: -9999, y: -9999, active: false })
  const fireArr    = useRef<Particle[]>([])
  const smokeArr   = useRef<Particle[]>([])
  const rafRef     = useRef<number>(0)
  const lastTime   = useRef(0)
  const fireTimer  = useRef(0)
  const smokeTimer = useRef(0)
  const isMobile   = useRef(false)

  const loop = useCallback((ts: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const dt = Math.min(ts - lastTime.current, 50)
    lastTime.current = ts
    fireTimer.current  += dt
    smokeTimer.current += dt

    /* clear with full transparency so page content shows through */
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const { x, y, active } = mouse.current

    /* spawn */
    if (active) {
      while (fireArr.current.length < FIRE.max && fireTimer.current >= FIRE.delay) {
        fireArr.current.push(makeParticle(FIRE, x, y))
        fireTimer.current -= FIRE.delay
      }
      while (smokeArr.current.length < SMOKE.max && smokeTimer.current >= SMOKE.delay) {
        smokeArr.current.push(makeParticle(SMOKE, x, y))
        smokeTimer.current -= SMOKE.delay
      }
    }

    /* update + draw smoke (behind, normal blend) */
    ctx.globalCompositeOperation = 'source-over'
    smokeArr.current = smokeArr.current.filter(p => {
      p.life += dt
      p.alpha -= p.alphaDecay * dt / 1000
      p.radius -= p.radiusDecay * dt / 1000
      p.x += p.speed * p.dirX * dt / 1000
      p.y += p.speed * p.dirY * dt / 1000
      if (p.life >= p.lifeSpan || p.alpha <= 0 || p.radius <= 0) return false
      ctx.globalAlpha = p.alpha
      ctx.fillStyle   = p.colour
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
      return true
    })

    /* update + draw fire (additive blend = glowing look) */
    ctx.globalCompositeOperation = 'lighter'
    fireArr.current = fireArr.current.filter(p => {
      p.life += dt
      p.alpha -= p.alphaDecay * dt / 1000
      p.radius -= p.radiusDecay * dt / 1000
      p.x += p.speed * p.dirX * dt / 1000
      p.y += p.speed * p.dirY * dt / 1000
      if (p.life >= p.lifeSpan || p.alpha <= 0 || p.radius <= 0) return false
      ctx.globalAlpha = p.alpha
      ctx.fillStyle   = p.colour
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
      return true
    })

    ctx.globalAlpha = 1
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    /* skip on touch-only devices */
    isMobile.current = window.matchMedia('(hover: none)').matches
    if (isMobile.current) return

    const canvas = canvasRef.current!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const onLeave = () => { mouse.current.active = false }
    const onEnter = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true }
    }

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [loop])

  /* Don't render anything on touch devices */
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',   /* never blocks clicks */
        zIndex: 99999,            /* above everything */
        display: 'block',
      }}
    />
  )
}
