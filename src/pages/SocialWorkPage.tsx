import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import sw from './SocialWorkPage.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/* Data                                                                  */
/* ------------------------------------------------------------------ */

const STATS: { count: string; num: number; suffix: string; label: string }[] = [
  { count: '12+', num: 12, suffix: '+', label: 'Years of Impact' },
  { count: '50,000+', num: 50000, suffix: '+', label: 'Women Reached' },
  { count: '200+', num: 200, suffix: '+', label: 'Villages Served' },
  { count: '3', num: 3, suffix: '', label: 'Active Programmes' },
]

const REGIONS = [
  { icon: '🏕', name: 'Nagpur Division', stat: '45 camps' },
  { icon: '🌾', name: 'Amravati Division', stat: '38 camps' },
  { icon: '🏛', name: 'Aurangabad Division', stat: '29 camps' },
  { icon: '🌆', name: 'Pune Region', stat: '22 camps' },
  { icon: '🌊', name: 'Mumbai Region', stat: '18 camps' },
  { icon: '🌿', name: 'Vidarbha Rural', stat: '54 camps' },
]

const PILLARS = [
  {
    id: 'mardini',
    icon: '⚔',
    title: 'Mission MARDINI',
    subtitle: 'Physical Warriors',
    desc: 'Self-defense, Lathi-Kaushal, Sword Training — building physical warriors ready to defend themselves and their communities.',
    accent: '#DC143C',
    bg: 'rgba(220,20,60,0.06)',
    border: 'rgba(220,20,60,0.25)',
  },
  {
    id: 'bhava',
    icon: '🌸',
    title: 'Shakti Bhava',
    subtitle: 'Healing Circles',
    desc: 'Survivor support circles, anonymous counseling, taboo-breaking conversations — safe spaces where healing begins.',
    accent: '#3D5A45',
    bg: 'rgba(61,90,69,0.06)',
    border: 'rgba(61,90,69,0.25)',
  },
  {
    id: 'varta',
    icon: '📖',
    title: 'Shakti Varta',
    subtitle: 'Intellectual Pillar',
    desc: 'Seminars, podcasts, research papers — the intellectual pillar of the movement, spreading knowledge and awareness.',
    accent: '#C9A96E',
    bg: 'rgba(201,169,110,0.06)',
    border: 'rgba(201,169,110,0.3)',
  },
]

const MEDIA = [
  { seed: 'camp1', tag: 'LATHI-KAUSHAL', caption: 'Village Lathi-Kaushal training session, Nagpur' },
  { seed: 'camp2', tag: 'SWORD TRAINING', caption: 'Traditional sword training revival, Wardha' },
  { seed: 'camp3', tag: 'SELF-DEFENSE', caption: 'Self-defense workshop for college girls, Amravati' },
  { seed: 'camp4', tag: 'SEMINAR', caption: 'Shakti Varta academic seminar, Pune University' },
  { seed: 'camp5', tag: 'SURVIVOR CIRCLE', caption: 'Shakti Bhava healing circle session, Yavatmal' },
  { seed: 'camp6', tag: 'CAMP', caption: 'Aaryaveera residential camp, Nagpur 2024' },
]

