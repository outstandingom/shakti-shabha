import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X, BookOpen, ChevronRight, Compass } from 'lucide-react'
import h from './HistoryPage.module.css'

type Lang = 'en' | 'hi'

/* ============================================================
   Falling Leaves Engine (Preserved from Home Hero Section)
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
    const v = Math.min(255, Math.round(lum * 0.9 + 60))
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
    cfg: LeafCfg
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
  const grayCtx = grayCanvas.getContext('2d')!
  const revealCtx = revealCanvas.getContext('2d')!
  const sceneCanvas = document.createElement('canvas')
  const sceneCtx = sceneCanvas.getContext('2d')!
  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')!

  let width = 0
  let height = 0
  let dpr = 1

  const cfg: LeafCfg = {
    width: 0,
    height: 0,
    minWind: 1.2,
    maxWind: 7,
    minSize: 20,
    maxSize: 44,
    emitterY: 0.1,
    emitterSpread: 0.9,
    gravity: 0.5,
    turbulence: 0.75,
    tumbleStrength: 0.35,
    direction: -1,
  }

  const colorSprites = LEAF_PALETTE.map((p) =>
    createLeafSprite(p.fill, p.vein)
  )
  const graySprites = colorSprites.map((c) => grayscaleClone(c))
  const particles: Leaf[] = []

  const initParticles = () => {
    particles.length = 0
    const count = width < 720 ? 45 : 75
    for (let i = 0; i < count; i++) {
      const idx = (Math.random() * colorSprites.length) | 0
      const leaf = new Leaf(colorSprites[idx], graySprites[idx], cfg)
      leaf.x = Math.random() * width * 1.5
      particles.push(leaf)
    }
  }

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
    cfg.width = width
    cfg.height = height
    if (particles.length === 0) initParticles()
  }

  let pointerX = -9999
  let pointerY = -9999
  let pointerActive = false
  const pointerRadius = 140

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
    }

    sceneCtx.clearRect(0, 0, width, height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(sceneCtx, true)
    }

    grayCtx.clearRect(0, 0, width, height)
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(grayCtx, false)
    }

    revealCtx.clearRect(0, 0, width, height)
    if (pointerActive) {
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
      grad.addColorStop(0.6, 'rgba(255,255,255,0.85)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      maskCtx.fillStyle = grad
      maskCtx.fillRect(0, 0, width, height)
      revealCtx.drawImage(sceneCanvas, 0, 0, width, height)
      revealCtx.save()
      revealCtx.globalCompositeOperation = 'destination-in'
      revealCtx.drawImage(maskCanvas, 0, 0, width, height)
      revealCtx.restore()
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
   Historical Milestones (8 Epochs)
   ============================================================ */

interface Milestone {
  id: string
  yearNumeric: number
  posX: number
  posY: number
  threshold: number
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
  accentColor: string
}

