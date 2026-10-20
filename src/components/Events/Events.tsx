import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Events.module.css'

const EVENTS = [
  { day:'14', month:'Nov 2026', name:'Aaryaveera 3-Day Self-Defense Camp', meta:'Wardha, Maharashtra · Limited seats · ₹1,200', badge:'Camp' },
  { day:'22', month:'Nov 2026', name:'Shakti Varta Seminar — The Legal Collage', meta:'Online · IPC & BNS Analysis · Free for members', badge:'Webinar' },
  { day:'05', month:'Dec 2026', name:'Vedic Parenting in Modern India Workshop', meta:'Nagpur · Full-day session · ₹800', badge:'Workshop' },
  { day:'18', month:'Dec 2026', name:'Sponsor a Village Camp — CSR Drive', meta:'Multiple locations · Corporate & NGO collaboration', badge:'CSR' },
  { day:'08', month:'Jan 2027', name:'Aaryaveera 7-Day Leadership Retreat', meta:'Pune Outskirts · Residential · ₹4,500', badge:'Retreat' },
]

export default function Events() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-ev="item"]', {
        opacity: 0, y: 24, rotateX: 4, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.header}>
        <h2>Upcoming Events</h2>
        <Link to="/events" className="btn-magnetic btn-ghost">All Events →</Link>
      </div>
      <div className={s.list}>
        {EVENTS.map(ev => (
          <div key={ev.name} data-ev="item" className={s.item}>
            <div className={s.dateBlock}>
              <div className={s.day}>{ev.day}</div>
              <div className={s.month}>{ev.month}</div>
            </div>
            <div className={s.info}>
              <div className={s.name}>{ev.name}</div>
              <div className={s.meta}>{ev.meta}</div>
            </div>
            <span className={s.badge}>{ev.badge}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
