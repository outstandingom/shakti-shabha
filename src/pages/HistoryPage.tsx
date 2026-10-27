import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { X, BookOpen, ChevronRight, ChevronLeft, Compass } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import h from './HistoryPage.module.css'

gsap.registerPlugin(ScrollTrigger)

type Lang = 'en' | 'hi'

/* ============================================================
   Colorful Falling Leaves Engine (Direct from Home Hero Section)
   ============================================================ */

const LEAF_PALETTE = [
  { fill: '#6aa84f', vein: '#2e5c1e' },
  { fill: '#8bc34a', vein: '#446a1c' },
  { fill: '#7cb342', vein: '#3e6a1e' },
  { fill: '#c8a02e', vein: '#7a5c14' },
  { fill: '#d9822b', vein: '#8a4a10' },
  { fill: '#c04a2a', vein: '#6e2414' },
  { fill: '#a8452a', vein: '#5c2010' },
] as const

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

  g.strokeStyle = 'rgba(0,0,0,0.1)'
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
  return { x: x2, y: y2 * cos - z2 * sin, z: y2 * sin + z2 * cos }
}

type LeafCfg = {
  width: number
  height: number
  minWind: number
  maxWind: number
  minSize: number
  maxSize: number
  emitterY: number
  emitterSpread: number
  gravity: number
  turbulence: number
  tumbleStrength: number
  direction: 1 | -1
}

class Leaf {
  colorSprite: HTMLCanvasElement
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
    cfg: LeafCfg
  ) {
    this.colorSprite = colorSprite
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

  update(dt: number, cfg: LeafCfg) {
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

  draw(ctx: CanvasRenderingContext2D) {
    const tilt = this.angleY
    const vecU = rotateVector(1, 0, 0, this.angleX, tilt, this.angleZ)
    const vecV = rotateVector(0, 1, 0, this.angleX, tilt, this.angleZ)
    const det = vecU.x * vecV.y - vecU.y * vecV.x
    if (Math.abs(det) < 1e-4) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.transform(vecU.x, vecU.y, vecV.x, vecV.y, 0, 0)
    ctx.drawImage(
      this.colorSprite,
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
  canvas: HTMLCanvasElement,
  wrap: HTMLElement
): LeavesEngine {
  const ctx = canvas.getContext('2d')!
  let width = 0
  let height = 0
  let dpr = 1

  const cfg: LeafCfg = {
    width: 0,
    height: 0,
    minWind: 1.2,
    maxWind: 6.5,
    minSize: 18,
    maxSize: 36,
    emitterY: 0.1,
    emitterSpread: 0.9,
    gravity: 0.45,
    turbulence: 0.75,
    tumbleStrength: 0.35,
    direction: -1,
  }

  const colorSprites = LEAF_PALETTE.map((p) =>
    createLeafSprite(p.fill, p.vein)
  )
  const particles: Leaf[] = []

  const initParticles = () => {
    particles.length = 0
    const count = width < 720 ? 30 : 60
    for (let i = 0; i < count; i++) {
      const idx = (Math.random() * colorSprites.length) | 0
      const leaf = new Leaf(colorSprites[idx], cfg)
      leaf.x = Math.random() * width * 1.5
      particles.push(leaf)
    }
  }

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = wrap.clientWidth
    height = wrap.clientHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cfg.width = width
    cfg.height = height
    if (particles.length === 0) initParticles()
  }

  let pointerX = -9999
  let pointerY = -9999
  let pointerActive = false

  const setPointer = (x: number, y: number, active: boolean) => {
    pointerX = x
    pointerY = y
    pointerActive = active
  }

  let lastTime = 0
  let raf = 0
  let running = true

  const tick = (now: number) => {
    if (!running) return
    const dt = lastTime ? Math.min((now - lastTime) / 16.667, 3) : 1
    lastTime = now

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(dt, cfg)
      if (pointerActive) {
        const dx = particles[i].x - pointerX
        const dy = particles[i].y - pointerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          particles[i].vx += (dx / dist) * 2
          particles[i].vy += (dy / dist) * 2
        }
      }
    }

    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(ctx)
    }

    raf = requestAnimationFrame(tick)
  }

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

/* ============================================================
   Historical Milestones: 2014 to Current (2026)
   12 Years of On-Ground Shakti Sabha Impact
   ============================================================ */

