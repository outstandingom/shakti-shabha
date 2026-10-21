import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import s from './Hero.module.css'

type ImageData = {
  src: string
  alt: string
  heightClass: string
}

const GIRL_IMAGES: ImageData[] = [
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 1',
    heightClass: s.h_4_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 2',
    heightClass: s.h_6_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 3',
    heightClass: s.h_8_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 4',
    heightClass: s.h_10_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 5 (center)',
    heightClass: s.h_11_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 6',
    heightClass: s.h_10_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 7',
    heightClass: s.h_8_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 8',
    heightClass: s.h_6_12,
  },
  {
    src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80',
    alt: 'Portrait of girl 9',
    heightClass: s.h_4_12,
  },
]

/* ------------------------------------------------------------------ */
/* Falling leaves engine (adapted from your canvas demo)              */
/* ------------------------------------------------------------------ */
type LeafPalette = { fill: string; vein: string }

const LEAF_PALETTE: LeafPalette[] = [
  { fill: '#6aa84f', vein: '#2e5c1e' },
  { fill: '#8bc34a', vein: '#446a1c' },
  { fill: '#7cb342', vein: '#3e6a1e' },
  { fill: '#c8a02e', vein: '#7a5c14' },
  { fill: '#d9822b', vein: '#8a4a10' },
  { fill: '#c04a2a', vein: '#6e2414' },
  { fill: '#a8452a', vein: '#5c2010' },
]

function createLeafSprite(fill: string, vein: string): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')!
  g.translate(64, 64)

  g.beginPath()
  g.moveTo(0, -58)
  g.bezierCurveTo(38, -35, 38, 20, 0, 48)
  g.bezierCurveTo(-38, 20, -38, -35, 0, -58)
  g.closePath()
  g.fillStyle = fill
  g.fill()

  g.strokeStyle = 'rgba(0,0,0,0.12)'
  g.lineWidth = 1.5
  g.stroke()

  g.beginPath()
  g.moveTo(0, -50)
  g.lineTo(0, 48)
  g.strokeStyle = vein
  g.lineWidth = 2
  g.stroke()

  g.lineWidth = 1
  for (let i = -3; i <= 2; i++) {
    const y = i * 11
    const spread = 16 - Math.abs(i) * 2
    g.beginPath()
    g.moveTo(0, y)
    g.lineTo(-spread, y - 9)
    g.moveTo(0, y)
    g.lineTo(spread, y - 9)
    g.stroke()
  }

  g.beginPath()
  g.moveTo(0, 48)
  g.quadraticCurveTo(2, 58, -2, 66)
  g.strokeStyle = vein
  g.lineWidth = 3
  g.lineCap = 'round'
  g.stroke()

  return c
}

/** Create a grayscale clone of a leaf sprite (for the "default" layer) */
function grayscaleClone(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = src.width
  c.height = src.height
  const g = c.getContext('2d')!
  g.drawImage(src, 0, 0)
  const data = g.getImageData(0, 0, c.width, c.height)
  const d = data.data
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    // push toward near-black/gray for the ink-illustration feel
    const v = Math.round(lum * 0.85 + 25)
    d[i] = v
    d[i + 1] = v
    d[i + 2] = v
  }
  g.putImageData(data, 0, 0)
  return c
}

function rotateVector(
  x: number,
  y: number,
  z: number,
  ax: number,
  ay: number,
  az: number
) {
  let cos = Math.cos(az)
  let sin = Math.sin(az)
  const x1 = x * cos - y * sin
  const y1 = x * sin + y * cos
  const z1 = z

  cos = Math.cos(ay)
  sin = Math.sin(ay)
  const x2 = x1 * cos + z1 * sin
  const y2 = y1
  const z2 = -x1 * sin + z1 * cos

  cos = Math.cos(ax)
  sin = Math.sin(ax)

  return {
    x: x2,
    y: y2 * cos - z2 * sin,
    z: y2 * sin + z2 * cos,
  }
}

class Leaf {
  colorSprite: HTMLCanvasElement
  graySprite: HTMLCanvasElement

  width: number
  height: number
  x = 0
  y = 0
  vx = 0
  vy = 0
  windFactor = 1
  waveOffset = 0
  angleZ = 0
  spinZ = 0
  angleX = 0
  angleY = 0
  spinX = 0
  spinY = 0
  spawnMinY = 0

  constructor(
    colorSprite: HTMLCanvasElement,
    graySprite: HTMLCanvasElement,
    cfg: {
      width: number
      height: number
      minSize: number
      maxSize: number
      direction: 1 | -1
      emitterY: number
      emitterSpread: number
    }
  ) {
    this.colorSprite = colorSprite
    this.graySprite = graySprite
    this.width = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize)
    this.height = this.width