const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: 'gargi',
    yearNumeric: -800,
    posX: 10,
    posY: 84,
    threshold: 0.05,
    epochEn: 'Vedic Civilization (~800 BCE)',
    epochHi: 'वैदिक सभ्यता (लगभग ८०० ईसा पूर्व)',
    nameEn: 'Gargi Vachaknavi',
    nameHi: 'गार्गी वाचक्नवी',
    yearsEn: 'Vedic Period · Mithila Court',
    yearsHi: 'वैदिक काल · मिथिला राजदरबार',
    quoteEn: 'On what then, pray, is the realm of the heavens woven, warp and woof?',
    quoteHi: 'हे याज्ञवल्क्य! यह संपूर्ण ब्रह्मांड किस ताने-बाने पर टिका हुआ है?',
    descEn: 'Eminent Vedic philosopher who challenged the foremost rishis at King Janaka’s court, establishing sovereign feminine intellect in foundational metaphysics.',
    descHi: 'विदुषी दार्शनिक जिन्होंने राजा जनक की राजसभा में महर्षि याज्ञवल्क्य से शास्त्रार्थ कर सनातन दर्शन में स्त्री की बौद्धिक संप्रभुता स्थापित की।',
    dossierEn: {
      context: 'Documented in the Brihadaranyaka Upanishad (Chapter III), Gargi interrogated the highest metaphysical doctrine of Brahman with unwavering rigour.',
      tactics: 'Uncompromising philosophical inquiry that compelled Sage Yajnavalkya to acknowledge the limits of public philosophical dispute.',
      legacy: 'Affirmed that ancient Bharatiya women enjoyed full educational, sacrificial, and philosophical sovereignty.',
      citation: 'Brihadaranyaka Upanishad, Brahmana 6 & 8; Archaeological Survey of India Epigraphical Bulletin.'
    },
    dossierHi: {
      context: 'बृहदारण्यक उपनिषद् (अध्याय ३) में वर्णित गार्गी संवाद ने यह सिद्ध किया कि ब्रह्मज्ञान की अधिकारिणी केवल पुरुष नहीं, अपितु स्त्रियाँ भी थीं।',
      tactics: 'अकाट्य तार्किक प्रश्नोत्तरी जिसके समक्ष श्रेष्ठतम विद्वानों को भी मौन स्वीकार करना पड़ा।',
      legacy: 'प्राचीन भारत में कन्याओं के उपनयन, वेदाध्ययन तथा दार्शनिक संप्रभुता का अकाट्य ऐतिहासिक प्रमाण।',
      citation: 'बृहदारण्यक उपनिषद्, तृतीय अध्याय, षष्ठ एवं अष्टम ब्राह्मण; भारतीय पुरातत्व सर्वेक्षण अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'rudrama',
    yearNumeric: 1262,
    posX: 22,
    posY: 72,
    threshold: 0.18,
    epochEn: 'Medieval Kakatiya Era (1262–1289 CE)',
    epochHi: 'मध्यकालीन काकतीय युग (१२६२–१२८९ ईस्वी)',
    nameEn: 'Rani Rudrama Devi',
    nameHi: 'रानी रुद्रमा देवी',
    yearsEn: '13th Century · Orugallu (Warangal)',
    yearsHi: '१३वीं शताब्दी · ओरुगल्लु (वारंगल)',
    quoteEn: 'The sovereignty of this soil is defended not by birthright alone, but by the sword in hand.',
    quoteHi: 'इस मातृभूमि की संप्रभुता केवल कुल से नहीं, अपितु रणक्षेत्र में खड्ग की धार से रक्षित होती है।',
    descEn: 'Monarch of the Kakatiya dynasty who commanded armies in warrior attire, revolutionized concentric fort defenses, and protected Deccan trade routes.',
    descHi: 'काकतीय राजवंश की पराक्रमी शासिका जिन्होंने वीर वेश में सेना का नेतृत्व किया, अभेद्य दुर्ग निर्माण कराया और दक्कन की रक्षा की।',
    dossierEn: {
      context: 'Venetian traveler Marco Polo marveled at her enlightened administration, justice, and military valor upon visiting the Kakatiya kingdom.',
      tactics: 'Pioneered circular concentric stone fortifications and deep moat architecture at Warangal, resisting multiple invasions.',
      legacy: 'One of the few independently crowned female monarchs in world military history to reign without regency.',
      citation: 'Travels of Marco Polo (Book III, Chapter 21); Chandupatla Epigraph dated 1289 CE.'
    },
    dossierHi: {
      context: 'वेनिस के यात्री मार्को पोलो ने अपनी यात्रा-वृत्तांत में रानी के न्यायप्रिय शासन और सैन्य शौर्य की मुक्तकंठ से प्रशंसा की थी।',
      tactics: 'वारंगल दुर्ग में त्रि-स्तरीय पाषाण प्राचीर तथा परिखा प्रणाली का सैन्य नवाचार जिससे विशाल शत्रु सेनाएँ परास्त हुईं।',
      legacy: 'विश्व इतिहास की उन विरली सम्राज्ञियों में से एक जिन्होंने बिना किसी संरक्षक के स्वतंत्र सम्राट के रूप में शासन किया।',
      citation: 'मार्को पोलो का यात्रा वृत्तांत (अध्याय २१); चंदुपटला शिलालेख, १२८९ ईस्वी।'
    },
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'abbakka',
    yearNumeric: 1555,
    posX: 34,
    posY: 61,
    threshold: 0.32,
    epochEn: 'Anti-Colonial Dawn (1555–1582 CE)',
    epochHi: 'उपनिवेशवाद-विरोधी संग्राम (१५५५–१५८२ ईस्वी)',
    nameEn: 'Rani Abbakka Chowta',
    nameHi: 'रानी अब्बक्का चौटा',
    yearsEn: '16th Century · Ullal, Coastal Karnataka',
    yearsHi: '१६वीं शताब्दी · उल्लाल, तटीय कर्नाटक',
    quoteEn: 'Never shall foreign caravels dictate the terms of trade on Bharatiya waters.',
    quoteHi: 'विदेशी नौसैनिक जहाजों को हमारी मातृभूमि के सागर पर कभी कर वसूलने की अनुमति नहीं दी जाएगी।',
    descEn: 'The fearless naval commander who defeated the Portuguese armada in four major campaigns across four decades of relentless littoral warfare.',
    descHi: 'उल्लाल की अमर वीरांगना जिन्होंने पुर्तगाली नौसेना को चार भीषण समुद्री युद्धों में धूल चटाकर भारत के पश्चिमी तट की रक्षा की।',
    dossierEn: {
      context: 'Known to colonial chroniclers as Abhaya Rani (The Fearless Queen). She enforced naval blockades against Portuguese forts.',
      tactics: 'Nocturnal fire-arrow littoral raids that incinerated Portuguese galleons anchored off Mangalore harbor.',
      legacy: 'Celebrated as India’s first anti-colonial naval commander, predating 1857 by three centuries.',
      citation: 'Goa Historical Archives, Monçoes do Reino Series; Queen Abbakka Memorial Historical Trust Records.'
    },
    dossierHi: {
      context: 'पुर्तगाली दस्तावेजों में उन्हें "अभया रानी" की उपाधि दी गई थी। उन्होंने विदेशी सेना की घेराबंदी कर पश्चिमी तट को मुक्त रखा।',
      tactics: 'रात्रि में अग्निबाणों से सुसज्जित नौकाओं द्वारा पुर्तगाली जंगी जहाजों पर अप्रत्याशित आक्रमण कर उन्हें भस्म कर देना।',
      legacy: '१८५७ के स्वतंत्रता संग्राम से तीन सौ वर्ष पूर्व भारत की प्रथम नौसैनिक स्वतंत्रता सेनानी के रूप में प्रतिष्ठित।',
      citation: 'गोवा राज्य पुरालेख, मोन्सोएस दो रेइनो श्रृंखला; रानी अब्बक्का स्मृति न्यास अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'durgavati',
    yearNumeric: 1564,
    posX: 47,
    posY: 50,
    threshold: 0.46,
    epochEn: 'Gondwana Sovereignty (1548–1564 CE)',
    epochHi: 'गोंडवाना संप्रभुता (१५४८–१५६४ ईस्वी)',
    nameEn: 'Rani Durgavati',
    nameHi: 'रानी दुर्गावती',
    yearsEn: '16th Century · Garha-Katanga',
    yearsHi: '१६वीं शताब्दी · गढ़ा-कटंगा',
    quoteEn: 'Dignified death in the crucible of battle is infinitely greater than living in servitude.',
    quoteHi: 'शत्रु की दासता में जीने से लाख गुना श्रेष्ठ है समरांगण में स्वाभिमान के साथ बलिदान होना।',
    descEn: 'Chandel princess who reigned over Gondwana, developed vast public water systems, and repelled imperial Mughal invasions with supreme martial resolve.',
    descHi: 'गोंडवाना की वीरांगना महारानी जिन्होंने विशाल जल संरक्षण तंत्र विकसित किया तथा अकबर की सेना को तीन बार रणभूमि में पराजित किया।',
    dossierEn: {
      context: 'Refused imperial tribute demands. When invaded with massive artillery, she mounted her war elephant Sarman and led the vanguard personally.',
      tactics: 'Utilized narrow defiles at Narrai gorge to nullify imperial numerical superiority.',
      legacy: 'A national symbol of unwavering self-sacrifice and civilizational dignity.',
      citation: 'Abul Fazl, Akbarnama (Vol. II, Chapter 42); Jabalpur District Gazetteer.'
    },
    dossierHi: {
      context: 'मुगल सम्राट अकबर के अधीनता प्रस्ताव को ठुकराकर उन्होंने अपने प्रसिद्ध हाथी सरमन पर सवार होकर स्वयं अग्रिम मोर्चे का नेतृत्व किया।',
      tactics: 'नरई नाले के संकरे पहाड़ी दर्रों में शत्रु की तोपों को प्रभावहीन कर पारंपरिक छापामार एवं अग्रिम मारक प्रहार।',
      legacy: 'सर्वस्व न्योछावर कर आत्मसम्मान और स्वाधीनता की रक्षा करने वाली भारतीय नारी के अमर प्रतीक।',
      citation: 'अबुल फज़ल, अकबरनामा (द्वितीय खंड); जबलपुर गजेटियर एवं मध्य प्रदेश पुरातत्व प्रलेख।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'keladi',
    yearNumeric: 1689,
    posX: 60,
    posY: 39,
    threshold: 0.60,
    epochEn: 'Deccan Resistance (1671–1696 CE)',
    epochHi: 'दक्कन प्रतिरोध युग (१६७१–१६९६ ईस्वी)',
    nameEn: 'Keladi Chennamma',
    nameHi: 'केलादी चेन्नम्मा',
    yearsEn: '17th–18th Century · Keladi, Karnataka',
    yearsHi: '१७वीं–१८वीं शताब्दी · केलादी, कर्नाटक',
    quoteEn: 'He who seeks refuge under our banner is protected, though the entire empire march against us.',
    quoteHi: 'जो हमारी शरण में आया है, उसकी रक्षा करना हमारा धर्म है, चाहे पूरा मुगल साम्राज्य हमारे विरुद्ध खड़ा हो जाए।',
    descEn: 'Heroic queen who granted sanctuary to Chhatrapati Rajaram (son of Shivaji Maharaj) and defeated Aurangzeb’s pursuing Mughal army in jungle warfare.',
    descHi: 'केलादी की साहसी महारानी जिन्होंने छत्रपति शिवाजी महाराज के पुत्र राजाराम को शरण दी और औरंगज़ेब की सेना को करारी शिकस्त दी।',
    dossierEn: {
      context: 'Provided royal protection to Rajaram fleeing to Jinji, defying Aurangzeb’s ultimatum.',
      tactics: 'Trapped Mughal general Azam Tara’s heavy cavalry within flooded monsoon ravines of the Western Ghats.',
      legacy: 'Secured the continuation of the Maratha Hindavi Swarajya during its darkest hour.',
      citation: 'Keladi Nripa Vijaya by Poet Linganna; Karnataka State Archives, Bangalore.'
    },
    dossierHi: {
      context: 'छत्रपति संभाजी महाराज के बलिदान के उपरांत मुगलों से घिरे राजाराम महाराज को सुरक्षित जिंजी पहुँचाने हेतु महारानी ने अभयदान दिया।',
      tactics: 'पश्चिमी घाट के घने मानसूनी वर्षा वनों में भारी मुगल घुड़सवार सेना को फंसाकर निर्णायक विजय प्राप्त की।',
      legacy: 'मराठा हिंदवी स्वराज्य की रक्षा में ऐतिहासिक योगदान, जिसने औरंगज़ेब के विजय अभियान को हमेशा के लिए रोक दिया।',
      citation: 'कवि लिंगण्णा विरचित केलादी नृप विजय; कर्नाटक राज्य पुरालेखागार, बेंगलुरु।'
    },
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'lakshmibai',
    yearNumeric: 1857,
    posX: 73,
    posY: 27,
    threshold: 0.74,
    epochEn: 'First War of Independence (1857–1858 CE)',
    epochHi: 'प्रथम स्वतंत्रता संग्राम (१८५७–१८५८ ईस्वी)',
    nameEn: 'Rani Lakshmibai of Jhansi',
    nameHi: 'झाँसी की रानी लक्ष्मीबाई',
    yearsEn: '1828–1858 · Bundelkhand',
    yearsHi: '१८२८–१८५८ · बुन्देलखण्ड',
    quoteEn: 'I shall not yield my Jhansi. We shall fight for freedom or die upon the field of honor.',
    quoteHi: 'मैं अपनी झाँसी नहीं दूँगी! हम स्वाधीनता के लिए लड़ेंगे या वीरगति को प्राप्त होंगे।',
    descEn: 'The immortal warrior queen who formed an all-women Durga Dal artillery battalion and fought British colonial forces mounted with sword in hand.',
    descHi: 'अमर वीरांगना जिन्होंने महिला दुर्गा दल तोपखाना बटालियन का गठन किया और अंग्रेजों के विरुद्ध रणचंडी बनकर युद्ध किया।',
    dossierEn: {
      context: 'British commander Sir Hugh Rose described her as "the bravest and best military leader of the rebels."',
      tactics: 'Master equestrian combat, synchronized artillery defense of Jhansi fort, and audacious midnight breakouts through siege lines.',
      legacy: 'The eternal beacon of Indian freedom struggle and martial feminine courage.',
      citation: 'National Archives of India, Foreign Dept. Secret Consultations, 1858; Sir Hugh Rose Campaign Dispatches.'
    },
    dossierHi: {
      context: 'ब्रिटिश सेनापति सर ह्यू रोज़ ने अपनी रिपोर्ट में लिखा था कि "विद्रोहियों में रानी लक्ष्मीबाई सबसे बहादुर और सर्वश्रेष्ठ सैन्य नेता थीं।"',
      tactics: 'अद्वितीय अश्वारोहण, झाँसी किले से तोपों का अचूक संचलन तथा घेराबंदी तोड़कर कालपी की ओर तीव्र सैन्य प्रस्थान।',
      legacy: 'भारतीय स्वाधीनता संग्राम की अमर प्रेरणा और शौर्य की शाश्वत प्रतीक।',
      citation: 'भारतीय राष्ट्रीय पुरालेखागार, गुप्त परामर्श विलेख, १८५८; ब्रिटिश सैन्य पत्राचार।'
    },
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'anandibai',
    yearNumeric: 1886,
    posX: 85,
    posY: 18,
    threshold: 0.87,
    epochEn: 'Scientific & Academic Pioneer (1886 CE)',
    epochHi: 'वैज्ञानिक एवं चिकित्सा क्रांति (१८८६ ईस्वी)',
    nameEn: 'Dr. Anandibai Joshi',
    nameHi: 'डॉ. आनंदीबाई जोशी',
    yearsEn: '1865–1887 · Maharashtra & Philadelphia',
    yearsHi: '१८६५–१८८७ · महाराष्ट्र एवं फिलाडेल्फिया',
    quoteEn: 'I want to render to my poor sisters the services that they so dread to receive at the hands of male doctors.',
    quoteHi: 'मैं अपनी असहाय बहनों की उस पीड़ा को दूर करना चाहती हूँ जो वे लोकलाज के कारण किसी पुरुष चिकित्सक से नहीं कह पातीं।',
    descEn: 'India’s first female physician who crossed oceans at age 18, studied at Woman’s Medical College of Pennsylvania, and broke centuries of orthodoxy.',
    descHi: 'भारत की प्रथम महिला चिकित्सक जिन्होंने १८ वर्ष की अल्पायु में समुद्र पार कर अमेरिका से चिकित्सा डिग्री प्राप्त की और इतिहास रचा।',
    dossierEn: {
      context: 'After losing her newborn child due to lack of medical care, she resolved to become a physician, addressing public assemblies in Serampore.',
      tactics: 'Rigorous academic excellence and moral conviction that disarmed fierce orthodox criticism.',
      legacy: 'Opened the doors of professional medicine and higher sciences for generations of Indian women.',
      citation: 'Woman’s Medical College of Pennsylvania Archives (Class of 1886); Caroline Healey Dall Biography (1888).'
    },
    dossierHi: {
      context: 'चिकित्सा के अभाव में अपने नवजात शिशु को खोने के बाद उन्होंने जीवन को भारत की स्त्रियों के स्वास्थ्य और चिकित्सा सेवा हेतु समर्पित किया।',
      tactics: 'रूढ़िवादिता और तीव्र सामाजिक विरोध का उत्तर अपने ज्ञान, तपोबल और अमेरिका में सर्वोच्च शैक्षणिक प्रदर्शन से दिया।',
      legacy: 'भारत में आधुनिक चिकित्सा और उच्च विज्ञान के द्वार लाखों बेटियों के लिए हमेशा के लिए खोल दिए।',
      citation: 'विमेन्स मेडिकल कॉलेज ऑफ पेंसिलवेनिया पुरालेख (१८८६); कैरोलीन हीली डॉल कृत जीवन चरित।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  },
  {
    id: 'modern',
    yearNumeric: 2026,
    posX: 94,
    posY: 10,
    threshold: 0.98,
    epochEn: '21st Century Sovereign Awakening',
    epochHi: '२१वीं सदी — आधुनिक वीरांगना जागरण',
    nameEn: 'Today’s Success Daughters',
    nameHi: 'आज की सफल बेटियाँ',
    yearsEn: 'Present Era · Pan-India Impact',
    yearsHi: 'वर्तमान युग · अखिल भारतीय प्रभाव',
    quoteEn: 'From village farms to civil services and technology startups, our strength is unstoppable.',
    quoteHi: 'गाँवों के खेतों से लेकर प्रशासनिक सेवा और प्रौद्योगिकी उद्यमों तक — हमारी शक्ति अब अडिग है।',
    descEn: 'Shakti Sabha alumni clearing civil services, winning national martial arts medals, and leading rural economic enterprises.',
    descHi: 'शक्ति सभा की वे प्रशिक्षित बेटियाँ जिन्होंने यूपीएससी उत्तीर्ण किया, राष्ट्रीय खेल जीते और आत्मनिर्भरता की मिसाल बनीं।',
    dossierEn: {
      context: 'Demonstrating that the warrior spirit of Gargi, Abbakka, and Lakshmibai thrives in modern India’s youth.',
      tactics: 'Combining physical martial fitness (Lathi-Kaushal), deep psychological resilience, and digital literacy.',
      legacy: 'Creating a self-sustaining ecosystem of 50,000+ fearless women leaders across 400+ schools.',
      citation: 'Shakti Sabha On-Ground Impact Audit 2024–2026; Zilla Parishad Educational Field Reports.'
    },
    dossierHi: {
      context: 'यह सिद्ध करती हैं कि गार्गी, अब्बक्का और लक्ष्मीबाई की तेजस्विता आज भी भारत की प्रत्येक बेटी के रक्त में प्रवाहित है।',
      tactics: 'लाठी-कौशल आत्मरक्षा, मानसिक सुदृढ़ता तथा डिजिटल व प्रशासनिक नेतृत्व का अनुपम समन्वय।',
      legacy: '४०० से अधिक विद्यालयों में ५०,००० से अधिक बेटियों का एक सशक्त, स्वाभिमानी और सुरक्षित समाज।',
      citation: 'शक्ति सभा धरातलीय प्रभाव अंकेक्षण रिपोर्ट २०२४–२०२६; जिला परिषद शिक्षा प्रतिवेदन।'
    },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    accentColor: '#FFFFFF'
  }
]

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('gargi')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [animTime, setAnimTime] = useState(0)
  const [tracerPos, setTracerPos] = useState<{ x: number; y: number }>({ x: 80, y: 520 })

  const trackRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Leaves engine canvas references
  const grayCanvasRef = useRef<HTMLCanvasElement>(null)
  const revealCanvasRef = useRef<HTMLCanvasElement>(null)
  const leavesWrapRef = useRef<HTMLDivElement>(null)
  const leavesEngineRef = useRef<LeavesEngine | null>(null)

  // Initialize Falling Leaves Engine in History Section
  useEffect(() => {
    const gray = grayCanvasRef.current
    const reveal = revealCanvasRef.current
    const wrap = leavesWrapRef.current
    if (!gray || !reveal || !wrap) return

    const engine = createLeavesEngine(gray, reveal, wrap)
    leavesEngineRef.current = engine

    const toLocal = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      engine.setPointer(x, y, true)
    }
    const onLeave = () => engine.setPointer(-9999, -9999, false)

    wrap.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave, { passive: true })

    return () => {
      engine.destroy()
      leavesEngineRef.current = null
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Animation frame loop for dynamic living wave on the ascending line
  useEffect(() => {
    let raf = 0
    let start = performance.now()
    const loop = (now: number) => {
      setAnimTime((now - start) * 0.001)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Dynamic Living Line Calculation: The line moves up and down!
  const { pathD, fillAreaD } = useMemo(() => {
    // Dynamic up-and-down undulation using scroll progress and time
    const w1 = Math.sin(scrollProgress * Math.PI * 4 + animTime * 2) * 16
    const w2 = Math.cos(scrollProgress * Math.PI * 3 + animTime * 1.6) * 14
    const w3 = Math.sin(scrollProgress * Math.PI * 5 + animTime * 2.2) * 12

    const yStart = 520 + w1 * 0.4
    const cp1y = 480 + w1
    const cp2y = 410 - w2
    const cpMidY = 320 + w2
    const cp3y = 230 - w3
    const cp4y = 140 + w3
    const yEnd = 60 + w1 * 0.3

    const d = `M 80 ${yStart} C 220 ${cp1y}, 360 ${cp2y}, 500 ${cpMidY} C 640 ${cp3y}, 780 ${cp4y}, 940 ${yEnd}`
    const fill = `${d} L 940 560 L 80 560 Z`
    return { pathD: d, fillAreaD: fill }
  }, [scrollProgress, animTime])

  // Update scroll progress & ascending graph apex tracker
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const scrollableDistance = rect.height - window.innerHeight
      if (scrollableDistance <= 0) return

      const currentScroll = -rect.top
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance))
      setScrollProgress(progress)

      // Calculate exact (x, y) coordinates of the ascending apex point
      const pathEl = pathRef.current
      if (pathEl) {
        try {
          const totalLen = pathEl.getTotalLength()
          const currentLen = totalLen * Math.max(0.01, progress)
          const pt = pathEl.getPointAtLength(currentLen)
          setTracerPos({ x: pt.x, y: pt.y })
        } catch {
          // Fallback if SVG not yet rendered
        }
      }

      // Determine the currently active milestone
      let currentActive = TIMELINE_MILESTONES[0]
      for (const m of TIMELINE_MILESTONES) {
        if (progress >= m.threshold - 0.04) {
          currentActive = m
        }
      }
      setActiveMilestoneId(currentActive.id)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathD])

  // Jump to a specific epoch along the pinned scroll track
  const jumpToEpoch = useCallback((milestone: Milestone) => {
    const track = trackRef.current
    if (!track) return

    const trackTop = window.scrollY + track.getBoundingClientRect().top
    const scrollableDistance = track.getBoundingClientRect().height - window.innerHeight
    const targetScrollY = trackTop + scrollableDistance * milestone.threshold

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
    setActiveMilestoneId(milestone.id)
  }, [])

  const currentMilestone = useMemo(() => {
    return TIMELINE_MILESTONES.find(m => m.id === activeMilestoneId) || TIMELINE_MILESTONES[0]
  }, [activeMilestoneId])

  return (
    <div className={h.pinnedTrack} ref={trackRef}>
      {/* ── THE PINNED / FIXED VIEWPORT (SCREEN REMAINS STILL WHILE SCROLLING) ── */}
      <div className={h.viewportPinned}>

        {/* ── Falling Leaves Background Canvas Layer (From Home Hero Section) ── */}
        <div ref={leavesWrapRef} className={h.leavesWrap} aria-hidden="true">
          <canvas ref={grayCanvasRef} className={h.leavesCanvas} />
          <canvas ref={revealCanvasRef} className={h.revealCanvas} />
        </div>

        {/* Background Radial Ambiance */}
        <div className={h.bgGlowAura} />
        <div className={h.bgGlowGold} />

        {/* ── Top Header Navigation Bar ───────────────────────────────── */}
        <header className={h.topNav}>
          <div className={h.navLeft}>
            <Link to="/" className={h.backHomeLink}>
              <span>←</span>
              <span>{lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर लौटें'}</span>
            </Link>
            <span className={h.brandPill}>
              {lang === 'en' ? 'Civilizational Itihaas' : 'सभ्यतागत इतिहास'}
            </span>
          </div>

          <div className={h.navCenter}>
            <h1 className={h.pageHeaderTitle}>
              <span>{lang === 'en' ? 'The Ascending Arc of ' : 'भारतीय नारी का '}</span>
              <span className={h.pageHeaderHighlight}>
                {lang === 'en' ? 'Shakti' : 'ऐतिहासिक उत्कर्ष'}
              </span>
            </h1>
            <div className={h.scrollGuideHint}>
              <Compass size={13} />
              <span>
                {lang === 'en'
                  ? 'Scroll to ascend line · Milestones reveal as you scroll up'
                  : 'स्क्रॉल करें: रेखा ऊपर उठेगी व युग क्रमशः प्रकट होंगे'}
              </span>
            </div>
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
        </header>

        {/* ── Central Main Ascending Graph Arena ─────────────────────── */}
        <main className={h.graphArena}>
          <div className={h.graphStage}>
            {/* Vector Ascending Graph Canvas */}
            <svg
              viewBox="0 0 1000 600"
              className={h.svgChart}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Pure White Laser Glow Filter as requested */}
                <filter id="pureWhiteGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Shimmer Fill Under Curve */}
                <linearGradient id="areaGradientWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
                  <stop offset="60%" stopColor="rgba(220, 20, 60, 0.08)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </linearGradient>
              </defs>

              {/* Coordinate Grid Lines */}
              <line x1="70" y1="120" x2="950" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="230" x2="950" y2="230" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="340" x2="950" y2="340" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="450" x2="950" y2="450" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />

              {/* Vertical Time Markers */}
              <line x1="100" y1="80" x2="100" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="340" y1="80" x2="340" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="600" y1="80" x2="600" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="850" y1="80" x2="850" y2="540" stroke="rgba(255,255,255,0.04)" />

              {/* Axis Headings */}
              <text x="80" y="60" fill="#FFFFFF" fontSize="13" fontFamily="Cinzel, serif" fontWeight="700">
                {lang === 'en' ? '▲ Sovereign Impact & Awakening' : '▲ संप्रभुता एवं नेतृत्व प्रभाव'}
              </text>
              <text x="760" y="580" fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="Outfit, sans-serif">
                {lang === 'en' ? 'Timeline (Centuries) ►' : 'कालक्रम (शताब्दी) ►'}
              </text>

              {/* Ghost Silhouette Path */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Active Rising Fill Under Ascending Curve */}
              <path
                d={fillAreaD}
                fill="url(#areaGradientWhite)"
                opacity={Math.min(1, scrollProgress * 1.4)}
              />

              {/* THE ASCENDING LIVING LINE GRAPH (Undulates Up & Down and Shines Radiant Pure White) */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#pureWhiteGlow)"
                strokeDasharray="1400"
                strokeDashoffset={Math.max(0, 1400 * (1 - scrollProgress))}
              />

              {/* Secondary White Core Glow */}
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1400"
                strokeDashoffset={Math.max(0, 1400 * (1 - scrollProgress))}
              />

              {/* Real-time Ascending Apex Tracer Flame Star (Moves along undulating curve) */}
              <circle
                cx={tracerPos.x}
                cy={tracerPos.y}
                r="7"
                fill="#FFFFFF"
                filter="url(#pureWhiteGlow)"
              />
              <circle
                cx={tracerPos.x}
                cy={tracerPos.y}
                r="15"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.9"
              />
            </svg>

            {/* ── FLOATING MILESTONE IMAGES ALONG THE ASCENDING TRAJECTORY ── */}
            {/* STRICT REQUIREMENT: NO SEMI-TRANSPARENT IMAGES. ONLY VISIBLE WHEN WE SCROLL UP! */}
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isActive = activeMilestoneId === item.id
              // Visible strictly when user has scrolled up to or past this milestone's threshold
              const isVisible = scrollProgress >= item.threshold - 0.02

              // Dynamic scroll-driven vertical bobbing wave:
              // As the user scrolls, revealed images oscillate smoothly UP and DOWN!
              const floatWave = Math.sin(scrollProgress * Math.PI * 6 + idx * 1.6 + animTime * 2) * 20

              return (
                <div
                  key={item.id}
                  className={`${h.imageCardNode} ${
                    isVisible ? h.imageCardVisible : h.imageCardHidden
                  } ${isActive ? h.imageCardNodeActive : ''}`}
                  style={{
                    left: `${item.posX}%`,
                    top: `${item.posY}%`,
                    transform: isVisible
                      ? `translate(-50%, -50%) translateY(${floatWave}px) scale(1)`
                      : 'translate(-50%, -50%) scale(0.4)'
                  }}
                  onClick={() => {
                    if (!isVisible) return
                    setActiveMilestoneId(item.id)
                    setActiveDossier(item)
                  }}
                  title={
                    lang === 'en'
                      ? `Click to inspect dossier: ${item.nameEn}`
                      : `${item.nameHi} का ऐतिहासिक अभिलेख देखने के लिए क्लिक करें`
                  }
                >
                  <div
                    className={`${h.avatarWrap} ${isActive ? h.avatarWrapActive : ''}`}
                    style={{
                      borderColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={lang === 'en' ? item.nameEn : item.nameHi}
                      loading="lazy"
                    />
                  </div>

                  <div className={h.cardLabelPill}>
                    <span className={h.cardYearText}>
                      {item.yearNumeric < 0
                        ? `${Math.abs(item.yearNumeric)} BCE`
                        : `${item.yearNumeric} CE`}
                    </span>
                    <span>{lang === 'en' ? item.nameEn : item.nameHi}</span>
                  </div>

                  {isActive && (
                    <div className={h.clickToInspectPill}>
                      {lang === 'en' ? 'Click to inspect archive 🔍' : 'अभिलेख देखें 🔍'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* ── BOTTOM DOCK HUD & SPOTLIGHT BAR ───────────────────────── */}
        <footer className={h.bottomHUD}>
          {/* Quick Epoch Jump Pills Row */}
          <div className={h.epochJumpsRow}>
            {TIMELINE_MILESTONES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${h.epochJumpBtn} ${activeMilestoneId === m.id ? h.epochJumpBtnActive : ''}`}
                onClick={() => jumpToEpoch(m)}
                title={lang === 'en' ? m.nameEn : m.nameHi}
              >
                <span>{m.yearNumeric < 0 ? `${Math.abs(m.yearNumeric)} BCE` : `${m.yearNumeric}`}</span>
                <span>·</span>
                <span>{lang === 'en' ? m.nameEn.split(' ')[0] : m.nameHi.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Milestone Spotlight Strip */}
          <div className={h.spotlightBar}>
            <div className={h.spotlightIdentity}>
              <div
                className={h.spotlightSmallThumb}
                onClick={() => setActiveDossier(currentMilestone)}
              >
                <img
                  src={currentMilestone.image}
                  alt={lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi}
                />
              </div>

              <div className={h.spotlightDetails}>
                <span className={h.spotlightEpochTag}>
                  {lang === 'en' ? currentMilestone.epochEn : currentMilestone.epochHi}
                </span>
                <span className={h.spotlightNameText}>
                  {lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi}
                </span>
                <span className={h.spotlightQuoteText}>
                  "{lang === 'en' ? currentMilestone.quoteEn : currentMilestone.quoteHi}"
                </span>
              </div>
            </div>

            <div className={h.spotlightActions}>
              <div className={h.ascentMetric}>
                <span>{lang === 'en' ? 'Ascent Progress' : 'उत्कर्ष प्रगति'}</span>
                <span className={h.ascentMetricValue}>
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>

              <button
                type="button"
                className={h.openDossierBtn}
                onClick={() => setActiveDossier(currentMilestone)}
              >
                <BookOpen size={15} />
                <span>
                  {lang === 'en'
                    ? 'Inspect Archival Dossier'
                    : 'प्रामाणिक अभिलेख देखें'}
                </span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </footer>
      </div>

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
              <X size={18} />
            </button>

            <div className={h.modalHeroBanner}>
              <img
                src={activeDossier.image}
                alt={lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
              />
            </div>

            <div className={h.modalBadgeRow}>
              {lang === 'en' ? 'Verified Archival Dossier' : 'प्रमाणित पुरातात्विक अभिलेख'}
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
                  {lang === 'en' ? '1. Historical Context & Epoch:' : '१. ऐतिहासिक संदर्भ एवं कालखंड:'}
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
                    : '२. सामरिक नवाचार एवं नेतृत्व:'}
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
                    ? '3. Civilizational Legacy & Sovereign Precedent:'
                    : '३. सभ्यतागत धरोहर एवं संप्रभुता:'}
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
                    ? 'Verified Epigraphical Citation:'
                    : 'प्रमाणित पुरालेखीय संदर्भ:'}
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
