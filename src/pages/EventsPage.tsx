import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import ep from './EventsPage.module.css'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'

gsap.registerPlugin(ScrollTrigger)

interface EventItem {
  id: string
  title: string
  type: 'CAMP' | 'WEBINAR' | 'SEMINAR' | 'WORKSHOP'
  category: string
  day: string
  month: string
  year: string
  time: string
  location: string
  mode: string
  price: string
  seats: string
  desc: string
  accent: string
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Aaryaveera 3-Day Residential Self-Defense Camp',
    type: 'CAMP',
    category: 'Mardini · Warrior Spirit',
    day: '15-17',
    month: 'Dec',
    year: '2026',
    time: '6:00 AM – 7:00 PM',
    location: 'Shakti Prangan, Nagpur, Maharashtra',
    mode: 'In-Person (Residential)',
    price: '₹1,200',
    seats: '24 seats left',
    desc: 'Intensive immersion in Lathi-Kaushal, hand-to-hand combat defense, tactical situational awareness, and Dharmic character discipline.',
    accent: '#DC143C',
  },
  {
    id: 'ev-2',
    title: 'Shakti Varta: True Masculinity & The Guardian Ideal',
    type: 'WEBINAR',
    category: 'Shakti Varta · Discourse',
    day: '22',
    month: 'Dec',
    year: '2026',
    time: '5:30 PM – 7:30 PM IST',
    location: 'Live on Zoom / Encrypted Portal',
    mode: 'Online Interactive',
    price: 'FREE',
    seats: 'Open Registration',
    desc: 'Scholarly panel exploring Paurush in ancient Bharatiya thought versus toxic modern constructs, featuring historians, philosophers, and sociologists.',
    accent: '#3D5A45',
  },
  {
    id: 'ev-3',
    title: 'Traditional Lathi-Kaushal & Staff Combat Masterclass',
    type: 'WORKSHOP',
    category: 'Martial Heritage',
    day: '05-07',
    month: 'Jan',
    year: '2027',
    time: '8:00 AM – 1:00 PM',
    location: 'District Sports Complex, Amravati',
    mode: 'In-Person',
    price: '₹800',
    seats: '18 seats left',
    desc: 'Master the 24 fundamental footwork forms and defensive blocks of Maratha staff combat with certified Aaryaveera master trainers.',
    accent: '#C9A96E',
  },
  {
    id: 'ev-4',
    title: 'Aaryaveera 5-Day Leadership & Fearlessness Immersion',
    type: 'CAMP',
    category: 'Aaryaveera Certification',
    day: '20-24',
    month: 'Jan',
    year: '2027',
    time: 'Full Residential',
    location: 'Shivaji Hill Retreat, Pune, Maharashtra',
    mode: 'In-Person (Residential)',
    price: '₹2,500',
    seats: '12 seats left',
    desc: 'Advanced physical endurance, psychological crisis management, public speaking, and community mobilization for emerging female leaders.',
    accent: '#DC143C',
  },
  {
    id: 'ev-5',
    title: 'Shakti Bhava: Confidential Survivor Healing Circle',
    type: 'SEMINAR',
    category: 'Shakti Bhava · Healing',
    day: '08',
    month: 'Feb',
    year: '2027',
    time: '10:00 AM – 4:00 PM',
    location: 'Confidential Venue, Bandra, Mumbai',
    mode: 'In-Person (Verified)',
    price: '₹500 / CSR Waiver',
    seats: '15 participants max',
    desc: 'A sacred, confidential therapeutic space guided by licensed clinical trauma therapists, somatic healers, and elder survivor mentors.',
    accent: '#3D5A45',
  },
  {
    id: 'ev-6',
    title: 'Rural Outreach: Village Self-Reliance & Defense Drive',
    type: 'CAMP',
    category: 'Social Work Outreach',
    day: '15-17',
    month: 'Feb',
    year: '2027',
    time: '9:00 AM – 5:00 PM',
    location: 'Zilla Parishad Ground, Wardha Rural',
    mode: 'In-Person (Community)',
    price: 'FREE',
    seats: '150 villagers registered',
    desc: 'Full village defense camp funded by Sahyog CSR partners. Free distribution of training kits, legal awareness booklets, and nutrition guidance.',
    accent: '#C9A96E',
  },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CAMP' | 'WEBINAR' | 'SEMINAR' | 'WORKSHOP'>('ALL')
  const [bookedEvent, setBookedEvent] = useState<string | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const filteredEvents = activeTab === 'ALL'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(e => e.type === activeTab)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-event-card]', {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
      })
    }, pageRef)

    return () => ctx.revert()
  }, [activeTab])

  return (
    <main className={s.page} ref={pageRef}>
      {/* Hero Banner */}
      <div className={ep.hero}>
        <div className={ep.heroInner}>
          <Link to="/" className={ep.backLink}>← Back to Home</Link>
          <span className={ep.badge}>SRS Section 9 · Live Event Calendar</span>
          <h1 className={ep.title}>Events & Camps</h1>
          <p className={ep.hindiSubtitle}>कार्यक्रम और शिविर · Together On Ground</p>
          <p className={ep.desc}>
            From high-energy Aaryaveera warrior camps in rural districts to intellectually rigorous Shakti Varta symposia.
            Reserve your seat with domestic instant check-in, verified QR passes, and post-session archival access.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <div className={s.statCount}>85+</div>
          <div className={s.statLabel}>Events Conducted</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount}>12,400+</div>
          <div className={s.statLabel}>Attendees Certified</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount}>28</div>
          <div className={s.statLabel}>Districts Mobilized</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount}>100%</div>
          <div className={s.statLabel}>Verified QR Entry</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={s.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#DC143C', textTransform: 'uppercase' }}>Upcoming Schedule</span>
            <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>Live Event Calendar</h2>
          </div>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(['ALL', 'CAMP', 'WEBINAR', 'SEMINAR', 'WORKSHOP'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${ep.filterBtn} ${activeTab === tab ? ep.filterBtnActive : ''}`}
              >
                {tab === 'ALL' ? 'All Formats' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className={ep.eventsGrid}>
          {filteredEvents.map(item => (
            <div key={item.id} className={ep.eventCard} data-event-card>
              <div className={ep.eventTopStrip} style={{ background: item.accent }} />
              
              <div className={ep.eventHeader}>
                <span
                  className={ep.eventTypeBadge}
                  style={{
                    background: `${item.accent}15`,
                    color: item.accent,
                    border: `1px solid ${item.accent}30`
                  }}
                >
                  {item.type}
                </span>
                <div className={ep.eventDateBox}>
                  <div className={ep.eventDateDay}>{item.day}</div>
                  <div className={ep.eventDateMonth}>{item.month} {item.year}</div>
                </div>
              </div>

              <div className={ep.eventBody}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.category}
                </div>
                <h3 className={ep.eventTitle}>{item.title}</h3>
                
                <div className={ep.eventMeta}>
                  <div className={ep.metaItem}>
                    <GoogleIcon name="location_on" size={16} />
                    <span>{item.location}</span>
                  </div>
                  <div className={ep.metaItem}>
                    <GoogleIcon name="schedule" size={16} />
                    <span>{item.time}</span>
                  </div>
                  <div className={ep.metaItem}>
                    <GoogleIcon name="confirmation_number" size={16} />
                    <span style={{ color: item.seats.includes('left') ? '#DC143C' : '#059669', fontWeight: 600 }}>{item.seats}</span>
                  </div>
                </div>

                <p className={ep.eventDesc}>{item.desc}</p>
              </div>

              <div className={ep.eventFooter}>
                <div>
                  <div className={ep.priceVal}>{item.price}</div>
                  <div className={ep.priceLabel}>{item.mode}</div>
                </div>
                <button
                  className={ep.bookBtn}
                  onClick={() => {
                    setBookedEvent(item.title)
                    setTimeout(() => setBookedEvent(null), 3500)
                  }}
                >
                  Book Seat →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Toast */}
        {bookedEvent && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: '#111827',
            color: '#FFFFFF',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            border: '1px solid #DC143C',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ fontWeight: 700, color: '#E8C98A', marginBottom: '0.25rem' }}>Reservation Pending Domestic Checkout</div>
            <div style={{ fontSize: '0.85rem', color: '#E5E7EB' }}>Seat reserved for: <strong>{bookedEvent}</strong></div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.4rem' }}>*FCRA compliant domestic gateway (UPI / RuPay / NetBanking)</div>
          </div>
        )}

        {/* Aaryaveera Camp Series Feature Section (Crimson & Rose Red Signature Card) */}
        <div className={ep.campSeriesBox}>
          <div className={ep.campGrid}>
            <div>
              <span className={ep.campEyebrow}>
                Signature Format · Institutional & Rural
              </span>
              <h2 className={ep.campTitle}>
                The Aaryaveera Camp Series
              </h2>
              <p className={ep.campDesc}>
                We partner with high schools, universities, and rural gram panchayats to deliver intensive residential self-defense and character camps.
                Our syllabus blends martial discipline, psychological resilience, legal literacy, and physical readiness.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#inquire" className={ep.campCrimsonBtn}>
                  Request Camp for Your Institution →
                </a>
                <Link to="/courses" className={ep.campOutlineBtn}>
                  Explore Online LMS
                </Link>
              </div>
            </div>

            <div className={ep.campFeatures}>
              {/* 3-Day Essentials with Google Shield Icon */}
              <div className={ep.featureCard}>
                <div className={ep.featureIcon}>
                  <span className={ep.googleIcon}>shield</span>
                </div>
                <h4 className={ep.featureTitle}>3-Day Essentials</h4>
                <p className={ep.featureText}>Basic escape techniques, weapon disarming, voice projection, and situational hazard assessment.</p>
              </div>

              {/* 5-Day Warrior with Google Swords Icon */}
              <div className={ep.featureCard}>
                <div className={ep.featureIcon}>
                  <span className={ep.googleIcon}>swords</span>
                </div>
                <h4 className={ep.featureTitle}>5-Day Warrior</h4>
                <p className={ep.featureText}>Full Lathi-Kaushal combat training, stamina building, nocturnal awareness, and legal self-defense rights.</p>
              </div>

              {/* 7-Day Leadership with Google Fire Icon */}
              <div className={ep.featureCard}>
                <div className={ep.featureIcon}>
                  <span className={ep.googleIcon}>local_fire_department</span>
                </div>
                <h4 className={ep.featureTitle}>7-Day Leadership</h4>
                <p className={ep.featureText}>Residential train-the-trainer camp, psychological trauma release, emergency first-aid, and certification.</p>
              </div>

              {/* Encrypted QR Passes with Google QR Code Icon */}
              <div className={ep.featureCard}>
                <div className={ep.featureIcon}>
                  <span className={ep.googleIcon}>qr_code_scanner</span>
                </div>
                <h4 className={ep.featureTitle}>Encrypted QR Passes</h4>
                <p className={ep.featureText}>Automated gate scanning, student identity safety, verified guardian pickup, and digital attendance logs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Registration Process */}
        <div className={ep.stepsSection}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
            Hassle-Free & Secure
          </span>
          <h2 className={s.sectionTitle} style={{ marginTop: '0.4rem' }}>How Camp Registration Works</h2>
          
          <div className={ep.stepsGrid}>
            <div className={ep.stepCard}>
              <div className={ep.stepNum}>01</div>
              <h3 className={ep.stepTitle}>Select Camp & Venue</h3>
              <p className={ep.stepText}>Choose an upcoming date and physical venue suited to your region. Review the daily itinerary and trainer credentials.</p>
            </div>
            <div className={ep.stepCard}>
              <div className={ep.stepNum}>02</div>
              <h3 className={ep.stepTitle}>Domestic Payment</h3>
              <p className={ep.stepText}>Instant confirmation via UPI, NetBanking, or domestic debit/credit cards. CSR scholarship waivers available for rural participants.</p>
            </div>
            <div className={ep.stepCard}>
              <div className={ep.stepNum}>03</div>
              <h3 className={ep.stepTitle}>QR Pass & Preparation</h3>
              <p className={ep.stepText}>Receive an encrypted SMS & email pass with entry QR code, required attire guide, and access to preparatory video modules.</p>
            </div>
          </div>
        </div>

        {/* Institutional Inquiry Form */}
        <div id="inquire" style={{ marginTop: '5rem', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>Institutional Partnership</span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 1rem' }}>
              Host an Aaryaveera Camp at Your School or College
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '2rem' }}>
              We bring our master trainers, equipment, and certified curriculum directly to your campus. Fill in your details and our camp director will connect within 24 hours.
            </p>

            <form onSubmit={e => { e.preventDefault(); alert('Thank you! Our camp coordinator will contact you.') }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Institution / College Name</label>
                <input required type="text" placeholder="e.g. Government Girls Higher Secondary School" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>City / District</label>
                  <input required type="text" placeholder="e.g. Nagpur" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Est. Participants</label>
                  <input required type="number" placeholder="e.g. 150" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Official Contact Email / Phone</label>
                <input required type="text" placeholder="principal@college.edu.in / +91 98765 43210" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem 2rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Submit Camp Proposal Request →
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  )
}
