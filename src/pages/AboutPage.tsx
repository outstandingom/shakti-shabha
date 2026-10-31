import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, FounderProfileData } from '../data/founderData'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 1. SIMPLE & CLEAR DATA STRUCTURES
// ============================================================

const KEY_METRICS = [
  { icon: 'sports_martial_arts', value: 'Black Belt', label: 'Karate & Combat', hi: 'कराटे एवं आत्मरक्षा' },
  { icon: 'shield', value: '2,000+', label: 'Girls Trained', hi: 'बहनें प्रशिक्षित' },
  { icon: 'record_voice_over', value: '500+', label: 'Seminars Held', hi: 'सेमिनार एवं सत्र' },
  { icon: 'school', value: '25,000+', label: 'Students Reached', hi: 'विद्यार्थी जुड़े' },
  { icon: 'volunteer_activism', value: '13', label: 'Minors Safeguarded', hi: 'बेटियों को संबल' },
  { icon: 'nature_people', value: 'Tribal', label: 'Rural Outreach', hi: 'ग्रामीण व आदिवासी क्षेत्र' }
]

const THREE_PILLARS = [
  {
    id: 'mardini',
    icon: 'swords',
    title: 'Mission Mardini',
    titleHi: 'मिशन मार्दिनी · आत्मरक्षा व शौर्य',
    tagline: 'Physical Sovereignty & Self-Defense',
    color: '#DC143C',
    link: '/mardini',
    linkText: 'Explore Mission Mardini →',
    points: [
      'पारंपरिक लट्ठ-कौशल एवं कराटे पर आधारित व्यावहारिक आत्मरक्षा।',
      'डर और घबराहट पर नियंत्रण के लिए सिमुलेशन अभ्यास।',
      '7 से 10 दिवसीय गहन आवासीय प्रशिक्षण शिविर एवं ग्रामीण आउटरीच।'
    ]
  },
  {
    id: 'support',
    icon: 'health_and_safety',
    title: 'Ground Safety & Support',
    titleHi: 'धरातलीय सुरक्षा एवं संबल',
    tagline: 'Crisis Intervention & Guidance',
    color: '#059669',
    link: '/counselling',
    linkText: 'Learn About Support →',
    points: [
      'संकट के समय बहनों और परिवारों को सही सलाह व मार्गदर्शन।',
      'कानूनी संस्थाओं (CWC) और विधिक सहायकों के साथ समन्वय।',
      '13 नाबालिग बेटियों का सुरक्षित पुनर्वास और 250+ संकट परामर्श।'
    ]
  },
  {
    id: 'varta',
    icon: 'psychology',
    title: 'Shakti Bhava & Varta',
    titleHi: 'शक्ति भाव एवं वार्ता · विचार व संस्कार',
    tagline: 'Consciousness & Independent Thinking',
    color: '#4338CA',
    link: '/three-streams',
    linkText: 'Discover Three Streams →',
    points: [
      'भारतीय संस्कृति, क्षात्र-धर्म और ऐतिहासिक वीरांगनाओं का परिचय।',
      'युवाओं में स्वतंत्र सोच, तार्किक समझ और डिजिटल जागरूकता।',
      'कॉलेज और स्कूलों में प्रेरणादायी सेमिनार और संवाद सत्र।'
    ]
  }
]

const TIMELINE = [
  { year: '2012', title: 'Shakti Sabha Founded', titleHi: 'शक्ति सभा की स्थापना', desc: 'पुणे में युवाओं और महिलाओं को सशक्त बनाने के संकल्प के साथ शुरुआत।' },
  { year: '2014', title: 'First Mission Mardini Camp', titleHi: 'प्रथम मार्दिनी शिविर', desc: 'लट्ठ-कौशल और आत्मरक्षा का पहला 7-दिवसीय आवासीय प्रशिक्षण शिविर।' },
  { year: '2016', title: '100+ Schools Reached', titleHi: '१००+ विद्यालयों में विस्तार', desc: 'स्कूलों और कॉलेजों में आत्मरक्षा जागरूकता कार्यशालाओं का प्रसार।' },
  { year: '2018', title: 'Crisis Support Initiated', titleHi: 'संकट सहायता की शुरुआत', desc: 'कठिन परिस्थितियों में बहनों और परिवारों को विधिक व मानसिक संबल।' },
  { year: '2022', title: 'Aaryaveera Codified', titleHi: 'आर्यवीरा दर्शन का विस्तार', desc: 'फाउंडर की विचारधारा को एक राष्ट्रीय आंदोलन के रूप में मान्यता।' },
  { year: '2024', title: '25,000+ Students Impacted', titleHi: '२५,०००+ विद्यार्थियों तक पहुंच', desc: 'पूरे भारत में 500+ सेमिनार और 2,000+ प्रशिक्षित वीरांगनाएं।' }
]

