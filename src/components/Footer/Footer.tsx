import { Link } from 'react-router-dom'
import s from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Social Work', to: '/social-work' },
  { label: 'Aaryaveera', to: '/aaryaveera' },
  { label: 'Events', to: '/events' },
  { label: 'Courses', to: '/courses' },
  { label: 'Sahyog', to: '/sahyog' },
  { label: 'History', to: '/history' },
]

const PROGRAMME_LINKS = [
  { label: 'Mardini — Revolution', to: '/social-work' },
  { label: 'Shakti Bhava — Healing', to: '/history' },
  { label: 'Shakti Varta — Discourse', to: '/aaryaveera' },
  { label: 'Aaryaveera Programme', to: '/aaryaveera' },
  { label: 'Brand Identity', to: '/brand' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        {/* Brand */}
        <div className={s.brand}>
          <div className={s.logoName}>Shakti Sabha</div>
          <div className={s.logoHindi}>शक्ति सभा</div>
          <p className={s.tagline}>Union of Peace &amp; Revolution</p>
          <div className={s.badge}>FCRA Compliant</div>
        </div>

        {/* Navigation */}
        <div className={s.col}>
          <div className={s.colTitle}>Navigation</div>
          <ul className={s.links}>
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={s.link}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programmes */}
        <div className={s.col}>
          <div className={s.colTitle}>Programmes</div>
          <ul className={s.links}>
            {PROGRAMME_LINKS.map(l => (
              <li key={l.label}>
                <Link to={l.to} className={s.link}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className={s.col}>
          <div className={s.colTitle}>Legal & Info</div>
          <ul className={s.links}>
            <li className={s.infoLine}>FCRA Compliant</li>
            <li className={s.infoLine}>Domestic Payments Only</li>
            <li className={s.infoLine}>SRS v1.2</li>
          </ul>
          <div className={s.built}>Built by PrintingTask</div>
        </div>
      </div>

      <div className={s.bottom}>
        <span className={s.copy}>© {year} Shakti Sabha. All rights reserved.</span>
        <span className={s.copy}>12 years of on-ground impact — Maharashtra &amp; beyond.</span>
      </div>
    </footer>
  )
}
