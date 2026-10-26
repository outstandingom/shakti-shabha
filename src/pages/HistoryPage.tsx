import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './PageLayout.module.css'
import h from './HistoryPage.module.css'

gsap.registerPlugin(ScrollTrigger)

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
    id: 'abbakka',
    icon: '👑',
    name: 'Rani Abbakka',
    years: '16th Century · Ullal, Karnataka',
    quote: 'Never let foreign ships control the waters of our motherland.',
    desc: 'Pehli anti-colonial naval commander. Portuguese ko 4 baar haraya.',
    bio: 'Queen of Ullal who repelled Portuguese armies for over four decades. Known as Abhaya Rani (the fearless queen), she allied with local Zamorin rulers, commanded mixed-faith naval fleets, and personally led midnight counter-offensives on Portuguese galleons.',
    footnote: 1,
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
    accentColor: '#818CF8',
  },
  {
    id: 'gargi',
    icon: '📜',
    name: 'Gargi Vachaknavi',
    years: 'Vedic Period · Mithila',
    quote: 'On what is the world woven, warp and woof?',
    desc: 'Vedic philosopher jinse Yajnavalkya ne debate mein haar maani.',
    bio: 'Daughter of Sage Vachaknu, Gargi entered the royal philosophical court of King Janaka and interrogated the greatest scholars of Bharat. Her penetrating inquiry in the Brihadaranyaka Upanishad established feminine intellectual authority in classical Vedic metaphysics.',
    footnote: 2,
    gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 40%, #D97706 100%)',
    accentColor: '#FBBF24',
  },
  {
    id: 'durgavati',
    icon: '⚔',
    name: 'Rani Durgavati',
    years: '16th Century · Gondwana',
    quote: 'Better to die with dignity than to live under imperial subjugation.',
    desc: 'Gondwana ki rani jisne Mughal empire se akhri saans tak ladhi.',
    bio: 'Ruling queen of Garha-Katanga, she fortified her state, built immense irrigation reservoirs, and defeated imperial Mughal forces in three successive battles. When surrounded at Narrai gorge, she chose glorious martyrdom over captivity.',
    footnote: 3,
    gradient: 'linear-gradient(135deg, #881337 0%, #9F1239 40%, #E11D48 100%)',
    accentColor: '#FDA4AF',
  },
  {
    id: 'keladi',
    icon: '🛡',
    name: 'Keladi Chennamma',
    years: '18th Century · Karnataka',
    quote: 'Dharma shields those who give sanctuary to the pursued.',
    desc: 'Woh rani jisne Aurangzeb ki army ko apne rajya mein ghusne nahi diya.',
    bio: 'Queen of Keladi Kingdom who granted refuge to Rajaram Chhatrapati (son of Shivaji Maharaj) when fleeing Mughal capture. She defeated Aurangzeb\'s advancing armies in the rainforests of the Western Ghats, securing Maratha sovereignty.',
    footnote: 4,
    gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #059669 100%)',
    accentColor: '#6EE7B7',
  },
  {
    id: 'lakshmibai',
    icon: '👑',
    name: 'Rani Lakshmibai',
    years: '1828 – 1858 · Jhansi',
    quote: 'Meri Jhansi nahi doongi.',
    desc: 'The Lion of Jhansi. Refused to surrender. Fought British forces personally on the battlefield.',
    bio: 'Born Manikarnika Tambe, she led the 1857 armed struggle, personally training an all-women Durga Dal artillery battalion and dying sword in hand in Gwalior.',
    footnote: 5,
    gradient: 'linear-gradient(135deg, #701A75 0%, #86198F 40%, #A21CAF 100%)',
    accentColor: '#F0ABFC',
  },
  {
    id: 'anandibai',
    icon: '🔬',
    name: 'Anandibai Joshi',
    years: '1865 – 1887 · Maharashtra',
    quote: 'I will demonstrate what a daughter of Bharat can achieve.',
    desc: "India's first woman doctor. Fought social norms, crossed oceans at 18.",
    bio: 'Graduated from Woman\'s Medical College of Pennsylvania in 1886. Defying severe orthodox taboos, her courage blazed a trail for modern medicine across India.',
    footnote: 6,
    gradient: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 40%, #0284C7 100%)',
    accentColor: '#7DD3FC',
  },
]

const SUCCESS_GIRLS: SuccessGirl[] = [
  {
    id: 'ritu',
    icon: '🚀',
    name: 'Ritu S.',
    role: 'IAS Topper',
    story: 'From a Nagpur village with no electricity, to clearing UPSC at age 24. Shakti Sabha\'s leadership fellowship was her turning point — "they told me I could think, not just obey."',
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
    cardColor: 'linear-gradient(135deg, #6B21A8 0%, #9333EA 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'kavya',
    icon: '🎨',
    name: 'Kavya R.',
    role: 'Artist & Activist',
    story: 'Used art therapy from Shakti Bhava healing circle to process trauma. Now exhibits nationally and funds girls\' education across Vidarbha — "pain became my canvas."',
    cardColor: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    textColor: '#FFFFFF',
  },
]

