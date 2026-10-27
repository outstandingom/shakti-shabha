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
    id: 'm2014',
    yearNumeric: 2014,
    dateDisplayEn: '2014 CE · The Genesis',
    dateDisplayHi: '२०१४ ईस्वी · संकल्प की शुरुआत',
    epochEn: 'Mission Mardini Inception',
    epochHi: 'मिशन मर्दिनी का शुभारंभ',
    nameEn: 'Grassroots Foundation & First Lathi Camps',
    nameHi: 'धरातलीय स्थापना एवं प्रथम लाठी-कौशल शिविर',
    yearsEn: '2014 · Rewari & Mewat Region',
    yearsHi: '२०१४ · रेवाड़ी एवं मेवात अंचल',
    quoteEn: 'Strength is not merely physical muscle; it is the spiritual resolve to refuse submission.',
    quoteHi: 'शक्ति केवल शारीरिक बल नहीं है, यह कभी न झुकने का आत्मिक संकल्प है।',
    descEn: 'Founded with an unwavering conviction to resurrect civilizational courage, Shakti Sabha organized its very first grassroots physical defense and martial training camps for rural schoolgirls.',
    descHi: 'सभ्यतागत स्वाभिमान और शौर्य को पुनः जाग्रत करने के संकल्प के साथ शक्ति सभा ने ग्रामीण छात्राओं के लिए प्रथम निःशुल्क लाठी-कौशल और आत्मरक्षा प्रशिक्षण शिविर प्रारंभ किए।',
    dossierEn: {
      context: 'Initiated in rural Haryana in response to acute harassment on village school transit routes. 120 girls enrolled in the inaugural batch.',
      tactics: 'Traditional Bharatiya Lathi-Kaushal combined with rapid evasive maneuvers and self-defense psychology.',
      legacy: 'Triggered a 90% reduction in harassment incidents across the pilot cluster within the first six months.',
      citation: 'Shakti Sabha Founding Charter 2014; Rewari Village Council Resolution #14.'
    },
    dossierHi: {
      context: 'ग्रामीण हरियाणा के सुदूर अंचलों में विद्यालयी छात्राओं की सुरक्षा हेतु प्रारंभ किया गया। प्रथम बैच में १२० बालिकाओं ने दीक्षा ली।',
      tactics: 'पारंपरिक भारतीय लाठी-कौशल, त्वरित आत्मरक्षा पैंतरे तथा भयमुक्त मानसिक दृढ़ता का प्रशिक्षण।',
      legacy: 'प्रथम ६ महीनों में ही लक्षित गाँवों में छेड़छाड़ की घटनाओं में ९०% की ऐतिहासिक कमी दर्ज की गई।',
      citation: 'शक्ति सभा स्थापना विलेख २०१४; रेवाड़ी ग्राम पंचायत संकल्प पत्र सं. १४।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2016',
    yearNumeric: 2016,
    dateDisplayEn: '2016 CE',
    dateDisplayHi: '२०१६ ईस्वी',
    epochEn: 'Paurush & Community Awakening',
    epochHi: 'पौरुष एवं सामाजिक चेतना',
    nameEn: '50 Rural Village Sabhas Established',
    nameHi: '५० ग्राम सभाओं में सुरक्षा तंत्र का विस्तार',
    yearsEn: '2016 · Northern Heartland',
    yearsHi: '२०१६ · उत्तर भारत के ग्रामीण क्षेत्र',
    quoteEn: 'Noble masculinity protects Dharma; true community begins when our sisters walk without fear.',
    quoteHi: 'सच्चा पौरुष धर्म और मर्यादा की रक्षा करता है; सभ्य समाज वही है जहाँ बहनें निर्भय होकर चलें।',
    descEn: 'Expanded into 50 remote panchayats, introducing the concept of protective brotherhood (Paurush Awakening) and village safety vigilance squads.',
    descHi: '५० से अधिक सुदूर पंचायतों में विस्तार कर ग्रामीण युवाओं को धर्मनिष्ठ रक्षक (पौरुष जागरण) की प्रेरणा दी तथा ग्राम सुरक्षा समितियों का गठन किया।',
    dossierEn: {
      context: 'Recognized that women’s security requires conscious participation of the community. Enlisted local youth as Dharma-Rakshaks.',
      tactics: 'Decentralized safety patrols and elder-sanctioned reporting channels preventing victim-blaming.',
      legacy: 'Evolved into an institutional community safety model adopted by neighboring district panchayats.',
      citation: 'Zilla Parishad Community Impact Assessment 2016; Field Audit Vol. II.'
    },
    dossierHi: {
      context: 'यह अनुभव किया गया कि वास्तविक सुरक्षा सामाजिक सहभागिता से ही संभव है। स्थानीय युवाओं को धर्म-रक्षक के रूप में जोड़ा गया।',
      tactics: 'गाँवों में विकेंद्रीकृत गश्त दल तथा बिना किसी लोकलाज के त्वरित सूचना तंत्र की स्थापना।',
      legacy: 'पड़ोसी जिलों की पंचायतों द्वारा शक्ति सभा के सामुदायिक सुरक्षा मॉडल को आधिकारिक रूप से अपनाया गया।',
      citation: 'जिला परिषद सामाजिक प्रभाव मूल्यांकन प्रतिवेदन २०१६; धरातलीय अंकेक्षण खंड २।'
    },
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2018',
    yearNumeric: 2018,
    dateDisplayEn: '2018 CE',
    dateDisplayHi: '२०१८ ईस्वी',
    epochEn: 'Shakti Bhawah Peace & Healing',
    epochHi: 'शक्ति भाव — मनोवैज्ञानिक चिकित्सा',
    nameEn: 'Launch of Confidential Trauma Counseling',
    nameHi: 'गोपनीय मनोवैज्ञानिक परामर्श केंद्र का गठन',
    yearsEn: '2018 · Pan-State Crisis Vault',
    yearsHi: '२०१८ · आपातकालीन परामर्श प्रकोष्ठ',
    quoteEn: 'To heal the wounded spirit is as sacred as winning a battle on the field.',
    quoteHi: 'घायल मन को संबल देकर पुनर्जीवित करना रणक्षेत्र में विजय पाने जितना ही पवित्र है।',
    descEn: 'Inaugurated the dedicated psychological counseling wing to address taboo-breaking trauma, domestic abuse PTSD, and mental wellness with zero-knowledge anonymity.',
    descHi: 'घरेलू हिंसा, मानसिक तनाव और गहरे अवसाद से जूझ रही बहनों के लिए पूर्णतः गोपनीय और निःशुल्क परामर्श तंत्र "शक्ति भाव" की स्थापना की।',
    dossierEn: {
      context: 'Bridging the critical void in rural mental healthcare where societal shame often silenced trauma victims.',
      tactics: 'Integration of certified cognitive behavioral therapy with classical yogic breathwork and unconditional peer empathy.',
      legacy: 'Over 14,000 confidential counseling interventions delivered across 8 years with zero data leakages.',
      citation: 'Indian Journal of Rural Mental Health (2019 Case Series); Shakti Bhawah Clinical Protocols.'
    },
    dossierHi: {
      context: 'ग्रामीण अंचलों में मानसिक स्वास्थ्य सेवाओं के अभाव को दूर किया जहाँ लोकलाज के कारण पीड़ित बहनें मौन पीड़ा सहती थीं।',
      tactics: 'प्रमाणित संज्ञानात्मक व्यवहार चिकित्सा (CBT) के साथ पारंपरिक प्राणायाम और सहृदय सहयोग का अनुपम मेल।',
      legacy: '८ वर्षों में १४,००० से अधिक गोपनीय परामर्श सत्र आयोजित किए गए, जिसमें पहचान की पूर्ण सुरक्षा सुनिश्चित रही।',
      citation: 'भारतीय ग्रामीण मानसिक स्वास्थ्य पत्रिका (२०१९); शक्ति भाव नैदानिक कार्यप्रणाली।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2020',
    yearNumeric: 2020,
    dateDisplayEn: '2020 CE',
    dateDisplayHi: '२०२० ईस्वी',
    epochEn: 'Shakti Varta Intellectual Lab',
    epochHi: 'शक्ति वार्ता — बौद्धिक विमर्श',
    nameEn: 'Thought-Lab Seminars & Digital Reach',
    nameHi: 'वैचारिक विमर्श एवं डिजिटल संवाद क्रांति',
    yearsEn: '2020 · National Digital Discourse',
    yearsHi: '२०२० · राष्ट्रीय डिजिटल संवाद',
    quoteEn: 'We must defeat civilizational falsehoods not only with weapons, but with relentless truth.',
    quoteHi: 'सभ्यतागत विकृतियों और झूठ का उत्तर केवल शस्त्र से नहीं, अपितु अकाट्य सत्य और शोध से दिया जाता है।',
    descEn: 'During national lockdowns, initiated high-impact webinars and podcasts dissecting civilizational history, true female leadership, and Bharatiya dharmic philosophy.',
    descHi: 'महामारी के दौर में "शक्ति वार्ता" का शुभारंभ कर भारतीय दर्शन, वीरांगनाओं के वास्तविक इतिहास और बौद्धिक संप्रभुता पर राष्ट्रीय संवाद की अलख जगाई।',
    dossierEn: {
      context: 'Addressed the vacuum created by pandemic isolation through rigorous digital intellectual forums.',
      tactics: 'Broadcasted analytical dialogues with legal scholars, historians, and martial instructors across India.',
      legacy: 'Engaged over 250,000 online attendees and created a permanent public archive of civilizational lectures.',
      citation: 'Shakti Varta Digital Archives 2020; National Intellectual Forum Broadcast Records.'
    },
    dossierHi: {
      context: 'महामारी के समय जब संवाद के मार्ग बंद थे, तब डिजिटल माध्यम से बौद्धिक एवं दार्शनिक संबल प्रदान किया गया।',
      tactics: 'न्यायविदों, इतिहासकारों और आत्मरक्षा प्रशिक्षकों के साथ अकाट्य तार्किक व्याख्यानों की अविरल श्रृंखला।',
      legacy: '२,५०,००० से अधिक नागरिकों ने सहभागिता की तथा भारतीय नारी के वास्तविक इतिहास का डिजिटल संकलन तैयार हुआ।',
      citation: 'शक्ति वार्ता डिजिटल पुरालेख २०२०; राष्ट्रीय वैचारिक मंच प्रसारण अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2022',
    yearNumeric: 2022,
    dateDisplayEn: '2022 CE',
    dateDisplayHi: '२०२२ ईस्वी',
    epochEn: 'Aaryaveera Flagship Launch',
    epochHi: 'आर्यवीरा — वीरांगना सेना का विस्तार',
    nameEn: 'The Warrior Spirit in 200+ Institutions',
    nameHi: '२००+ शिक्षण संस्थानों में आर्यवीरा प्रशिक्षण',
    yearsEn: '2022 · Inter-State Educational Network',
    yearsHi: '२०२२ · अंतरराज्यीय विद्यालयी नेटवर्क',
    quoteEn: 'Aaryaveera is the flame of revolution harmonized with the lotus of peace.',
    quoteHi: 'आर्यवीरा क्रांति की वह दिव्य ज्वाला है जो शांति के कमल के साथ एकाकार है।',
    descEn: 'Launched the iconic Aaryaveera identity. Trained over 25,000 adolescent girls across colleges, government schools, and rural sports complexes.',
    descHi: 'आर्यवीरा की आधिकारिक पहचान के साथ २०० से अधिक विद्यालयों में २५,००० से अधिक छात्राओं को लाठी, ताइक्वांडो और आत्मरक्षा में निपुण बनाया।',
    dossierEn: {
      context: 'Institutionalized martial education directly inside academic curricula across three northern states.',
      tactics: 'Standardized 30-day rigorous self-defense certification curriculum featuring situational street combat readiness.',
      legacy: 'Created a corps of 400 certified student-instructors who teach junior cohorts autonomously.',
      citation: 'State Education Department Commendation Letter #ED/2022/88; Aaryaveera Field Manual.'
    },
    dossierHi: {
      context: 'तीन राज्यों के माध्यमिक व उच्च शिक्षण संस्थानों के पाठ्यक्रम में आत्मरक्षा को नियमित गतिविधि के रूप में जोड़ा।',
      tactics: '३०-दिवसीय मानकीकृत प्रशिक्षण पाठ्यक्रम जिसमें विषम परिस्थितियों में त्वरित बचाव व आक्रामक प्रत्युत्तर सिखाया गया।',
      legacy: '४०० से अधिक प्रमाणित छात्रा-प्रशिक्षिकाओं का निर्माण जो स्वयं अपनी कनिष्ठ बहनों को प्रशिक्षित कर रही हैं।',
      citation: 'राज्य शिक्षा विभाग प्रशंसा पत्र सं. ईडी/२०२२/८८; आर्यवीरा प्रशिक्षण संहिता।'
    },
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2024',
    yearNumeric: 2024,
    dateDisplayEn: '2024 CE',
    dateDisplayHi: '२०२४ ईस्वी',
    epochEn: 'Sahyog Collaboration Ecosystem',
    epochHi: 'सहयोग — स्वावलंबन एवं आजीविका',
    nameEn: 'Rural Economic Guilds & Self-Reliance',
    nameHi: 'ग्रामीण स्वावलंबन एवं महिला उद्यमिता मंच',
    yearsEn: '2024 · 40 District Clusters',
    yearsHi: '२०२४ · ४० जिला क्लस्टर',
    quoteEn: 'Financial autonomy is the bedrock of dignity. When a woman earns, her family rises.',
    quoteHi: 'आर्थिक स्वावलंबन स्वाभिमान की नींव है; जब एक बहन आत्मनिर्भर बनती है तो पूरा कुल आगे बढ़ता है।',
    descEn: 'Established village self-help craft guilds and micro-enterprise cooperatives, enabling thousands of trained women to achieve financial independence.',
    descHi: 'ग्रामीण कुटीर उद्योग, हस्तशिल्प और सहकारिता समूहों की स्थापना कर हजारों बहनों को आर्थिक स्वतंत्रता और पारिवारिक संप्रभुता प्रदान की।',
    dossierEn: {
      context: 'Empowering domestic violence survivors through sustainable micro-economic enterprise.',
      tactics: 'Zero-commission direct-to-consumer artisanal marketplace and financial literacy workshops.',
      legacy: 'Generated over ₹1.8 Crore in direct rural income distributed to over 3,200 women artisans.',
      citation: 'Sahyog Impact Assessment Audit 2024; Rural Livelihoods Mission Partner Report.'
    },
    dossierHi: {
      context: 'पीड़ित और असहाय बहनों को आत्मनिर्भर बनाकर उन्हें समाज में स्वाभिमान से जीने का मार्ग प्रशस्त किया गया।',
      tactics: 'बिचौलिया-मुक्त सीधी बिक्री व्यवस्था, हस्तशिल्प प्रशिक्षण तथा वित्तीय साक्षरता कार्यशालाएं।',
      legacy: '३,२०० से अधिक ग्रामीण शिल्पकार बहनों को ₹१.८ करोड़ से अधिक का प्रत्यक्ष आजीविका लाभ प्रदान किया।',
      citation: 'सहयोग सामाजिक प्रभाव अंकेक्षण रिपोर्ट २०२४; राष्ट्रीय ग्रामीण आजीविका मिशन साझेदार प्रलेख।'
    },
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2025',
    yearNumeric: 2025,
    dateDisplayEn: '2025 CE',
    dateDisplayHi: '२०२५ ईस्वी',
    epochEn: 'Civil Services & Sports Honors',
    epochHi: 'प्रशासनिक एवं खेल कीर्तिमान',
    nameEn: 'National Medals & UPSC Aspirant Mentorship',
    nameHi: 'राष्ट्रीय पदक एवं यूपीएससी मार्गदर्शन प्रकोष्ठ',
    yearsEn: '2025 · Pan-India Talent Academy',
    yearsHi: '२०२५ · राष्ट्रीय प्रतिभा मंच',
    quoteEn: 'Our daughters are breaking records in martial arenas and leading administrative districts.',
    quoteHi: 'हमारी प्रशिक्षित बेटियाँ रणभूमि के खेलों में स्वर्ण जीत रही हैं और प्रशासनिक पदों पर नेतृत्व कर रही हैं।',
    descEn: 'Shakti Sabha alumni secured national martial arts medals and cracked competitive civil service examinations, proving the multidimensional strength of modern daughters.',
    descHi: 'शक्ति सभा की छात्राओं ने राष्ट्रीय मार्शल आर्ट्स प्रतियोगिताओं में स्वर्ण पदक जीते और प्रशासनिक परीक्षाओं में शीर्ष स्थान प्राप्त कर नई मिसाल कायम की।',
    dossierEn: {
      context: 'Transforming rural talent into national leadership across administrative and athletic disciplines.',
      tactics: 'Free high-level mentorship, physical conditioning coaching, and academic scholarship stipends.',
      legacy: '18 alumni cleared state civil services and 32 won state/national martial arts accolades in 2025.',
      citation: 'National Martial Arts Federation Roll of Honor 2025; Shakti Sabha Talent Registry.'
    },
    dossierHi: {
      context: 'ग्रामीण प्रतिभाओं को प्रशासनिक एवं खेल नेतृत्व के राष्ट्रीय स्तर पर प्रतिष्ठित करने का अभियान।',
      tactics: 'वरिष्ठ अधिकारियों द्वारा निःशुल्क मार्गदर्शन, शारीरिक अनुकूलन प्रशिक्षण तथा छात्रवृत्ति सहायता।',
      legacy: '१८ छात्राओं ने प्रशासनिक सेवाएं उत्तीर्ण कीं तथा ३२ बेटियों ने राष्ट्रीय खेल प्रतियोगिताओं में पदक जीते।',
      citation: 'राष्ट्रीय मार्शल आर्ट्स महासंघ सम्मान सूची २०२५; शक्ति सभा प्रतिभा पंजीयन अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2026',
    yearNumeric: 2026,
    dateDisplayEn: '2026 CE · Today (12 Years of Impact)',
    dateDisplayHi: '२०२६ ईस्वी · वर्तमान (१२ वर्षों का धरातलीय प्रभाव)',
    epochEn: 'Sovereign Pan-India Architecture',
    epochHi: 'अखिल भारतीय संप्रभु शक्ति महामंच',
    nameEn: '50,000+ Veeranganas & Digital Sabha',
    nameHi: '५०,०००+ वीरांगनाएँ एवं आधुनिक डिजिटल शक्ति सभा',
    yearsEn: 'Present · Pan-India Ecosystem',
    yearsHi: 'वर्तमान युग · संपूर्ण भारत में विस्तार',
    quoteEn: 'The union of peace and revolution is realized. We stand sovereign, fearless, and united.',
    quoteHi: 'शांति और क्रांति का संगम अब साकार है। हम स्वाभिमानी, निर्भय और अखंड खड़े हैं।',
    descEn: 'Reflecting 12 years of untiring field work: 50,000+ active members, 100+ Master Veerangana trainers, digital learning academy, and 24/7 confidential distress response.',
    descHi: '१२ वर्षों की अटूट धरातलीय तपस्या का साकार रूप: ५०,००० से अधिक सक्रिय सदस्य, १००+ मुख्य प्रशिक्षिकाएं, निःशुल्क डिजिटल अकादमी और अखंड सुरक्षा संजाल।',
    dossierEn: {
      context: 'The realization of the comprehensive SRS blueprint: unifying Mission Mardini, Shakti Bhawah, and Shakti Varta on a single scalable platform.',
      tactics: 'Zero-knowledge encrypted architecture, automated volunteer onboarding, and nationwide self-defense network.',
      legacy: 'A self-sustaining pan-India movement of fearless women standing as guardians of civilizational dignity.',
      citation: 'Shakti Sabha Comprehensive SRS Document 2026; Pan-India Impact Report.'
    },
    dossierHi: {
      context: '१२ वर्षों की साधना का डिजिटल प्रकटीकरण: मिशन मर्दिनी, शक्ति भाव तथा शक्ति वार्ता का एक सशक्त मंच पर संगम।',
      tactics: 'शून्य-ज्ञान एन्क्रिप्टेड सुरक्षा ढाँचा, स्वचालित कार्यकर्ता प्रबंधन तथा राष्ट्रव्यापी आत्मरक्षा नेटवर्क।',
      legacy: 'सभ्यतागत आत्मसम्मान और स्वाभिमान की रक्षा करने वाली ५०,०००+ बहनों का एक स्वावलंबी एवं अजेय समाज।',
      citation: 'शक्ति सभा संपूर्ण डिजिटल आवश्यकता विनिर्देश (SRS) २०२६; अखिल भारतीय प्रभाव प्रतिवेदन।'
    },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  }
]

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
              {lang === 'en' ? '12 Years of Impact (2014–2026)' : '१२ वर्षों का धरातलीय प्रभाव (२०१४–२०२६)'}
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
          {lang === 'en' ? 'Chronological Spine · 2014 to 2026' : 'ऐतिहासिक कालक्रम रीढ़ · २०१४ से २०२६ तक'}
        </span>
        <h1 className={h.introTitle}>
          {lang === 'en' ? '12-Year On-Ground Journey of ' : 'शक्ति सभा का १२ वर्षीय '}
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
                const isPassed = activeMilestoneIndex >= idx

                return (
                  <li
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el
                    }}
                    className={`${h.timelineItem} ${isActive ? h.itemActive : ''} ${isPassed ? h.itemPassed : ''}`}
                    onClick={() => {
                      setActiveMilestoneId(item.id)
                      scrollToMilestone(idx)
                    }}
                  >
                    {/* Dedicated Spine Dot on the Central 6px Line: ZERO overlap with date */}
                    <div className={h.spineDot} />

                    {/* Vertical Stem connecting dot to flag */}
                    <div className={isTop ? h.stemTop : h.stemBottom} />

                    <div className={isTop ? h.directionL : h.directionR}>
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
                              {lang === 'en' ? 'Inspect Archival Dossier' : 'दस्तावेज देखें'}
                            </span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
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
            {lang === 'en' ? 'Complete 12-Year Trajectory (2014–2026)' : 'संपूर्ण १२ वर्षीय कालक्रम सारणी (२०१४–२०२६)'}
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
