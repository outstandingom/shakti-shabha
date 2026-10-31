import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getFounderData, FounderProfileData, DEFAULT_FOUNDER_DATA } from '../data/founderData'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const FOUNDER_METRICS = [
  {
    icon: 'sports_martial_arts',
    title: 'Black Belt in Karate',
    desc: 'Martial arts discipline, tactical combat training, and unarmed self-defense.'
  },
  {
    icon: 'swords',
    title: '2,000+ Girls Trained',
    desc: 'Armed and unarmed self-defense awareness and practical street-safety training.'
  },
  {
    icon: 'record_voice_over',
    title: '500+ Seminars & Discourses',
    desc: 'Institutional seminars, youth awareness programmes, and consciousness-building sessions.'
  },
  {
    icon: 'school',
    title: '25,000+ Students Reached',
    desc: 'Youth awakening sessions across educational and community platforms.'
  },
  {
    icon: 'holiday_village',
    title: 'Mission Mardini Camps',
    desc: 'Organizing intensive 7–10 day self-defense and empowerment camps.'
  },
  {
    icon: 'nature_people',
    title: 'Tribal Outreach',
    desc: 'Awareness, guidance, and support initiatives for young girls in tribal and underserved communities.'
  },
  {
    icon: 'hub',
    title: 'Collaborative Initiatives',
    desc: 'Working with other organizations and community groups to expand training and awareness programmes.'
  }
]

const TACTICAL_INTERVENTIONS = [
  {
    icon: 'child_care',
    title: '1. Vulnerability Interception & Child Protection Coordination',
    desc: 'Interventions in this sphere address acute vulnerability, runaway minors at transit hubs, and distress situations where young girls face immediate risk of exploitation or informal cross-district trade.',
    bullets: [
      'Operational Methodology: Works directly at the grassroots and transit points (railway nodes, community perimeters) to intercept minors before predatory entrapment occurs.',
      'Strict adherence to statutory child-protection frameworks facilitating immediate communication with statutory authorities, Child Welfare Committees (CWC), National/State Commission for Women, and authorized shelter networks.',
      'Documented Footprint: Directly facilitated the timely safety interception, statutory handoff, and supervised reintegration of 13 vulnerable minors into verified legal guardianship and safe academic environments.'
    ]
  },
  {
    icon: 'shield',
    title: '2. Counter-Grooming, Coercive Entrapment & Pre-FIR Family Mediation',
    desc: 'Handling complex community and campus scenarios involving identity deception, peer-driven entrapment, digital blackmail, and high-pressure interpersonal coercion.',
    bullets: [
      'Operational Methodology: Recognizing that families in over 80% of distress cases avoid formal litigation due to acute social vulnerability and fear of exposure, acts as a trusted community mediator.',
      'Intervenes directly in campus and residential hostel settings to break cycles of digital coercion and isolation.',
      'Conducts direct, non-adversarial dialogue with families and young women to resolve high-risk situations before irreversible harm occurs.',
      'Coordinates with local civic leadership, community elders, and law-enforcement helplines to neutralize predatory pressure.',
      'Documented Footprint: Handled over 250 reported distress and vulnerability consultations, actively conducting direct field-level safety mediations and pre-emptive family reintegrations in 50+ critical situations.'
    ]
  },
  {
    icon: 'psychology',
    title: '3. Trauma-Informed Somatic Support & Non-Verbal De-escalation',
    desc: 'Supporting young girls and women dealing with deep psychological shock, learned helplessness, domestic distress, and street-level anxiety.',
    bullets: [
      'Non-verbal behavioral observation to detect acute panic, dissociation, and the biological "freeze" response.',
      'Private, trauma-sensitive conversational de-escalation to relieve irrational guilt, internalized shame, and fear of judgment.',
      'Facilitating safe academic relocation, educational sponsorship, and vocational anchoring where prolonged domestic friction prevents an immediate peaceful resolution at home.',
      'Connecting survivors to certified clinical psychologists, healthcare professionals, and pro-bono legal advocates when specialized interventions are required.',
      'Core Principle: "A crisis or traumatic event does not define a woman’s destiny. Our objective is to restore self-worth, emotional autonomy, and physical confidence so that every girl reclaims her sovereign agency in society."'
    ]
  }
]

