import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import m from './MardiniPage.module.css'

export default function MardiniPage() {
  return (
    <main className={m.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={m.hero}>
        <div className={m.heroInner}>
          <Link to="/" className={m.backLink}>← Back to Home</Link>
          <span className={m.badge}>01 · Revolution · शारीरिक संप्रभुता</span>
          <h1 className={m.title}>Mission Mardini</h1>
          <p className={m.hindiSubtitle}>मर्दिनी · The Tactical Combat & Physical Defense Wing</p>
          <p className={m.desc}>
            Self-defense. Lathi-Kaushal. Sword training. Village camps across Maharashtra and beyond. The revolution that begins in the body and spreads to the spirit.
          </p>
        </div>
      </div>

      <div className={m.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={m.statsGrid}>
          <div className={m.statCard}>
            <div className={m.statNumber}>2,000+</div>
            <div className={m.statLabel}>Girls Weaponized</div>
            <div className={m.statDesc}>Trained in armed and unarmed street defense & CQC across Maharashtra & rural heartlands.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>7–10 Days</div>
            <div className={m.statLabel}>Residential Warrior Camps</div>
            <div className={m.statDesc}>Full-immersion combat conditioning, tactical discipline, and fear-elimination drills.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>100+</div>
            <div className={m.statLabel}>Schools & Settlements</div>
            <div className={m.statDesc}>Frontline outreach in tribal corridors, residential hostels, and suburban colleges.</div>
          </div>
          <div className={m.statCard}>
            <div className={m.statNumber}>0%</div>
            <div className={m.statLabel}>Freeze Response</div>
            <div className={m.statDesc}>Stress-inoculation conditioning replaces biological freeze with decisive tactical clarity.</div>
          </div>
        </div>

        {/* ── THE DUAL-SHIELD DOCTRINE ──────────────────────────────── */}
        <div className={m.doctrineBox}>
          <span className={m.eyebrow}>The Combat Philosophy</span>
          <h2 className={m.heading} style={{ marginBottom: '1rem' }}>
            Mental Resilience Before Physical Strike: The Dual-Shield Doctrine
          </h2>
          <blockquote className={m.doctrineQuote}>
            "Before the body can strike, the mind must be liberated from fear. True empowerment is not a slogan — it is the simultaneous mastery of cognitive composure and physical capability.”
          </blockquote>
          <p className={m.doctrineText}>
            Under the leadership of Harshita Mankar (Black Belt in Karate, Expert in Lathi-Kaushal and Sword Warfare), Mission Mardini completely rejects passive, apologetic self-defense models. Conventional workshops teach women how to react only after an assault has commenced; Mission Mardini engineers an active perimeter, teaching young girls to scan baseline human behavior, neutralize threats before a trap closes, and respond with explosive leverage.
          </p>
        </div>

        {/* ── 3-TIER COMBAT CURRICULUM ──────────────────────────────── */}
        <div className={m.sectionHeader}>
          <span className={m.eyebrow}>Asymmetric Defense Matrix</span>
          <h2 className={m.heading}>Dual-Tier & Tactical Curriculum</h2>
          <p className={m.lead}>
            A rigorous multi-tiered combat syllabus designed to overpower larger, heavier adversaries under real-world street violence, ambushes, and coercive physical encounters.
          </p>
        </div>

        <div className={m.tiersGrid}>
          {/* Tier 1 */}
          <div className={m.tierCard}>
            <span className={m.tierBadge}>Tier 1 · The Mental Shield</span>
            <h3 className={m.tierTitle}>Psychological Inoculation & Situational Radar</h3>
            <ul className={m.tierList}>
              <li className={m.tierItem}>
                <strong>Pre-Attack Threat Recognition:</strong>
                Training girls to scan human baselines, decode pre-violence cues (stalking, predatory encroachment, coordinated grooming), and establish immediate territorial boundaries.
              </li>
              <li className={m.tierItem}>
                <strong>Overcoming Freeze Response:</strong>
                High-adrenaline stress-inoculation drills replace the autonomic paralysis (freeze reflex) with decisive action, ensuring danger triggers instantaneous calculated focus.
              </li>
              <li className={m.tierItem}>
                <strong>Verbal Command & Space Domination:</strong>
                Projecting voice and posture to shatter the attacker’s presumption of an easy target and alert surrounding environments.
              </li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className={m.tierCard}>
            <span className={m.tierBadge}>Tier 2 · Empty Hand</span>
            <h3 className={m.tierTitle}>Unarmed Lethality (CQC Empty-Hand Combat)</h3>
            <ul className={m.tierList}>
              <li className={m.tierItem}>
                <strong>Body Mechanics & Structural Leverage:</strong>
                Rooted in Karate empty-hand disciplines, girls learn to channel whole-body mass into strikes targeting anatomical weak points: eyes, trachea, groin, and nerve clusters.
              </li>
              <li className={m.tierItem}>
                <strong>Escape from Chokes & Grapples:</strong>
                Technical escapes from bear-hugs, hair grabs, pin-downs, and multiple assailants using centrifugal momentum rather than raw strength.
              </li>
              <li className={m.tierItem}>
                <strong>Improvised Weaponry:</strong>
                Transforming everyday objects — pens, dupattas, bags, keys, and water bottles — into effective offensive tools.
              </li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className={m.tierCard}>
            <span className={m.tierBadge}>Tier 3 · Tactical Arms</span>
            <h3 className={m.tierTitle}>Weaponized Defense (Traditional Martial Arts)</h3>
            <ul className={m.tierList}>
              <li className={m.tierItem}>
                <strong>Lathi-Kaushal (Staff Combat):</strong>
                Reviving the ancient Indian martial tradition of the wooden staff, adapted into an impenetrable perimeter-defense and crowd-control weapon for rural and urban corridors.
              </li>
              <li className={m.tierItem}>
                <strong>Blade Warfare & Edge Defense:</strong>
                Techniques to disarm edge-weapon threats, maintain grip retention, control distance, and redirect slash/stab momentum safely.
              </li>
              <li className={m.tierItem}>
                <strong>Kshatra-Dharma Discipline:</strong>
                Cultivating the sacred vow that weapons are carried not for violence, but as an inviolable deterrent to uphold Dharma and protect the innocent.
              </li>
            </ul>
          </div>
        </div>

        {/* ── 7–10 DAYS RESIDENTIAL CAMP SCHEDULE ────────────────────── */}
        <div className={m.campScheduleGrid}>
          <div className={m.scheduleCol}>
            <h4>
              <GoogleIcon name="calendar_today" size={22} style={{ color: '#DC143C' }} />
              7–10 Days Camp Immersion
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Our residential Mission Mardini camps operate across Maharashtra, Madhya Pradesh, and tribal districts. Participants live together in an ashram-like martial environment, breaking personal limitations.
            </p>
            <ul className={m.scheduleList}>
              <li className={m.scheduleItem}>
                <span>05:30 AM</span>
                <div>Prana-Ayam, Suryanamaskar & Core Conditioning</div>
              </li>
              <li className={m.scheduleItem}>
                <span>08:00 AM</span>
                <div>Lathi-Kaushal Drills & Footwork Patterns</div>
              </li>
              <li className={m.scheduleItem}>
                <span>11:00 AM</span>
                <div>Micro-Expression Profiling & Threat De-escalation Lecture</div>
              </li>
              <li className={m.scheduleItem}>
                <span>03:30 PM</span>
                <div>Close-Quarter Combat (CQC) & Ground Defense Sparring</div>
              </li>
              <li className={m.scheduleItem}>
                <span>06:30 PM</span>
                <div>Vedic Epistemology, Veerangana Sannidhi & Night Drills</div>
              </li>
            </ul>
          </div>

          <div className={m.scheduleCol}>
            <h4>
              <GoogleIcon name="military_tech" size={22} style={{ color: '#DC143C' }} />
              Warrior Certification Standards
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Every graduate of Mission Mardini undergoes rigorous tactical evaluation before earning the certified Aaryaveera badge:
            </p>
            <ul className={m.scheduleList}>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Full Contact Reaction Test:</strong> 3-minute continuous multi-attacker situational drill.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Lathi Proficiency:</strong> Flawless 12-point strike and parry sequence execution.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>First Aid & Trauma Care:</strong> Bleed control, sprain management, and emergency transport.</div>
              </li>
              <li className={m.scheduleItem}>
                <span>✓</span>
                <div><strong>Sovereign Vow:</strong> Oath of Kshatra-Dharma — never to accept victimhood, always to defend truth.</div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── CALL TO ACTION BANNER ─────────────────────────────────── */}
        <div className={m.ctaBanner}>
          <h2 className={m.ctaTitle}>Bring Mission Mardini to Your Institution</h2>
          <p className={m.ctaText}>
            We partner with schools, universities, police cadet groups, and community organizations to conduct 3-day workshops or 7–10 day certified warrior camps.
          </p>
          <div className={m.ctaButtons}>
            <Link to="/sahyog" className={m.btnPrimary}>
              <span>Host a Camp (Partner With Us)</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
            <Link to="/events" className={m.btnOutline}>
              <span>View Upcoming Public Camps</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