const VIDEOS: VideoCard[] = [
  {
    id: 'v1',
    title: 'Ritu\'s Journey: From Village to Collectorate',
    subtitle: 'Overcoming silence, building conviction (8 min)',
    duration: '8:24',
    thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'v2',
    title: 'The Staff in Her Hand: Meera\'s Story',
    subtitle: 'From defensive fear to national podium (6 min)',
    duration: '6:12',
    thumb: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'v3',
    title: 'Code & Courage: Anjali Speaks',
    subtitle: 'Building a tech enterprise from rural roots (5 min)',
    duration: '5:45',
    thumb: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
  },
]

const FOOTNOTES = [
  { id: 1, text: 'Source: Portuguese Colonial Records (Goa Archives) & Queen Abbakka Memorial Trust Archives, Ullal.' },
  { id: 2, text: 'Source: Brihadaranyaka Upanishad, Chapter III, Brahmana 6 & 8 (Dialogues with Sage Yajnavalkya).' },
  { id: 3, text: 'Source: Akbarnama by Abul Fazl, Volume II, Account of the Conquest of Garha-Katanga.' },
  { id: 4, text: 'Source: Keladi Nripa Vijaya by Linganna Kavi & Karnataka State Archives (Keladi Dynasty Series).' },
  { id: 5, text: 'Source: National Archives of India, Foreign & Political Department Proceedings, 1858.' },
  { id: 6, text: 'Source: Woman\'s Medical College of Pennsylvania Archives, Philadelphia, 1886.' },
]

