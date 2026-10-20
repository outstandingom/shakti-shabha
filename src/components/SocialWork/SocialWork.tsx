import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './SocialWork.module.css'

const DOTS = [
  { top:'28%', left:'38%', delay:'0s' }, { top:'41%', left:'55%', delay:'0.4s' },
  { top:'55%', left:'34%', delay:'0.8s' }, { top:'35%', left:'68%', delay:'1.2s' },
  { top:'62%', left:'58%', delay:'0.6s' }, { top:'22%', left:'50%', delay:'1s' },
  { top:'70%', left:'44%', delay:'1.4s' }, { top:'48%', left:'26%', delay:'0.2s' },
]

const STATS = [
  { count: 12,   suffix: '',  label: 'Years of Unbroken Impact' },
  { count: 400,  suffix: '+', label: 'Schools Reached' },
  { count: 50,   suffix: '+', label: 'Villages Covered' },
  { count: 1000, suffix: '+', label: 'Camps Conducted' },
]

export default function SocialWork() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal
      gsap.from('[data-sw="text"]', {
        opacity: 0, y: 28, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 72%' }
      })
      gsap.from('[data-sw="map"]', {
        opacity: 0, scale: 0.96, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 72%' }
      })

      // Counter animation
      STATS.forEach((st, i) => {
        const el = document.querySelector(`[data-count="${i}"]`)
        if (!el) return
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter: () => {
            gsap.fromTo(el,
              { textContent: 0 },
              { textContent: st.count, duration: 2.2, ease: 'power2.out', snap: { textContent: 1 },
                onUpdate() { (el as HTMLElement).textContent = Math.round(Number((el as HTMLElement).textContent)) + st.suffix }
              }
            )
          }
        })
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        <div data-sw="text" className={s.left}>
          <h2>Where Shakti Sabha Has Stood</h2>
          <span className={s.dev}>जहाँ हम खड़े हैं</span>
          <p className={s.desc}>Twelve years of going where others didn't. 400+ schools, dozens of villages, self-defense camps and healing workshops — across Maharashtra and growing. Every dot on the map is a promise kept.</p>
          <div className={s.stats}>
            {STATS.map((st, i) => (
              <div key={i} className={s.stat}>
                <div className={s.statNum} data-count={i}>{st.count}{st.suffix}</div>
                <div className={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link to="/social-work" className="btn-magnetic btn-gold">Full Impact Archive</Link>
            <Link to="/events"      className="btn-magnetic btn-ghost">Upcoming Camps</Link>
          </div>
        </div>
        <div data-sw="map" className={s.right}>
          <div className={s.mapBox}>
            <div className={s.mapGrid} />
            {DOTS.map((d, i) => (
              <span key={i} className={s.mapDot} style={{ top: d.top, left: d.left, animationDelay: d.delay }} />
            ))}
          </div>
          <p className={s.mapLabel}>Interactive impact map — filterable by year, state, programme type</p>
        </div>
      </div>
    </section>
  )
}
