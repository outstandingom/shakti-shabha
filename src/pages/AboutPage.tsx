import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    icon: '⚔',
    name: 'MARDINI',
    dev: 'मर्दिनी',
    sub: 'Revolution & Self-Defense',
    accent: '#DC143C',
    accentBg: 'rgba(220,20,60,0.06)',
    border: 'rgba(220,20,60,0.22)',
    desc: 'The fire of Shakti Sabha\'s revolution. Mardini conducts on-ground self-defense camps, lathi-kaushal workshops, and sword training across rural Maharashtra and beyond. Over 12 years, the revolution has reached 400+ schools, 50,000+ women, and dozens of village communities — transforming vulnerability into sovereignty.',
    reach: ['400+ schools across Maharashtra', '50,000+ women trained', 'Quarterly warrior camps in 20+ districts'],
  },
  {
    icon: '🌸',
    name: 'SHAKTI BHAVA',
    dev: 'शक्ति भव',
    sub: 'Healing Space & Survivor Support',
    accent: '#3D5A45',
    accentBg: 'rgba(61,90,69,0.06)',
    border: 'rgba(61,90,69,0.22)',
    desc: 'The sacred space of healing. Shakti Bhava holds the pain of survivors without flinching — offering confidential counseling, trauma recovery, and peer support circles. It breaks silence on trafficking, PTSD, puberty, and depression, creating a community where pain becomes power and secrecy becomes solidarity.',
    reach: ['Confidential survivor counseling sessions', 'Anonymous case study documentation', 'Holistic trauma recovery programs'],
  },
  {
    icon: '📚',
    name: 'SHAKTI VARTA',
    dev: 'शक्ति वार्ता',
    sub: 'Intellectual Discourse & Research',
    accent: '#C9A96E',
    accentBg: 'rgba(201,169,110,0.06)',
    border: 'rgba(201,169,110,0.3)',
    desc: 'The intellectual backbone of the movement. Shakti Varta produces white papers, hosts the Aaryaveera Dialogues podcast, and convenes seminars examining Dharma, Paurush, and the civilizational role of women. Academic alliances and verified historical research back every claim with evidence and depth.',
    reach: ['Aaryaveera Dialogues podcast series', 'Policy white papers on women\'s security', 'Historical narratives of women warriors'],
  },
]

const TIMELINE = [
  { year: '2012', title: 'Shakti Sabha Founded', desc: 'Born in Pune, Maharashtra — with a vision to unite the strength of women across India.' },
  { year: '2014', title: 'First Warrior Camp', desc: 'The inaugural self-defense camp reached 200 women across rural Pune district.' },
  { year: '2016', title: '100 Schools Reached', desc: 'Mardini expanded to 100 schools — bringing self-defense and character education to young girls.' },
  { year: '2018', title: 'Shakti Bhava Launched', desc: 'Survivor support and counseling programs formalized — breaking the silence on gender-based trauma.' },
  { year: '2022', title: 'Aaryaveera Launched', desc: 'The flagship warrior brand — Aaryaveera — born as a unified identity for the whole movement.' },
  { year: '2024', title: '400+ Schools & National Stage', desc: 'From village camps to national recognition — Shakti Sabha stands at the heart of India\'s women\'s movement.' },
]

const VALUES = [
  { icon: '🪷', name: 'Dignity', dev: 'सम्मान', desc: 'Every woman is sacred. Dignity is not earned — it is the birthright of every daughter of this land.' },
  { icon: '🔥', name: 'Courage', dev: 'साहस', desc: 'Physical, moral, and spiritual courage — the trinity that separates the awakened from the fearful.' },
  { icon: '🌿', name: 'Truth', dev: 'सत्य', desc: 'Shakti Sabha speaks plainly — about trauma, about society, about what needs to change.' },
  { icon: '⚖', name: 'Dharma', dev: 'धर्म', desc: 'Rooted in civilizational wisdom, not ideology. Justice through duty, not anger.' },
]

const TEAM = [
  { name: 'Founder & Director', title: 'Shakti Sabha Leadership', initials: 'SS' },
  { name: 'Head of Mardini', title: 'Training & Field Operations', initials: 'MD' },
  { name: 'Head of Shakti Bhava', title: 'Counseling & Survivor Support', initials: 'SB' },
  { name: 'Head of Shakti Varta', title: 'Research & Publications', initials: 'SV' },
]

