import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import p from './AaryaveeraPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const PLATFORM_CARDS = [
  { label: 'Mission Mardini Camps', desc: '7–10 days intensive residential self-defense and martial readiness camps organized across institutional and rural corridors.' },
  { label: 'Warrior Certification', desc: 'Physical and cognitive warrior certificate verifying empty-hand lethality, lathi-kaushal, and legal self-defense literacy.' },
  { label: 'Course LMS Curriculum', desc: 'Asymmetric combat video modules, situational radar drills, and trauma-de-escalation coursework.' },
  { label: 'Event Series & Seminars', desc: 'Keynotes, institutional assemblies, and student awakening sessions reaching 25,000+ youth.' },
  { label: 'Aaryaveera Dialogues', desc: 'Civilizational podcast exploring Kshatra-Dharma, non-verbal psychology, and uncorrupted Vedic history.' },
  { label: 'Warrior Merchandise', desc: 'Custom bamboo lathi staffs, combat training gear, and civilizational identity apparel.' },
]

const PILLARS = [
  {
    name: 'MARDINI',
    dev: 'मर्दिनी',
    tag: 'Revolution & Combat',
    accent: '#DC143C',
    accentBg: 'rgba(220,20,60,0.08)',
    icon: '⚔',
    desc: 'The fire that ignites tactical sovereignty. Spearheaded by Harshita Mankar (Black Belt in Karate), Mission Mardini builds physical and cognitive warriors through asymmetric street combat, traditional Lathi-Kaushal, and blade defense.',
    items: ['2,000+ young women weaponized (armed & unarmed)', '7–10 days residential warrior camps with partner groups', 'Traditional Lathi-Kaushal, Sword parries & CQC mechanics'],
  },
  {
    name: 'SHAKTI BHAVA',
    dev: 'शक्ति भव',
    tag: 'Psychological Sovereignty',
    accent: '#3D5A45',
    accentBg: 'rgba(61,90,69,0.08)',
    icon: '🌸',
    desc: 'The shield of psychological fortitude. Somatic PTSD stabilization, non-verbal behavioral profiling, and confidential peer intervention. Directly executing frontline rescues of minors and neutralizing predatory grooming.',
    items: ['Tactical rescue & safe reintegration of 13 minors', '250+ grooming & coercive exploitation cases handled', 'Non-verbal profiling & somatic PTSD stabilization'],
  },
  {
    name: 'SHAKTI VARTA',
    dev: 'शक्ति वार्ता',
    tag: 'Intellectual Armor',
    accent: '#C9A96E',
    accentBg: 'rgba(201,169,110,0.08)',
    icon: '📚',
    desc: 'The intellectual vanguard. Grounded in Vedic epistemology, archival forensics, and deconstructing western reductionist narratives. Equipping youth with the philosophical armor of Kshatra-Dharma.',
    items: ['500+ keynotes & seminars reaching 25,000+ students', 'Shakti Varta Fellowship for classical texts & Vedic sciences', 'Independent archival research on forgotten Indian women warriors'],
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
  { icon: '🛡', title: 'The Dual-Shield Doctrine', text: 'Mental resilience before physical strike. Liberating the mind from fear and replacing the freeze-response with tactical awareness.' },
  { icon: '🔥', title: 'Character & Kshatra-Dharma', text: 'Sovereign, fearless, dharmic. Training young girls so their hands, elbows, and cognitive agility function as an organic weapon system.' },
  { icon: '🎙', title: 'Civilizational Dialogue', text: 'Rigorous intellectual forums examining Vedic philosophy, geopolitical subversion, and what it means to be sovereign in contemporary India.' },
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
          <span className={p.eyebrow}>Signature Initiative · Mission Mardini</span>
          <div className={p.heroTitle}>
            <span className={p.heroEn}>AARYAVEERA</span>
            <span className={p.heroDev}>आर्यवीरा</span>
          </div>
          <p className={p.heroSub}>The Warrior Spirit & Tactical Sovereignty</p>
          <p className={p.heroMotto}>"Shakti Se Shanti — From Strength, Peace"</p>

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
              Aaryaveera is more than a brand — it is a civilizational manifestation. Engineered by <strong>Harshita Mankar</strong> (Founder & Director, Shakti Sabha), Aaryaveera unites the <strong>flame of tactical revolution</strong> (Mission Mardini) with the <strong>lotus of psychological sovereignty</strong> (Shakti Bhava).
            </p>
            <p className={p.bodyText} style={{ marginTop: '1rem' }}>
              The name itself carries civilizational weight: <em>Aarya</em> — noble, cultured, dharmic; <em>Veera</em> — brave, courageous, tactically formidable. Together, they describe the highest aspiration: a sovereign sentinel who is both intellectually fortified and physically invincible.
            </p>
            <p className={p.bodyText} style={{ marginTop: '1rem' }}>
              From 7–10 days intensive residential camps across high schools and rural settlements to institutional white papers and digital fellowships, Aaryaveera creates a disciplined, coherent identity that rejects victimhood and restores Kshatra-Dharma.
            </p>
          </div>
          <div className={p.whatRight} id="what-right">
            {FEATURES.map((f, i) => (
              <div key={i} className={p.featureBox}>
                <div className={p.featureIcon}>{f.icon}</div>
                <div>
                  <h4 className={p.featureTitle}>{f.title}</h4>
                  <p className={p.featureText}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM INTEGRATION ────────────────────── */}
      <section className={p.platformSection}>
        <div className={p.platformInner}>
          <span className={p.sectionEyebrow} style={{ color: '#C9A96E' }}>Brand & Operational Surfaces</span>
          <h2 className={p.sectionH2Dark}>Platform Integration</h2>
          <p className={p.platformDesc}>The Aaryaveera identity lives across every operational surface of Shakti Sabha's ecosystem.</p>
        </div>
        <div className={p.platformScroll} ref={platformRef}>
          {PLATFORM_CARDS.map((c, i) => (
            <div key={i} className={p.platformCard}>
              <span className={p.platformNum}>0{i + 1}</span>
              <h4 className={p.platformCardTitle}>{c.label}</h4>
              <p className={p.platformCardDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THREE PILLARS ───────────────────────────── */}
      <section className={p.pillarsSection} ref={pillarsRef}>
        <div className={p.pillarsInner}>
          <span className={p.sectionEyebrow}>The Architecture</span>
          <h2 className={p.sectionH2Dark}>The Three Pillars</h2>
          <div className={p.pillarsGrid}>
            {PILLARS.map((pl) => (
              <div key={pl.name} className={p.pillarCard} style={{ '--pillar-accent': pl.accent, '--pillar-bg': pl.accentBg } as React.CSSProperties}>
                <div className={p.pillarTop}>
                  <span className={p.pillarIcon}>{pl.icon}</span>
                  <span className={p.pillarTag} style={{ color: pl.accent, background: pl.accentBg, border: `1px solid ${pl.accent}44` }}>{pl.tag}</span>
                </div>
                <h3 className={p.pillarName}>{pl.name}</h3>
                <span className={p.pillarDev}>{pl.dev}</span>
                <p className={p.pillarDesc}>{pl.desc}</p>
                <ul className={p.pillarList}>
                  {pl.items.map((item, idx) => (
                    <li key={idx} className={p.pillarItem}>
                      <span className={p.pillarBullet} style={{ background: pl.accent }} />
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
          <span className={p.sectionEyebrow} style={{ color: '#C9A96E' }}>Deliverables</span>
          <h2 className={p.sectionH2Dark}>Brand Assets & Deliverables</h2>
          <p className={p.assetsDesc}>Every touchpoint of the Aaryaveera experience is rigorously crafted, consistent, and mission-ready.</p>
          <div className={p.assetsList}>
            {BRAND_ASSETS.map((a, i) => (
              <div key={i} className={p.assetRow}>
                <span className={p.assetCheck}>✓</span>
                <div>
                  <span className={p.assetItem}>{a.item}</span>
                  <span className={p.assetSpec}>{a.spec}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────── */}
      <div className={p.ctaStrip} ref={ctaRef}>
        <div className={p.ctaInner}>
          <div>
            <h3 className={p.ctaTitle}>Begin the Warrior Journey</h3>
            <p className={p.ctaSub}>Join thousands of young women who have claimed their physical and cognitive sovereignty.</p>
          </div>
          <div className={p.ctaBtns}>
            <Link to="/courses" className={s.goldBtn}>Enroll in Aaryaveera Course</Link>
            <Link to="/events" className={s.goldOutlineBtn}>Attend Mission Mardini Camp</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
