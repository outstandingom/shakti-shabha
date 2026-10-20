import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Sahyog.module.css'

const COLS = [
  { icon: '🏢', tag: 'For Agencies & Corporates', title: 'CSR & Sponsorship', items: ['Post CSR projects', 'Sponsor village camps', 'Employee volunteering days', 'Receive impact reports'] },
  { icon: '🌱', tag: 'For NGOs & Partners',       title: 'Partner Network',   items: ['Partner listing & visibility', 'Resource and knowledge sharing', 'Joint events & workshops', 'Grant collaboration'] },
  { icon: '🎓', tag: 'For Students & Academics',  title: 'Internships',       items: ['Social work internships', 'Earn volunteer credits', 'Submit field projects', 'Mentorship from the field'] },
]

export default function Sahyog() {
  const secRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: secRef.current, start: 'top 72%' } })
      tl.from('[data-sy="header"]', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
        .from('[data-sy="card"]',   { opacity: 0, y: 28, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div data-sy="header" className={s.header}>
        <h2>Sahyog</h2>
        <span className={s.headerDev}>सहयोग · Collaboration Ecosystem</span>
        <p className={s.desc}>A dedicated channel for agencies, NGOs, and students to collaborate with Shakti Sabha — through CSR, partnerships, internships, and shared social work. Build together what none can build alone.</p>
      </div>
      <div className={s.grid}>
        {COLS.map(c => (
          <div key={c.title} data-sy="card" className={s.card}>
            <div className={s.cardIcon}>{c.icon}</div>
            <div className={s.cardTag}>{c.tag}</div>
            <div className={s.cardTitle}>{c.title}</div>
            <div className={s.cardList}>
              {c.items.map(item => <div key={item} className={s.cardItem}>{item}</div>)}
            </div>
          </div>
        ))}
      </div>
      <Link to="/sahyog" className="btn-magnetic btn-gold">Explore Sahyog Partnerships →</Link>
    </section>
  )
}
