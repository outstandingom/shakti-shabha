import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, FounderProfileData } from '../../data/founderData'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Profile.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Profile() {
  const secRef   = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<FounderProfileData>(getFounderData())

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getFounderData())
    }
    window.addEventListener('founder_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('founder_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: secRef.current, 
          start: 'top 90%',
          toggleActions: 'play none none none' 
        }
      })
      
      // Animate main photo revealing
      tl.to(photoRef.current, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' })
        // Animate right side heading and button
        .from('[data-p="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 }, '-=0.6')
        .from('[data-p="heading"]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('[data-p="badge-row"]', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
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
              src={profile.heroImage || "Gemini_Generated_Image_kdfkbukdfkbukdfk.png"} 
              alt={profile.name} 
              className={s.heroImg}
            />
          </div>

          {/* Bottom Left: Text & Paragraph */}
          <div className={s.leftBottom}>
            <h3 data-p="subtitle" className={s.subTitle}>
              Aaryaveera<br/>Harshita Mankar
            </h3>
            <p data-p="bio" className={s.bio}>
              {profile.bio}
            </p>
          </div>
        </div>

        {/* ========================================
            RIGHT COLUMN
            ======================================== */}
        <div className={s.right}>
          {/* Top Right: Heading & Button */}
          <div className={s.rightTop}>
            <span data-p="eyebrow" className={s.eyebrow}>FOUNDER &amp; DIRECTOR · AARYAVEERA</span>
            
            <h2 data-p="heading" className={s.heading}>
              <span className={s.nameBold}>Harshita</span>{' '}
              <span className={s.nameLight}>Mankar</span>
              <span className={s.title}>
                {profile.honorific_hi}
              </span>
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#DC143C', fontWeight: 600, letterSpacing: '0.04em', margin: '0.4rem 0 1rem' }}>
              {profile.subTitle}
            </p>

            {/* Hero Quote */}
            <div data-p="badge-row" style={{
              background: 'rgba(220, 20, 60, 0.04)',
              borderLeft: '3px solid #DC143C',
              padding: '0.9rem 1.1rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '1.25rem',
              fontStyle: 'italic',
              color: '#374151',
              fontSize: '0.92rem',
              lineHeight: 1.6
            }}>
              "{profile.heroQuote}"
            </div>

            {/* Quick Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.65rem',
              width: '100%',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>Black Belt</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Karate &amp; Combat</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>2,000+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Girls Weaponized</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>500+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Seminars Convened</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0.65rem 0.85rem' }}>
                <div style={{ color: '#DC143C', fontWeight: 800, fontSize: '1.1rem' }}>25,000+</div>
                <div style={{ color: '#6B7280', fontSize: '0.74rem' }}>Students Reached</div>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link to="/about" data-p="btn" className={s.ctaBtn}>
                Full Biography &amp; Genesis →
              </Link>
              <Link to="/three-streams" className="btn-magnetic btn-ghost" style={{ fontSize: '0.82rem', padding: '0.6rem 1.1rem' }}>
                The Three Streams →
              </Link>
            </div>
          </div>

          {/* Bottom Right: Two Sub Images */}
          <div className={s.rightBottom}>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop" 
                alt="Mission Mardini Camp" 
              />
            </div>
            <div data-p="subimg" className={s.subImg}>
              <img 
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop" 
                alt="Youth Awakening Seminar" 
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