const VALUES = [
  { icon: 'balance', name: 'Kshatra-Dharma', dev: 'क्षात्र धर्म', desc: 'अन्याय के विरुद्ध खड़े होने का साहस, शक्ति का मर्यादित उपयोग और समाज की रक्षा का संकल्प।' },
  { icon: 'shield', name: 'Physical Preparedness', dev: 'शारीरिक सामर्थ्य', desc: 'भयमुक्त जीवन के लिए आत्मरक्षा का व्यावहारिक ज्ञान और शारीरिक मजबूती।' },
  { icon: 'psychology', name: 'Independent Thinking', dev: 'स्वतंत्र सोच', desc: 'बिना किसी पूर्वाग्रह या दबाव के सही और गलत को समझने का तार्किक विवेक।' },
  { icon: 'spa', name: 'Human Consciousness', dev: 'आत्म चेतना', desc: 'शक्ति बिना अहंकार के, ज्ञान बिना अंधविश्वास के और अधिकार दायित्व के साथ।' }
]

export interface SocialChannel {
  id: string
  platform: 'YouTube' | 'Instagram' | 'Facebook' | 'Website' | 'Pinterest' | 'Twitter'
  entity: string
  entityHi: string
  entityType: 'aaryaveera' | 'shaktisabha'
  handle: string
  url: string
  domain: string
  desc: string
  googleIcon: string
  accentColor: string
  softBg: string
  actionLabel: string
}