    const centerY = cfg.height * cfg.emitterY
    const spread = cfg.height * cfg.emitterSpread
    const minY = centerY - spread / 2
    const maxY = centerY + spread / 2

    this.y = minY + Math.random() * (maxY - minY)
    this.spawnMinY = minY

    this.x =
      cfg.direction === -1
        ? cfg.width + this.width + Math.random() * cfg.width
        : -this.width - Math.random() * cfg.width

    const sizeFactor =
      (this.width - cfg.minSize) / (cfg.maxSize - cfg.minSize || 1)
    this.windFactor = Math.max(
      0.1,
      Math.min(1, 1 - (sizeFactor * 0.5 + Math.random() * 0.5))
    )

    this.waveOffset = Math.random() * Math.PI * 2
    this.angleZ = Math.random() * Math.PI * 2
    this.spinZ = (Math.random() - 0.5) * 0.015
    this.spinX = (Math.random() - 0.5) * 0.1
    this.spinY = (Math.random() - 0.5) * 0.1
  }

  update(
    dt: number,
    cfg: {
      width: number
      height: number
      minWind: number
      maxWind: number
      gravity: number
      turbulence: number
      tumbleStrength: number
      direction: 1 | -1
    }
  ) {
    const targetSpeed =
      cfg.minWind + (cfg.maxWind - cfg.minWind) * this.windFactor
    this.vx += (targetSpeed - this.vx) * (1 - Math.pow(0.9, dt))
    this.x += this.vx * cfg.direction * dt

    const gravityMod = 1.5 - this.windFactor
    this.vy += cfg.gravity * 0.05 * gravityMod * dt

    const wave = Math.sin(this.x * 0.01 * cfg.direction + this.waveOffset)
    this.vy += wave * cfg.turbulence * 0.05 * dt
    this.vy *= Math.pow(0.98, dt)

    this.y += this.vy * dt
    this.angleZ += (this.spinZ + this.vx * 0.002) * dt

    if (cfg.tumbleStrength > 0) {
      this.angleX += this.spinX * cfg.tumbleStrength * dt
      this.angleY += this.spinY * cfg.tumbleStrength * dt
    }

    const buffer = 200
    const outByX =
      cfg.direction === -1 ? this.x < -buffer : this.x > cfg.width + buffer
    const topLimit = Math.min(this.spawnMinY, -buffer) - buffer

    if (outByX || this.y > cfg.height + buffer || this.y < topLimit) {
      // respawn
      this.width = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize)
      this.height = this.width
      const sizeFactor =
        (this.width - cfg.minSize) / (cfg.maxSize - cfg.minSize || 1)
      this.windFactor = Math.max(
        0.1,
        Math.min(1, 1 - (sizeFactor * 0.5 + Math.random() * 0.5))
      )
      this.y =
        cfg.height * cfg.emitterY +
        (Math.random() - 0.5) * cfg.height * cfg.emitterSpread
      this.spawnMinY = this.y - 1
      this.x =
        cfg.direction === -1
          ? cfg.width + this.width + Math.random() * 200
          : -this.width - Math.random() * 200
      this.vx = 0
      this.vy = 0
      this.waveOffset = Math.random() * Math.PI * 2
      this.angleZ = Math.random() * Math.PI * 2
    }
  }

  draw(ctx: CanvasRenderingContext2D, colorized: boolean) {
    const tilt = this.angleY
    const vecU = rotateVector(1, 0, 0, this.angleX, tilt, this.angleZ)
    const vecV = rotateVector(0, 1, 0, this.angleX, tilt, this.angleZ)

    const det = vecU.x * vecV.y - vecU.y * vecV.x
    if (Math.abs(det) < 1e-4) return

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.transform(vecU.x, vecU.y, vecV.x, vecV.y, 0, 0)
    ctx.drawImage(
      colorized ? this.colorSprite : this.graySprite,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    )
    ctx.restore()
  }
}

type LeavesEngine = {
  destroy: () => void
  setPointer: (x: number, y: number, active: boolean) => void
}

