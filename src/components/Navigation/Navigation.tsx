import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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
  const [open, setOpen] = useState(false)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const location = useLocation()

  // scrolled state
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn() // initial check (page may load mid-scroll)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.28,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    if (ctaRef.current) {
      gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
    }
  }

  return (
    <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
      <Link to="/" className={s.logo}>
        <span className={s.logoMain}>Shakti Sabha</span>
        <span className={s.logoDev}>शक्ति सभा</span>
      </Link>

      <div className={`${s.links} ${open ? s.linksOpen : ''}`}>
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <Link
        to="/brand"
        ref={ctaRef}
        className={s.cta}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        Brand Identity
      </Link>

      <button
        className={s.hamburger}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={s.bar} /><span className={s.bar} /><span className={s.bar} />
      </button>
    </nav>
  )
}
