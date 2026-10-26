import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import h from './HistoryPage.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/* Data                                                                  */
/* ------------------------------------------------------------------ */

interface HistoricalWarrior {
  id: string
  icon: string
  name: string
  years: string
  quote: string
  desc: string
  bio: string
  footnote: number
  gradient: string
  accentColor: string
}

interface SuccessGirl {
  id: string
  icon: string
  name: string
  role: string
  story: string
  cardColor: string
  textColor: string
}

interface VideoCard {
  id: string
  title: string
  subtitle: string
  duration: string
  thumb: string
}

const WARRIORS: HistoricalWarrior[] = [
  {
    id: 'lakshmibai',
    icon: '👑',
    name: 'Rani Lakshmibai',
    years: '1828 – 1858',
    quote: 'Meri Jhansi nahi doongi.',
    desc: 'The Lion of Jhansi. Refused to surrender. Fought British forces personally on the battlefield, mounted and sword in hand, until her final breath.',
    bio: 'Born Manikarnika Tambe, Lakshmibai became queen of Jhansi at 18. When the British annexed her kingdom under the Doctrine of Lapse, she refused submission. She personally led cavalry charges in the 1857 uprising and died on the battlefield at 30 — the most iconic warrior of India\'s first war of independence.',
    footnote: 1,
    gradient: 'linear-gradient(135deg, #92400E 0%, #B45309 40%, #D97706 100%)',
    accentColor: '#F59E0B',
  },
  {
    id: 'chennamma',
    icon: '⚔',
    name: 'Kittur Chennamma',
    years: '1778 – 1829',
    quote: 'I will not submit to a foreign yoke.',
    desc: 'Led one of the first armed rebellions against British rule in Karnataka. A warrior queen who captured two British officers and never surrendered her spirit.',
    bio: 'Kittur Chennamma was queen of Kittur, a small but fiercely independent princely state in Karnataka. In 1824 — 33 years before 1857 — she led an armed uprising against the East India Company, capturing two senior British political officers. Though eventually defeated, she remained a prisoner of conscience until her death, never recanting her defiance.',
    footnote: 2,
    gradient: 'linear-gradient(135deg, #3B0764 0%, #6D28D9 40%, #8B5CF6 100%)',
    accentColor: '#A78BFA',
  },
  {
    id: 'anandibai',
    icon: '🔬',
    name: 'Anandibai Joshi',
    years: '1865 – 1887',
    quote: 'If I die without achieving my goal, others will be inspired to take it up.',
    desc: "India's first woman doctor. Fought social norms, crossed oceans, and became a physician at 21. Died young — but changed history forever.",
    bio: 'Married at 9, widowed at 14 from her first child, Anandibai Joshi made a radical decision: become a doctor. She wrote to a church in New Jersey seeking help, sailed to America alone in 1883, and earned her medical degree from the Woman\'s Medical College of Pennsylvania in 1886 — becoming the first Hindu woman to obtain a western medical degree. She returned to India with tuberculosis and died weeks later, but her courage opened the door for thousands after her.',
    footnote: 3,
    gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
    accentColor: '#34D399',
  },
  {
    id: 'pandit',
    icon: '📜',
    name: 'Vijayalakshmi Pandit',
    years: '1900 – 1990',
    quote: 'The more we sweat in peace, the less we bleed in war.',
    desc: 'First woman president of the UN General Assembly. Diplomat, freedom fighter, trailblazer who represented free India on the world stage.',
    bio: 'Sister of Jawaharlal Nehru, Vijayalakshmi Pandit was imprisoned three times by the British for her role in India\'s independence movement. After independence she became India\'s first woman ambassador, served in Moscow, Washington and London, and in 1953 was elected President of the United Nations General Assembly — the first woman ever to hold that position. She shattered the glass ceiling of international diplomacy.',
    footnote: 4,
    gradient: 'linear-gradient(135deg, #881337 0%, #BE185D 40%, #EC4899 100%)',
    accentColor: '#F9A8D4',
  },
]

const SUCCESS_GIRLS: SuccessGirl[] = [
  {
    id: 'ritu',
    icon: '🚀',
    name: 'Ritu S.',
    role: 'IAS Topper',
    story: 'From a Nagpur village with no electricity, to clearing UPSC at age 24. Shakti Sabha\'s leadership programme was her turning point — "they told me I could think, not just obey."',
    cardColor: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'meera',
    icon: '🏅',
    name: 'Meera K.',
    role: 'National Athlete',
    story: 'Trained in Lathi-Kaushal at our camp at age 15. Today she represents Maharashtra in national martial arts championships — "the staff taught me that strength is discipline."',
    cardColor: 'linear-gradient(135deg, #C2410C 0%, #F97316 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'anjali',
    icon: '💻',
    name: 'Anjali P.',
    role: 'Tech Entrepreneur',
    story: 'Joined Shakti Sabha\'s digital literacy workshops at 19. Now runs a 12-person tech startup. Revenue: ₹40L in Year 1 — "they gave me permission to be ambitious."',
    cardColor: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'kavya',
    icon: '🎨',
    name: 'Kavya R.',
    role: 'Artist & Activist',
    story: 'Used art therapy from Shakti Bhava healing circle to process trauma. Now exhibits nationally and funds girls\' education — "art became my voice when words failed."',
    cardColor: 'linear-gradient(135deg, #0E7490 0%, #06B6D4 100%)',
    textColor: '#FFFFFF',
  },
]

