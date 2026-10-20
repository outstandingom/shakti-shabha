import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Courses.module.css'

const COURSES = [
  { badge:'Flagship · Aaryaveera', title:'Warrior Spirit Certification', detail:'The complete Aaryaveera journey — self-defense, leadership, cultural identity, and character. 12 modules, lifetime access.', modules:'12 Modules', duration:'8 Weeks', level:'All Levels', featured:true },
  { badge:'Parenting', title:'Vedic Parenting in Modern India', detail:'Raising resilient, rooted children in a fractured world. Drawing on Vedic wisdom, modern psychology, and lived experience.', modules:'8 Modules', duration:'6 Weeks', level:'Parents', featured:false },
  { badge:'Discourse · Shakti Varta', title:'Understanding Paurush — True Masculinity', detail:'An honest inquiry into masculinity, Dharma, and the role of men in protecting and building a just society.', modules:'6 Modules', duration:'4 Weeks', level:'Open', featured:false },
  { badge:'Self-Defense', title:'Lathi-Kaushal for Women', detail:"The ancient Indian art of Lathi — practical, powerful, rooted. Taught by Shakti Sabha's field instructors.", modules:'10 Modules', duration:'6 Weeks', level:'Beginners', featured:false },
  { badge:'Research', title:'The Legal Collage — Know Your Rights', detail:'Understanding IPC, BNS, and systemic loopholes. Fact-based, lawyer-reviewed, essential for every woman in India.', modules:'5 Modules', duration:'3 Weeks', level:'Open', featured:false },
]

export default function Courses() {
  const secRef  = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll
      const track = trackRef.current
      if (!track) return
      const totalScroll = track.scrollWidth - window.innerWidth + 96
      gsap.to(track, {
        x: -totalScroll, ease: 'none',
        scrollTrigger: {
          trigger: secRef.current, start: 'top top', end: () => `+=${totalScroll}`,
          pin: true, scrub: 1, anticipatePin: 1,
        }
      })
      gsap.from('[data-c="card"]', {
        opacity: 0, y: 20, stagger: 0.08, duration: 0.5,
        scrollTrigger: { trigger: secRef.current, start: 'top 80%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section} data-courses-section>
      <div className={s.header}>
        <h2>Courses</h2>
        <Link to="/courses" className="btn-magnetic btn-ghost">All Courses →</Link>
      </div>
      <div ref={trackRef} className={s.track}>
        {COURSES.map(c => (
          <div key={c.title} data-c="card" className={`${s.card} ${c.featured ? s.featured : ''}`}>
            <div className={s.cardBadge}>{c.badge}</div>
            <div className={s.cardTitle}>{c.title}</div>
            <p className={s.cardDetail}>{c.detail}</p>
            <div className={s.cardMeta}>
              <div className={s.cardMetaItem}><strong>{c.modules}</strong>Content</div>
              <div className={s.cardMetaItem}><strong>{c.duration}</strong>Duration</div>
              <div className={s.cardMetaItem}><strong>{c.level}</strong>Level</div>
            </div>
            <Link to="/courses" className={s.enroll}>Enroll Now →</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
