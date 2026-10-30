import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import p from './AaryaveeraPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const PLATFORM_CARDS = [
  { label: 'Mission Mardini Camps', desc: '7–10 days intensive residential self-defense and martial readiness camps organized across institutional, rural, and tribal corridors.' },
  { label: 'Dual-Shield Doctrine', desc: 'Cognitive de-escalation, threat recognition, and managing the freeze response combined with bio-mechanical combat.' },
  { label: 'Lathi-Kaushal & Karate', desc: 'Traditional staff training, martial arts discipline, and practical street-safety empty-hand defense.' },
  { label: 'Event Series & Seminars', desc: 'Keynotes, institutional assemblies, and consciousness-building sessions reaching 25,000+ youth across India.' },
  { label: 'Aaryaveera Dialogues', desc: 'Civilizational podcast exploring Kshatra-Dharma, non-verbal psychology, and uncorrupted Vedic history.' },
  { label: 'Frontline Safeguarding', desc: 'Vulnerability interception at transit nodes, pre-FIR family mediations, and somatic trauma de-escalation.' },
]

const PILLARS = [
  {
    name: 'MARDINI',
    dev: 'मर्दिनी',
    tag: 'Physical Sovereignty & Tactical Preparedness',
    accent: '#DC143C',
    accentBg: 'rgba(220,20,60,0.08)',
    icon: 'swords',
    desc: 'Led by Aaryaveera (Black Belt in Karate), Mission Mardini challenges passive self-defense by developing mental composure, situational awareness, Karate empty-hand defense, and Lathi-Kaushal.',
    items: ['2,000+ girls trained in armed and unarmed defense', '7–10 days intensive residential warrior camps', 'Tribal and rural outreach beyond urban centers'],
  },
  {
    name: 'SHAKTI BHAVA',
    dev: 'शक्ति भव',
    tag: 'Cognitive Awakening & Human Consciousness',
    accent: '#3D5A45',
    accentBg: 'rgba(61,90,69,0.08)',
    icon: 'spa',
    desc: 'Youth-awareness and consciousness initiative cultivating independent thinkers who examine narratives through reason. Direct crisis mediator handling complex vulnerability and family reconciliations.',
    items: ['500+ institutional seminars reaching 25,000+ students', '13 minors safely reintegrated under statutory oversight', '50+ critical family mediations & somatic grounding'],
  },
  {
    name: 'SHAKTI VARTA',
    dev: 'शक्ति वार्ता',
    tag: 'Intellectual Sovereignty & Critical Inquiry',
    accent: '#C9A96E',
    accentBg: 'rgba(201,169,110,0.08)',
    icon: 'menu_book',
    desc: 'Research, mentorship, and public discourse platform equipping youth with research literacy, primary textual inquiry (Vedas, Gita, Satyarth Prakash), and media deconstruction tools.',
    items: ['Vedic Digital Fellowship for classical texts & philosophy', 'Critical media analysis & algorithm deconstruction', 'Archival research on forgotten Indian women warriors'],
  },
]

const BRAND_ASSETS = [
  { item: 'Primary Logo', spec: 'Flame + lotus composite in SVG & PNG — full color, monochrome, reversed' },
  { item: 'Warrior Emblem', spec: 'Icon-only mark for certification badges, merchandise, and favicon' },
  { item: 'Brand Story Document', spec: 'Comprehensive dossier covering origin, values, visual language, and tone of voice' },
  { item: 'Animated Intro', spec: '5-second MP4/WebM flame reveal for video openers and social reels' },
  { item: 'Merchandise Templates', spec: 'Print-ready files for training garments, tote bags, and bamboo lathi staffs' },
  { item: 'Social Kit', spec: 'Civilizational discourse graphics, reels templates, and white paper covers' },
]

const FEATURES = [
  { icon: 'shield', title: 'The Dual-Shield Doctrine', text: 'Mental resilience before physical strike. Liberating the mind from fear and replacing the freeze-response with tactical awareness.' },
  { icon: 'local_fire_department', title: 'Character & Kshatra-Dharma', text: 'The responsibility to protect, the courage to confront injustice, the discipline to exercise power responsibly, and the wisdom to distinguish strength from aggression.' },
  { icon: 'podcasts', title: 'Civilizational Dialogue', text: 'Rigorous intellectual forums examining Vedic philosophy, narrative deconstruction, and sovereign human dignity.' },
]