const OFFICIAL_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'yt-aaryaveera',
    platform: 'YouTube',
    entity: 'Aaryaveera',
    entityHi: 'आर्यवीरा यूट्यूब',
    entityType: 'aaryaveera',
    handle: '@aaryaveeraa',
    url: 'https://youtube.com/@aaryaveeraa?si=',
    domain: 'youtube.com',
    desc: 'Official video discourses, self-defense masterclasses, and youth awakening series.',
    googleIcon: 'smart_display',
    accentColor: '#FF0000',
    softBg: 'rgba(255, 0, 0, 0.08)',
    actionLabel: 'Watch & Subscribe'
  },
  {
    id: 'ig-aaryaveera',
    platform: 'Instagram',
    entity: 'Aaryaveera',
    entityHi: 'आर्यवीरा इंस्टाग्राम',
    entityType: 'aaryaveera',
    handle: '@aaryaveera',
    url: 'https://www.instagram.com/aaryaveera?exln=dTB1MXQ3eWF5NGl6',
    domain: 'instagram.com',
    desc: 'Founder Aaryaveera Harshita Mankar’s official reflections and updates.',
    googleIcon: 'photo_camera',
    accentColor: '#E1306C',
    softBg: 'rgba(225, 48, 108, 0.08)',
    actionLabel: 'Follow @aaryaveera'
  },
  {
    id: 'ig-theaaryaveera',
    platform: 'Instagram',
    entity: 'The Aaryaveera',
    entityHi: 'द आर्यवीरा कैडर',
    entityType: 'aaryaveera',
    handle: '@theaaryaveera',
    url: 'https://www.instagram.com/theaaryaveera?mdxt=c25ybWV4bzkzNXZr',
    domain: 'instagram.com',
    desc: 'Warrior cadre demonstrations, camp highlights, and training drills.',
    googleIcon: 'photo_camera',
    accentColor: '#E1306C',
    softBg: 'rgba(225, 48, 108, 0.08)',
    actionLabel: 'Follow @theaaryaveera'
  },
  {
    id: 'ig-shaktisabha',
    platform: 'Instagram',
    entity: 'Shakti Sabha',
    entityHi: 'शक्ति सभा संस्थागत',
    entityType: 'shaktisabha',
    handle: '@shaktisabha',
    url: 'https://www.instagram.com/shaktisabha?exln=MWhtaWwwZDZmamI5',
    domain: 'instagram.com',
    desc: 'Official institutional announcements, camps, and community initiatives.',
    googleIcon: 'photo_camera',
    accentColor: '#DC143C',
    softBg: 'rgba(220, 20, 60, 0.08)',
    actionLabel: 'Follow @shaktisabha'
  },
  {
    id: 'fb-shaktisabha',
    platform: 'Facebook',
    entity: 'Shakti Sabha',
    entityHi: 'शक्ति सभा फेसबुक',
    entityType: 'shaktisabha',
    handle: 'Shakti Sabha Page',
    url: 'https://www.facebook.com/share/1CbJnBXKHQ/',
    domain: 'facebook.com',
    desc: 'Official institutional community page and grassroots family outreach.',
    googleIcon: 'groups',
    accentColor: '#1877F2',
    softBg: 'rgba(24, 119, 242, 0.08)',
    actionLabel: 'Connect on Facebook'
  },
  {
    id: 'fb-aaryaveera',
    platform: 'Facebook',
    entity: 'Aaryaveera',
    entityHi: 'आर्यवीरा फेसबुक',
    entityType: 'aaryaveera',
    handle: 'Aaryaveera Page',
    url: 'https://www.facebook.com/share/14qXzYydVzv/',
    domain: 'facebook.com',
    desc: 'Movement ideology, discussions on Kshatra-Dharma, and national events.',
    googleIcon: 'share',
    accentColor: '#1877F2',
    softBg: 'rgba(24, 119, 242, 0.08)',
    actionLabel: 'Follow on Facebook'
  },
  {
    id: 'web-aaryaveera',
    platform: 'Website',
    entity: 'Aaryaveera',
    entityHi: 'आधिकारिक वेबसाइट',
    entityType: 'aaryaveera',
    handle: 'www.aaryaveera.com',
    url: 'https://www.aaryaveera.com',
    domain: 'aaryaveera.com',
    desc: 'Founder portal detailing the Aaryaveera civilizational vision and writings.',
    googleIcon: 'language',
    accentColor: '#B45309',
    softBg: 'rgba(180, 83, 9, 0.08)',
    actionLabel: 'Visit aaryaveera.com'
  },
  {
    id: 'pin-aaryaveera',
    platform: 'Pinterest',
    entity: 'Aaryaveera & Shakti Sabha',
    entityHi: 'पिंटरेस्ट आर्काइव',
    entityType: 'aaryaveera',
    handle: 'pin.it/5DFgIhdKj',
    url: 'https://pin.it/5DFgIhdKj',
    domain: 'pinterest.com',
    desc: 'Visual archives, martial arts graphics, posters, and photo documentation.',
    googleIcon: 'push_pin',
    accentColor: '#E60023',
    softBg: 'rgba(230, 0, 35, 0.08)',
    actionLabel: 'View on Pinterest'
  },
  {
    id: 'tw-theaaryaveera',
    platform: 'Twitter',
    entity: 'The Aaryaveera',
    entityHi: 'द आर्यवीरा एक्स / ट्विटर',
    entityType: 'aaryaveera',
    handle: '@TheAaryaveera',
    url: 'https://x.com/TheAaryaveera?s=20',
    domain: 'x.com',
    desc: 'Cultural discourse and live updates on Twitter (X).',
    googleIcon: 'tag',
    accentColor: '#111827',
    softBg: 'rgba(17, 24, 39, 0.07)',
    actionLabel: 'Follow on X'
  }
]

