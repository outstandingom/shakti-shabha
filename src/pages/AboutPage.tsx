import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './PageLayout.module.css'
import p from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const FOUNDER_METRICS = [
  {
    icon: 'sports_martial_arts',
    title: 'Black Belt in Karate',
    desc: 'Tactical Combat & Empty-Hand Mastery'
  },
  {
    icon: 'swords',
    title: '2,000+ Girls Weaponized',
    desc: 'Armed & Unarmed Street Defense Readiness'
  },
  {
    icon: 'record_voice_over',
    title: '500+ Seminars Delivered',
    desc: 'Reached 25,000+ students for youth awakening sessions'
  },
  {
    icon: 'holiday_village',
    title: '7–10 Days Mission Mardini Camps',
    desc: 'Organizing & collaborating with partner groups for camps'
  },
  {
    icon: 'nature_people',
    title: 'Tribal Area Outreach',
    desc: 'On-ground awareness and frontline support for young girls'
  },
  {
    icon: 'psychology',
    title: 'Dual-Tier Curriculum',
    desc: 'Cognitive De-escalation & High-Impact CQC'
  }
]

const TACTICAL_INTERVENTIONS = [
  {
    icon: 'emergency',
    title: 'Anti-Trafficking Extractions',
    desc: 'Directly directed and executed the tactical rescue and safe reintegration of 13 minors from organized human-trafficking networks across high-risk jurisdictional corridors.'
  },
  {
    icon: 'shield',
    title: 'Grooming & Coercive Exploitation Mitigation',
    desc: 'Handled 250+ documented crisis cases, executing 50+ high-stakes field rescues involving predatory exploitation and systematic psychological coercion.'
  },
  {
    icon: 'biotech',
    title: 'Psychological Reclamation & Specialized Trauma Profiling',
    desc: 'Utilizing non-verbal behavioral profiling, micro-expression analysis, and somatic PTSD stabilization techniques, pioneered specialized post-extraction frameworks to de-escalate trauma and neutralize psychological conditioning in young survivors.'
  }
]

const CURRICULUM_TIERS = [
  {
    tier: 'Tier 1 · Mental Shield',
    title: 'Psychological Inoculation & Situational Radar',
    items: [
      {
        head: 'Pre-Attack Threat Recognition',
        body: 'Training young girls to scan baseline human behavior, decode pre-violence cues (grooming, stalking, spatial encroachment), and react before a physical trap closes.'
      },
      {
        head: 'Overcoming Freeze Response',
        body: 'Using stress-inoculation drills to replace the biological "freeze" response with calculated tactical awareness, ensuring that sudden danger triggers clarity rather than panic.'
      }
    ]
  },
  {
    tier: 'Tier 2 · Empty Hand',
    title: 'Unarmed Lethality (Empty-Hand Combat)',
    items: [
      {
        head: 'Body Mechanics & Leverage',
        body: 'Rooted in her Karate discipline, girls are trained to use their natural body structure to overpower larger, heavier adversaries through targeted strikes to critical vulnerabilities (eyes, throat, groin, solar plexus).'
      },
      {
        head: 'Improvised Defense',
        body: 'Conditioning young women so that even in the complete absence of a tool or weapon, their hands, elbows, knees, and cognitive agility function as an organic weapon system.'
      }
    ]
  },
  {
    tier: 'Tier 3 · Tactical Arms',
    title: 'Weaponized Defense (Traditional Tactical Arms)',
    items: [
      {
        head: 'Lathi-Kaushal (Tactical Stick Combat)',
        body: 'Reviving the ancient Indian martial discipline of the staff/lathi, adapting it into an effective perimeter-defense and crowd-control weapon for young girls in rural and urban corridors.'
      },
      {
        head: 'Blade Warfare & Close-Quarter Combat (CQC)',
        body: 'Handling and neutralizing edge-weapon threats, teaching grip retention, distance management, and defensive redirection under high-adrenaline contact scenarios.'
      }
    ]
  }
]

