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

const TESTIMONIALS = [
  {
    quote: '"Pehli baar kisi platform ne mujhe sirf ek problem nahi, ek warrior feel karaaya. Gargi ki story padhke laga — main bhi kuch soch sakti hoon."',
    name: 'Priya S.',
    location: 'Mumbai, Maharashtra',
    tag: 'Community Member'
  },
  {
    quote: '"Depression article ne woh baat boli jo main 2 saal se kisi ko nahi bol paayi thi. Laga kisi ne actually samjha aur mujhe ek safe space diya."',
    name: 'Ananya R.',
    location: 'Delhi',
    tag: 'Counseling & Mental Health'
  },
  {
    quote: '"Community mein aane ke baad realize hua main akeli nahi hoon. Itni strong women hain — aur sab ek doosre ki unconditionally help karti hain."',
    name: 'Kavitha M.',
    location: 'Bangalore, Karnataka',
    tag: 'Sahyog Volunteer'
  },
]

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.querySelectorAll(`.${p.pillarCard}`), {
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
        })
      }

      if (timelineRef.current) {
        gsap.from(timelineRef.current.querySelectorAll(`.${p.timelineItem}`), {
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' },
          opacity: 0,
          x: -30,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      if (valuesRef.current) {
        gsap.from(valuesRef.current.querySelectorAll(`.${p.valueCard}`), {
          scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' },
          opacity: 0,
          scale: 0.95,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={s.page} ref={pageRef}>
      {/* ── HERO BANNER ────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <Link to="/" className={p.backLink}>← Back to Home</Link>
          <span className={p.heroEyebrow}>Union of Peace & Revolution</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>शांति और क्रांति का संगम · The Soul of the Movement</p>
          <p className={p.heroDesc}>
            12 years of on-ground impact — from the villages of Maharashtra to the national stage.
            Shakti Sabha is where the fearless become free. Ancient roots. Modern strength.
          </p>
        </div>
      </div>

      {/* ── BOLD MISSION STATEMENT ───────────────────── */}
      <div className={p.quoteSection} style={{ background: '#0F0E11', color: '#FFFFFF', padding: 'clamp(3rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div className={p.quoteInner} style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC143C', display: 'block', marginBottom: '1rem' }}>
            Mission Statement · Brand Ka Dil
          </span>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)', lineHeight: 1.6, color: '#E8C98A', fontStyle: 'italic', marginBottom: '1.25rem' }}>
            "Sadiyaan beet gayi, Indian woman ki asli kahani dobara sunne ki. Woh sirf ghar nahi sambhalti thi — woh yuddh jeetti thi, darshan padhati thi, rajya chalati thi. Shakti Sabha usi sach ko wapas laane ke liye hai."
          </blockquote>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            — Shakti Sabha Mission & Conviction
          </p>
        </div>
      </div>

      {/* ── DO WINGS: SHAKTI + SABHA (PLATFORM KA DNA) ── */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3rem)', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Platform Ka DNA
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#111827', marginTop: '0.4rem' }}>
              Shakti Sabha — Do Wings, Ek Mission
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Website ke do pillars: Left = SHAKTI (knowledge, history, itihaas). Right = SABHA (support, community, counselling).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '2.5rem' }}>
            {/* Wing 1: Shakti */}
            <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(220, 20, 60, 0.25)', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#DC143C' }} />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚔️</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#DC143C', textTransform: 'uppercase' }}>Wing 1</div>
              <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', margin: '0.25rem 0 0.5rem' }}>
                SHAKTI
              </h3>
              <p style={{ fontStyle: 'italic', color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                "Jaano apni asli taakat kahan se aayi"
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#334155' }}>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#DC143C' }}>●</span> Ancient India mein women ka actual role
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#DC143C' }}>●</span> Forgotten heroines — Gargi, Abbakka, Durgavati
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#DC143C' }}>●</span> Modern women empowerment movements
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#DC143C' }}>●</span> Identity — "Indian woman" hona aaj kya matlab rakhta hai
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#DC143C' }}>●</span> Civilizational history — jo textbooks ne nahi bataya
                </li>
              </ul>
            </div>

            {/* Wing 2: Sabha */}
            <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(61, 90, 69, 0.3)', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#3D5A45' }} />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤝</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#3D5A45', textTransform: 'uppercase' }}>Wing 2</div>
              <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', margin: '0.25rem 0 0.5rem' }}>
                SABHA
              </h3>
              <p style={{ fontStyle: 'italic', color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                "Yahan bol sakti ho, yahan suna jaayega"
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#334155' }}>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#3D5A45' }}>●</span> Mental health + psychological support
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#3D5A45' }}>●</span> Professional counselling resources
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#3D5A45' }}>●</span> Career, relationships, self-worth guidance
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#3D5A45' }}>●</span> Community — judgment-free safe space
                </li>
                <li style={{ display: 'flex', gap: '0.65rem' }}>
                  <span style={{ color: '#3D5A45' }}>●</span> Workshops & Webinars — live interactive sessions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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

      {/* ── TESTIMONIALS SECTION ─────────────────────── */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3rem)', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Real Kahaniyaan
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#111827', marginTop: '0.4rem' }}>
              Shakti Sabha ne Badla Kya
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '550px', margin: '0.5rem auto 0' }}>
              Real voices of women whose courage, self-worth, and purpose were reignited through our community and counseling.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem' }}>
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontStyle: 'italic', color: '#334155', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {t.quote}
                </p>
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.location} · <span style={{ color: '#DC143C' }}>{t.tag}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <div className={p.ctaSection}>
        <div className={p.ctaInner}>
          <h3 className={p.ctaTitle}>Join the Movement</h3>
          <p className={p.ctaDesc}>Whether you volunteer, enroll in a camp, or train — your role in this revolution matters.</p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Sabha Join Karein →</Link>
            <Link to="/events" className={p.ctaOutline}>Attend Next Camp</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
