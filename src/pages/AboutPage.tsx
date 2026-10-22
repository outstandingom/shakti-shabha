// The Union of Peace & Revolution — Dedicated Page
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const STREAMS = [
  {
    num: '01',
    stream: 'Revolution',
    name: 'Mardini',
    dev: 'मर्दिनी',
    themeColor: '#DC143C',
    themeBg: 'rgba(220, 20, 60, 0.05)',
    borderColor: 'rgba(220, 20, 60, 0.25)',
    summary: 'Self-defense. Lathi-Kaushal. Sword training. Village camps across Maharashtra and beyond. The revolution that begins in the body and spreads to the spirit.',
    details: [
      'Comprehensive on-ground training camps conducted across rural districts and peri-urban centers.',
      'Training in traditional Bharatiya martial arts, modern situational defense, and physical courage.',
      'Over 50,000+ women trained to recognize vulnerability as a myth and claim their innate strength.',
    ],
    link: '/social-work',
    linkLabel: 'Explore Social Work →',
  },
  {
    num: '02',
    stream: 'Healing',
    name: 'Shakti Bhava',
    dev: 'शक्ति भव',
    themeColor: '#166534',
    themeBg: 'rgba(22, 101, 52, 0.05)',
    borderColor: 'rgba(22, 101, 52, 0.25)',
    summary: 'Counseling. Anonymized case studies. Breaking silence on trafficking, PTSD, puberty, and depression. The space where survivors become warriors.',
    details: [
      'Confidential psychological aid and trauma recovery led by empathetic trained professionals.',
      'Safe listening circles that address gender-based violence, domestic distress, and stigma.',
      'Holistic healing programs that restore self-worth, community standing, and mental resilience.',
    ],
    link: '/history',
    linkLabel: 'Read Survivor Stories →',
  },
  {
    num: '03',
    stream: 'Discourse',
    name: 'Shakti Varta',
    dev: 'शक्ति वार्ता',
    themeColor: '#4338CA',
    themeBg: 'rgba(67, 56, 202, 0.05)',
    borderColor: 'rgba(67, 56, 202, 0.25)',
    summary: 'White papers. Research. Podcasts. Seminars. The intellectual engine that backs the revolution with verified knowledge and historical truth.',
    details: [
      'Evidence-based policy white papers examining ground realities of female security and rights.',
      'The Aaryaveera Dialogues podcast exploring civilizational perspectives on Dharma and equality.',
      'Academic alliances, seminars, and publication of verified historical narratives of women warriors.',
    ],
    link: '/aaryaveera',
    linkLabel: 'Discover Aaryaveera →',
  },
]

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--theme-bg, #FFFFFF)', paddingTop: '6.5rem', paddingBottom: '7rem' }}>
      
      {/* Top Banner with Crimson Theme */}
      <section style={{ 
        background: 'linear-gradient(145deg, #A80E2D 0%, #DC143C 55%, #B01030 100%)', 
        color: '#FFFFFF', 
        padding: ' clamp(3.5rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '0.82rem', 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none', 
              marginBottom: '2rem', 
              fontFamily: 'var(--btn-font, Poppins, sans-serif)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            ← Back to Home
          </Link>

          <span style={{ 
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '1rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            Our Founding Architecture
          </span>

          <h1 style={{ 
            fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', 
            fontWeight: 700, 
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', 
            lineHeight: 1.15,
            color: '#FFFFFF', 
            marginBottom: '1.25rem',
            maxWidth: '22ch'
          }}>
            The Union of Peace &amp; Revolution
          </h1>

          <p style={{ 
            fontFamily: 'var(--font-body, "Outfit", sans-serif)', 
            fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', 
            color: 'rgba(255, 255, 255, 0.92)', 
            maxWidth: '65ch', 
            lineHeight: '1.8' 
          }}>
            Everything Shakti Sabha builds lives within one of three streams — each distinct in method, unified in purpose: dignity, safety, and awakening for every woman who stands with us.
          </p>
        </div>
      </section>

      {/* The 3 Streams Deep-Dive Section */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {STREAMS.map(item => (
            <div 
              key={item.name}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: `1px solid ${item.borderColor}`,
                padding: '2.75rem 2.25rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Colored top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: item.themeColor }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ 
                  fontFamily: 'var(--font-display, "Cinzel", serif)', 
                  fontSize: '2.5rem', 
                  fontWeight: 900, 
                  color: item.themeColor, 
                  lineHeight: 1 
                }}>
                  {item.num}
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: item.themeColor,
                  background: item.themeBg,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  border: `1px solid ${item.borderColor}`
                }}>
                  {item.stream}
                </span>
              </div>

              <h2 style={{ 
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)', 
                fontSize: '1.85rem', 
                fontWeight: 700, 
                color: '#111111', 
                marginBottom: '0.2rem',
                lineHeight: 1.2
              }}>
                {item.name}
              </h2>

              <span style={{ 
                fontFamily: 'var(--font-devanagari, "Noto Sans Devanagari", sans-serif)', 
                fontSize: '1rem', 
                color: '#666666', 
                marginBottom: '1.25rem',
                display: 'block' 
              }}>
                {item.dev}
              </span>

              <p style={{ 
                fontSize: '0.92rem', 
                color: '#333333', 
                lineHeight: '1.75', 
                marginBottom: '1.75rem' 
              }}>
                {item.summary}
              </p>

              {/* Action bullet points */}
              <ul style={{ 
                listStyle: 'none', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem', 
                marginBottom: '2.5rem', 
                flexGrow: 1 
              }}>
                {item.details.map((detail, idx) => (
                  <li key={idx} style={{ 
                    fontSize: '0.85rem', 
                    color: '#555555', 
                    lineHeight: '1.6', 
                    paddingLeft: '1.25rem', 
                    position: 'relative' 
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: item.themeColor, fontWeight: 700 }}>•</span>
                    {detail}
                  </li>
                ))}
              </ul>

              <Link 
                to={item.link} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.7rem 2rem',
                  fontFamily: 'var(--btn-font, Poppins, sans-serif)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: item.themeColor,
                  background: item.themeBg,
                  border: `1px solid ${item.borderColor}`,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.themeColor
                  e.currentTarget.style.color = '#FFFFFF'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 22px rgba(0, 0, 0, 0.15)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = item.themeBg
                  e.currentTarget.style.color = item.themeColor
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
