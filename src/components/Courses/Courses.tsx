import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Courses.module.css'
import Testimonials from '../Testimonials/Testimonials'

gsap.registerPlugin(ScrollTrigger)

const COURSES = [
  {
    badge: 'Kshatra-Dharma · Shakti Sabha',
    title: 'Warrior Spirit Certification',
    detail: 'Guided by the Aaryaveera philosophy — self-defense, leadership, cultural identity, and character. 12 modules, lifetime access.',
    modules: '12 Modules',
    duration: '8 Weeks',
    level: 'All Levels',
    price: '₹1,800',
    original_price: '₹2,500',
    discount_percent: 28,
    discount_tag: 'Save ₹700',
    featured: true
  },
  {
    badge: 'Parenting',
    title: 'Vedic Parenting in Modern India',
    detail: 'Raising resilient, rooted children in a fractured world. Drawing on Vedic wisdom, modern psychology, and lived experience.',
    modules: '8 Modules',
    duration: '6 Weeks',
    level: 'Parents',
    price: '₹1,500',
    original_price: '₹2,000',
    discount_percent: 25,
    discount_tag: 'Save ₹500',
    featured: false
  },
  {
    badge: 'Discourse · Shakti Varta',
    title: 'Understanding Paurush — True Masculinity',
    detail: 'An honest inquiry into masculinity, Dharma, and the role of men in protecting and building a just society.',
    modules: '6 Modules',
    duration: '4 Weeks',
    level: 'Open',
    price: '₹1,800',
    original_price: '₹2,600',
    discount_percent: 31,
    discount_tag: 'Save ₹800',
    featured: false
  },
  {
    badge: 'Self-Defense',
    title: 'Lathi-Kaushal for Women',
    detail: "The ancient Indian art of Lathi — practical, powerful, rooted. Taught by Shakti Sabha's field instructors.",
    modules: '10 Modules',
    duration: '6 Weeks',
    level: 'Beginners',
    price: '₹2,000',
    original_price: '₹2,800',
    discount_percent: 29,
    discount_tag: 'Save ₹800',
    featured: false
  },
  {
    badge: 'Research',
    title: 'The Legal Collage — Know Your Rights',
    detail: 'Understanding IPC, BNS, and systemic loopholes. Fact-based, lawyer-reviewed, essential for every woman in India.',
    modules: '5 Modules',
    duration: '3 Weeks',
    level: 'Open',
    price: '₹1,400',
    original_price: '₹2,000',
    discount_percent: 30,
    discount_tag: 'Save ₹600',
    featured: false
  },
]

const getInitialCourses = () => {
  try {
    const local = typeof window !== 'undefined' ? localStorage.getItem('shakti_custom_courses') : null
    if (local) {
      const parsed = JSON.parse(local)
      const published = parsed.filter((c: any) => c.published).map((c: any) => {
        const origPrice = c.original_price ? (typeof c.original_price === 'number' ? `₹${c.original_price.toLocaleString()}` : c.original_price) : (c.price ? `₹${c.price.toLocaleString()}` : '')
        const payablePrice = c.price ? (typeof c.price === 'number' ? `₹${c.price.toLocaleString()}` : c.price) : 'Free'
        return {
          badge: c.instructor ? `Instructor · ${c.instructor}` : 'Academy',
          title: c.title,
          detail: c.description || 'Comprehensive training curriculum.',
          modules: c.syllabus?.length ? `${c.syllabus.length} Modules` : 'Self-Paced',
          duration: c.duration || 'Flexible',
          level: c.level || 'All Levels',
          image: c.cover_image_url || '',
          price: payablePrice,
          original_price: origPrice,
          discount_percent: c.discount_percent || 0,
          discount_tag: c.discount_tag || '',
          featured: false
        }
      })
      if (published.length > 0) {
        return published
      }
    }
  } catch (e) {
    // fallback
  }
  return COURSES
}

export default function Courses() {
  const [coursesList, setCoursesList] = useState(getInitialCourses)
  const secRef  = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleUpdate = () => {
      setCoursesList(getInitialCourses())
    }
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('shakti_courses_updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('shakti_courses_updated', handleUpdate)
    }
  }, [])
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
    <>
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
        {coursesList.map((c: any) => (
          <div key={c.title} data-c="card" className={`${s.card} ${c.featured ? s.featured : ''}`}>
            {c.image && (
              <div className={s.cardImgWrap}>
                <img src={c.image} alt={c.title} className={s.cardImg} loading="lazy" />
              </div>
            )}
            <div className={s.cardBadge}>{c.badge}</div>
            <div className={s.cardTitle}>{c.title}</div>
            <p className={s.cardDetail}>{c.detail}</p>
            <div className={s.cardFooter}>
              <div className={s.priceWrapper}>
                {c.original_price && (
                  <div className={s.discountRow}>
                    <span className={s.originalPrice}>{c.original_price}</span>
                    {c.discount_percent ? (
                      <span className={s.discountBadge}>{c.discount_percent}% OFF</span>
                    ) : null}
                    {c.discount_tag ? (
                      <span className={s.savingsTag}>{c.discount_tag}</span>
                    ) : null}
                  </div>
                )}
                <div className={s.priceRow}>
                  <span className={s.priceText}>{c.price || '₹1,800'}</span>
                  <span className={s.finalLabel}>Customer Price</span>
                </div>
              </div>
              <Link to="/courses" className={s.enroll}>Enroll Now →</Link>
            </div>
          </div>
        ))}
      </div>
      </section>
      <Testimonials />
    </>
  )
}
