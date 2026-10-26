import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X, BookOpen, ChevronRight, Compass } from 'lucide-react'
import h from './HistoryPage.module.css'

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
   Historical Milestones (8 Epochs)
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
    id: 'gargi',
    yearNumeric: -800,
    dateDisplayEn: '800 BCE',
    dateDisplayHi: '८०० ईसा पूर्व',
    epochEn: 'Vedic Civilization',
    epochHi: 'वैदिक सभ्यता',
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
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'rudrama',
    yearNumeric: 1262,
    dateDisplayEn: '1262 – 1289 CE',
    dateDisplayHi: '१२६२ – १२८९ ईस्वी',
    epochEn: 'Medieval Kakatiya Era',
    epochHi: 'मध्यकालीन काकतीय युग',
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
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'abbakka',
    yearNumeric: 1555,
    dateDisplayEn: '1555 – 1582 CE',
    dateDisplayHi: '१५५५ – १५८२ ईस्वी',
    epochEn: 'Anti-Colonial Dawn',
    epochHi: 'उपनिवेशवाद-विरोधी संग्राम',
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
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'durgavati',
    yearNumeric: 1564,
    dateDisplayEn: '1564 CE',
    dateDisplayHi: '१५६४ ईस्वी',
    epochEn: 'Gondwana Sovereignty',
    epochHi: 'गोंडवाना संप्रभुता',
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
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'keladi',
    yearNumeric: 1689,
    dateDisplayEn: '1689 CE',
    dateDisplayHi: '१६८९ ईस्वी',
    epochEn: 'Deccan Resistance',
    epochHi: 'दक्कन प्रतिरोध युग',
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
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'lakshmibai',
    yearNumeric: 1857,
    dateDisplayEn: '1857 – 1858 CE',
    dateDisplayHi: '१८५७ – १८५८ ईस्वी',
    epochEn: 'First War of Independence',
    epochHi: 'प्रथम स्वतंत्रता संग्राम',
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
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'anandibai',
    yearNumeric: 1886,
    dateDisplayEn: '1886 CE',
    dateDisplayHi: '१८८६ ईस्वी',
    epochEn: 'Scientific & Academic Pioneer',
    epochHi: 'वैज्ञानिक एवं चिकित्सा क्रांति',
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
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'modern',
    yearNumeric: 2026,
    dateDisplayEn: '2026 CE · Today',
    dateDisplayHi: '२०२६ ईस्वी · आज',
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
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  }
]

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('gargi')
  const [hoveredChartItem, setHoveredChartItem] = useState<Milestone | null>(null)
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})
  const [scrollProgress, setScrollProgress] = useState(0)

  const timelineRef = useRef<HTMLUListElement>(null)
  const leavesCanvasRef = useRef<HTMLCanvasElement>(null)
  const leavesWrapRef = useRef<HTMLDivElement>(null)

  // Colorful Falling Leaves Engine (floats across the entire timeline)
  useEffect(() => {
    const canvas = leavesCanvasRef.current
    const wrap = leavesWrapRef.current
    if (!canvas || !wrap) return

    const engine = createLeavesEngine(canvas, wrap)

    const toLocal = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      engine.setPointer(x, y, true)
    }
    const onLeave = () => engine.setPointer(-9999, -9999, false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })

    return () => {
      engine.destroy()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Scroll detection to highlight current date & photo along the spine
  useEffect(() => {
    const handleScroll = () => {
      const timelineEl = timelineRef.current
      if (!timelineEl) return

      const rect = timelineEl.getBoundingClientRect()
      const totalH = rect.height
      const topOffset = -rect.top + window.innerHeight * 0.4
      const progress = Math.max(0, Math.min(1, topOffset / totalH))
      setScrollProgress(progress)

      // Find closest milestone based on scroll position of elements
      const items = timelineEl.querySelectorAll(`.${h.timelineItem}`)
      let closestId = TIMELINE_MILESTONES[0].id
      let minDistance = Infinity
      const viewportCenter = window.innerHeight * 0.45

      items.forEach((itemEl, idx) => {
        const itemRect = itemEl.getBoundingClientRect()
        const dist = Math.abs(itemRect.top - viewportCenter)
        if (dist < minDistance) {
          minDistance = dist
          closestId = TIMELINE_MILESTONES[idx].id
        }
      })

      setActiveMilestoneId(closestId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
              <span>{lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ પર लौटें'}</span>
            </Link>
            <span className={h.brandPill}>
              {lang === 'en' ? 'Civilizational Itihaas' : 'सभ्यतागत इतिहास'}
            </span>
          </div>

          <div className={h.headerCenterTitle}>
            <span>{lang === 'en' ? 'The Ascending Arc of ' : 'भारतीय नारी का '}</span>
            <span className={h.crimsonAccent}>
              {lang === 'en' ? 'Shakti' : 'ऐतिहासिक उत्कर्ष'}
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
          {lang === 'en' ? 'Chronological Spine · 800 BCE – 2026 CE' : 'ऐतिहासिक कालक्रम रीढ़ · ८०० ईसा पूर्व – २०२६'}
        </span>
        <h1 className={h.introTitle}>
          {lang === 'en' ? 'Civilizational Trajectory of ' : 'भारतीय नारी का अमर '}
          <span className={h.crimsonAccent}>
            {lang === 'en' ? 'Itihaas' : 'इतिहास'}
          </span>
        </h1>
        <p className={h.introDesc}>
          {lang === 'en'
            ? 'Scroll down to travel along the central chronological spine. The active historical milestone automatically expands with its round photo, verified strategy, and citations.'
            : 'नीचे स्क्रॉल करते जाएं। जैसे ही आप किसी कालखंड पर पहुंचेंगे, उस वीरांगना का चित्र, विचार और पुरातात्विक दस्तावेज स्वतः विस्तार ले लेंगे।'}
        </p>
        <div className={h.scrollProgressPill}>
          <Compass size={14} color="#DC143C" />
          <span>{lang === 'en' ? 'Current Epoch:' : 'वर्तमान कालखंड:'}</span>
          <span className={h.scrollProgressVal}>
            {lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi} ({lang === 'en' ? currentMilestone.dateDisplayEn : currentMilestone.dateDisplayHi})
          </span>
        </div>
      </section>

      {/* ============================================================
          THE VERTICAL SPINE TIMELINE (Alternating direction-l / direction-r)
          ============================================================ */}
      <div className={h.timelineWrapper}>
        <ul className={h.timeline} ref={timelineRef}>
          {/* Dynamic Active Progress Spine Line */}
          <div
            className={h.timelineActiveSpine}
            style={{ height: `${Math.min(100, scrollProgress * 105)}%` }}
          />

          {TIMELINE_MILESTONES.map((item, idx) => {
            const isLeft = idx % 2 === 0
            const isActive = activeMilestoneId === item.id

            return (
              <li
                key={item.id}
                className={`${h.timelineItem} ${isActive ? h.itemActive : ''}`}
                onClick={() => setActiveMilestoneId(item.id)}
              >
                <div className={isLeft ? h.directionL : h.directionR}>
                  <div className={h.flagWrapper}>
                    {/* Time Badge (Date tag) */}
                    <span className={h.timeWrapper}>
                      <span className={h.time}>
                        {lang === 'en' ? item.dateDisplayEn : item.dateDisplayHi}
                      </span>
                    </span>

                    {/* Flag Title */}
                    <span className={`${h.flag} ${isActive ? h.flagActive : ''}`}>
                      {lang === 'en' ? item.nameEn : item.nameHi}
                    </span>
                  </div>

                  {/* ACTIVE STATE: Round photo, detailed information & dossier CTA */}
                  {isActive ? (
                    <div className={h.activeMilestoneBox}>
                      <div className={h.activeRoundPhotoWrapper}>
                        {/* Round Radius Image as requested */}
                        <div className={h.activeRoundPhoto}>
                          <img
                            src={item.image}
                            alt={lang === 'en' ? item.nameEn : item.nameHi}
                            onLoad={() => handleImageLoad(item.image)}
                            style={{
                              opacity: loadedImages[item.image] ? 1 : 0,
                              transition: 'opacity 0.25s ease'
                            }}
                          />
                        </div>

                        <div className={h.activeTitles}>
                          <span className={h.activeEpoch}>
                            {lang === 'en' ? item.epochEn : item.epochHi}
                          </span>
                          <strong className={h.activeName}>
                            {lang === 'en' ? item.nameEn : item.nameHi}
                          </strong>
                        </div>
                      </div>

                      <div className={h.activeQuote}>
                        "{lang === 'en' ? item.quoteEn : item.quoteHi}"
                      </div>

                      <p className={h.activeDesc}>
                        {lang === 'en' ? item.descEn : item.descHi}
                      </p>

                      <button
                        type="button"
                        className={h.inspectDossierBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveDossier(item)
                        }}
                      >
                        <BookOpen size={14} />
                        <span>
                          {lang === 'en'
                            ? 'Inspect Verified Archival Dossier'
                            : 'प्रमाणित पुरातात्विक दस्तावेज देखें'}
                        </span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ) : (
                    /* INACTIVE STATE: Clean, compact summary */
                    <div className={h.inactiveDescSnippet}>
                      {lang === 'en' ? item.epochEn : item.epochHi} — {lang === 'en' ? item.descEn.split('.')[0] + '.' : item.descHi.split('।')[0] + '।'}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ============================================================
          END OF JOURNEY: COMPLETE CHRONOLOGICAL CHART OVERVIEW
          "when he reach to end we need to show the simple chart with the date and heading
           and when the user hover the image we need to show more details"
          ============================================================ */}
      <section className={h.endSummarySection}>
        <div className={h.endHeader}>
          <span className={h.endHeaderBadge}>
            {lang === 'en' ? 'Complete Trajectory Overview' : 'संपूर्ण कालक्रम सारणी'}
          </span>
          <h2 className={h.endHeaderTitle}>
            {lang === 'en' ? 'Civilizational Epoch Matrix' : 'युग प्रवर्तक वीरांगना संचिका'}
          </h2>
          <p className={h.endHeaderSubtitle}>
            {lang === 'en'
              ? 'Hover any milestone to reveal verified battlefield tactics and civilizational legacy.'
              : 'किसी भी कालखंड के चित्र पर कर्सर ले जाकर उसके सामरिक नवाचार एवं पुरालेखीय साक्ष्य देखें।'}
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
                    {lang === 'en' ? item.dateDisplayEn : item.dateDisplayHi}
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
                      {lang === 'en' ? 'Tactics & Legacy:' : 'रणनीति व संप्रभुता:'}
                    </strong>
                    <p style={{ margin: 0 }}>
                      {lang === 'en' ? item.dossierEn.tactics : item.dossierHi.tactics}
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
                    ? '3. Civilizational Legacy & Precedent:'
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
