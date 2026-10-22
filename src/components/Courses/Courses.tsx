import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Courses.module.css'

gsap.registerPlugin(ScrollTrigger)

const COURSES = [
  { badge:'Flagship · Aaryaveera', title:'Warrior Spirit Certification', detail:'The complete Aaryaveera journey — self-defense, leadership, cultural identity, and character. 12 modules, lifetime access.', modules:'12 Modules', duration:'8 Weeks', level:'All Levels', featured:true },
  { badge:'Parenting', title:'Vedic Parenting in Modern India', detail:'Raising resilient, rooted children in a fractured world. Drawing on Vedic wisdom, modern psychology, and lived experience.', modules:'8 Modules', duration:'6 Weeks', level:'Parents', featured:false },
  { badge:'Discourse · Shakti Varta', title:'Understanding Paurush — True Masculinity', detail:'An honest inquiry into masculinity, Dharma, and the role of men in protecting and building a just society.', modules:'6 Modules', duration:'4 Weeks', level:'Open', featured:false },
  { badge:'Self-Defense', title:'Lathi-Kaushal for Women', detail:"The ancient Indian art of Lathi — practical, powerful, rooted. Taught by Shakti Sabha's field instructors.", modules:'10 Modules', duration:'6 Weeks', level:'Beginners', featured:false },
  { badge:'Research', title:'The Legal Collage — Know Your Rights', detail:'Understanding IPC, BNS, and systemic loopholes. Fact-based, lawyer-reviewed, essential for every woman in India.', modules:'5 Modules', duration:'3 Weeks', level:'Open', featured:false },
]

export default function Courses() {
  const secRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scrollBy = (offset: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: offset, behavior: 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (track) {
      track.addEventListener('scroll', checkScroll, { passive: true })
      checkScroll()
    }
    return () => track?.removeEventListener('scroll', checkScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop horizontal scroll pin (screens > 960px)
      const mm = gsap.matchMedia()

      mm.add('(min-width: 961px)', () => {
        const track = trackRef.current
        if (!track) return
        const totalScroll = track.scrollWidth - window.innerWidth + 96
        if (totalScroll > 0) {
          gsap.to(track, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
              trigger: secRef.current,
              start: 'top top',
              end: () => `+=${totalScroll}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          })
        }
      })

      // Cards appearance animation
      gsap.from('[data-c="card"]', {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 80%' }
      })
    }, secRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section} data-courses-section>
      <div className={s.header}>
        <div className={s.headerLeft}>
          <span className={s.eyebrow}>Programmes &amp; Learning</span>
          <h2 className={s.title}>Courses</h2>
        </div>

        <div className={s.headerRight}>
          {/* Scroll navigation arrows for touch & mobile */}
          <div className={s.navArrows}>
            <button
              type="button"
              className={`${s.arrowBtn} ${!canScrollLeft ? s.arrowDisabled : ''}`}
              onClick={() => scrollBy(-280)}
              aria-label="Previous courses"
              disabled={!canScrollLeft}
            >
              ←
            </button>
            <button
              type="button"
              className={`${s.arrowBtn} ${!canScrollRight ? s.arrowDisabled : ''}`}
              onClick={() => scrollBy(280)}
              aria-label="Next courses"
              disabled={!canScrollRight}
            >
              →
            </button>
          </div>

          <Link to="/courses" className="btn-magnetic btn-ghost">All Courses →</Link>
        </div>
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

      {/* Swipe indicator for mobile */}
      <div className={s.mobileHint}>
        <span>← Swipe to explore all courses ({COURSES.length}) →</span>
      </div>
    </section>
  )
}
