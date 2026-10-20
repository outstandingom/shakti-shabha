import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './HistoryGirls.module.css'

const HISTORICAL = [
  { icon:'👑', name:'Rani Lakshmibai', meta:'Warrior Queen · 1857' },
  { icon:'⚔️', name:'Kittur Chennamma', meta:'Freedom Fighter · 1824' },
  { icon:'🔬', name:'Anandibai Joshi', meta:"India's First Woman Doctor" },
  { icon:'📜', name:'Vijaya Lakshmi Pandit', meta:'Diplomat · UN President' },
]

const SUCCESS = [
  { icon:'🚀', name:'Ritu, IAS 2023', meta:'Shakti Sabha Camp Alumna' },
  { icon:'🏅', name:'Meera, National Athlete', meta:'Lathi-Kaushal Programme' },
  { icon:'💻', name:'Anjali, Tech Lead', meta:'Aaryaveera Graduate' },
  { icon:'🎨', name:'Kavya, Working Artist', meta:'Mardini Camp, 2019' },
]

const TIMELINE = [
  { year:'2012', text:'First self-defense camp, Wardha. 12 girls. One mat. One instructor.' },
  { year:'2015', text:'Expanded to 50 schools across Vidarbha. Media archive begins.' },
  { year:'2018', text:'Shakti Varta launches — podcast, white papers, legal collage.' },
  { year:'2022', text:'Aaryaveera brand established. First Warrior Certification class.' },
  { year:'2026', text:'400+ schools. Platform launch. Digital chapter begins.' },
]

export default function HistoryGirls() {
  const secRef      = useRef<HTMLElement>(null)
  const tlRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hg="panel"]', {
        opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 72%' }
      })
      gsap.from('[data-hg="card"]', {
        opacity: 0, scale: 0.94, stagger: 0.06, duration: 0.5, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '[data-hg="panel"]', start: 'top 80%' }
      })
      // Timeline draw
      if (tlRef.current) {
        gsap.fromTo(tlRef.current,
          { '--line-height': '0%' },
          { '--line-height': '100%', duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: tlRef.current, start: 'top 80%' }
          }
        )
      }
      gsap.from('[data-hg="tl"]', {
        opacity: 0, x: -16, stagger: 0.12, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: tlRef.current, start: 'top 80%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.header}>
        <h2>History &amp; Today's Success Girls</h2>
        <p>The women who came before us made this possible. The women we walk with today are making it inevitable. Two timelines, one Shakti.</p>
      </div>
      <div className={s.dual}>
        <div data-hg="panel" className={s.panel}>
          <span className={s.panelBar} style={{ background:'linear-gradient(to right, var(--fire), var(--gold))' }} />
          <span className={s.panelLabel} style={{ color:'var(--gold-deep)' }}>Historical Women Warriors</span>
          <div className={s.panelTitle}>They Led the Way</div>
          <div className={s.cards}>
            {HISTORICAL.map(h => (
              <div key={h.name} data-hg="card" className={s.figCard}>
                <div className={s.figIcon}>{h.icon}</div>
                <div className={s.figName}>{h.name}</div>
                <div className={s.figMeta}>{h.meta}</div>
              </div>
            ))}
          </div>
          <p className={s.note}>Click any figure on the full page for their complete story, footnoted sources, and verified archives.</p>
        </div>
        <div data-hg="panel" className={s.panel}>
          <span className={s.panelBar} style={{ background:'linear-gradient(to right, var(--sage), var(--mist))' }} />
          <span className={s.panelLabel} style={{ color:'var(--sage)' }}>Today's Success Girls</span>
          <div className={s.panelTitle}>They Are Writing It Now</div>
          <div className={s.cards}>
            {SUCCESS.map(g => (
              <div key={g.name} data-hg="card" className={s.figCard}>
                <div className={s.figIcon}>{g.icon}</div>
                <div className={s.figName}>{g.name}</div>
                <div className={s.figMeta}>{g.meta}</div>
              </div>
            ))}
          </div>
          <p className={s.note}>Video testimonials and before/after journeys available on the full History page.</p>
        </div>
      </div>
      <div ref={tlRef} className={s.timeline}>
        {TIMELINE.map(t => (
          <div key={t.year} data-hg="tl" className={s.tlItem}>
            <span className={s.tlDot} />
            <div className={s.tlYear}>{t.year}</div>
            <div className={s.tlText}>{t.text}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:'2.5rem' }}>
        <Link to="/history" className="btn-magnetic btn-gold">Full History &amp; Success Stories →</Link>
      </div>
    </section>
  )
}
