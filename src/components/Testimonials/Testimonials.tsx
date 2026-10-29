import { useState, useEffect, useRef } from 'react'
import { supabase, Testimonial } from '../../lib/supabase'
import { DEFAULT_TESTIMONIALS } from './testimonialsData'
import s from './Testimonials.module.css'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadTestimonials = async () => {
      let remoteList: Testimonial[] = []

      // 1. Fetch published from Supabase
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          remoteList = data as Testimonial[]
        }
      } catch (err) {
        // Table might not exist yet, fallback smoothly
      }

      // 2. Fetch from LocalStorage (Custom admin testimonials)
      try {
        const local = localStorage.getItem('shakti_testimonials')
        if (local) {
          const localParsed: Testimonial[] = JSON.parse(local)
          const publishedLocal = localParsed.filter(t => t.published !== false)

          // Deduplicate by ID
          const existingIds = new Set(remoteList.map(t => t.id))
          const uniqueLocal = publishedLocal.filter(t => !existingIds.has(t.id))
          remoteList = [...uniqueLocal, ...remoteList]
        }
      } catch (e) {
        console.warn('LocalStorage testimonials read error:', e)
      }

      // 3. Fallback to default authentic testimonies if empty
      if (remoteList.length === 0) {
        remoteList = DEFAULT_TESTIMONIALS
      } else {
        // If there are only 1 or 2, mix in defaults so marquee fills out nicely
        const existingQuotes = new Set(remoteList.map(t => t.quote.trim().toLowerCase()))
        const extraDefaults = DEFAULT_TESTIMONIALS.filter(d => !existingQuotes.has(d.quote.trim().toLowerCase()))
        remoteList = [...remoteList, ...extraDefaults]
      }

      if (isMounted) {
        setTestimonials(remoteList)
      }
    }

    loadTestimonials()

    // Listen for custom event when admin publishes/updates testimonials in another tab or component
    const handleStorageChange = () => {
      loadTestimonials()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Duplicate list to achieve infinite seamless loop
  const marqueeItems = [...testimonials, ...testimonials]

  const nudge = (direction: 'left' | 'right') => {
    if (!trackRef.current) return
    const offset = direction === 'left' ? -350 : 350
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className={s.section} aria-label="Community Testimonials">
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.eyebrow}>Voices of Transformation</span>
            <h2 className={s.title}>The Spirit of Shakti</h2>
            <p className={s.subtitle}>
              Hear from the brave women, survivors, grassroots trainers, and scholars who have forged their strength through Shakti Sabha's three streams.
            </p>
          </div>

          <div className={s.headerRight}>
            <button
              className={s.navBtn}
              onClick={() => nudge('left')}
              title="Previous testimonial"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className={s.navBtn}
              onClick={() => nudge('right')}
              title="Next testimonial"
              aria-label="Next"
            >
              →
            </button>
            <button
              className={s.navBtn}
              onClick={() => setIsPaused(p => !p)}
              title={isPaused ? 'Resume auto scroll' : 'Pause auto scroll'}
              aria-label={isPaused ? 'Play' : 'Pause'}
              style={{ fontSize: '0.9rem' }}
            >
              {isPaused ? '▶' : '❚❚'}
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div
        className={s.marqueeOuter}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className={s.marqueeTrack}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {marqueeItems.map((item, idx) => (
            <article key={`${item.id}-${idx}`} className={s.card}>
              <div className={s.cardTop}>
                <div className={s.stars} aria-label={`${item.rating || 5} out of 5 stars`}>
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className={s.quoteIcon} aria-hidden="true">“</span>
              </div>

              <blockquote className={s.quoteText}>
                "{item.quote}"
              </blockquote>

              <div className={s.authorBlock}>
                <div className={s.avatarWrap}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className={s.avatarImg}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to initials if image link breaks
                        const target = e.currentTarget
                        target.style.display = 'none'
                        if (target.parentElement) {
                          const fallback = document.createElement('span')
                          fallback.className = s.avatarInitial
                          fallback.textContent = item.name.charAt(0).toUpperCase()
                          target.parentElement.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <span className={s.avatarInitial}>
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={s.authorInfo}>
                  <h3 className={s.authorName}>{item.name}</h3>
                  <div className={s.authorRole}>
                    <span>{item.role}</span>
                    {item.location && (
                      <span className={s.authorLocation}>{item.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={s.scrollHint}>
        <span>Hover or touch cards to pause marquee • Continuous auto-scrolling</span>
      </div>
    </section>
  )
}
