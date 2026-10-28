import { useState } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './Footer.module.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const year = new Date().getFullYear()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        {/* Brand & Mission Column */}
        <div className={s.brand}>
          <div className={s.logoName}>Shakti Sabha</div>
          <div className={s.logoHindi}>शक्ति सभा</div>
          <p className={s.tagline}>
            Indian women ke liye ek aisa platform jahan roots milti hain, strength milti hai, aur ek aisi community milti hai jo tumhari taraf hai. Ancient roots. Modern strength.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Instagram">
              <GoogleIcon name="photo_camera" size={17} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="YouTube">
              <GoogleIcon name="smart_display" size={17} />
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Telegram">
              <GoogleIcon name="send" size={17} />
            </a>
            <a href="mailto:contact@shaktisabha.com" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.85rem' }} title="Email">
              <GoogleIcon name="mail" size={17} />
            </a>
          </div>

          <div className={s.badge} style={{ marginTop: '1.25rem' }}>FCRA Compliant · Domestic Only</div>
        </div>

        {/* Explore Links */}
        <div className={s.col}>
          <div className={s.colTitle}>The Three Wings</div>
          <ul className={s.links}>
            <li><Link to="/mardini" className={s.link} style={{ color: '#FFB3BA' }}>01 · Mission Mardini (Combat)</Link></li>
            <li><Link to="/shakti-bhava" className={s.link} style={{ color: '#A7F3D0' }}>02 · Shakti Bhava (Healing)</Link></li>
            <li><Link to="/shakti-varta" className={s.link} style={{ color: '#C7D2FE' }}>03 · Shakti Varta (Discourse)</Link></li>
            <li><Link to="/articles" className={s.link}>Latest Articles</Link></li>
            <li><Link to="/history" className={s.link}>Veeranganas</Link></li>
            <li><Link to="/counselling" className={s.link}>Mental Health & Counselling</Link></li>
            <li><Link to="/research" className={s.link}>Indian History & Thought-Lab</Link></li>
            <li><Link to="/gallery" className={s.link}>3D Media Vault</Link></li>
          </ul>
        </div>

        {/* Platform Links */}
        <div className={s.col}>
          <div className={s.colTitle}>Platform</div>
          <ul className={s.links}>
            <li><Link to="/about" className={s.link}>About Us</Link></li>
            <li><Link to="/aaryaveera" className={s.link}>Aaryaveera Initiative</Link></li>
            <li><Link to="/counselling" className={s.link}>Counselling Services</Link></li>
            <li><Link to="/sahyog" className={s.link}>Community Ecosystem</Link></li>
            <li><Link to="/courses" className={s.link}>Online Courses & LMS</Link></li>
            <li><Link to="/events" className={s.link}>Events & Camps</Link></li>
            <li><Link to="/brand" className={s.link}>Brand Identity</Link></li>
            <li><span className={s.infoLine}>Privacy Policy & Terms of Service</span></li>
          </ul>
        </div>

        {/* Shakti Dispatch Newsletter */}
        <div className={s.col}>
          <div className={s.colTitle}>The Shakti Dispatch</div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
            Har hafte — ek naya article, ek forgotten heroine ki kahani, ek psychological insight. Seedha aapke inbox mein.
          </p>

          {subscribed ? (
            <div style={{ padding: '0.75rem', background: 'rgba(220,20,60,0.15)', border: '1px solid #DC143C', borderRadius: '8px', color: '#FFB3BA', fontSize: '0.8rem' }}>
              ✓ Sabha mein swagat hai! Subscription confirmed.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Aapka email address..."
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem',
                  background: '#DC143C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Join Sabha →
              </button>
            </form>
          )}

          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            ✦ Free hai. Kabhi bhi unsubscribe kar sakte hain. No spam.
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <span className={s.copy}>© {year} Shakti Sabha. All rights reserved.</span>
        <span className={s.copy}>12 years of on-ground impact — Maharashtra &amp; beyond.</span>
        <span className={s.copy} style={{ color: '#E8C98A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <GoogleIcon name="swords" size={16} /> MADE IN BHARAT
        </span>
      </div>
    </footer>
  )
}