const PILLARS_IN_ACTION = [
  {
    icon: 'swords',
    name: 'Mission Mardini',
    sub: 'Physical Sovereignty & Tactical Defense',
    color: '#DC143C',
    desc: 'Rejecting passive self-defense models, Harshita engineered Mission Mardini — a battle-tested combat framework blending traditional Indian martial arts with modern defensive mechanics.',
    bullets: [
      'Trained 2,000+ young women across schools, colleges, and rural settlements in high-impact survival tactics.',
      'Integrated tactical stick-combat (Lathi-Kaushal), traditional blade warfare, and modern Close-Quarter Combat (CQC) with situational peripheral awareness, training participants to neutralize physical threats within split-second windows.'
    ]
  },
  {
    icon: 'spa',
    name: 'Shakti Bhava',
    sub: 'Mass Awakening & Narrative Deconstruction',
    color: '#3D5A45',
    desc: 'Through Shakti Bhava, Harshita conducts large-scale intellectual and cognitive interventions to immunize youth against civilizational subversion and cognitive conditioning.',
    bullets: [
      'Convened 500+ keynotes, symposiums, and institutional seminars across schools, universities, residential hostels, and cultural forums.',
      'Addresses root causes of systemic alienation by dismantling western reductionist narratives and hyper-consumerist paradigms.',
      'Systematically reconstructs civilizational identity by anchoring youth in advanced Indian sciences, historical epistemology, and awakened human consciousness.'
    ]
  },
  {
    icon: 'menu_book',
    name: 'Shakti Varta & Deep Research',
    sub: 'Vedic Epistemology & Forgotten Warriors',
    color: '#C9A96E',
    desc: 'Anchoring social transformation in rigorous textual analysis, Harshita leads continuous research into classical literature and forgotten historical archives.',
    bullets: [
      'Shakti Varta Digital Fellowship: Curated an ongoing intellectual forum connecting 200+ young women to foundational texts — including the Bhagavad Gita, Maharshi Dayananda’s Satyarth Prakash, and original Vedic philosophies.',
      'Historical Reclamation Project: Spearheading independent archival research documenting forgotten Indian women warriors, reconstructing uncensored historical narratives to counter distortion and inspire modern youth.',
      'Digital Outreach: Synthesizes historical forensics, non-verbal psychology, and geopolitical analysis across short-form digital series, delivering civilizational discourse to thousands of youth globally.'
    ]
  }
]

const TIMELINE = [
  { year: '2012', title: 'Shakti Sabha Founded', desc: 'Born with a vision to revive the civilizational paradigm of Kshatra-Dharma and cognitive sovereignty.' },
  { year: '2014', title: 'First Mission Mardini Camp', desc: 'Inaugural residential camp blending Karate empty-hand combat with Lathi-Kaushal staff defense.' },
  { year: '2016', title: '100+ Schools Reached', desc: 'Expanded across rural and urban corridors, training adolescent girls in situational radar and freeze-response elimination.' },
  { year: '2018', title: 'Shakti Bhava & Trauma Profiling', desc: 'Somatic PTSD stabilization and non-verbal behavioral profiling frameworks formalized for crisis rescue.' },
  { year: '2022', title: 'Aaryaveera Leadership Series', desc: 'Flagship residential leadership and train-the-trainer camp established for pan-India student sentinels.' },
  { year: '2024', title: '25,000+ Students Awakened', desc: 'Over 500 seminars, 2,000+ weaponized young warriors, and active tribal outreach operations pan-India.' },
]

