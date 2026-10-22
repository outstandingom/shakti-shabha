import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Profile.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Profile() {
  const secRef   = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: secRef.current, 
          start: 'top 90%', // Triggers earlier so elements don't stay hidden
          toggleActions: 'play none none none' 
        }
      })
      
      // Animate main photo revealing
      tl.to(photoRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' })
        // Animate right side heading and button
        .from('[data-p="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.6')
        .from('[data-p="heading"]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('[data-p="btn"]',     { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
        // Animate sub images
        .from('[data-p="subimg"]',  { opacity: 0, y: 30, stagger: 0.2, duration: 0.6 }, '-=0.2')
        // Animate left bottom text
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
          {/* Main Hero Image */}
          <div ref={photoRef} className={s.photoFrame}>
            <img 
              src="/harshitama'am.jpg" 
              alt="Smt. Harshita Mankar" 
              className={s.heroImg}
            />
          </div>

          {/* Bottom Left: Text & Paragraph */}
          <div className={s.leftBottom}>
            <h3 data-p="subtitle" className={s.subTitle}>
              Empowering<br/>the Future
            </h3>
            <p data-p="bio" className={s.bio}>
              A social warrior who chose the village over the boardroom. For twelve unbroken years, Lalita-ji has taken self-defense, healing, and intellectual discourse to women and girls who had no one to stand beside them.
            </p>
          </div>
        </div>

        {/* ========================================
            RIGHT COLUMN
            ======================================== */}
        <div className={s.right}>
          {/* Top Right: Heading & Button */}
          <div className={s.rightTop}>
            <span data-p="eyebrow" className={s.eyebrow}>Founder & Visionary</span>
            
            <h2 data-p="heading" className={s.heading}>
              Smt. Harshita <em>Mankar</em><br/>
              <span className={s.title} style={{fontFamily:'var(--ff-dev)'}}>
                श्रीमती हर्षिता मानकरी
              </span>
            </h2>

            {/* THE BUTTON IS HERE */}
            <Link to="/social-work" data-p="btn" className={s.ctaBtn}>
              View Impact Archive
            </Link>
          </div>

          {/* Bottom Right: Two Sub Images */}
          <div className={s.rightBottom}>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop" 
                alt="NGO Work 1" 
              />
            </div>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop" 
                alt="NGO Work 2" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
