import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'
import cp from './CounsellingPage.module.css'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  actionText: string
  actionLink: string
}

const SERVICES: ServiceItem[] = [
  {
    icon: '🧠',
    title: 'Psychological Empowerment',
    desc: 'Mental wellbeing aur emotional growth ke liye expert guidance. Apne aap ko samjho, apni strength pehchano.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
  },
  {
    icon: '💬',
    title: 'Counselling Services',
    desc: 'Professional counsellors ke saath apni journey mein support paao. Ek safe space — sirf tumhare liye.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
  },
  {
    icon: '🎓',
    title: 'Webinars & Workshops',
    desc: 'Live interactive sessions — women empowerment, mental health, career growth par expert speakers ke saath.',
    actionText: 'Jaanein Aur →',
    actionLink: '/events',
  },
  {
    icon: '👥',
    title: 'Community Platform',
    desc: 'Like-minded Indian women ka ek judgment-free space. Share karo, suno, aur ek doosre se seekho.',
    actionText: 'Jaanein Aur →',
    actionLink: '/sahyog',
  },
  {
    icon: '📚',
    title: 'Online Courses',
    desc: 'Women empowerment, Indian history, aur psychological wellness par comprehensive self-paced courses.',
    actionText: 'Jaanein Aur →',
    actionLink: '/courses',
  },
  {
    icon: '🌿',
    title: 'Healthy Lifestyle',
    desc: 'Holistic wellness — physical, mental, aur spiritual. Balanced life ke liye practical guidance.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
  },
  {
    icon: '⚔️',
    title: 'Our Revolution',
    desc: 'Social change ke liye ek platform. Campaigns, petitions, aur collective action — milke awaaz uthao.',
    actionText: 'Jaanein Aur →',
    actionLink: '/aaryaveera',
  },
  {
    icon: '🎙️',
    title: 'Podcasts & Media',
    desc: 'Inspiring conversations, historical investigations, aur motivational content — on-the-go sunte rehno.',
    actionText: 'Jaanein Aur →',
    actionLink: '/aaryaveera',
  },
  {
    icon: '⭐',
    title: 'Testimonials',
    desc: 'Unki kahaniyaan jo Shakti Sabha ke saath badli hain. Real stories, real transformation.',
    actionText: 'Padhein →',
    actionLink: '/about',
  },
]

export default function CounsellingPage() {
  const [formDone, setFormDone] = useState(false)

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={cp.hero}>
        <div className={cp.heroInner}>
          <Link to="/" className={cp.backLink}>← Back to Home</Link>
          <span className={cp.badge}>Hamare Services · Shakti Sabha Mein Kya Milega</span>
          <h1 className={cp.title}>Counselling & Psychological Support</h1>
          <p className={cp.hindiSubtitle}>सुरक्षित मंच · पेशेवर मार्गदर्शन एवं आत्म-विश्वास</p>
          <p className={cp.desc}>
            Professional counsellors ke saath apni journey mein support paao.
            Ek safe space, judgment-free environment — sirf tumhare liye.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className={s.section}>

        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
            Comprehensive Support Architecture
          </span>
          <h2 className={s.sectionTitle} style={{ marginTop: '0.35rem', display: 'inline-block' }}>
            Shakti Sabha Mein Kya Milega
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginTop: '0.5rem' }}>
            Mental health aur emotional growth se lekar community connection aur legal literacy tak — har kadam par hum tumhare saath hain.
          </p>
        </div>

        {/* 9 Services Grid */}
        <div className={cp.servicesGrid}>
          {SERVICES.map((srv, idx) => (
            <div key={idx} className={cp.serviceCard}>
              <div>
                <div className={cp.serviceIcon}>{srv.icon}</div>
                <h3 className={cp.serviceTitle}>{srv.title}</h3>
                <p className={cp.serviceDesc}>{srv.desc}</p>
              </div>

              {srv.actionLink.startsWith('#') ? (
                <a href={srv.actionLink} className={cp.serviceLink}>
                  {srv.actionText}
                </a>
              ) : (
                <Link to={srv.actionLink} className={cp.serviceLink}>
                  {srv.actionText}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Confidential Intake Form */}
        <div id="book-session" className={cp.bookingBox}>
          <div className={cp.bookingGrid}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
                Safe & Confidential
              </span>
              <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 1rem' }}>
                Book a Confidential Counselling Session
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Whether you are navigating anxiety, relationship challenges, career decisions, or processing trauma — our certified female clinical psychologists are here to listen with unconditional empathy.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#374151' }}>
                <div>🔒 <strong>100% Confidential:</strong> We adhere to strict HIPAA & APA privacy codes.</div>
                <div>💬 <strong>Free First Assessment:</strong> 30-minute intake session at zero cost.</div>
                <div>🌸 <strong>Online or In-Person:</strong> Tele-counseling available pan-India.</div>
              </div>
            </div>

            <div>
              {formDone ? (
                <div style={{ padding: '2.5rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌸</div>
                  <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', color: '#065F46', marginBottom: '0.5rem' }}>Intake Request Received</h3>
                  <p style={{ fontSize: '0.88rem', color: '#047857' }}>
                    A counselor coordinator will reach out to you discreetly via your preferred contact mode within 24 hours.
                  </p>
                  <button onClick={() => setFormDone(false)} style={{ marginTop: '1.25rem', padding: '0.45rem 1.25rem', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setFormDone(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Name or Preferred Alias</label>
                    <input required type="text" placeholder="e.g. Meera (Alias ok)" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Area of Support</label>
                    <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}>
                      <option>Anxiety, Stress & Overthinking</option>
                      <option>Depression & Loss of Motivation</option>
                      <option>Trauma, Domestic Coercion & Recovery</option>
                      <option>Self-Worth, Boundaries & Career Guidance</option>
                      <option>Other / Just Need Someone to Talk To</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email Address</label>
                      <input required type="email" placeholder="you@email.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Phone / WhatsApp</label>
                      <input required type="tel" placeholder="+91..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                  </div>

                  <button type="submit" style={{ padding: '0.85rem', background: '#3D5A45', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                    Request Safe Callback →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