const VALUES = [
  { icon: 'spa', name: 'Dignity', dev: 'सम्मान', desc: 'Every woman is sacred. Dignity is not earned — it is the sovereign birthright of every daughter of this civilization.' },
  { icon: 'local_fire_department', name: 'Courage', dev: 'साहस', desc: 'Physical, moral, and cognitive courage — the trinity that transforms vulnerable targets into tactically invincible sentinels.' },
  { icon: 'verified', name: 'Truth', dev: 'सत्य', desc: 'Uncompromising clarity — confronting predation, systemic coercion, and cultural conditioning with objective forensics.' },
  { icon: 'balance', name: 'Dharma', dev: 'धर्म', desc: 'Rooted in timeless Vedic epistemology and Kshatra-Dharma. Duty, justice, and protection without ideological subversion.' },
]

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (timelineRef.current) {
        gsap.from(timelineRef.current.querySelectorAll(`.${p.timelineItem}`), {
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' },
          opacity: 0,
          x: -30,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      if (valuesRef.current) {
        gsap.from(valuesRef.current.querySelectorAll(`.${p.valueCard}`), {
          scrollTrigger: { trigger: valuesRef.current, start: 'top 80%' },
          opacity: 0,
          scale: 0.95,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={s.page} ref={pageRef}>
      {/* ── HERO BANNER ────────────────────────────── */}
      <div className={p.hero}>
        <div className={p.heroInner}>
          <Link to="/" className={p.backLink}>← Back to Home</Link>
          <span className={p.eyebrow}>Civilizational Leadership & Tactical Sovereignty</span>
          <h1 className={p.heroTitle}>About Shakti Sabha</h1>
          <p className={p.heroHindi}>शांति और क्रांति का संगम · The Soul & Strategy of the Movement</p>
          <p className={p.heroDesc}>
            Reviving the civilizational paradigm of Kshatra-Dharma and cognitive sovereignty.
            From high-risk frontline rescues to residential combat camps, Shakti Sabha forges young women into intellectually fortified and tactically invincible sentinels.
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
                src="/harshitama'am.jpg"
                alt="Harshita Mankar - Founder & Director, Shakti Sabha"
                className={p.founderImg}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80'
                }}
              />
              <div className={p.founderBadgePill}>
                <GoogleIcon name="verified_user" size={16} style={{ marginRight: '6px' }} />
                Verified Tactical Instructor & Non-Verbal Profiler
              </div>
            </div>

            <div className={p.founderInfo}>
              <span className={p.founderEyebrow}>Founder & Institutional Leadership</span>
              <h2 className={p.founderName}>Harshita Mankar</h2>
              <div className={p.founderTitle}>Founder & Director, Shakti Sabha</div>
              <div className={p.founderSpecialties}>
                Civilizational Strategist | Tactical Combat Instructor | Non-Verbal Profiler & PTSD Counselor
              </div>

              {/* Hero Quote Directly Below Name and Title */}
              <div className={p.heroQuoteBox}>
                <blockquote className={p.heroQuoteText}>
                  "We do not build dependent victims; we forge sovereign, intellectually fortified, and tactically invincible sentinels of Indian civilization.”
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
            </div>
          </div>

          {/* ── The Genesis ───────────────────────────── */}
          <div className={p.genesisBox}>
            <h3 className={p.genesisTitle}>
              <GoogleIcon name="eco" size={24} style={{ color: '#34D399' }} />
              The Genesis: From Grassroots Activism to Strategic Sovereignty
            </h3>
            <p className={p.genesisText}>
              Harshita Mankar’s journey began at an early age, working across diverse institutional ecosystems and cultural organizations to awaken youth consciousness. Over years of frontline exposure, she observed a critical limitation in conventional advocacy: modern socio-political frameworks often treat women as passive beneficiaries or perpetual victims, eroding their inherent psychological strength. Evolving through rigorous field realities, Harshita transitioned from collaborative activism to independent, institutional leadership establishing Shakti Sabha to revive the civilizational paradigm of Kshatra-Dharma and cognitive sovereignty.
            </p>
          </div>

          {/* ── Tactical Frontline Interventions & Crisis Rescue ── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Operational Interventions
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: '#FFFFFF', margin: '0.35rem 0 1rem' }}>
              Tactical Frontline Interventions & Crisis Rescue
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '750px', marginBottom: '2rem' }}>
              Operating in high-risk environments across rural heartlands, urban centers, and institutional corridors, Harshita has led frontline intervention and operational rescue missions where statutory systems faced jurisdictional limitations:
            </p>
          </div>

          <div className={p.tacticalGrid}>
            {TACTICAL_INTERVENTIONS.map((item, idx) => (
              <div key={idx} className={p.tacticalCard}>
                <GoogleIcon name={item.icon} size={32} style={{ color: '#DC143C', marginBottom: '0.75rem' }} />
                <h4 className={p.tacticalTitle}>{item.title}</h4>
                <p className={p.tacticalDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Mission Mardini: Tactical Combat & Integrated Sovereignty ── */}
          <div className={p.doctrineBox}>
            <div className={p.doctrineSubtitle}>The Dual-Shield Doctrine</div>
            <h3 className={p.doctrineHeading}>
              Mission Mardini: Tactical Combat & Integrated Sovereignty
            </h3>
            <p className={p.doctrinePremise}>
              "Mental Resilience Before Physical Strike: The Dual-Shield Doctrine"<br />
              Harshita Mankar holds a Black Belt in Karate, Expert in Lathi-Kaushal, Sword and serves as a tactical combat instructor who rejects conventional, passive self-defense models. Her core training doctrine is built on an inviolable premise: "Before the body can strike, the mind must be liberated from fear. True empowerment is not a slogan it is the simultaneous mastery of cognitive composure and physical capability."
            </p>
            <p style={{ color: '#E2E8F0', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Under Mission Mardini, she trains young women and teenage girls through an asymmetric combat curriculum designed to handle real-world street violence, ambushes, and coercive physical encounters:
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
          </div>

          {/* ── The Three Pillars in Action ──────────── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Strategic Wings
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: '#FFFFFF', margin: '0.35rem 0 1.5rem' }}>
              The Three Pillars in Action by Harshita Mankar
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOLD MISSION STATEMENT ───────────────────── */}
      <div className={p.quoteSection} style={{ background: '#0F0E11', color: '#FFFFFF', padding: 'clamp(3rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div className={p.quoteInner} style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#DC143C', display: 'block', marginBottom: '1rem' }}>
            Civilizational Conviction · Brand Ka Dil
          </span>
          <blockquote style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.25rem, 2.3vw, 1.75rem)', lineHeight: 1.6, color: '#E8C98A', fontStyle: 'italic', marginBottom: '1.25rem' }}>
            "Sadiyaan beet gayi, Indian woman ki asli kahani dobara sunne ki. Woh sirf ghar nahi sambhalti thi — woh yuddh jeetti thi, darshan padhati thi, rajya chalati thi. Shakti Sabha usi sach ko wapas laane ke liye hai."
          </blockquote>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            — Shakti Sabha Mission & Conviction
          </p>
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
