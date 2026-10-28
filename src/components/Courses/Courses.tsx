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


const getInitialCourses = () => {
  try {
    const local = typeof window !== 'undefined' ? localStorage.getItem('shakti_custom_courses') : null
    if (local) {
      const parsed = JSON.parse(local)
      const published = parsed.filter((c: any) => c.published).map((c: any) => ({
        badge: c.instructor ? `Instructor · ${c.instructor}` : 'Academy',
        title: c.title,
        detail: c.description || 'Comprehensive training curriculum.',
        modules: c.syllabus?.length ? `${c.syllabus.length} Modules` : 'Self-Paced',
        duration: c.duration || 'Flexible',
        level: c.level || 'All Levels',
        featured: false
      }))
      if (published.length > 0) return [...published, ...COURSES]
    }
  } catch (e) {
    // fallback
  }
  return COURSES
}

export default function Courses() {
  const [coursesList] = useState(getInitialCourses)
  const secRef  = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  // GSAP maps horizontal px 1:1 to vertical scroll px (end = `+=${totalScroll}`),
  // so scrolling one card-width vertically moves one card-width horizontally.
  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const cardW = (track.querySelector('[data-c="card"]') as HTMLElement | null)
      ?.offsetWidth ?? 300
    window.scrollBy({ top: dir * cardW, behavior: 'smooth' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const section = secRef.current
      if (!track || !section) return

      // ── Horizontal scroll — ALL breakpoints (no matchMedia gate) ──────────
      const totalScroll = track.scrollWidth - section.offsetWidth

      if (totalScroll > 0) {
        gsap.to(track, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
      }

      // ── Cards entrance ─────────────────────────────────────────────────────
      gsap.from('[data-c="card"]', {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
    }, secRef)

    return () => ctx.revert()
  }, [])

  const canScrollLeft  = progress > 0.02
  const canScrollRight = progress < 0.98

  return (
    <section ref={secRef} className={s.section} data-courses-section>
      <div className={s.header}>
        <div className={s.headerLeft}>
          <span className={s.eyebrow}>Programmes &amp; Learning</span>
          <h2 className={s.title}>Courses</h2>
        </div>

        <div className={s.headerRight}>
          <div className={s.navArrows}>
            <button
              type="button"
              className={`${s.arrowBtn} ${!canScrollLeft ? s.arrowDisabled : ''}`}
              onClick={() => scrollByCards(-1)}
              aria-label="Previous courses"
              disabled={!canScrollLeft}
            >←</button>
            <button
              type="button"
              className={`${s.arrowBtn} ${!canScrollRight ? s.arrowDisabled : ''}`}
              onClick={() => scrollByCards(1)}
              aria-label="Next courses"
              disabled={!canScrollRight}
            >→</button>
          </div>
          <Link to="/courses" className="btn-magnetic btn-ghost">All Courses →</Link>
        </div>
      </div>

      {/* GSAP translates this element — no native overflow scroll */}
      <div ref={trackRef} className={s.track}>
        {coursesList.map(c => (
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
