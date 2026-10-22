import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Profile.module.css' // Keep your existing CSS file name

gsap.registerPlugin(ScrollTrigger)

export default function CourseSection() {
  const secRef   = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: secRef.current, 
          start: 'top 90%', 
          toggleActions: 'play none none none' 
        }
      })
      
      tl.to(photoRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' })
        .from('[data-p="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.6')
        .from('[data-p="heading"]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('[data-p="btn"]',     { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
        .from('[data-p="subimg"]',  { opacity: 0, y: 30, stagger: 0.2, duration: 0.6 }, '-=0.2')
        .from('[data-p="subtitle"]',{ opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
        .from('[data-p="bio"]',     { opacity: 0, y: 15, duration: 0.5 }, '-=0.4')
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        
        {/* ========================================
            LEFT COLUMN
            ======================================== */}
        <div className={s.left}>
          <div ref={photoRef} className={s.photoFrame}>
            {/* Replace with a Course or Training Image */}
            <img 
              src="/harshitama'am.jpg" 
              alt="Course Training" 
              className={s.heroImg}
            />
          </div>

          <div className={s.leftBottom}>
            <h3 data-p="subtitle" className={s.subTitle}>
              Learn &<br/>Grow
            </h3>
            <p data-p="bio" className={s.bio}>
              This comprehensive program is designed to build confidence, physical strength, and mental resilience. Join our expert-led sessions to master the art of self-defense and community leadership.
            </p>
          </div>
        </div>

        {/* ========================================
            RIGHT COLUMN
            ======================================== */}
        <div className={s.right}>
          <div className={s.rightTop}>
            {/* Changed Eyebrow to Course */}
            <span data-p="eyebrow" className={s.eyebrow}>Course Overview</span>
            
            {/* CHANGED THE HEADING TO A COURSE */}
            <h2 data-p="heading" className={s.heading}>
              Self Defense <em>Mastery</em><br/>
              <span className={s.title} style={{fontFamily:'var(--ff-dev)'}}>
                आत्मरक्षा प्रशिक्षण
              </span>
            </h2>

            <Link to="/courses" data-p="btn" className={s.ctaBtn}>
              Enroll Now
            </Link>
          </div>

          <div className={s.rightBottom}>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop" 
                alt="Course Work 1" 
              />
            </div>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop" 
                alt="Course Work 2" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
