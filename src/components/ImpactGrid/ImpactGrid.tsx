import { Link } from 'react-router-dom'
import GoogleIcon from '../GoogleIcon/GoogleIcon'

const METRICS = [
  {
    val: '2,800+',
    label: 'Direct Somatic & Tactical Cadets',
    desc: '7–10 day residential self-defense, Lathi-Kaushal & biomechanics bootcamps across welfare hostels, colleges & community camps.',
    accent: '#DC143C'
  },
  {
    val: '25,000+',
    label: 'Youth via Institutional Forums',
    desc: 'Direct in-person participants across schools, colleges, and university hostels in character-building & cognitive focus sessions.',
    accent: '#3D5A45'
  },
  {
    val: '50,000+',
    label: 'Policy & Discourse Attendees',
    desc: 'Scholars and citizens across national plenaries (CIDCO Navi Mumbai, Lata Mangeshkar Auditorium, Ratlam State Dialogue).',
    accent: '#C9A96E'
  },
  {
    val: '50+ Cases',
    label: 'High-Risk Crisis Mediations',
    desc: 'Frontline human trafficking interceptions, Child Welfare Committee (CWC) coordination, and family crisis reconciliations.',
    accent: '#4F46E5'
  }
]

export default function ImpactGrid() {
  return (
    <section style={{ background: '#09090C', padding: '3.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: '#C9A96E', fontFamily: 'Cinzel, Georgia, serif', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GoogleIcon name="verified" size={15} />
              Verified Institutional Footprint
            </div>
            <h2 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              High-Level Impact Summary
            </h2>
          </div>
          <Link
            to="/impact"
            style={{
              color: '#C9A96E',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              padding: '0.5rem 1.25rem',
              borderRadius: 9999,
              background: 'rgba(201, 169, 110, 0.08)',
              border: '1px solid rgba(201, 169, 110, 0.25)'
            }}
          >
            <span>View 3-Depth Archive &amp; Taxonomy</span>
            <GoogleIcon name="arrow_forward" size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {METRICS.map((m, idx) => (
            <div
              key={idx}
              style={{
                background: '#111115',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '1.75rem 1.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: m.accent }} />
              <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, marginBottom: '0.5rem' }}>
                {m.val}
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#C9A96E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {m.label}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#9CA3AF', lineHeight: 1.6 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
