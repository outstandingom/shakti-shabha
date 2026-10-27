import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2, Minimize2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../lib/supabase'
import s from './PageLayout.module.css'
import cp from './CounsellingPage.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ServiceWheelItem {
  icon: string
  title: string
  desc: string
  actionText: string
  actionLink: string
  tags: string[]
  image: string
}

const WHEEL_SERVICES: ServiceWheelItem[] = [
  {
    icon: '🧠',
    title: 'Psychological Empowerment',
    desc: 'Mental wellbeing aur emotional growth ke liye expert guidance. Apne aap ko samjho, apni strength pehchano.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
    tags: ['Mental Health', 'Empowerment', 'Shakti Bhawah'],
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800',
  },
  {
    icon: '💬',
    title: 'Counselling Services',
    desc: 'Professional counsellors ke saath apni journey mein support paao. Ek safe space — sirf tumhare liye.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
    tags: ['Safe Space', 'Confidential', 'Therapy'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
  },
  {
    icon: '🎓',
    title: 'Webinars & Workshops',
    desc: 'Live interactive sessions — women empowerment, mental health, career growth par expert speakers ke saath.',
    actionText: 'Jaanein Aur →',
    actionLink: '/events',
    tags: ['Live Sessions', 'Workshops', 'Growth'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
  },
  {
    icon: '👥',
    title: 'Community Platform',
    desc: 'Like-minded Indian women ka ek judgment-free space. Share karo, suno, aur ek doosre se seekho.',
    actionText: 'Jaanein Aur →',
    actionLink: '/sahyog',
    tags: ['Sisterhood', 'Solidarity', 'Sahyog'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800',
  },
  {
    icon: '📚',
    title: 'Online Courses',
    desc: 'Women empowerment, Indian history, aur psychological wellness par comprehensive self-paced courses.',
    actionText: 'Jaanein Aur →',
    actionLink: '/courses',
    tags: ['LMS', 'History', 'Self-Paced'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800',
  },
  {
    icon: '🌿',
    title: 'Healthy Lifestyle',
    desc: 'Holistic wellness — physical, mental, aur spiritual. Balanced life ke liye practical guidance.',
    actionText: 'Jaanein Aur →',
    actionLink: '#book-session',
    tags: ['Holistic', 'Mindfulness', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800',
  },
  {
    icon: '⚔️',
    title: 'Our Revolution',
    desc: 'Social change ke liye ek platform. Campaigns, petitions, aur collective action — milke awaaz uthao.',
    actionText: 'Jaanein Aur →',
    actionLink: '/aaryaveera',
    tags: ['Mardini', 'Aaryaveera', 'Action'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800',
  },
  {
    icon: '🎙️',
    title: 'Podcasts & Media',
    desc: 'Inspiring conversations, historical investigations, aur motivational content — on-the-go sunte rehno.',
    actionText: 'Jaanein Aur →',
    actionLink: '/aaryaveera',
    tags: ['Shakti Varta', 'Podcasts', 'Audio'],
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800',
  },
  {
    icon: '⭐',
    title: 'Testimonials',
    desc: 'Unki kahaniyaan jo Shakti Sabha ke saath badli hain. Real stories, real transformation.',
    actionText: 'Padhein →',
    actionLink: '/about',
    tags: ['Real Stories', 'Transformation', 'About'],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800',
  },
]

export default function CounsellingPage() {
  const [formDone, setFormDone] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    concern: 'Anxiety, Stress & Overthinking',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isWheelActive, setIsWheelActive] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const wheelWrapperRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)

  const totalCards = WHEEL_SERVICES.length
  const SPREAD_X = 0.16
  const SPREAD_Y = 0.28
  const ROTATE = 4
  const SKEW = -2
  const SCALE_MIN = 0.7

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = wheelWrapperRef.current
    if (!section || !wrapper || totalCards === 0) return

    const updateCards = (progress: number) => {
      const current = progress * (totalCards - 1)
      const activeIdx = Math.min(totalCards - 1, Math.max(0, Math.round(current)))
      setActiveCardIndex(activeIdx)

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const offset = index - current
        const absOffset = Math.abs(offset)
        const spreadX = -offset * window.innerWidth * SPREAD_X
        const spreadY = offset * window.innerHeight * SPREAD_Y
        const rotateZ = offset * ROTATE
        const skewY = offset * SKEW
        const scale = Math.max(SCALE_MIN, 1 - absOffset * 0.08)

        if (absOffset > 2.2) {
          card.style.opacity = '0'
          card.style.pointerEvents = 'none'
          return
        }

        const opacity = absOffset > 1.8 ? 0 : Math.max(0, 1 - absOffset * 0.45)
        card.style.pointerEvents = absOffset < 0.4 ? 'auto' : 'none'
        card.style.transform = `
          translate3d(${spreadX}px, ${spreadY}px, 0)
          rotate(${rotateZ}deg)
          skewY(${skewY}deg)
          scale(${scale})
        `
        card.style.opacity = String(opacity)
        card.style.zIndex = String(Math.round(100 - absOffset * 20))
      })
    }

    // Initialize cards on load
    updateCards(0)

    // Calculate total pinning scroll distance
    const pinDistance = window.innerHeight * (totalCards - 1) * 0.85

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${pinDistance}`,
        pin: wrapper,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.2,
        onToggle: (self) => {
          setIsWheelActive(self.isActive)
        },
        onUpdate: (self) => {
          updateCards(self.progress)
        },
      })
      triggerRef.current = st
    }, section)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      clearTimeout(timer)
      ctx.revert()
      triggerRef.current = null
    }
  }, [totalCards])

  // Scroll directly to a specific card when dot indicator is clicked
  const scrollToCard = (index: number) => {
    const st = triggerRef.current
    if (!st) return
    const targetScroll = st.start + (index / (totalCards - 1)) * (st.end - st.start)

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  return (
    <main className={cp.page}>
      {/* ── Hero Banner ── */}
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

      {/* ── Section Title ── */}
      <div className={cp.introBar}>
        <span className={cp.introEyebrow}>Comprehensive Support Architecture</span>
        <h2 className={cp.introHeading}>Shakti Sabha Mein Kya Milega</h2>
        <p className={cp.introSubtext}>
          Scroll through our 3D interactive support wheel below to explore each dedicated service.
        </p>
      </div>

      {/* ── Fixed Right-Side Indicator Dots ── */}
      <div
        className={`${cp.indicator} ${isWheelActive ? '' : cp.indicatorHidden}`}
        aria-label="Timeline navigation"
      >
        {WHEEL_SERVICES.map((_, idx) => (
          <div
            key={idx}
            className={`${cp.dot} ${activeCardIndex === idx ? cp.dotActive : ''}`}
            onClick={() => scrollToCard(idx)}
            title={WHEEL_SERVICES[idx].title}
          />
        ))}
      </div>

      {/* ── 3D Card Wheel Section (#2 Accordéon asymétrique) ── */}
      <section className={cp.scrollContainer} ref={sectionRef}>
        <div className={cp.wheelWrapper} ref={wheelWrapperRef}>
          {WHEEL_SERVICES.map((item, idx) => (
            <div
              key={idx}
              className={cp.card}
              data-index={idx}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
            >
              <div className={cp.cardInner}>
                {/* Left: Phone Mockup Frame */}
                <div className={cp.cardImage}>
                  <div className={cp.phoneMockup}>
                    <div className={cp.phoneScreen}>
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                  </div>
                </div>

                {/* Right: Card Content */}
                <div className={cp.cardContent}>
                  <div className={cp.cardIcon}>{item.icon}</div>
                  <h2>{item.title}</h2>
                  <p>{item.desc}</p>

                  {item.actionLink.startsWith('#') ? (
                    <a href={item.actionLink} className={cp.cardActionBtn}>
                      <span>{item.actionText}</span>
                    </a>
                  ) : (
                    <Link to={item.actionLink} className={cp.cardActionBtn}>
                      <span>{item.actionText}</span>
                    </Link>
                  )}

                  <div className={cp.tags}>
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={cp.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fullscreen Toggle Button ── */}
      <button
        type="button"
        className={cp.fullscreenBtn}
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      {/* ── Confidential Intake Booking Box (Preserved) ── */}
      <div className={s.section}>
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
                  <button onClick={() => { setFormDone(false); setFormData({ name: '', concern: 'Anxiety, Stress & Overthinking', email: '', phone: '', message: '' }) }} style={{ marginTop: '1.25rem', padding: '0.45rem 1.25rem', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Submit Another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async e => {
                    e.preventDefault()
                    setSubmitting(true)
                    try {
                      await supabase.from('counselling_requests').insert([{
                        name: formData.name,
                        concern: formData.concern,
                        email: formData.email,
                        phone: formData.phone,
                        message: formData.message || '',
                        status: 'pending'
                      }])
                    } catch (err) {
                      console.warn('Counselling submission error:', err)
                    } finally {
                      setSubmitting(false)
                      setFormDone(true)
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Name or Preferred Alias</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Meera (Alias ok)"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Area of Support</label>
                    <select
                      value={formData.concern}
                      onChange={e => setFormData(prev => ({ ...prev, concern: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', background: '#FFFFFF' }}
                    >
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
                      <input
                        required
                        type="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Phone / WhatsApp</label>
                      <input
                        required
                        type="tel"
                        placeholder="+91..."
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Brief Message / Notes (Optional)</label>
                    <textarea
                      placeholder="Any specific timings or questions..."
                      rows={2}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: '0.85rem', background: '#3D5A45', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Request Safe Callback →'}
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
