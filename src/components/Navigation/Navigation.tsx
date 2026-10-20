import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import gsap from 'gsap'
import s from './Navigation.module.css'

const LINKS = [
  { label: 'Social Work', to: '/social-work' },
  { label: 'Aaryaveera', to: '/aaryaveera' },
  { label: 'Events', to: '/events' },
  { label: 'Courses', to: '/courses' },
  { label: 'Sahyog', to: '/sahyog' },
  { label: 'History', to: '/history' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.35, ease: 'power2.out' })
  }
  const onLeave = () => gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })

  return (
    <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
      <Link to="/" className={s.logo}>
        <span className={s.logoMain}>Shakti Sabha</span>
        <span className={s.logoDev}>शक्ति सभा</span>
      </Link>
      <div className={s.links}>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}>
            {l.label}
          </NavLink>
        ))}
      </div>
      <Link to="/brand" ref={ctaRef} className={s.cta} onMouseMove={onMove} onMouseLeave={onLeave}>
        Brand Identity
      </Link>
      <button className={s.hamburger} aria-label="Menu">
        <span className={s.bar} /><span className={s.bar} /><span className={s.bar} />
      </button>
    </nav>
  )
}