const VIDEOS: VideoCard[] = [
  {
    id: 'ritu-video',
    title: 'Her Voice · Her Story',
    subtitle: "Ritu's IAS Journey",
    duration: '8 min',
    thumb: 'https://picsum.photos/seed/v-ritu/600/340',
  },
  {
    id: 'meera-video',
    title: "The Warrior's Path",
    subtitle: "Meera's Sports Story",
    duration: '6 min',
    thumb: 'https://picsum.photos/seed/v-meera/600/340',
  },
  {
    id: 'anjali-video',
    title: 'Code & Courage',
    subtitle: "Anjali's Startup Story",
    duration: '5 min',
    thumb: 'https://picsum.photos/seed/v-anjali/600/340',
  },
]

/* ------------------------------------------------------------------ */
/* Component                                                             */
/* ------------------------------------------------------------------ */

export default function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const warriorsRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const videosRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  const [formState, setFormState] = useState({ name: '', storyTitle: '', contact: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero entrance */
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('[data-hero-child]'), {
          opacity: 0,
          y: 28,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
        })
      }

      /* Warriors cards stagger */
      if (warriorsRef.current) {
        gsap.from(warriorsRef.current.querySelectorAll('[data-warrior]'), {
          scrollTrigger: { trigger: warriorsRef.current, start: 'top 78%' },
          opacity: 0,
          y: 40,
          scale: 0.95,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
        })
      }

      /* Success girls */
      if (successRef.current) {
        gsap.from(successRef.current.querySelectorAll('[data-success]'), {
          scrollTrigger: { trigger: successRef.current, start: 'top 80%' },
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power2.out',
        })
      }

      /* Videos */
      if (videosRef.current) {
        gsap.from(videosRef.current.querySelectorAll('[data-video]'), {
          scrollTrigger: { trigger: videosRef.current, start: 'top 82%' },
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      /* CTA */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className={h.page}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div
        className={h.banner}
        style={{
          background: 'linear-gradient(135deg, #8B0057 0%, #C2185B 40%, #E91E8C 70%, #FF4081 100%)',
        }}
        ref={heroRef}
      >
        {/* Floating decorative elements */}
        <div className={h.floatEmoji} style={{ top: '12%', left: '6%', animationDelay: '0s' }}>⚔</div>
        <div className={h.floatEmoji} style={{ top: '25%', right: '8%', animationDelay: '1.2s' }}>👑</div>
        <div className={h.floatEmoji} style={{ bottom: '15%', left: '12%', animationDelay: '0.6s' }}>🌸</div>
        <div className={h.floatEmoji} style={{ bottom: '20%', right: '5%', animationDelay: '1.8s' }}>🔬</div>

        <div className={h.bannerInner}>
          <Link to="/" className={s.back} data-hero-child>← Back to Home</Link>
          <span className={h.bannerEyebrow} data-hero-child>
            Historical Warriors · Today's Success Girls
          </span>
          <h1 className={h.bannerTitle} data-hero-child>Her Story Is History</h1>
          <p className={h.bannerHindi} data-hero-child>
            इतिहास की वीरांगनाएँ और आज की सफल बेटियाँ
          </p>
          <p className={h.bannerDesc} data-hero-child>
            From ancient Rajputana to modern Maharashtra — the spirit of the warrior woman lives on
          </p>
        </div>
      </div>

      {/* ── Historical Women Warriors ────────────────────────────── */}
      <section className={h.section}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <h2 className={h.sectionTitle}>🏛 Historical Women Warriors of India</h2>
            <p className={h.sectionSubtitle}>
              Their courage wrote history. We carry it forward.
            </p>
          </div>

          <div className={h.warriorsGrid} ref={warriorsRef}>
            {WARRIORS.map((w) => (
              <div
                key={w.id}
                className={h.warriorCard}
                data-warrior
                style={{ background: w.gradient }}
                onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedId(expandedId === w.id ? null : w.id)}
                aria-expanded={expandedId === w.id}
              >
                <div className={h.warriorIcon}>{w.icon}</div>
                <div className={h.warriorMeta}>
                  <h3 className={h.warriorName}>
                    {w.name}
                    <sup className={h.footnoteRef}>[{w.footnote}]</sup>
                  </h3>
                  <div className={h.warriorYears} style={{ color: w.accentColor }}>{w.years}</div>
                </div>
                <blockquote className={h.warriorQuote}>"{w.quote}"</blockquote>
                <p className={h.warriorDesc}>{w.desc}</p>

                {/* Expanded biography */}
                <div className={`${h.warriorBio} ${expandedId === w.id ? h.warriorBioOpen : ''}`}>
                  <div className={h.warriorBioInner}>
                    <p>{w.bio}</p>
                  </div>
                </div>

                <div className={h.warriorExpandHint}>
                  {expandedId === w.id ? '↑ Less' : '↓ Read biography'}
                </div>
              </div>
            ))}
          </div>

          {/* Footnotes */}
          <div className={h.footnotes}>
            <h4 className={h.footnotesTitle}>Sources & References</h4>
            <ol className={h.footnoteList}>
              <li>National Archives of India, Jhansi Revolt Records, 1858</li>
              <li>Karnataka State Gazetteer, Kittur Division Records</li>
              <li>Women's Medical College of Pennsylvania Archives, 1886</li>
              <li>United Nations Official Records, 1953</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ── Today's Success Girls ────────────────────────────────── */}
      <section className={h.successSection}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <h2 className={h.sectionTitle}>🌟 Today's Success Girls</h2>
            <p className={h.sectionSubtitle}>
              Shakti Sabha's own — women who rose from challenge to triumph
            </p>
          </div>

          <div className={h.successGrid} ref={successRef}>
            {SUCCESS_GIRLS.map((g) => (
              <div
                key={g.id}
                className={h.successCard}
                data-success
                style={{ background: g.cardColor, color: g.textColor }}
              >
                <div className={h.successIcon}>{g.icon}</div>
                <div className={h.successRole}>{g.role}</div>
                <h3 className={h.successName}>{g.name}</h3>
                <p className={h.successStory}>{g.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Testimonials ───────────────────────────────────── */}
      <section className={h.videoSection}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <h2 className={h.sectionTitle}>🎬 Video Testimonials</h2>
            <p className={h.sectionSubtitle}>
              In their own words — unscripted, unfiltered, unforgettable
            </p>
          </div>

          <div className={h.videoGrid} ref={videosRef}>
            {VIDEOS.map((v) => (
              <div key={v.id} className={h.videoCard} data-video>
                <div className={h.videoThumbWrap}>
                  <img
                    src={v.thumb}
                    alt={v.subtitle}
                    className={h.videoThumb}
                    loading="lazy"
                  />
                  <div className={h.videoOverlay}>
                    <div className={h.playBtn} aria-label={`Play: ${v.subtitle}`}>▶</div>
                  </div>
                  <span className={h.videoDuration}>{v.duration}</span>
                </div>
                <div className={h.videoInfo}>
                  <div className={h.videoSeriesTitle}>{v.title}</div>
                  <div className={h.videoSubtitle}>{v.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Share a Story CTA ────────────────────────────────────── */}
      <section className={h.ctaSection} ref={ctaRef}>
        <div className={h.sectionInner}>
          <div className={h.ctaCard}>
            <h2 className={h.ctaTitle}>Know a Success Story?</h2>
            <p className={h.ctaDesc}>
              Share it with us — every story of triumph deserves to be heard and celebrated.
            </p>

            {submitted ? (
              <div className={h.ctaSuccess}>
                ✅ Thank you! We've received your story and will be in touch soon.
              </div>
            ) : (
              <form className={h.ctaForm} onSubmit={handleFormSubmit} noValidate>
                <div className={h.ctaFormRow}>
                  <div className={h.ctaField}>
                    <label className={h.ctaLabel} htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={h.ctaInput}
                      value={formState.name}
                      onChange={handleFormChange}
                      placeholder="Priya Sharma"
                      required
                    />
                  </div>
                  <div className={h.ctaField}>
                    <label className={h.ctaLabel} htmlFor="storyTitle">Story Title</label>
                    <input
                      id="storyTitle"
                      name="storyTitle"
                      type="text"
                      className={h.ctaInput}
                      value={formState.storyTitle}
                      onChange={handleFormChange}
                      placeholder="From Village to Victory"
                      required
                    />
                  </div>
                  <div className={h.ctaField}>
                    <label className={h.ctaLabel} htmlFor="contact">Contact (Email / Phone)</label>
                    <input
                      id="contact"
                      name="contact"
                      type="text"
                      className={h.ctaInput}
                      value={formState.contact}
                      onChange={handleFormChange}
                      placeholder="priya@example.com"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className={h.ctaSubmitBtn}>
                  Share Your Story →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