const CURRICULUM_TIERS = [
  {
    tier: 'Shield One · Cognitive & Mental Shield',
    title: 'Cognitive De-escalation & Situational Awareness',
    items: [
      {
        head: 'Threat Recognition',
        body: 'Participants learn to recognize potentially unsafe situations, identify concerning behavioural patterns, understand personal boundaries, and recognize warning signs associated with stalking, grooming, coercion, and unwanted physical proximity.'
      },
      {
        head: 'Situational Awareness',
        body: 'Training develops environmental awareness, risk assessment, safe-distance management, and the ability to identify exit routes and seek assistance before a situation escalates.'
      },
      {
        head: 'Managing the Freeze Response',
        body: 'Participants learn practical techniques for managing fear and stress, improving their ability to think clearly, communicate boundaries, make decisions, and respond appropriately during threatening situations.'
      },
      {
        head: 'Psychological Preparedness',
        body: 'The objective is to replace helplessness with preparedness through guided exercises, scenario-based learning, and confidence-building activities.'
      }
    ]
  },
  {
    tier: 'Shield Two · Physical Defense & Tactical Combat',
    title: 'Physical Defense & Tactical Combat Disciplines',
    items: [
      {
        head: 'Empty-Hand Defense',
        body: 'Participants learn foundational Karate-based defensive techniques, body mechanics, balance, movement, protective positioning, and practical responses to common physical threats.'
      },
      {
        head: 'Lathi-Kaushal: Traditional Staff Training',
        body: 'The programme introduces the Indian martial discipline of Lathi-Kaushal, adapting traditional staff techniques for personal protection, controlled movement, distance management, and defensive preparedness.'
      },
      {
        head: 'Traditional Weapon Awareness',
        body: 'Where appropriate and permitted, participants receive supervised instruction in traditional martial arts equipment, safety practices, handling discipline, and defensive awareness.'
      },
      {
        head: 'Close-Quarter Defense & Escape',
        body: 'Participants develop foundational skills for responding to close-range physical threats, maintaining balance, creating distance, emergency communication, and swift access to support.'
      }
    ]
  }
]

const PILLARS_IN_ACTION = [
  {
    icon: 'swords',
    name: 'Mission Mardini',
    sub: 'Physical Sovereignty & Tactical Preparedness',
    color: '#DC143C',
    dedicatedLink: '/mardini',
    dedicatedLabel: 'Explore Mission Mardini Page →',
    desc: 'Guided by founder Harshita Mankar’s Aaryaveera philosophy, the programme challenges passive approaches to self-defense by integrating physical training with psychological preparedness, situational awareness, discipline, and decision-making under pressure.',
    bullets: [
      'Dual-Shield Doctrine: Cognitive De-escalation & Situational Awareness + Physical Defense & Tactical Combat.',
      'Intensive 7–10 day residential warrior camps with martial discipline and scenario-based drills.',
      'Frontline tribal and rural outreach making practical combat training accessible beyond urban institutions.'
    ]
  },
  {
    icon: 'spa',
    name: 'Shakti Bhava',
    sub: 'Cognitive Awakening, Consciousness & Civilizational Awareness',
    color: '#059669',
    dedicatedLink: '/shakti-bhava',
    dedicatedLabel: 'Explore Shakti Bhava Page →',
    desc: 'Cultivates individuals who can think independently, examine social narratives, understand their cultural and intellectual roots, and make decisions through reason rather than digital influence or social pressure.',
    bullets: [
      '500+ seminars, institutional sessions, and consciousness discourses reaching 25,000+ students.',
      'Key engagement in Narrative Awareness, Critical Thinking, Civilizational Literacy, and Human Consciousness.',
      'Promotes mutual dignity, healthy boundaries, personal responsibility, and rejects hyper-consumerist polarization.'
    ]
  },
  {
    icon: 'menu_book',
    name: 'Shakti Varta',
    sub: 'Intellectual Sovereignty, Critical Inquiry & Research-Based Dialogue',
    color: '#4338CA',
    dedicatedLink: '/shakti-varta',
    dedicatedLabel: 'Explore Shakti Varta Page →',
    desc: 'A practical learning environment where youth are equipped with critical thinking, research literacy, and logical reasoning to investigate claims independently from primary sources.',
    bullets: [
      'Vedic Digital Fellowship: Engaging young women with the Vedas, Bhagavad Gita, Mahabharata, and Satyarth Prakash.',
      'Critical Media Analysis: Source verification, identifying logical fallacies, and deconstructing manipulative algorithms.',
      'Open-House Debates & Youth Ignite Forums: Rational philosophical dialogues, forgotten warrior queens, and digital public consciousness.'
    ]
  }
]