function createLeavesEngine(
  grayCanvas: HTMLCanvasElement,
  revealCanvas: HTMLCanvasElement,
  wrap: HTMLElement
): LeavesEngine {
  const grayCtx = grayCanvas.getContext('2d', { alpha: false })!
  const revealCtx = revealCanvas.getContext('2d', { alpha: true })!

  // offscreen scene buffers
  const sceneCanvas = document.createElement('canvas')
  const sceneCtx = sceneCanvas.getContext('2d', { alpha: false })!

  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')!

  let width = 0
  let height = 0
  let dpr = 1

  const cfg = {
    bgColor: '#f9f5ec',
    minWind: 1,
    maxWind: 10,
    minSize: 22,
    maxSize: 52,
    emitterY: 0.15,
    emitterSpread: 0.85,
    gravity: 0.6,
    turbulence: 0.8,
    tumbleStrength: 0.4,
    particleCount: 110,
    direction: -1 as 1 | -1,
  }

  // ---- sprites ----
  const colorSprites = LEAF_PALETTE.map((p) =>
    createLeafSprite(p.fill, p.vein)
  )
  const graySprites = colorSprites.map((c) => grayscaleClone(c))

  // ---- particles ----
  const particles: Leaf[] = []
  const initParticles = () => {
    particles.length = 0
    for (let i = 0; i < cfg.particleCount; i++) {
      const idx = (Math.random() * colorSprites.length) | 0
      const leaf = new Leaf(colorSprites[idx], graySprites[idx], {
        width,
        height,
        minSize: cfg.minSize,
        maxSize: cfg.maxSize,
        direction: cfg.direction,
        emitterY: cfg.emitterY,
        emitterSpread: cfg.emitterSpread,
      })
      // seed across the screen initially
      leaf.x = Math.random() * width * 1.5
      particles.push(leaf)
    }
  }

  // ---- resize ----
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = wrap.clientWidth
    height = wrap.clientHeight

    for (const c of [grayCanvas, revealCanvas, sceneCanvas, maskCanvas]) {
      c.width = Math.round(width * dpr)
      c.height = Math.round(height * dpr)
    }
    grayCanvas.style.width = width + 'px'
    grayCanvas.style.height = height + 'px'
    revealCanvas.style.width = width + 'px'
    revealCanvas.style.height = height + 'px'

    grayCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    revealCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    sceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    grayCtx.imageSmoothingEnabled = true
    grayCtx.imageSmoothingQuality = 'high'
    revealCtx.imageSmoothingEnabled = true
    revealCtx.imageSmoothingQuality = 'high'
    sceneCtx.imageSmoothingEnabled = true
    sceneCtx.imageSmoothingQuality = 'high'

    if (particles.length === 0) initParticles()
  }

  // ---- pointer reveal ----
  let pointerX = -9999
  let pointerY = -9999
  let pointerActive = false
  let pointerRadius = 140

  const setPointer = (x: number, y: number, active: boolean) => {
    pointerX = x
    pointerY = y
    pointerActive = active
  }

  // ---- animation ----
  let lastTime = 0
  let raf = 0
  let running = true

  const tick = (now: number) => {
    if (!running) return
    const dt = lastTime ? Math.min((now - lastTime) / 16.667, 3) : 1
    lastTime = now

    // 1. Draw the full color scene to an offscreen canvas
    sceneCtx.fillStyle = cfg.bgColor
    sceneCtx.fillRect(0, 0, width, height)
    for (const p of particles) {
      p.update(dt, cfg)
      p.draw(sceneCtx, true)
    }

    // 2. Draw the grayscale scene to the visible gray canvas
    grayCtx.fillStyle = cfg.bgColor
    grayCtx.fillRect(0, 0, width, height)
    for (const p of particles) {
      p.draw(grayCtx, false)
    }

    // 3. Build a radial mask and composite the color scene onto the reveal canvas
    revealCtx.clearRect(0, 0, width, height)
    if (pointerActive) {
      // build mask on maskCanvas
      maskCtx.clearRect(0, 0, width, height)
      const grad = maskCtx.createRadialGradient(
        pointerX,
        pointerY,
        0,
        pointerX,
        pointerY,
        pointerRadius
      )
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.55, 'rgba(255,255,255,0.9)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      maskCtx.fillStyle = grad
      maskCtx.fillRect(0, 0, width, height)

      // draw color scene into reveal
      revealCtx.drawImage(sceneCanvas, 0, 0, width, height)

      // punch out everything outside the mask using destination-in
      revealCtx.save()
      revealCtx.globalCompositeOperation = 'destination-in'
      revealCtx.drawImage(maskCanvas, 0, 0, width, height)
      revealCtx.restore()
    }

    raf = requestAnimationFrame(tick)
  }

  // wait for resize + init, then go
  resize()
  raf = requestAnimationFrame(tick)

  return {
    destroy: () => {
      running = false
      cancelAnimationFrame(raf)
    },
    setPointer,
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const secRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const grayCanvasRef = useRef<HTMLCanvasElement>(null)
  const revealCanvasRef = useRef<HTMLCanvasElement>(null)
  const leavesWrapRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<LeavesEngine | null>(null)

  // GSAP timeline (unchanged)
  useEffect(() => {
    const images = imgRefs.current.filter(
      (img): img is HTMLImageElement => img !== null
    )
    const content = contentRef.current
    if (!images.length || !content) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      images.forEach((img) => gsap.set(img, { width: '100%', y: '50vh' }))
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    const centerIndex = Math.floor(images.length / 2)
    const STAGGER = 0.2
    const DURATION = 1

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      images.forEach((image, index) => {
        const delay = Math.abs(index - centerIndex) * STAGGER
        tl.to(
          image,
          { width: '100%', duration: DURATION, ease: 'power2.inOut' },
          delay
        )
      })

      const maxDelay = Math.max(
        ...images.map((_, i) => Math.abs(i - centerIndex) * STAGGER)
      )
      const totalFirstAnimationTime = maxDelay + DURATION

      images.forEach((image, index) => {
        const delay =
          totalFirstAnimationTime + Math.abs(index - centerIndex) * STAGGER
        tl.to(
          image,
          { y: '50vh', duration: DURATION, ease: 'power2.out' },
          delay
        )
      })

      tl.fromTo(
        content,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: 'power2.out',
        },
        totalFirstAnimationTime + 0.4
      )
    }, secRef)

    return () => ctx.revert()
  }, [])

  // Leaves engine
  useEffect(() => {
    const gray = grayCanvasRef.current
    const reveal = revealCanvasRef.current
    const wrap = leavesWrapRef.current
    if (!gray || !reveal || !wrap) return

    const engine = createLeavesEngine(gray, reveal, wrap)
    engineRef.current = engine

    // pointer / touch handlers
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      engine.setPointer(
        e.clientX - rect.left,
        e.clientY - rect.top,
        true
      )
    }
    const onPointerDown = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      engine.setPointer(
        e.clientX - rect.left,
        e.clientY - rect.top,
        true
      )
    }
    const onPointerUp = (e: PointerEvent) => {
      // on touch, hide the reveal after release; on mouse, keep following
      if (e.pointerType === 'touch') {
        engine.setPointer(-9999, -9999, false)
      }
    }
    const onPointerLeave = () => {
      engine.setPointer(-9999, -9999, false)
    }

    // Listen on the whole section so both images + leaves react
    const target = secRef.current ?? wrap
    target.addEventListener('pointermove', onPointerMove, { passive: true })
    target.addEventListener('pointerdown', onPointerDown, { passive: true })
    target.addEventListener('pointerup', onPointerUp, { passive: true })
    target.addEventListener('pointercancel', onPointerUp, { passive: true })
    target.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      engine.destroy()
      engineRef.current = null
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerdown', onPointerDown)
      target.removeEventListener('pointerup', onPointerUp)
      target.removeEventListener('pointercancel', onPointerUp)
      target.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  // Toggle grayscale on hero images on touch/hover
  const revealImage = (el: HTMLImageElement | null) => {
    if (!el) return
    el.classList.add(s.reveal!)
  }
  const hideImage = (el: HTMLImageElement | null) => {
    if (!el) return
    el.classList.remove(s.reveal!)
  }

  const handleExplore = () => {
    const nextEl = secRef.current?.nextElementSibling
    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section ref={secRef} className={s.heroSection}>
      {/* Falling leaves background */}
      <div ref={leavesWrapRef} className={s.leavesWrap} aria-hidden="true">
        <canvas ref={grayCanvasRef} className={s.leavesCanvas} />
        <canvas ref={revealCanvasRef} className={s.revealCanvas} />
      </div>

      <div ref={contentRef} className={s.heroContent}>
        <h1 className={s.title}>
          Discover the world <br /> through people
        </h1>
        <button type="button" onClick={handleExplore} className={s.ctaBtn}>
          Start Exploring
        </button>
      </div>

      <div className={s.heroImages}>
        {GIRL_IMAGES.map((item, idx) => (
          <div key={idx} className={s.col}>
            <img
              ref={(el) => {
                imgRefs.current[idx] = el
              }}
              src={item.src}
              alt={item.alt}
              className={`${s.imgItem} ${item.heightClass}`}
              onPointerEnter={() => revealImage(imgRefs.current[idx])}
              onPointerLeave={() => hideImage(imgRefs.current[idx])}
              onPointerDown={() => revealImage(imgRefs.current[idx])}
              onPointerUp={() => {
                // keep color on hover for mouse; for touch release hide
                // small delay so user sees the effect
                setTimeout(() => hideImage(imgRefs.current[idx]), 400)
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
