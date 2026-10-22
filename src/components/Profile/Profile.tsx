import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Profile.module.css'

gsap.registerPlugin(ScrollTrigger)

const TEAM = [
  { emoji: '👩', name: 'Priya Sharma', role: 'Program Director' },
  { emoji: '🧑', name: 'Arjun Mehta',  role: 'Field Coordinator' },
  { emoji: '👩', name: 'Kavita Rao',   role: 'Lead Counselor' },
  { emoji: '🧑', name: 'Dev Patil',    role: 'Tech & Media' },
]

export default function Profile() {
  const secRef   = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: secRef.current, start: 'top 72%', toggleActions: 'play none none none' }
      })
      tl.to(photoRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' })
        .from('[data-p="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.5')
        .from('[data-p="name"]',    { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('[data-p="subimg"]',  { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.2')
        .from('[data-p="bio"]',     { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
        .from('[data-p="stat"]',    { opacity: 0, y: 12, stagger: 0.08, duration: 0.4 }, '-=0.2')
        .from('[data-p="team"]',    { opacity: 0, y: 10, duration: 0.4 }, '-=0.1')
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        
        {/* ========================================
            LEFT COLUMN (Hero Image + Info)
            ======================================== */}
        <div className={s.left}>
          <div ref={photoRef} className={s.photoFrame}>
            {/* Replace this placeholder with your actual hero image */}
            <div className={s.photoPlaceholder}>
              <span className={s.photoIcon}>👩‍💼</span>
              <span className={s.photoLabel}>Founder Photo</span>
            </div>
          </div>

          {/* Bottom Left Information */}
          <div className={s.leftInfo}>
            <p data-p="bio" className={s.bio}>
              A social warrior who chose the village over the boardroom. For twelve unbroken years, Lalita-ji has taken self-defense, healing, and intellectual discourse to women and girls who had no one to stand beside them — building Shakti Sabha from a single camp in Wardha into a movement that spans hundreds of schools and villages.
            </p>
            
            <div className={s.stats}>
              {[['12', 'Years Active'], ['400+', 'Schools Reached'], ['∞', 'Lives Changed']].map(([n, l]) => (
                <div key={l} data-p="stat" className={s.stat}>
                  <div className={s.statNum}>{n}</div>
                  <div className={s.statLabel}>{l}</div>
                </div>
              ))}
            </div>
            
            <Link to="/social-work" className="btn-magnetic btn-ghost">
              View Full Impact Archive →
            </Link>

            <div data-p="team" className={s.team}>
              <p className={s.teamHeading}>Core Team</p>
              <div className={s.teamGrid}>
                {TEAM.map(m => (
                  <div key={m.name} className={s.member}>
                    <div className={s.avatar}>{m.emoji}</div>
                    <div>
                      <div className={s.memberName}>{m.name}</div>
                      <div className={s.memberRole}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            RIGHT COLUMN (Heading + Sub Images)
            ======================================== */}
        <div className={s.right}>
          {/* Top Right Heading */}
          <div className={s.rightHeading}>
            <span data-p="eyebrow" className={s.eyebrow}>Founder & Visionary</span>
            <h2 data-p="name" className={s.name}>
              Smt. Harshita Mankar<br/>
              <span className={s.title} style={{fontFamily:'var(--ff-dev)'}}>
                श्रीमती हर्षिता मानकरी
              </span>
            </h2>
          </div>

          {/* Bottom Right Two Sub Images */}
          <div className={s.subImages}>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" 
                alt="Impact Work 1" 
              />
            </div>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop" 
                alt="Impact Work 2" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