const TIMELINE = [
  { year: '2012', title: 'Shakti Sabha Founded', desc: 'Born with a vision to revive the civilizational paradigm of Kshatra-Dharma, tactical preparedness, and cognitive sovereignty.' },
  { year: '2014', title: 'First Mission Mardini Camp', desc: 'Inaugural residential camp blending Karate empty-hand combat with Lathi-Kaushal staff defense and freeze-response elimination.' },
  { year: '2016', title: '100+ Schools Reached', desc: 'Expanded across rural corridors, residential hostels, and colleges for situational awareness and boundary management.' },
  { year: '2018', title: 'Frontline Interventions Formalized', desc: 'Somatic trauma de-escalation, non-verbal behavioral observation, and statutory child-protection coordination.' },
  { year: '2022', title: 'Aaryaveera Philosophy Codified', desc: 'The founder’s personal worldview (Aaryaveera) formally codified as the ideological foundation guiding all Shakti Sabha initiatives.' },
  { year: '2024', title: '25,000+ Students Awakened', desc: 'Over 500 seminars, 2,000+ girls trained in self-defense, 13 minors safely reintegrated, and active tribal outreach operations.' },
]

const VALUES = [
  { icon: 'balance', name: 'Kshatra-Dharma', dev: 'क्षात्र धर्म', desc: 'The responsibility to protect, the courage to confront injustice, the discipline to exercise power responsibly, and the wisdom to distinguish strength from aggression.' },
  { icon: 'psychology', name: 'Intellectual Sovereignty', dev: 'बौद्धिक संप्रभुता', desc: 'Do not accept an idea merely because it is popular, traditional, or influential. Examine its evidence, reasoning, context, and implications.' },
  { icon: 'shield', name: 'Physical Preparedness', dev: 'शारीरिक सामर्थ्य', desc: 'Before the body can respond, the mind must overcome fear. True empowerment requires the development of both mental composure and physical capability.' },
  { icon: 'spa', name: 'Human Consciousness', dev: 'आत्म चेतना', desc: 'Strength without hatred. Knowledge without blindness. Power with responsibility. Developing the whole human being.' },
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
    desc: 'Official video discourses, self-defense masterclasses, and ideological youth awakening series.',
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
    desc: 'Founder Aaryaveera Harshita Mankar’s official reflections, ideological doctrine, and live updates.',
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
    desc: 'Warrior cadre demonstrations, camp chronicles, martial training drills, and field highlights.',
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
    desc: 'Institutional announcements, rural school drives, Mission Mardini camps, and community initiatives.',
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
    desc: 'Official institutional community page, public awareness campaigns, and grassroots family outreach.',
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
    desc: 'Movement ideology, discussions on Kshatra-Dharma, and national convention announcements.',
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
    desc: 'Founder portal detailing the Aaryaveera civilizational vision, publications, and worldview.',
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
    desc: 'Visual archives, martial arts graphics, educational posters, and photo documentation.',
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
    desc: 'Timely thought leadership, cultural discourse, and movement alerts on Twitter (X).',
    googleIcon: 'tag',
    accentColor: '#111827',
    softBg: 'rgba(17, 24, 39, 0.07)',
    actionLabel: 'Follow on X'
  }
]

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

    // Ensure elements are never stuck hidden if ScrollTrigger recalculates
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 350)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  const confidentialityText =
    profile?.interventions?.confidentialityNotice ||
    DEFAULT_FOUNDER_DATA.interventions.confidentialityNotice

  const heroImgSrc = profile.heroImage
    ? (profile.heroImage.startsWith('/') || profile.heroImage.startsWith('http')
        ? profile.heroImage
        : `/${profile.heroImage}`)
    : "/harshitama'am.jpg"

  return (
    <main className={`${p.page} ${s.page}`} ref={pageRef}>
      {/* ── HERO BANNER ────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <Link to="/" className={p.backLink}>← Back to Home</Link>
          <span className={p.eyebrow}>Civilizational Leadership &amp; Tactical Sovereignty</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>शांति और क्रांति का संगम · The Soul &amp; Strategy of the Movement</p>
          <p className={p.heroDesc}>
            Reviving the civilizational paradigm of Kshatra-Dharma and cognitive sovereignty.
            From high-risk frontline rescues to residential combat camps, Shakti Sabha forges young women into intellectually fortified and tactically capable guardians.
          </p>
        </div>
      </div>

      {/* ── FOUNDER DOSSIER & STRATEGIC BLUEPRINT ──── */}
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
                Civilizational Strategist &amp; Combat Instructor
              </div>
            </div>

            <div className={p.founderInfo}>
              <span className={p.founderEyebrow}>FOUNDER &amp; DIRECTOR · AARYAVEERA</span>
              <h2 className={p.founderName}>{profile.name}</h2>
              <div className={p.founderTitle}>{profile.title}</div>
              <div className={p.founderSpecialties}>
                {profile.subTitle}
              </div>

              {/* Hero Quote Directly Below Name and Title */}
              <div className={p.heroQuoteBox}>
                <blockquote className={p.heroQuoteText}>
                  "{profile.heroQuote}"
                </blockquote>
              </div>

              {/* Key Metric Badges */}
              <div className={p.metricBadgesGrid}>
                {FOUNDER_METRICS.map((m, idx) => (
                  <div key={idx} className={p.metricBadgeCard}>
                    <div className={p.metricBadgeHeader}>
                      <GoogleIcon name={m.icon} size={22} className={p.metricBadgeIcon} style={{ color: '#DC143C' }} />
                      <span className={p.metricBadgeTitle}>{m.title}</span>
                    </div>
                    <p className={p.metricBadgeDesc}>{m.desc}</p>
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

          {/* ── The Genesis ───────────────────────────── */}
          <div className={p.genesisBox}>
            <h3 className={p.genesisTitle}>
              <GoogleIcon name="eco" size={24} style={{ color: '#166534' }} />
              THE GENESIS: {profile.genesisLead}
            </h3>
            <p className={p.genesisText} style={{ marginBottom: '1rem' }}>
              {profile.genesisP1}
            </p>
            <p className={p.genesisText} style={{ marginBottom: '1rem' }}>
              {profile.genesisP2}
            </p>
            <p className={p.genesisText} style={{ marginBottom: '1rem' }}>
              {profile.genesisP3}
            </p>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #DCFCE7',
              borderLeft: '4px solid #166534',
              padding: '1.15rem 1.4rem',
              borderRadius: '0 10px 10px 0',
              marginTop: '1.25rem',
              fontSize: '0.94rem',
              lineHeight: 1.65,
              color: '#166534',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}>
              <strong style={{ color: '#14532D', display: 'block', marginBottom: '0.35rem' }}>
                The Principle of Kshatra-Dharma:
              </strong>
              <span style={{ color: '#374151' }}>{profile.kshatraDharmaText}</span>
            </div>
          </div>

          {/* ── Tactical Frontline Interventions & Survivor Support ── */}
          <div style={{ marginBottom: '1.5rem', marginTop: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Operational Interventions &amp; Safeguarding
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: '#111827', margin: '0.35rem 0 1rem' }}>
              Tactical Frontline Interventions &amp; Survivor Support
            </h3>
            <p style={{ color: '#4B5563', fontSize: '0.94rem', maxWidth: '820px', lineHeight: 1.65, marginBottom: '2rem' }}>
              Harshita’s grassroots work has included direct engagement with vulnerable individuals and families facing situations of exploitation, coercion, and personal crisis. Her intervention work has focused on safety, crisis response, coordination with relevant stakeholders, and supporting survivors through recovery and reintegration.
            </p>
          </div>

          <div className={p.tacticalGrid} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {TACTICAL_INTERVENTIONS.map((item, idx) => (
              <div key={idx} className={p.tacticalCard} style={{ padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                  <GoogleIcon name={item.icon} size={28} style={{ color: '#DC143C' }} />
                  <h4 className={p.tacticalTitle} style={{ margin: 0, fontSize: '1.15rem' }}>{item.title}</h4>
                </div>
                <p className={p.tacticalDesc} style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {item.desc}
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', fontSize: '0.88rem', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Institutional Note on Confidentiality & Statutory Compliance */}
          <div style={{
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: '1.25rem 1.5rem',
            marginTop: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#111827', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <GoogleIcon name="gavel" size={18} style={{ color: '#DC143C' }} />
              Institutional Note on Confidentiality &amp; Statutory Compliance
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.65 }}>
              "{confidentialityText}"
            </p>
          </div>

          {/* ── Mission Mardini: Tactical Combat & Integrated Sovereignty ── */}
          <div className={p.doctrineBox}>
            <div className={p.doctrineSubtitle}>Physical Sovereignty. Mental Resilience. Tactical Preparedness.</div>
            <h3 className={p.doctrineHeading}>
              Mission Mardini: The Dual-Shield Doctrine
            </h3>
            <p className={p.doctrinePremise}>
              "Before the body can respond, the mind must overcome fear. True empowerment requires the development of both mental composure and physical capability."<br /><br />
              Guided by founder Harshita Mankar’s Aaryaveera philosophy, the programme challenges passive approaches to self-defense by integrating physical training with psychological preparedness, situational awareness, discipline, and decision-making under pressure. It is designed for school students, teenage girls, university students, rural women, and participants from tribal and underserved communities.
            </p>

            <div className={p.curriculumGrid}>
              {CURRICULUM_TIERS.map((tier, idx) => (
                <div key={idx} className={p.curriculumCard}>
                  <span className={p.curriculumNumber}>{tier.tier}</span>
                  <h4 className={p.curriculumTitle}>{tier.title}</h4>
                  <ul className={p.curriculumList}>
                    {tier.items.map((item, iIdx) => (
                      <li key={iIdx} className={p.curriculumItem}>
                        <strong>{item.head}:</strong> {item.body}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Camps & Outreach Sub-section (Clean white contrast card) */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E9D5FF',
              borderRadius: 14,
              padding: '1.75rem',
              marginTop: '2rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
            }}>
              <h4 style={{ color: '#111827', margin: '0 0 0.75rem', fontSize: '1.15rem', fontFamily: 'var(--font-display, "Cinzel", serif)', fontWeight: 700 }}>
                Intensive 7–10 Day Mardini Camps &amp; Field Outreach
              </h4>
              <p style={{ color: '#4B5563', fontSize: '0.92rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
                Mission Mardini organizes intensive training camps designed to develop physical confidence, mental resilience, discipline, and practical self-defense awareness. Activities include Karate and foundational combat, Lathi-Kaushal and traditional martial arts, situational awareness, psychological stress management, leadership, and practical safety simulations.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 250px', background: '#FFF5F5', border: '1px solid #FFE4E6', padding: '1rem 1.15rem', borderRadius: 10 }}>
                  <strong style={{ color: '#DC143C', fontSize: '0.88rem', display: 'block', marginBottom: '0.35rem' }}>Institutional Collaborations</strong>
                  <span style={{ color: '#4B5563', fontSize: '0.84rem', lineHeight: 1.5, display: 'block' }}>Collaborating with educational institutions and community organizations to expand training and awareness.</span>
                </div>
                <div style={{ flex: '1 1 250px', background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '1rem 1.15rem', borderRadius: 10 }}>
                  <strong style={{ color: '#166534', fontSize: '0.88rem', display: 'block', marginBottom: '0.35rem' }}>Tribal &amp; Rural Outreach</strong>
                  <span style={{ color: '#4B5563', fontSize: '0.84rem', lineHeight: 1.5, display: 'block' }}>Making training, guidance, and support accessible to young girls in underserved areas beyond urban centers.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── The Three Pillars in Action ──────────── */}
          <div style={{ marginBottom: '1.5rem', marginTop: '3.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              OUR THREE STREAMS · ONE VISION
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: '#111827', margin: '0.35rem 0 1.5rem' }}>
              The Shakti Sabha Tri-Stream Architecture
            </h3>
          </div>

          <div className={p.actionPillarsGrid}>
            {PILLARS_IN_ACTION.map((pillar, idx) => (
              <div
                key={idx}
                className={p.actionPillarCard}
                style={{ '--pill-color': pillar.color } as React.CSSProperties}
              >
                <div className={p.actionPillarHeader}>
                  <GoogleIcon name={pillar.icon} size={28} style={{ color: pillar.color }} />
                  <span className={p.actionPillarName}>{pillar.name}</span>
                </div>
                <div className={p.actionPillarSub}>{pillar.sub}</div>
                <p className={p.actionPillarDesc}>{pillar.desc}</p>
                <ul className={p.actionPillarBullets}>
                  {pillar.bullets.map((b, bIdx) => (
                    <li key={bIdx} className={p.actionPillarBullet}>
                      <span style={{ color: pillar.color }}>●</span>
                      <div>{b}</div>
                    </li>
                  ))}
                </ul>

                <Link to={pillar.dedicatedLink} className={p.actionPillarLink}>
                  <span>{pillar.dedicatedLabel}</span>
                  <GoogleIcon name="arrow_forward" size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SHAKTI SABHA PHILOSOPHY ──────────────── */}
      <div className={p.quoteSection}>
        <div className={p.quoteInner} style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC143C', display: 'block', marginBottom: '1rem' }}>
            THE SHAKTI SABHA PHILOSOPHY
          </span>
          <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: '#881337', marginBottom: '1.25rem' }}>
            Strength Without Hatred. Knowledge Without Blindness. Power With Responsibility.
          </h3>
          <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', textAlign: 'left' }}>
            Shakti Sabha believes that genuine empowerment must develop the whole human being. Physical strength without self-control can become aggression. Knowledge without critical inquiry can become dogma. Freedom without responsibility can become directionless. Peace without courage can become passive acceptance of injustice.
          </p>
          <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', textAlign: 'left' }}>
            We encourage women to recognize their strength without developing hostility towards men. We encourage young people to question ideas without becoming prisoners of cynicism. We promote cultural awareness without blind glorification and modern thinking without blind imitation.
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.15rem', lineHeight: 1.6, color: '#DC143C', fontStyle: 'italic', margin: '0 0 1rem' }}>
            "We do not seek to create followers. We seek to cultivate independent minds, responsible leaders, and conscious individuals."
          </blockquote>
        </div>
      </div>

      {/* ── TIMELINE ────────────────────────────────── */}
      <section className={p.timelineSection} ref={timelineRef}>
        <div className={p.sectionInner}>
          <span className={p.sectionEyebrow}>Our Journey</span>
          <h2 className={p.sectionTitle}>12 Years of Impact</h2>
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
                  <h4 className={p.timelineTitle}>{t.title}</h4>
                  <p className={p.timelineDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES GRID ─────────────────────────────── */}
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

      {/* ── OFFICIAL DIGITAL SOVEREIGNTY & SOCIAL MEDIA CHANNELS ── */}
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

      {/* ── CTA ─────────────────────────────────────── */}
      <div className={p.ctaSection}>
        <div className={p.ctaInner}>
          <h3 className={p.ctaTitle}>Join the Revolution</h3>
          <p className={p.ctaDesc}>Whether you request an institutional camp, seek confidential psychological support, or join our fellowship — your sovereignty starts here.</p>
          <div className={p.ctaBtns}>
            <Link to="/sahyog" className={p.ctaPrimary}>Sabha Join Karein →</Link>
            <Link to="/events" className={p.ctaOutline}>Attend Mission Mardini Camp</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
