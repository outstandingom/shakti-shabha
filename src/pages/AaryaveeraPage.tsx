import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'

const CARDS = [
  { icon: '⚔', title: 'Self-Defense & Training', text: 'Aaryaveera Camps and Warrior Certification. The trained body is the first declaration of freedom.' },
  { icon: '🔥', title: 'Character & Leadership', text: 'Courses that build the Aaryaveera spirit — noble, fearless, anchored in Dharma and cultural roots.' },
  { icon: '◎', title: 'Dialogue & Research', text: '"Aaryaveera Dialogues" under Shakti Varta — honest discourse on true masculinity, Paurush, and Dharma.' },
]

export default function AaryaveeraPage() {
  return (
    <main className={s.page} style={{ background: '#0A0A0B' }}>
      {/* Dark Hero */}
      <div className={s.banner} style={{ background: 'linear-gradient(160deg, #0A0A0B 0%, #1A1209 60%, #0C0C0D 100%)', borderBottom: '1px solid rgba(201,169,110,0.25)' }}>
        <div className={s.bannerInner}>
          <Link to="/" className={s.back} style={{ color: 'rgba(255,255,255,0.6)' }}>← Back to Home</Link>
          <span className={s.bannerEyebrow} style={{ color: '#D4AF37', background: 'rgba(201,169,110,0.1)', borderColor: 'rgba(201,169,110,0.3)' }}>Signature Initiative · Focus Area</span>
          <h1 className={s.bannerTitle} style={{ color: '#E8C98A', fontFamily: 'var(--font-display, "Cinzel", serif)', letterSpacing: '0.12em' }}>AARYAVEERA</h1>
          <p className={s.bannerHindi} style={{ color: '#C9A96E' }}>आर्यवीरा · The Warrior Spirit</p>
          <p className={s.bannerDesc} style={{ color: 'rgba(255,255,255,0.7)' }}>"Shakti Se Shanti — From Strength, Peace" · Powered by PrintingTask</p>
        </div>
      </div>

      {/* Programme Cards */}
      <div className={s.section} style={{ background: '#111113' }}>
        <h2 className={s.sectionTitle} style={{ color: '#E8C98A' }}>The Three Pillars</h2>
        <div className={s.cardsGrid}>
          {CARDS.map((c, i) => (
            <div key={i} className={s.darkCard}>
              <div className={s.darkCardIcon}>{c.icon}</div>
              <h3 className={s.darkCardTitle}>{c.title}</h3>
              <p className={s.darkCardText}>{c.text}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/courses" className={s.goldBtn}>Enroll in a Course →</Link>
          <Link to="/" className={s.goldOutlineBtn}>Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