export default function AaryaveeraPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const whatRef = useRef<HTMLDivElement>(null)
  const platformRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const assetsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(heroRef.current, { opacity: 0, y: 30, duration: 1, ease: 'power3.out' })

      // What is Aaryaveera
      gsap.from(`#what-left`, { opacity: 0, x: -40, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: whatRef.current, start: 'top 80%' } })
      gsap.from(`#what-right .${p.featureBox}`, { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: whatRef.current, start: 'top 75%' } })

      // Platform cards
      gsap.from(`.${p.platformCard}`, { opacity: 0, y: 40, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: platformRef.current, start: 'top 80%' } })

      // Pillars
      gsap.from(`.${p.pillarCard}`, { opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: pillarsRef.current, start: 'top 78%' } })

      // Assets checklist
      gsap.from(`.${p.assetRow}`, { opacity: 0, x: -30, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: assetsRef.current, start: 'top 80%' } })

      // CTA
      gsap.from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 88%' } })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className={p.page}>
      {/* ── HERO BANNER ─────────────────────────────── */}
      <div className={p.hero} ref={heroRef}>
        <div className={p.heroInner}>
          <Link to="/" className={s.back}>← Back to Home</Link>
          <span className={p.eyebrow}>FOUNDER &amp; DIRECTOR · SHAKTI SABHA</span>
          <div className={p.heroTitle}>
            <h1 style={{ margin: 0, display: 'inline' }}>
              <span className={p.heroEn}>AARYAVEERA</span>
              <span className={p.heroDev}>आर्यवीरा</span>
            </h1>
          </div>
          <p className={p.heroSub}>Harshita Mankar · Civilizational Strategist | Tactical Combat Instructor | Non-Verbal Behaviour Profiler</p>
          <p className={p.heroMotto}>"We do not build dependent victims; we forge sovereign, intellectually fortified, and tactically capable guardians of Indian civilization."</p>

          {/* Animated Flame SVG */}
          <div className={p.flameCont} aria-hidden="true">
            <svg className={p.flame} viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 85C30 85 8 64 8 44C8 28 19 16 30 8C30 8 28 25 38 32C38 32 32 22 40 14C40 14 52 28 52 44C52 64 30 85 30 85Z" fill="url(#flameGrad)" />
              <path d="M30 85C30 85 16 68 16 52C16 40 23 32 30 24C30 24 28 36 34 42C34 42 30 36 36 28C36 28 44 38 44 52C44 68 30 85 30 85Z" fill="url(#innerFlame)" opacity="0.8"/>
              <circle cx="30" cy="62" r="6" fill="url(#lotus)" opacity="0.6"/>
              <defs>
                <linearGradient id="flameGrad" x1="30" y1="8" x2="30" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFD700"/>
                  <stop offset="0.5" stopColor="#DC143C"/>
                  <stop offset="1" stopColor="#8B0000"/>
                </linearGradient>
                <linearGradient id="innerFlame" x1="30" y1="24" x2="30" y2="85" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFF3B0"/>
                  <stop offset="1" stopColor="#C9A96E"/>
                </linearGradient>
                <radialGradient id="lotus" cx="50%" cy="50%" r="50%">
                  <stop stopColor="#C9A96E"/>
                  <stop offset="1" stopColor="#3D5A45" stopOpacity="0"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ── WHAT IS AARYAVEERA ──────────────────────── */}
      <section className={p.whatSection} ref={whatRef}>
        <div className={p.whatInner}>
          <div className={p.whatLeft} id="what-left">
            <span className={p.sectionEyebrow}>The Doctrine</span>
            <h2 className={p.sectionH2}>What is Aaryaveera?</h2>
            <p className={p.bodyText}>
              Aaryaveera is more than a brand — it is a civilizational manifestation. Engineered by <strong>Harshita Mankar</strong> (Founder &amp; Director, Shakti Sabha), Aaryaveera unites the <strong>flame of tactical revolution</strong> (Mission Mardini) with the <strong>lotus of psychological sovereignty</strong> (Shakti Bhava) and intellectual armor (Shakti Varta).
            </p>
            <p className={p.bodyText} style={{ marginTop: '1rem' }}>
              The name itself carries civilizational weight: <em>Aarya</em> — noble, cultured, dharmic; <em>Veera</em> — brave, courageous, tactically formidable. Together, they describe the highest aspiration: a sovereign guardian who is both intellectually fortified and physically capable.
            </p>
            <p className={p.bodyText} style={{ marginTop: '1rem' }}>
              From 7–10 days intensive residential camps across high schools, colleges, and rural settlements to institutional white papers and digital fellowships, Aaryaveera creates a disciplined, coherent identity that rejects victimhood and restores Kshatra-Dharma.
            </p>
          </div>

          <div className={p.whatRight} id="what-right">
            {FEATURES.map((f, i) => (
              <div key={i} className={p.featureBox}>
                <div className={p.featureIconWrap}>
                  <GoogleIcon name={f.icon} size={28} className={p.featureIcon} />
                </div>
                <div>
                  <h3 className={p.featureTitle}>{f.title}</h3>
                  <p className={p.featureText}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM INTEGRATION ────────────────────── */}
      <section className={p.platformSection} ref={platformRef}>
        <div className={p.platformInner}>
          <span className={p.sectionEyebrow}>Operational Footprint</span>
          <h2 className={p.sectionH2}>Core Operational Dimensions</h2>
          <div className={p.platformGrid}>
            {PLATFORM_CARDS.map((card, i) => (
              <div key={i} className={p.platformCard}>
                <span className={p.platformNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={p.platformTitle}>{card.label}</h3>
                <p className={p.platformDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ───────────────────────────── */}
      <section className={p.pillarsSection} ref={pillarsRef}>
        <div className={p.pillarsInner}>
          <span className={p.sectionEyebrow}>Architecture</span>
          <h2 className={p.sectionH2}>Our Three Streams</h2>
          <div className={p.pillarsGrid}>
            {PILLARS.map((pil) => (
              <div key={pil.name} className={p.pillarCard} style={{ borderColor: pil.accent }}>
                <div className={p.pillarBadge} style={{ background: pil.accentBg, color: pil.accent }}>
                  {pil.tag}
                </div>
                <div className={p.pillarHeader}>
                  <GoogleIcon name={pil.icon} size={24} style={{ color: pil.accent }} />
                  <span className={p.pillarName}>{pil.name}</span>
                  <span className={p.pillarDev}>{pil.dev}</span>
                </div>
                <p className={p.pillarDesc}>{pil.desc}</p>
                <ul className={p.pillarList}>
                  {pil.items.map((item, idx) => (
                    <li key={idx}>
                      <span className={p.checkMark} style={{ color: pil.accent }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND ASSETS ────────────────────────────── */}
      <section className={p.assetsSection} ref={assetsRef}>
        <div className={p.assetsInner}>
          <span className={p.sectionEyebrow}>Identity System</span>
          <h2 className={p.sectionH2}>Aaryaveera Brand Assets</h2>
          <div className={p.assetTable}>
            {BRAND_ASSETS.map((row, i) => (
              <div key={i} className={p.assetRow}>
                <span className={p.assetItem}>{row.item}</span>
                <span className={p.assetSpec}>{row.spec}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className={p.ctaSection} ref={ctaRef}>
        <div className={p.ctaInner}>
          <h2 className={p.ctaHeading}>Step Into Sovereignty</h2>
          <p className={p.ctaSub}>
            Whether attending a 7–10 day Mardini camp or joining our Vedic Digital Fellowship — become a guardian of civilization.
          </p>
          <div className={p.ctaBtns}>
            <Link to="/mardini" className={p.ctaPrimary}>
              Explore Mission Mardini →
            </Link>
            <Link to="/about" className={p.ctaOutline}>
              Read Founder Dossier
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