const REPORTS = [
  { title: 'Vidarbha Camp Report 2024', pages: 28, year: '2024', size: '2.4 MB' },
  { title: 'Maharashtra Schools Programme 2023', pages: 45, year: '2023', size: '3.8 MB' },
  { title: 'Survivor Support Circle Annual Report 2022', pages: 32, year: '2022', size: '1.9 MB' },
]

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function SocialWorkPage() {
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const regionRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const reportsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Animated stat counters */
      statRefs.current.forEach((el, i) => {
        if (!el) return
        const numEl = el.querySelector('[data-count]') as HTMLElement | null
        if (!numEl) return
        const target = STATS[i].num
        const suffix = STATS[i].suffix
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const obj = { val: 0 }
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                numEl.textContent = Math.round(obj.val).toLocaleString() + suffix
              },
            })
          },
        })
      })

      /* Region cards stagger */
      if (regionRef.current) {
        gsap.from(regionRef.current.querySelectorAll('[data-region]'), {
          scrollTrigger: { trigger: regionRef.current, start: 'top 80%' },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      /* Pillar cards */
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.querySelectorAll('[data-pillar]'), {
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
          opacity: 0,
          x: -30,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
        })
      }

      /* Media grid */
      if (mediaRef.current) {
        gsap.from(mediaRef.current.querySelectorAll('[data-media]'), {
          scrollTrigger: { trigger: mediaRef.current, start: 'top 80%' },
          opacity: 0,
          scale: 0.92,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.2)',
        })
      }

      /* Reports */
      if (reportsRef.current) {
        gsap.from(reportsRef.current.querySelectorAll('[data-report]'), {
          scrollTrigger: { trigger: reportsRef.current, start: 'top 82%' },
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.55,
          ease: 'power2.out',
        })
      }

      /* CTA banner */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className={s.page}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div
        className={s.banner}
        style={{ background: 'linear-gradient(145deg, #7A0A20 0%, #A80E2D 30%, #DC143C 65%, #B01030 100%)' }}
      >
        <div className={s.bannerInner}>
          <Link to="/" className={s.back}>← Back to Home</Link>
          <span className={s.bannerEyebrow}>12 Years · On the Ground · 6 Divisions</span>
          <h1 className={s.bannerTitle}>Social Work Archive</h1>
          <p className={s.bannerHindi}>सामाजिक कार्य — बारह वर्षों की अटूट उपस्थिति</p>
          <p className={s.bannerDesc}>
            Twelve years of going where others didn't. Every case study, every camp, every circle
            of healing — documented here for the world to witness.
          </p>
        </div>
      </div>

      {/* ── Animated Stats ──────────────────────────────────────── */}
      <div className={s.statsGrid}>
        {STATS.map((st, i) => (
          <div
            key={i}
            className={s.statBox}
            ref={el => { statRefs.current[i] = el }}
          >
            <div className={s.statCount} data-count>{st.count}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Geographic Reach ────────────────────────────────────── */}
      <section className={sw.reachSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Our Geographic Reach</h2>
          <p className={sw.sectionSubtitle}>
            From the villages of Vidarbha to schools across Maharashtra —&nbsp;
            <strong>12 years of uninterrupted on-ground presence</strong>
          </p>
          <div className={sw.regionGrid} ref={regionRef}>
            {REGIONS.map((r) => (
              <div key={r.name} className={sw.regionCard} data-region>
                <div className={sw.regionIcon}>{r.icon}</div>
                <div className={sw.regionName}>{r.name}</div>
                <div className={sw.regionStat}>{r.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three Programme Pillars ─────────────────────────────── */}
      <section className={sw.pillarsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Three Programme Pillars</h2>
          <p className={sw.sectionSubtitle}>
            A triad of action — physical, emotional, and intellectual — for total empowerment.
          </p>
          <div className={sw.pillarsGrid} ref={pillarsRef}>
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className={sw.pillarCard}
                data-pillar
                style={{
                  background: p.bg,
                  borderColor: p.border,
                  '--pillar-accent': p.accent,
                } as React.CSSProperties}
              >
                <div className={sw.pillarIcon}>{p.icon}</div>
                <div className={sw.pillarAccentBar} style={{ background: p.accent }} />
                <h3 className={sw.pillarTitle} style={{ color: p.accent }}>{p.title}</h3>
                <div className={sw.pillarSubtitle}>{p.subtitle}</div>
                <p className={sw.pillarDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Vault ─────────────────────────────────────────── */}
      <section className={sw.mediaSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Media Vault</h2>
          <p className={sw.sectionSubtitle}>
            Filterable photos and videos from 12 years of camps — documenting the transformation.
          </p>
          <div className={sw.mediaGrid} ref={mediaRef}>
            {MEDIA.map((m) => (
              <div key={m.seed} className={sw.mediaCard} data-media>
                <div className={sw.mediaImgWrap}>
                  <img
                    src={`https://picsum.photos/seed/${m.seed}/400/280`}
                    alt={m.caption}
                    className={sw.mediaImg}
                    loading="lazy"
                  />
                  <span className={sw.mediaTag}>{m.tag}</span>
                </div>
                <p className={sw.mediaCaption}>{m.caption}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.25rem', background: '#DC143C', color: '#FFFFFF', borderRadius: '9999px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)' }}>
              Open Full 3D Interactive Media Vault &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Field Reports ───────────────────────────────────────── */}
      <section className={sw.reportsSection}>
        <div className={sw.sectionInner}>
          <h2 className={sw.sectionTitle}>Field Reports</h2>
          <p className={sw.sectionSubtitle}>
            Rigorously documented. Freely accessible. Our accountability to the communities we serve.
          </p>
          <div className={sw.reportsGrid} ref={reportsRef}>
            {REPORTS.map((r) => (
              <div key={r.title} className={sw.reportCard} data-report>
                <div className={sw.reportIconWrap}>
                  <span className={sw.reportPdfIcon}>📄</span>
                </div>
                <div className={sw.reportBody}>
                  <div className={sw.reportMeta}>
                    <span className={sw.reportYear}>{r.year}</span>
                    <span className={sw.reportPages}>{r.pages} pages</span>
                    <span className={sw.reportSize}>{r.size}</span>
                  </div>
                  <h3 className={sw.reportTitle}>{r.title}</h3>
                </div>
                <button className={sw.reportBtn} aria-label={`Download ${r.title}`}>
                  ↓ Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className={sw.ctaSection} ref={ctaRef}>
        <div className={sw.ctaInner}>
          <h2 className={sw.ctaTitle}>Support Our Mission</h2>
          <p className={sw.ctaDesc}>
            Every contribution — monetary or voluntary — directly funds camps, counseling circles, and
            research. Be part of the revolution.
          </p>
          <div className={sw.ctaBtns}>
            <Link to="/donate" className={sw.ctaDonateBtn}>Donate Now</Link>
            <Link to="/volunteer" className={sw.ctaVolunteerBtn}>Volunteer</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