// ============================================================
// 2. MAIN ABOUT PAGE COMPONENT
// ============================================================

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<FounderProfileData>(getFounderData())
  const [socialFilter, setSocialFilter] = useState<'all' | 'aaryaveera' | 'shaktisabha'>('all')

  const filteredChannels = OFFICIAL_SOCIAL_CHANNELS.filter((ch) => {
    if (socialFilter === 'all') return true
    return ch.entityType === socialFilter
  })

  useEffect(() => {
    const handleUpdate = () => setProfile(getFounderData())
    window.addEventListener('founder_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('founder_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(`.${p.timelineItem}`)
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: timelineRef.current, start: 'top 85%', once: true },
            onComplete: () => {
              gsap.set(items, { clearProps: 'opacity,transform' })
            }
          }
        )
      }

      if (valuesRef.current) {
        const cards = valuesRef.current.querySelectorAll(`.${p.valueCard}`)
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: valuesRef.current, start: 'top 85%', once: true },
            onComplete: () => {
              gsap.set(cards, { clearProps: 'opacity,transform' })
            }
          }
        )
      }
    }, pageRef)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 350)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  const heroImgSrc = profile.heroImage
    ? (profile.heroImage.startsWith('/') || profile.heroImage.startsWith('http')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/harshitama'am.jpg"

  return (
    <main className={`${p.page} ${s.page}`} ref={pageRef}>
      {/* ── 1. HERO BANNER ─────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <Link to="/" className={p.backLink}>← Back to Home</Link>
          <span className={p.eyebrow}>Civilizational Movement · 12 Years of Impact</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>शांति और क्रांति का संगम · Ancient Roots. Modern Strength.</p>
          <p className={p.heroDesc}>
            शक्ति सभा भारतीय महिलाओं और युवाओं के स्वाभिमान, आत्मरक्षा और मानसिक संबल का एक सशक्त मंच है। 
            हम खोखले नारों के बजाय धरातलीय प्रशिक्षण और संस्कारों के माध्यम से समाज को निर्भीक और जिम्मेदार बनाते हैं।
          </p>
        </div>
      </div>

      {/* ── 2. FOUNDER DOSSIER & CLEAR DISTINCTION ─── */}
      <section className={p.founderSection} id="founder">
        <div className={p.founderInner}>
          
          {/* Main Founder Card */}
          <div className={p.founderCard}>
            <div className={p.founderPortraitWrap}>
              <img
                src={heroImgSrc}
                alt="Aaryaveera Harshita Mankar - Founder & Director, Shakti Sabha"
                className={p.founderImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
                }}
              />
              <div className={p.founderBadgePill}>
                <GoogleIcon name="verified_user" size={16} style={{ marginRight: '6px' }} />
                Black Belt · Martial Arts Instructor
              </div>
            </div>

            <div className={p.founderInfo}>
              <span className={p.founderEyebrow}>FOUNDER &amp; DIRECTOR · AARYAVEERA</span>
              <h2 className={p.founderName}>{profile.name}</h2>
              <div className={p.founderTitle}>{profile.title}</div>
              <div className={p.founderSpecialties}>{profile.subTitle}</div>

              {/* Clear Distinction Banner (Institutional vs Philosophy) */}
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderLeft: '4px solid #166534',
                borderRadius: '0 10px 10px 0',
                padding: '0.85rem 1.15rem',
                margin: '0.75rem 0 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: '#166534', fontWeight: 700 }}>
                  <GoogleIcon name="info" size={17} />
                  <span>मूल अवधारणा (Core Clarity):</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                  <strong style={{ color: '#DC143C' }}>शक्ति सभा</strong> = संस्थागत ढांचा (Institutional Body).<br />
                  <strong style={{ color: '#166534' }}>आर्यवीरा</strong> = फाउंडर की व्यक्तिगत विचारधारा और दर्शन (Founder's Personal Worldview).
                </div>
              </div>

              {/* Hero Quote */}
              <div className={p.heroQuoteBox}>
                <blockquote className={p.heroQuoteText}>
                  "{profile.heroQuote}"
                </blockquote>
              </div>

              {/* Compact 6-Metric Stat Grid */}
              <div className={p.metricBadgesGrid}>
                {KEY_METRICS.map((m, idx) => (
                  <div key={idx} className={p.metricBadgeCard}>
                    <div className={p.metricBadgeHeader}>
                      <GoogleIcon name={m.icon} size={18} className={p.metricBadgeIcon} style={{ color: '#DC143C' }} />
                      <span className={p.metricBadgeTitle}>{m.value}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#111827' }}>{m.label}</div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280' }}>{m.hi}</div>
                  </div>
                ))}
              </div>

              {/* Founder Verified Social Quick Handles */}
              <div className={p.founderSocialRow}>
                <a href="https://youtube.com/@aaryaveeraa?si=" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera YouTube">
                  <GoogleIcon name="smart_display" size={16} style={{ color: '#FF0000' }} />
                  <span>YouTube @aaryaveeraa</span>
                </a>
                <a href="https://www.instagram.com/aaryaveera?exln=dTB1MXQ3eWF5NGl6" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera Instagram">
                  <GoogleIcon name="photo_camera" size={16} style={{ color: '#E1306C' }} />
                  <span>Instagram @aaryaveera</span>
                </a>
                <a href="https://x.com/TheAaryaveera?s=20" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="The Aaryaveera on X">
                  <GoogleIcon name="tag" size={16} style={{ color: '#111827' }} />
                  <span>X @TheAaryaveera</span>
                </a>
                <a href="https://www.aaryaveera.com" target="_blank" rel="noopener noreferrer" className={p.founderSocialPill} title="Aaryaveera Official Portal">
                  <GoogleIcon name="language" size={16} style={{ color: '#B45309' }} />
                  <span>aaryaveera.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── 3. THREE CORE PILLARS OF WORK (CLEAN 3-CARD GRID) ── */}
          <div style={{ marginTop: '3.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              OUR GROUND WORK · हमारा धरातलीय कार्य
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827', margin: '0.4rem 0 0.5rem' }}>
              How We Create Real Impact
            </h3>
            <p style={{ color: '#4B5563', fontSize: '0.94rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
              शारीरिक आत्मरक्षा, मानसिक संबल और वैचारिक जागरण — तीनों का संतुलित समन्वय।
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            {THREE_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderTop: `4px solid ${pillar.color}`,
                  borderRadius: 14,
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <GoogleIcon name={pillar.icon} size={26} style={{ color: pillar.color }} />
                  <h4 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.15rem', color: '#111827', margin: 0 }}>
                    {pillar.title}
                  </h4>
                </div>
                <div style={{ fontSize: '0.82rem', color: pillar.color, fontWeight: 700, marginBottom: '0.75rem' }}>
                  {pillar.titleHi}
                </div>
                <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1.25rem', color: '#4B5563', fontSize: '0.88rem', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  {pillar.points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
                <Link
                  to={pillar.link}
                  style={{
                    color: pillar.color,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: 'auto'
                  }}
                >
                  <span>{pillar.linkText}</span>
                  <GoogleIcon name="arrow_forward" size={14} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. THE SHAKTI SABHA PHILOSOPHY ──────────── */}
      <div className={p.quoteSection}>
        <div className={p.quoteInner} style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC143C', display: 'block', marginBottom: '0.75rem' }}>
            THE SHAKTI SABHA PHILOSOPHY · हमारा मूल दर्शन
          </span>
          <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: '#881337', marginBottom: '1rem' }}>
            Strength Without Hatred. Knowledge Without Blindness. Power With Responsibility.
          </h3>
          <p style={{ color: '#374151', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            सच्चा सशक्तिकरण वही है जो व्यक्ति के भीतर शक्ति और संयम दोनों का विकास करे। 
            हम बेटियों को अपनी ताकत पहचानना सिखाते हैं, बिना किसी कटुता या घृणा के। 
            हम आधुनिक सोच को अपनाते हैं, अपनी सांस्कृतिक जड़ों को भूले बिना।
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.1rem', lineHeight: 1.55, color: '#DC143C', fontStyle: 'italic', margin: 0 }}>
            "हम अनुयायी नहीं बनाते, हम स्वतंत्र, निर्भीक और जिम्मेदार नेतृत्व तैयार करते हैं।"
          </blockquote>
        </div>
      </div>

      {/* ── 5. TIMELINE: 12 YEARS OF IMPACT ─────────── */}
      <section className={p.timelineSection} ref={timelineRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Our Journey</span>
          <h2 className={p.sectionTitle}>12 Years of Ground Impact</h2>
          <div className={p.timeline}>
            {TIMELINE.map((t, i) => (
              <div key={i} className={p.timelineItem}>
                <div className={p.timelineLeft}>
                  <span className={p.timelineYear}>{t.year}</span>
                </div>
                <div className={p.timelineConnector}>
                  <div className={p.timelineDot} />
                  {i < TIMELINE.length - 1 && <div className={p.timelineLine} />}
                </div>
                <div className={p.timelineRight}>
                  <h4 className={p.timelineTitle}>{t.title} · <span style={{ color: '#DC143C', fontSize: '0.88rem' }}>{t.titleHi}</span></h4>
                  <p className={p.timelineDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. VALUES GRID ──────────────────────────── */}
      <section className={p.valuesSection} ref={valuesRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>What We Stand For</span>
          <h2 className={p.sectionTitle}>Our Core Values</h2>
          <div className={p.valuesGrid}>
            {VALUES.map((v) => (
              <div key={v.name} className={p.valueCard}>
                <GoogleIcon name={v.icon} size={28} style={{ color: '#DC143C', marginBottom: '0.5rem' }} />
                <h3 className={p.valueName}>{v.name}</h3>
                <span className={p.valueDev}>{v.dev}</span>
                <p className={p.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. OFFICIAL DIGITAL CHANNELS (FILTERED) ─── */}
      <section className={p.socialSection} id="social-channels">
        <div className={p.sectionInner}>
          <div className={p.socialHeader}>
            <span className={p.socialEyebrow}>
              <GoogleIcon name="public" size={16} />
              Digital Sovereignty · आधिकारिक सोशल मीडिया
            </span>
            <h2 className={p.socialTitle}>Connect With Our Movement</h2>
            <div className={p.socialHindi}>शक्ति सभा एवं आर्यवीरा के आधिकारिक सोशल मीडिया मंच</div>
            <p className={p.socialSubtitle}>
              Stay anchored with verified field reports, self-defense masterclasses, philosophical discourses, and live camp announcements across our verified digital handles.
            </p>

            {/* Entity Filter Bar */}
            <div className={p.socialFilterBar}>
              <button
                type="button"
                className={`${p.socialFilterBtn} ${socialFilter === 'all' ? p.socialFilterBtnActive : ''}`}
                onClick={() => setSocialFilter('all')}
              >
                All Handles ({OFFICIAL_SOCIAL_CHANNELS.length})
              </button>
              <button
                type="button"
                className={`${p.socialFilterBtn} ${socialFilter === 'aaryaveera' ? p.socialFilterBtnActive : ''}`}
                onClick={() => setSocialFilter('aaryaveera')}
              >
                Aaryaveera (Founder &amp; Philosophy)
              </button>
              <button
                type="button"
                className={`${p.socialFilterBtn} ${socialFilter === 'shaktisabha' ? p.socialFilterBtnActive : ''}`}
                onClick={() => setSocialFilter('shaktisabha')}
              >
                Shakti Sabha (Institutional Body)
              </button>
            </div>
          </div>

          <div className={p.socialGrid}>
            {filteredChannels.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={p.socialCard}
                style={{
                  '--card-accent': item.accentColor,
                  '--card-soft-bg': item.softBg
                } as React.CSSProperties}
              >
                <div>
                  <div className={p.socialCardTop}>
                    <div className={p.socialIconWrap}>
                      <GoogleIcon name={item.googleIcon} size={24} />
                    </div>
                    <span className={p.socialPlatformBadge}>{item.platform}</span>
                  </div>

                  <div className={p.socialCardBody}>
                    <h3 className={p.socialEntityName}>
                      {item.entity}
                    </h3>
                    <div className={p.socialHandleWrap}>
                      <GoogleIcon name="alternate_email" size={13} />
                      <span>{item.handle}</span>
                    </div>
                    <p className={p.socialCardDesc}>{item.desc}</p>
                  </div>
                </div>

                <div className={p.socialCardFooter}>
                  <span className={p.socialCardAction}>
                    <span>{item.actionLabel}</span>
                    <GoogleIcon name="arrow_outward" size={14} />
                  </span>
                  <span className={p.socialCardDomain}>{item.domain}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CALL TO ACTION ───────────────────────── */}
      <div className={p.ctaSection}>
        <div className={p.ctaInner}>
          <h3 className={p.ctaTitle}>Join the Revolution</h3>
          <p className={p.ctaDesc}>
            Whether you want to organize a self-defense camp, seek guidance, or join our community — your journey begins here.
          </p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Sabha Join Karein →</Link>
            <Link to="/events" className={p.ctaOutline}>Attend Mission Mardini Camp</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