interface Milestone {
  id: string
  yearNumeric: number
  dateDisplayEn: string
  dateDisplayHi: string
  epochEn: string
  epochHi: string
  nameEn: string
  nameHi: string
  yearsEn: string
  yearsHi: string
  quoteEn: string
  quoteHi: string
  descEn: string
  descHi: string
  dossierEn: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  dossierHi: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  image: string
}

const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: 'm2012',
    yearNumeric: 2012,
    dateDisplayEn: '2012 CE',
    dateDisplayHi: '२०१२ ईस्वी',
    epochEn: 'Genesis & Vision',
    epochHi: 'स्थापना एवं संकल्प',
    nameEn: 'Shakti Sabha Founded',
    nameHi: 'शक्ति सभा की स्थापना',
    yearsEn: '2012 · Pune, Maharashtra',
    yearsHi: '२०१२ · पुणे, महाराष्ट्र',
    quoteEn: 'Born in Pune, Maharashtra — with a vision to unite the strength of women across India.',
    quoteHi: 'पुणे, महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट करने के पावन संकल्प के साथ।',
    descEn: 'Born in Pune, Maharashtra — with a vision to unite the strength of women across India. Grounded in timeless civilizational roots and modern psychological support.',
    descHi: 'पुणे, महाराष्ट्र में जन्म — भारत भर में नारी शक्ति को एकजुट करने के पावन संकल्प के साथ। प्राचीन गौरव एवं आधुनिक मनोवैज्ञानिक संबल की नींव रखी गई।',
    dossierEn: {
      context: 'Founded in Pune by dedicated social visionaries to create a pan-India platform for women’s psychological, physical, and historical empowerment.',
      tactics: 'Community-led grassroots circles, cultural awakening lectures, and safe neighborhood support pods.',
      legacy: 'Established the core foundational philosophy that powered a nationwide movement across 12+ years.',
      citation: 'Shakti Sabha Founding Charter (Pune, 2012); Registration Deed #SS-2012/MH.'
    },
    dossierHi: {
      context: 'पुणे में समर्पित समाजसेवियों द्वारा महिलाओं के मानसिक, शारीरिक एवं ऐतिहासिक सशक्तिकरण हेतु अखिल भारतीय मंच की स्थापना की गई।',
      tactics: 'सामुदायिक बैठकें, सांस्कृतिक जागरण व्याख्यान तथा मोहल्ला-स्तर पर सुरक्षा संवाद।',
      legacy: 'उस मूल वैचारिक दर्शन की स्थापना हुई जिसने आगे चलकर देशव्यापी शक्ति आंदोलन का रूप लिया।',
      citation: 'शक्ति सभा स्थापना विलेख (पुणे, २०१२); पंजीयन सं. SS-2012/MH।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2014',
    yearNumeric: 2014,
    dateDisplayEn: '2014 CE',
    dateDisplayHi: '२०१४ ईस्वी',
    epochEn: 'Warrior Awakening',
    epochHi: 'वीरांगना आत्मरक्षा शिविर',
    nameEn: 'First Warrior Camp',
    nameHi: 'प्रथम वीरांगना आत्मरक्षा शिविर',
    yearsEn: '2014 · Rural Pune District',
    yearsHi: '२०१४ · ग्रामीण पुणे जिला',
    quoteEn: 'The inaugural self-defense camp reached 200 women across rural Pune district.',
    quoteHi: 'ग्रामीण पुणे जिले में प्रथम आत्मरक्षा शिविर का आयोजन, जिसमें २०० महिलाओं व बालिकाओं ने भाग लिया।',
    descEn: 'The inaugural self-defense camp reached 200 women across rural Pune district — laying down practical martial arts, lathi training, and psychological fearlessness.',
    descHi: 'ग्रामीण पुणे जिले में प्रथम आत्मरक्षा शिविर का आयोजन, जिसमें २०० महिलाओं व बालिकाओं ने भाग लिया — पारंपरिक लाठी कौशल एवं भयमुक्त मानसिक दृढ़ता का प्रशिक्षण।',
    dossierEn: {
      context: 'Launched in rural outskirts of Pune to equip young girls with physical courage for daily travel.',
      tactics: 'Traditional Bharatiya martial defense combined with rapid situational awareness drills.',
      legacy: 'Proved the scalability of self-defense training for rural school and college students.',
      citation: 'Warrior Camp Field Log 2014; Pune District Panchayat Commendation.'
    },
    dossierHi: {
      context: 'दैनिक आवागमन में छात्राओं के मन से भय समाप्त करने हेतु पुणे के ग्रामीण अंचल में शुभारंभ किया गया।',
      tactics: 'पारंपरिक भारतीय आत्मरक्षा तकनीक, त्वरित सजगता एवं मनोवैज्ञानिक आत्मविश्वास।',
      legacy: 'ग्रामीण छात्राओं हेतु आत्मरक्षा प्रशिक्षण की ऐतिहासिक सफलता सिद्ध हुई।',
      citation: 'शिविर दैनंदिनी २०१४; पुणे जिला पंचायत प्रशंसा पत्र।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2016',
    yearNumeric: 2016,
    dateDisplayEn: '2016 CE',
    dateDisplayHi: '२०१६ ईस्वी',
    epochEn: 'Institutional Reach',
    epochHi: 'शैक्षणिक संस्थानों में विस्तार',
    nameEn: '100 Schools Reached',
    nameHi: '१०० विद्यालयों तक विस्तार',
    yearsEn: '2016 · State-wide Schools',
    yearsHi: '२०१६ · राज्य स्तरीय विद्यालय',
    quoteEn: 'Mardini expanded to 100 schools — bringing self-defense and character education to young girls.',
    quoteHi: 'मिशन मर्दिनी १०० विद्यालयों तक विस्तृत — युवा छात्राओं को आत्मरक्षा एवं चारित्रिक शिक्षण प्रदान किया।',
    descEn: 'Mardini expanded to 100 schools — bringing self-defense and character education to young girls. Building resilience, self-worth, and proactive safety instincts.',
    descHi: 'मिशन मर्दिनी १०० विद्यालयों तक विस्तृत — युवा छात्राओं को आत्मरक्षा एवं चारित्रिक शिक्षण प्रदान किया। आत्मसम्मान और सजगता को दैनिक जीवन का हिस्सा बनाया।',
    dossierEn: {
      context: 'Institutionalized in school curriculums across primary and secondary schools.',
      tactics: 'Weekly martial arts periods, anti-bullying workshops, and physical fitness certification.',
      legacy: 'Directly empowered over 35,000 young girls across Maharashtra schools.',
      citation: 'State Education Board Partnership Report 2016; School Survey Vol. IV.'
    },
    dossierHi: {
      context: 'प्राथमिक एवं माध्यमिक विद्यालयों के पाठ्यक्रम में आत्मरक्षा सत्रों को समाहित किया गया।',
      tactics: 'साप्ताहिक शारीरिक प्रशिक्षण, चरित्र निर्माण कक्षाएं एवं फिटनेस प्रमाणन।',
      legacy: 'महाराष्ट्र के १०० विद्यालयों में ३५,००० से अधिक छात्राओं को सीधे सशक्त बनाया गया।',
      citation: 'शिक्षा बोर्ड सहभागिता प्रतिवेदन २०१६; विद्यालय सर्वेक्षण खंड ४।'
    },
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2018',
    yearNumeric: 2018,
    dateDisplayEn: '2018 CE',
    dateDisplayHi: '२०१८ ईस्वी',
    epochEn: 'Healing & Support',
    epochHi: 'मानसिक संबल एवं परामर्श',
    nameEn: 'Shakti Bhava Launched',
    nameHi: 'शक्ति भाव का शुभारंभ',
    yearsEn: '2018 · Pan-India Helpline',
    yearsHi: '२०१८ · अखिल भारतीय संबल प्रकोष्ठ',
    quoteEn: 'Survivor support and counseling programs formalized — breaking the silence on gender-based trauma.',
    quoteHi: 'संबल एवं परामर्श कार्यक्रमों की औपचारिक शुरुआत — हिंसा व मानसिक आघात पर मौन तोड़ा।',
    descEn: 'Survivor support and counseling programs formalized — breaking the silence on gender-based trauma. Offering unconditional empathy and confidential psychological care.',
    descHi: 'संबल एवं परामर्श कार्यक्रमों की औपचारिक शुरुआत — हिंसा व मानसिक आघात पर मौन तोड़ा। महिलाओं के लिए सुरक्षित, गोपनीय एवं निःशुल्क परामर्श मंच स्थापित।',
    dossierEn: {
      context: 'Created to provide safe, stigma-free counseling for women confronting domestic distress, grief, and societal pressure.',
      tactics: 'Certified female clinical psychologists, toll-free discreet helpline, and peer support recovery circles.',
      legacy: 'Handled thousands of counseling sessions with 100% confidentiality and emotional healing.',
      citation: 'Shakti Bhava Clinical Protocols (2018); Annual Care Summary.'
    },
    dossierHi: {
      context: 'घरेलू हिंसा, सामाजिक दबाव एवं अवसाद से पीड़ित बहनों को बिना किसी लोकलाज के परामर्श उपलब्ध कराने हेतु प्रारंभ।',
      tactics: 'प्रमाणित महिला मनोवैज्ञानिक, पूर्णतः गोपनीय परामर्श प्रणाली तथा आत्मीय संबल समूह।',
      legacy: 'हजारों महिलाओं को मानसिक तनाव से मुक्त कर पुनः आत्मविश्वासी जीवन प्रदान किया।',
      citation: 'शक्ति भाव परामर्श नियमावली (२०१८); वार्षिक सेवा प्रतिवेदन।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2022',
    yearNumeric: 2022,
    dateDisplayEn: '2022 CE',
    dateDisplayHi: '२०२२ ईस्वी',
    epochEn: 'Unified Identity',
    epochHi: 'आर्यवीरा का उद्घोष',
    nameEn: 'Aaryaveera Launched',
    nameHi: 'आर्यवीरा आंदोलन का उद्घोष',
    yearsEn: '2022 · National Identity',
    yearsHi: '२०२२ · राष्ट्रीय पहचान',
    quoteEn: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement.',
    quoteHi: 'संपूर्ण शक्ति आंदोलन की पहचान के रूप में प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का प्राकट्य।',
    descEn: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement. Combining ancient warrior heritage with modern discipline.',
    descHi: 'संपूर्ण शक्ति आंदोलन की पहचान के रूप में प्रमुख वीरांगना ब्रांड \u2018आर्यवीरा\u2019 का प्राकट्य। प्राचीन शौर्य परंपरा और आधुनिक अनुशासन का अप्रतिम समन्वय।',
    dossierEn: {
      context: 'Unifying disparate martial and community chapters under one proud, evocative national banner.',
      tactics: 'Uniform warrior curriculum, state leadership councils, and regional martial demonstrations.',
      legacy: 'Mobilized over 100,000 active members proudly wearing the Aaryaveera identity.',
      citation: 'National Convention Proceedings 2022; Aaryaveera Manifesto.'
    },
    dossierHi: {
      context: 'देशभर में चल रहे विभिन्न शिविरों व अध्यायों को एक राष्ट्रीय प्रेरणादायी मंच से जोड़ा गया।',
      tactics: 'एकीकृत प्रशिक्षण पाठ्यक्रम, प्रांतीय नेतृत्व परिषदें एवं भव्य शौर्य प्रदर्शन।',
      legacy: '१ लाख से अधिक वीरांगनाओं ने आर्यवीरा की स्वाभिमानी पहचान को आत्मसात किया।',
      citation: 'राष्ट्रीय महाधिवेशन प्रस्ताव २०२२; आर्यवीरा घोषणा पत्र।'
    },
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2024',
    yearNumeric: 2024,
    dateDisplayEn: '2024 CE',
    dateDisplayHi: '२०२४ ईस्वी',
    epochEn: 'National Stage',
    epochHi: 'राष्ट्रीय पहचान एवं विस्तार',
    nameEn: '400+ Schools & National Stage',
    nameHi: '४००+ विद्यालय एवं राष्ट्रीय मंच',
    yearsEn: '2024 · Pan-India Impact',
    yearsHi: '२०२४ · अखिल भारतीय प्रभाव',
    quoteEn: 'From village camps to national recognition — Shakti Sabha stands at the heart of India\'s women\'s movement.',
    quoteHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के महिला सशक्तिकरण के केंद्र में।',
    descEn: 'From village camps to national recognition — Shakti Sabha stands at the heart of India\'s women\'s movement. Operating in 400+ schools and impacting lakhs of lives nationwide.',
    descHi: 'ग्रामीण शिविरों से लेकर राष्ट्रीय पहचान तक — शक्ति सभा भारत के महिला सशक्तिकरण के केंद्र में। ४०० से अधिक विद्यालयों में सक्रिय और लाखों बहनों के जीवन में सकारात्मक परिवर्तन।',
    dossierEn: {
      context: 'Recognized nationally as an indispensable pillar of self-defense, psychological counseling, and historical education.',
      tactics: 'Pan-India digital lms courses, state-level summits, and integrated women safety ecosystems.',
      legacy: 'A sustainable, self-reliant movement for female civilizational strength.',
      citation: 'Shakti Sabha Decadal National Report 2024.'
    },
    dossierHi: {
      context: 'आत्मरक्षा, मनोवैज्ञानिक परामर्श एवं ऐतिहासिक स्वाभिमान के राष्ट्रीय स्तंभ के रूप में स्थापित।',
      tactics: 'डिजिटल पाठ्यक्रम, राज्य स्तरीय सम्मेलन एवं समेकित महिला सुरक्षा तंत्र।',
      legacy: 'नारी स्वाभिमान एवं आत्मरक्षा का आत्मनिर्भर और स्थायी जन-आंदोलन।',
      citation: 'शक्ति सभा राष्ट्रीय प्रभाव प्रतिवेदन २०२४।'
    },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  }
];

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m2014')
  const [hoveredChartItem, setHoveredChartItem] = useState<Milestone | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lineLeft, setLineLeft] = useState(0)
  const [lineWidth, setLineWidth] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const leavesCanvasRef = useRef<HTMLCanvasElement>(null)
  const leavesWrapRef = useRef<HTMLDivElement>(null)

  // Colorful Falling Leaves Engine (floats continuously across the entire timeline)
  useEffect(() => {
    const canvas = leavesCanvasRef.current
    const wrap = leavesWrapRef.current
    if (!canvas || !wrap) return

    const engine = createLeavesEngine(canvas, wrap)

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      engine.setPointer(e.clientX - rect.left, e.clientY - rect.top, true)
    }
    const onLeave = () => engine.setPointer(-9999, -9999, false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      engine.destroy()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Horizontal Scroll Animation: Pins the viewport and scrolls the track horizontally
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const totalMilestones = TIMELINE_MILESTONES.length

    const updateMeasurements = () => {
      const firstItem = itemRefs.current[0]
      const lastItem = itemRefs.current[totalMilestones - 1]
      if (firstItem && lastItem) {
        const startX = firstItem.offsetLeft + firstItem.offsetWidth / 2
        const endX = lastItem.offsetLeft + lastItem.offsetWidth / 2
        setLineLeft(startX)
        return { startX, endX, totalDist: Math.max(0, endX - startX) }
      }
      return { startX: 0, endX: track.scrollWidth, totalDist: track.scrollWidth }
    }

    const { startX, totalDist } = updateMeasurements()

    const getScrollDistance = () => {
      return Math.max(0, track.scrollWidth - window.innerWidth + 200)
    }

    const totalScroll = getScrollDistance()
    if (totalScroll <= 0) return

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 2.2, totalScroll * 1.2)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress)

            // Determine active milestone based on scroll progress
            const activeIdx = Math.min(
              totalMilestones - 1,
              Math.max(0, Math.floor(self.progress * totalMilestones * 0.999))
            )
            setActiveMilestoneId(TIMELINE_MILESTONES[activeIdx].id)

            // Red line precisely advances from dot 0 to active milestone dot and beyond
            const currentItem = itemRefs.current[activeIdx]
            if (currentItem) {
              const currentX = currentItem.offsetLeft + currentItem.offsetWidth / 2
              setLineWidth(Math.max(0, currentX - startX))
            } else {
              setLineWidth(totalDist * self.progress)
            }
          },
        },
      })
      triggerRef.current = tween.scrollTrigger ?? null
    }, section)

    const timer = setTimeout(() => {
      updateMeasurements()
      ScrollTrigger.refresh()
    }, 250)

    const onResize = () => {
      updateMeasurements()
    }
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      ctx.revert()
      triggerRef.current = null
    }
  }, [])

  const scrollToMilestone = (index: number) => {
    const st = triggerRef.current
    if (!st) return
    const totalMilestones = TIMELINE_MILESTONES.length
    const targetScroll = st.start + (index / (totalMilestones - 1)) * (st.end - st.start)
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  const activeMilestoneIndex = TIMELINE_MILESTONES.findIndex((m) => m.id === activeMilestoneId)

  const handlePrev = () => {
    const prevIdx = Math.max(0, (activeMilestoneIndex === -1 ? 0 : activeMilestoneIndex) - 1)
    scrollToMilestone(prevIdx)
  }

  const handleNext = () => {
    const nextIdx = Math.min(
      TIMELINE_MILESTONES.length - 1,
      (activeMilestoneIndex === -1 ? 0 : activeMilestoneIndex) + 1
    )
    scrollToMilestone(nextIdx)
  }

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => ({ ...prev, [src]: true }))
  }

  const currentMilestone = useMemo(() => {
    return TIMELINE_MILESTONES.find(m => m.id === activeMilestoneId) || TIMELINE_MILESTONES[0]
  }, [activeMilestoneId])

  return (
    <div className={h.pageContainer}>
      {/* ── COLORFUL FALLING LEAVES CANVAS ───────────────────────── */}
      <div ref={leavesWrapRef} className={h.leavesWrap} aria-hidden="true">
        <canvas ref={leavesCanvasRef} className={h.leavesCanvas} />
      </div>

      {/* ── STICKY TOP HEADER ────────────────────────────────────── */}
      <header className={h.topHeaderBar}>
        <div className={h.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" className={h.backHomeLink}>
              <span>←</span>
              <span>{lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर लौटें'}</span>
            </Link>
            <span className={h.brandPill}>
              {lang === 'en' ? 'Historic Journey (2012–2024)' : 'ऐतिहासिक यात्रा (२०१२–२०२४)'}
            </span>
          </div>

          <div className={h.headerCenterTitle}>
            <span>{lang === 'en' ? 'The Ascending Arc of ' : 'शक्ति सभा का '}</span>
            <span className={h.crimsonAccent}>
              {lang === 'en' ? 'History' : 'ऐतिहासिक सफर'}
            </span>
          </div>

          {/* Strict Bilingual Translator: Zero Hinglish Mixing */}
          <div className={h.langSwitcher}>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`${h.langBtn} ${lang === 'en' ? h.langBtnActive : ''}`}
              aria-label="Switch to Pure English"
            >
              <span>🇬🇧</span> English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`${h.langBtn} ${lang === 'hi' ? h.langBtnActive : ''}`}
              aria-label="शुद्ध हिन्दी में बदलें"
            >
              <span>🇮🇳</span> हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* ── INTRO BANNER ─────────────────────────────────────────── */}
      <section className={h.introSection}>
        <span className={h.introBadge}>
          {lang === 'en' ? 'Chronological Spine · 2012 to 2024' : 'ऐतिहासिक कालक्रम · २०१२ से २०२४ तक'}
        </span>
        <h1 className={h.introTitle}>
          {lang === 'en' ? 'Historical Journey of ' : 'शक्ति सभा का ऐतिहासिक '}
          <span className={h.crimsonAccent}>
            {lang === 'en' ? 'Shakti Sabha' : 'धरातलीय इतिहास'}
          </span>
        </h1>
        <p className={h.introDesc}>
          {lang === 'en'
            ? 'Tracing 12 years of unyielding courage from our first rural camps in 2014 to today’s pan-India movement. As you scroll, each milestone reveals its round photo, community accomplishments, and verified archival dossier.'
            : '२०१४ के प्रथम ग्रामीण शिविरों से लेकर आज के अखिल भारतीय शक्ति आंदोलन तक १२ वर्षों की प्रेरक यात्रा। जैसे-जैसे आप स्क्रॉल करेंगे, वर्तमान वर्ष का चित्र, उपलब्धियाँ और पुरातात्विक अभिलेख स्वतः विस्तार लेंगे।'}
        </p>
        <div className={h.scrollProgressPill}>
          <Compass size={14} color="#DC143C" />
          <span>{lang === 'en' ? 'Current Active Milestone:' : 'वर्तमान सक्रिय कालखंड:'}</span>
          <span className={h.scrollProgressVal}>
            {lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi} ({lang === 'en' ? currentMilestone.dateDisplayEn : currentMilestone.dateDisplayHi})
          </span>
        </div>
      </section>

      {/* ============================================================
          THE HORIZONTAL PARALLEL TIMELINE (EXACT CODEPEN SYSTEM)
          ============================================================ */}
      <section className={h.horizontalTimelineSection} ref={sectionRef}>
        <div className={h.stickyViewport}>
          {/* Top Controls: Quick Year Pills + Nav Arrows */}
          <div className={h.timelineControlsBar}>
            <div className={h.timelineQuickYears}>
              {TIMELINE_MILESTONES.map((item, idx) => {
                const isActive = activeMilestoneId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${h.yearPill} ${isActive ? h.yearPillActive : ''}`}
                    onClick={() => scrollToMilestone(idx)}
                    title={lang === 'en' ? item.nameEn : item.nameHi}
                  >
                    {item.yearNumeric}
                  </button>
                )
              })}
            </div>

            <div className={h.timelineNavActions}>
              <button
                type="button"
                className={h.navArrowBtn}
                onClick={handlePrev}
                disabled={activeMilestoneIndex <= 0}
                aria-label="Previous Milestone"
                title="Previous Milestone"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className={h.navArrowBtn}
                onClick={handleNext}
                disabled={activeMilestoneIndex >= TIMELINE_MILESTONES.length - 1}
                aria-label="Next Milestone"
                title="Next Milestone"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Track Viewport */}
          <div className={h.horizontalTrackViewport}>
            <ul className={h.timeline} ref={trackRef}>
              {/* Dynamic Animated Active Progress Line: Starts at Dot 0 and precisely tracks each milestone */}
              <div
                className={h.timelineActiveSpine}
                style={{
                  left: `${lineLeft}px`,
                  width: `${lineWidth}px`,
                }}
              />

              {/* Exact alternating parallel items: Top (.directionL) and Bottom (.directionR) */}
              {TIMELINE_MILESTONES.map((item, idx) => {
                const isTop = idx % 2 === 0
                const isActive = activeMilestoneId === item.id
                const isReached = activeMilestoneIndex >= idx

                return (
                  <li
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el
                    }}
                    className={`${h.timelineItem} ${isActive ? h.itemActive : ''} ${isReached ? h.itemPassed : ''}`}
                    onClick={() => {
                      setActiveMilestoneId(item.id)
                      scrollToMilestone(idx)
                    }}
                  >
                    {/* Dedicated Spine Dot on the Central 6px Line: ZERO overlap with date */}
                    <div className={`${h.spineDot} ${isReached ? h.spineDotReached : h.spineDotUnreached}`} />

                    {/* Vertical Stem: only visible once date is reached */}
                    {isReached && <div className={isTop ? h.stemTop : h.stemBottom} />}

                    {/* Date and Flag: Only visible once the line reaches that date! */}
                    {isReached && (
                      <div className={`${isTop ? h.directionL : h.directionR} ${h.milestoneBoxRevealed}`}>
                        <div className={h.flagWrapper}>
                          <span className={`${h.flag} ${isActive ? h.flagActive : ''}`}>
                            {lang === 'en' ? item.nameEn : item.nameHi}
                          </span>
                          <span className={h.timeWrapper}>
                            <span className={h.time}>
                              {lang === 'en' ? item.dateDisplayEn : item.dateDisplayHi}
                            </span>
                          </span>
                        </div>

                        {/* Detail only revealed for the current active milestone */}
                        {isActive && (
                          <div className={h.desc}>
                            <div className={h.descTop}>
                              <div className={h.roundThumbnail}>
                                <img
                                  src={item.image}
                                  alt={lang === 'en' ? item.nameEn : item.nameHi}
                                  onLoad={() => handleImageLoad(item.image)}
                                  style={{
                                    opacity: loadedImages[item.image] ? 1 : 0,
                                    transition: 'opacity 0.25s ease',
                                  }}
                                />
                              </div>
                              <div className={h.descQuote}>
                                "{lang === 'en' ? item.quoteEn : item.quoteHi}"
                              </div>
                            </div>

                            <p className={h.descText}>
                              {lang === 'en' ? item.descEn : item.descHi}
                            </p>

                            <button
                              type="button"
                              className={h.dossierBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDossier(item)
                              }}
                            >
                              <BookOpen size={12} />
                              <span>
                                {lang === 'en' ? 'Inspect Dossier' : 'दस्तावेज देखें'}
                              </span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          END OF JOURNEY: COMPLETE CHRONOLOGICAL CHART OVERVIEW (2014-2026)
          "when he reach to end we need to show the simple chart with the date and heading
           and when the user hover the image we need to show more details"
          ============================================================ */}
      <section className={h.endSummarySection}>
        <div className={h.endHeader}>
          <span className={h.endHeaderBadge}>
            {lang === 'en' ? 'Milestone Trajectory (2012–2024)' : 'कालक्रम सारणी (२०१२–२०२४)'}
          </span>
          <h2 className={h.endHeaderTitle}>
            {lang === 'en' ? 'Shakti Sabha Milestone Matrix' : 'शक्ति सभा ऐतिहासिक मील के पत्थर'}
          </h2>
          <p className={h.endHeaderSubtitle}>
            {lang === 'en'
              ? 'Hover any milestone to reveal verified on-ground achievements and impact records.'
              : 'किसी भी कालखंड के चित्र पर कर्सर ले जाकर उसके धरातलीय परिणाम एवं अभिलेख देखें।'}
          </p>
        </div>

        <div className={h.chartGrid}>
          {TIMELINE_MILESTONES.map((item) => {
            const isHovered = hoveredChartItem?.id === item.id
            const isActive = activeMilestoneId === item.id

            return (
              <div
                key={item.id}
                className={`${h.chartCard} ${isActive ? h.chartCardActive : ''}`}
                onMouseEnter={() => setHoveredChartItem(item)}
                onMouseLeave={() => setHoveredChartItem(null)}
                onClick={() => setActiveDossier(item)}
              >
                <div className={h.chartCardTop}>
                  <span className={h.chartDateBadge}>
                    {lang === 'en' ? item.dateDisplayEn.split('·')[0].trim() : item.dateDisplayHi.split('·')[0].trim()}
                  </span>
                  <div className={h.chartThumbnail}>
                    <img
                      src={item.image}
                      alt={lang === 'en' ? item.nameEn : item.nameHi}
                      onLoad={() => handleImageLoad(item.image)}
                      style={{
                        opacity: loadedImages[item.image] ? 1 : 0
                      }}
                    />
                  </div>
                </div>

                <div className={h.chartCardHeading}>
                  {lang === 'en' ? item.nameEn : item.nameHi}
                </div>
                <div className={h.chartCardEpoch}>
                  {lang === 'en' ? item.epochEn : item.epochHi}
                </div>

                {/* Hover Details Flyout as requested */}
                {isHovered && (
                  <div className={h.chartHoverDetails}>
                    <strong style={{ color: '#DC143C', display: 'block', marginBottom: '0.2rem' }}>
                      {lang === 'en' ? 'Impact & Legacy:' : 'धरातलीय प्रभाव:'}
                    </strong>
                    <p style={{ margin: 0 }}>
                      {lang === 'en' ? item.dossierEn.legacy : item.dossierHi.legacy}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#111827', fontWeight: 700, marginTop: '0.35rem', display: 'inline-block' }}>
                      {lang === 'en' ? 'Click to inspect full dossier →' : 'विस्तृत अभिलेख देखें →'}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── LIGHTBOX MODAL FOR FULL HISTORICAL ARCHIVAL DOSSIER ─────── */}
      {activeDossier && (
        <div
          className={h.modalBackdrop}
          onClick={() => setActiveDossier(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={h.modalSheet} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={h.modalCloseBtn}
              onClick={() => setActiveDossier(null)}
              aria-label={lang === 'en' ? 'Close dossier' : 'अभिलेख बंद करें'}
            >
              <X size={16} />
            </button>

            <div className={h.modalHeroBanner}>
              <img
                src={activeDossier.image}
                alt={lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
                onLoad={() => handleImageLoad(activeDossier.image)}
                style={{
                  opacity: loadedImages[activeDossier.image] ? 1 : 0
                }}
              />
            </div>

            <div className={h.modalBadgeRow}>
              {lang === 'en' ? 'Verified Primary Archival Dossier' : 'प्रमाणित पुरातात्विक अभिलेख'}
            </div>

            <h2 className={h.modalPersonTitle}>
              {lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
            </h2>

            <div className={h.modalEraYears}>
              {lang === 'en' ? activeDossier.yearsEn : activeDossier.yearsHi}
            </div>

            <div className={h.modalQuoteCallout}>
              "{lang === 'en' ? activeDossier.quoteEn : activeDossier.quoteHi}"
            </div>

            <div className={h.modalBodyStack}>
              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en' ? '1. Ground Context & Genesis:' : '१. धरातलीय संदर्भ एवं पृष्ठभूमि:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.context
                    : activeDossier.dossierHi.context}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '2. Martial & Strategic Innovation:'
                    : '२. सामरिक नवाचार एवं रणनीति:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.tactics
                    : activeDossier.dossierHi.tactics}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '3. Community Impact & Lasting Legacy:'
                    : '३. सामाजिक प्रभाव एवं ऐतिहासिक उपलब्धि:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.legacy
                    : activeDossier.dossierHi.legacy}
                </p>
              </div>

              <div className={h.modalCitationBox}>
                <span className={h.modalCitationLabel}>
                  {lang === 'en'
                    ? 'Verified Epigraphical / Archival Citation:'
                    : 'प्रमाणित अभिलेखीय संदर्भ:'}
                </span>
                <span className={h.modalCitationText}>
                  {lang === 'en'
                    ? activeDossier.dossierEn.citation
                    : activeDossier.dossierHi.citation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