export default function AboutPage() {
  const pillarsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      // Pillars
      gsap.from(`.${p.pillarCard}`, {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
      })

      // Quote
      gsap.from(`.${p.quoteSection}`, {
        opacity: 0, scale: 0.97, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: `.${p.quoteSection}`, start: 'top 85%' },
      })

      // Timeline items
      gsap.from(`.${p.timelineItem}`, {
        opacity: 0, x: -30, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 78%' },
      })

      // Values
      gsap.from(`.${p.valueCard}`, {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' },
      })

      // Team
      gsap.from(`.${p.teamCard}`, {
        opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 82%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className={p.page}>
      {/* ── HERO BANNER ─────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <Link to="/" className={s.back}>← Back to Home</Link>
          <span className={p.eyebrow}>12 Years of On-Ground Impact</span>
          <h1 className={p.heroTitle}>Union of Peace &amp; Revolution</h1>
          <p className={p.heroHindi}>शांति और क्रांति का संगम</p>
          <p className={p.heroDesc}>
            12 years of on-ground impact — from the villages of Maharashtra to the national stage. Shakti Sabha is where the fearless become free.
          </p>
        </div>
      </div>

      {/* ── THREE PILLARS ───────────────────────────── */}
      <section className={p.pillarsSection} ref={pillarsRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Our Foundation</span>
          <h2 className={p.sectionTitle}>The Three Pillars</h2>
          <div className={p.pillarsGrid}>
            {PILLARS.map((pl) => (
              <div key={pl.name} className={p.pillarCard} style={{ '--pl-accent': pl.accent, '--pl-bg': pl.accentBg, '--pl-border': pl.border } as React.CSSProperties}>
                <div className={p.pillarAccentBar} style={{ background: pl.accent }} />
                <div className={p.pillarHead}>
                  <span className={p.pillarIcon}>{pl.icon}</span>
                  <span className={p.pillarBadge} style={{ color: pl.accent, background: pl.accentBg, border: `1px solid ${pl.border}` }}>
                    {pl.sub}
                  </span>
                </div>
                <h3 className={p.pillarName}>{pl.name}</h3>
                <span className={p.pillarDev}>{pl.dev}</span>
                <p className={p.pillarDesc}>{pl.desc}</p>
                <ul className={p.pillarList}>
                  {pl.reach.map((r, i) => (
                    <li key={i} className={p.pillarItem}>
                      <span className={p.pillarDot} style={{ background: pl.accent }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION QUOTE ───────────────────────────── */}
      <div className={p.quoteSection}>
        <div className={p.quoteInner}>
          <span className={p.quoteDecor}>"</span>
          <blockquote className={p.quoteText}>
            We don't just train bodies. We awaken souls.
          </blockquote>
          <p className={p.quoteAttrib}>— Shakti Sabha, 12 Years</p>
        </div>
      </div>

      {/* ── TIMELINE ────────────────────────────────── */}
      <section className={p.timelineSection} ref={timelineRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Our Journey</span>
          <h2 className={p.sectionTitle}>12 Years of Impact</h2>
          <div className={p.timeline}>
            {TIMELINE.map((t, i) => (
              <div key={i} className={p.timelineItem}>
                <div className={p.timelineLeft}>
                  <span className={p.timelineYear}>{t.year}</span>
                </div>
                <div className={p.timelineConnector}>
                  <div className={p.timelineDot} />
                  {i < TIMELINE.length - 1 && <div className={p.timelineLine} />}
                </div>
                <div className={p.timelineRight}>
                  <h4 className={p.timelineTitle}>{t.title}</h4>
                  <p className={p.timelineDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES GRID ─────────────────────────────── */}
      <section className={p.valuesSection} ref={valuesRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>What We Stand For</span>
          <h2 className={p.sectionTitle}>Our Values</h2>
          <div className={p.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.name} className={p.valueCard}>
                <span className={p.valueIcon}>{v.icon}</span>
                <h3 className={p.valueName}>{v.name}</h3>
                <span className={p.valueDev}>{v.dev}</span>
                <p className={p.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────── */}
      <section className={p.teamSection} ref={teamRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>The People</span>
          <h2 className={p.sectionTitle}>Leadership Team</h2>
          <div className={p.teamGrid}>
            {TEAM.map((t) => (
              <div key={t.name} className={p.teamCard}>
                <div className={p.teamAvatar}>{t.initials}</div>
                <h4 className={p.teamName}>{t.name}</h4>
                <p className={p.teamTitle}>{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className={p.ctaSection}>
        <div className={p.ctaInner}>
          <h3 className={p.ctaTitle}>Join the Movement</h3>
          <p className={p.ctaDesc}>Whether you volunteer, donate, or train — your role in this story matters.</p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Join as Volunteer →</Link>
            <Link to="/sahyog" className={p.ctaOutline}>Donate to Shakti Sabha</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