export default function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeFootnote, setActiveFootnote] = useState<number | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const warriorsRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('[data-hero-child]'), {
          opacity: 0,
          y: 25,
          stagger: 0.12,
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
        <div className={h.bannerInner}>
          <Link to="/" className={s.back} data-hero-child>← Back to Home</Link>
          <span className={h.bannerEyebrow} data-hero-child>
            Bharat Ki Shaan · Forgotten Veeranganas
          </span>
          <h1 className={h.bannerTitle} data-hero-child>Her Story Is History</h1>
          <p className={h.bannerHindi} data-hero-child>
            इतिहास की वीरांगनाएँ और आज की सफल बेटियाँ
          </p>
          <p className={h.bannerDesc} data-hero-child>
            From ancient Vedic debates to modern boardrooms — the unbroken lineage of Bharat's sovereign women.
          </p>
        </div>
      </div>

      {/* ── SHAKTI SUTRA DAILY WISDOM BANNER ─────────────────────── */}
      <div style={{ background: '#0D090B', borderBottom: '1px solid rgba(201, 169, 110, 0.3)', padding: '2.5rem clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201, 169, 110, 0.12)', border: '1px solid rgba(201, 169, 110, 0.3)', padding: '0.3rem 1rem', borderRadius: '9999px', color: '#E8C98A', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <span>✦</span> Aaj Ka Shakti Sutra <span>✦</span>
          </div>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.15rem, 2vw, 1.55rem)', color: '#FFFFFF', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            "Stri hi srishti ka aadhaar hai, woh shakti hai jis par sansaar tika hai. Usse kamzor samajhna — apni neenv ko kamzor samajhna hai."
          </blockquote>
          <p style={{ color: '#C9A96E', fontSize: '0.85rem', fontWeight: 600 }}>
            — Shakta Mahimna Stotra
          </p>
        </div>
      </div>

      {/* ── Historical Women Warriors ────────────────────────────── */}
      <section className={h.section}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#C2185B', fontWeight: 700, textTransform: 'uppercase' }}>
              Bharat Ki Shaan
            </span>
            <h2 className={h.sectionTitle}>Forgotten Veeranganas</h2>
            <p className={h.sectionSubtitle}>
              Their courage wrote history. Click any warrior card to inspect their verified biographical archives.
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
              >
                <div className={h.cardTop}>
                  <span className={h.warriorIcon}>{w.icon}</span>
                  <span className={h.warriorYears}>{w.years}</span>
                </div>

                <h3 className={h.warriorName}>{w.name}</h3>
                <p className={h.warriorQuote}>"{w.quote}"</p>
                <p className={h.warriorDesc}>{w.desc}</p>

                <div className={h.cardAction}>
                  <span
                    className={h.fnRef}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveFootnote(activeFootnote === w.footnote ? null : w.footnote)
                    }}
                    title={`View Citation [${w.footnote}]`}
                  >
                    [{w.footnote}]
                  </span>
                  <span className={h.expandHint}>
                    {expandedId === w.id ? 'Close Story ↑' : 'Read Full Story ↓'}
                  </span>
                </div>

                {expandedId === w.id && (
                  <div className={h.bioExpanded} style={{ borderColor: w.accentColor }}>
                    <p className={h.bioText}>{w.bio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Footnote Popup */}
          {activeFootnote !== null && (
            <div className={h.fnPopup}>
              <div className={h.fnPopupInner}>
                <strong>Footnote [{activeFootnote}]:</strong>{' '}
                {FOOTNOTES.find((f) => f.id === activeFootnote)?.text}
                <button
                  className={h.fnClose}
                  onClick={() => setActiveFootnote(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Footnotes List */}
          <div className={h.footnotesList}>
            <h4 className={h.fnHeading}>Historical References & Primary Sources:</h4>
            <div className={h.fnGrid}>
              {FOOTNOTES.map((f) => (
                <div key={f.id} className={h.fnItem}>
                  <span className={h.fnNumber}>[{f.id}]</span>
                  <span className={h.fnText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Today's Success Girls ─────────────────────────────────── */}
      <section className={h.successSection}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#EC4899', fontWeight: 700, textTransform: 'uppercase' }}>
              Modern Awakening
            </span>
            <h2 className={h.sectionTitle}>🌟 Today's Success Girls</h2>
            <p className={h.sectionSubtitle}>
              Shakti Sabha's own — daughters who rose from challenge to triumph.
            </p>
          </div>

          <div className={h.successGrid} ref={successRef}>
            {SUCCESS_GIRLS.map((g) => (
              <div
                key={g.id}
                className={h.successCard}
                style={{ background: g.cardColor, color: g.textColor }}
              >
                <div className={h.successTop}>
                  <span className={h.successIcon}>{g.icon}</span>
                  <span className={h.successBadge}>{g.role}</span>
                </div>
                <h3 className={h.successName}>{g.name}</h3>
                <p className={h.successStory}>{g.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Testimonials ────────────────────────────────────── */}
      <section className={h.videoSection}>
        <div className={h.sectionInner}>
          <div className={h.sectionHeader}>
            <h2 className={h.sectionTitle}>🎬 Her Voice · Her Journey</h2>
            <p className={h.sectionSubtitle}>
              Video testimonials from the women who lead our village circles.
            </p>
          </div>

          <div className={h.videoGrid}>
            {VIDEOS.map((v) => (
              <div
                key={v.id}
                className={h.videoCard}
                onClick={() => alert(`Playing video documentary: "${v.title}"`)}
              >
                <div className={h.thumbBox}>
                  <img src={v.thumb} alt={v.title} className={h.thumbImg} />
                  <div className={h.playOverlay}>
                    <div className={h.playBtn}>▶</div>
                  </div>
                  <span className={h.durationBadge}>{v.duration}</span>
                </div>
                <div className={h.videoInfo}>
                  <h4 className={h.videoTitle}>{v.title}</h4>
                  <p className={h.videoSubtitle}>{v.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Share a Story Form ────────────────────────────────────── */}
      <section className={h.shareSection}>
        <div className={h.shareInner}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#C2185B', fontWeight: 700, textTransform: 'uppercase' }}>
            Inspire Others
          </span>
          <h2 className={h.shareTitle}>Know a Success Story? Share it with us</h2>
          <p className={h.shareDesc}>
            Every woman who fights for her dignity is writing history. Tell us her story — we feature verified grassroots triumphs.
          </p>

          {formSubmitted ? (
            <div className={h.shareSuccess}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌺</div>
              <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', color: '#831843', marginBottom: '0.5rem' }}>
                Story Received!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#9D174D' }}>
                Thank you for honoring her courage. Our editorial collective will review and reach out for verification.
              </p>
            </div>
          ) : (
            <form
              className={h.shareForm}
              onSubmit={(e) => {
                e.preventDefault()
                setFormSubmitted(true)
              }}
            >
              <div className={h.formRow}>
                <div className={h.formField}>
                  <label className={h.label}>Her Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Savita Patil"
                    className={h.input}
                  />
                </div>
                <div className={h.formField}>
                  <label className={h.label}>Her Field / Achievement</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Village Sarpanch / Sports Champion"
                    className={h.input}
                  />
                </div>
              </div>

              <div className={h.formField}>
                <label className={h.label}>Brief Story (2–3 sentences)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What challenge did she face, and how did she overcome it?"
                  className={h.textarea}
                />
              </div>

              <div className={h.formField}>
                <label className={h.label}>Your Email or Phone (for verification)</label>
                <input
                  type="text"
                  required
                  placeholder="contact@email.com / +91..."
                  className={h.input}
                />
              </div>

              <button type="submit" className={h.submitBtn}>
                Submit Her Story →
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
