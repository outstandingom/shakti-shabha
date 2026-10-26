import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import s from './Navigation.module.css'

const LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Social Work', to: '/social-work' },
  { label: 'Aaryaveera', to: '/aaryaveera' },
  { label: 'Events', to: '/events' },
  { label: 'Courses', to: '/courses' },
  { label: 'Sahyog', to: '/sahyog' },
  { label: 'History', to: '/history' },
  { label: 'Case Studies', to: '/case-study' },
  { label: 'Thought-Lab', to: '/research' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const logoImgRef = useRef<HTMLImageElement>(null)
  const logoMainRef = useRef<HTMLSpanElement>(null)
  const logoDevRef = useRef<HTMLSpanElement>(null)
  const location = useLocation()

  // scroll state
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // close mobile menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // logo intro: flip → writing reveal → subtext fade
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (logoImgRef.current) {
      tl.fromTo(
        logoImgRef.current,
        { rotateY: -90, scale: 0.8, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 0.8 }
      )
    }

    if (logoMainRef.current) {
      tl.fromTo(
        logoMainRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power2.inOut' },
        '-=0.2'
      )
    }

    if (logoDevRef.current) {
      tl.fromTo(
        logoDevRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        '-=0.35'
      )
    }
  }, [])

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
      {/* ---------- logo: flip image + writing text ---------- */}
      <Link to="/" className={s.logo} aria-label="Shakti Sabha home">
        <img
          ref={logoImgRef}
          src="/logo.jpeg"
          alt="Shakti Sabha logo"
          className={s.logoImg}
        />
        <div className={s.logoText}>
          <span ref={logoMainRef} className={s.logoMain}>Shakti Sabha</span>
          <span ref={logoDevRef} className={s.logoDev}>शक्ति सभा</span>
        </div>
      </Link>

      {/* ---------- links wrapped in a single rectangle ---------- */}
      <div className={`${s.linksBox} ${open ? s.linksBoxOpen : ''}`}>
        <div className={s.links}>
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
