import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './ThreeStreamsPage.module.css'

export default function ThreeStreamsPage() {
  return (
    <main className={s.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <Link to="/" className={s.backLink}>
            <GoogleIcon name="arrow_back" size={16} />
            Back to Home
          </Link>
          <span className={s.badge}>Architecture · The Tri-Stream Doctrine</span>
          <h1 className={s.title}>The Union of Peace &amp; Revolution</h1>
          <p className={s.hindiSubtitle}>शान्ति और क्रान्ति का संगम · त्रिवेणी दर्शन</p>
          <p className={s.desc}>
            Everything Shakti Sabha builds lives within one of three streams — each distinct in method, unified in purpose: dignity, safety, and awakening for every woman who stands with us.
          </p>

          <div className={s.heroTags}>
            <Link to="/mardini" className={`${s.heroTag} ${s.tagMardini}`}>
              01 Revolution · Mardini (मर्दिनी) →
            </Link>
            <Link to="/shakti-bhava" className={`${s.heroTag} ${s.tagBhava}`}>
              02 Healing · Shakti Bhava (शक्ति भव) →
            </Link>
            <Link to="/shakti-varta" className={`${s.heroTag} ${s.tagVarta}`}>
              03 Discourse · Shakti Varta (शक्ति वार्ता) →
            </Link>
          </div>
        </div>
      </div>

      <div className={s.section}>
        {/* ── UNIFIED CORE METRICS ──────────────────────────────────── */}
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <div className={s.statNumber}>2,000+</div>
            <div className={s.statLabel}>Girls Weaponized</div>
            <div className={s.statDesc}>Trained in CQC, Lathi & empty-hand tactical combat.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>13</div>
            <div className={s.statLabel}>Minors Rescued</div>
            <div className={s.statDesc}>Tactical extractions from human-trafficking rings.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>250+</div>
            <div className={s.statLabel}>Crises Resolved</div>
            <div className={s.statDesc}>High-stakes field rescues & coercive exploitation cases.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>500+</div>
            <div className={s.statLabel}>Keynotes & Seminars</div>
            <div className={s.statDesc}>Consciousness discourses & civilizational debriefs.</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>25,000+</div>
            <div className={s.statLabel}>Students Reached</div>
            <div className={s.statDesc}>Youth awakening workshops across Maharashtra.</div>
          </div>
        </div>

        {/* ── THE FOUNDATIONAL PHILOSOPHY ──────────────────────────── */}
        <div className={s.manifestoBox}>
          <span className={s.eyebrow}>The Core Doctrine</span>
          <h2 className={s.heading}>
            Why Neither Weapon Nor Wisdom Alone Is Sufficient
          </h2>
          <blockquote className={s.manifestoQuote}>
            "We do not build dependent victims; we forge sovereign, intellectually fortified, and tactically invincible sentinels of Indian civilization."
          </blockquote>
          <p className={s.manifestoText}>
            Peace without tactical readiness is an illusion that invites subjugation. Revolution without intellectual discipline descends into chaos. Shakti Sabha operates on an unbroken continuum: when a woman's body is fortified, her psychological sovereignty awakens; when her mind is freed from trauma, she becomes capable of leading her community; and when she is anchored in civilizational truth, her voice becomes unshakeable.
          </p>
          <p className={s.manifestoText}>
            Under the frontline leadership of Founder Harshita Mankar, these three streams are not disjointed initiatives — they are an integrated operating system for total female autonomy.
          </p>
        </div>

        {/* ── THE THREE PILLARS IN DETAIL ───────────────────────────── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className={s.eyebrow}>Detailed Stream Directives</span>
          <h2 className={s.heading}>Explore The Three Wings</h2>
        </div>

        <div className={s.streamsGrid}>
          {/* Stream 01 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#DC143C' }}>01</span>
              <span className={s.streamBadge} style={{ background: 'rgba(220, 20, 60, 0.1)', color: '#DC143C' }}>
                Revolution
              </span>
            </div>
            <h3 className={s.streamName}>Mardini</h3>
            <div className={s.streamDev}>मर्दिनी · Physical Defense</div>
            <p className={s.streamSummary}>
              Self-defense. Lathi-Kaushal. Sword training. Village camps across Maharashtra and beyond. The revolution that begins in the body and spreads to the spirit.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="sports_kabaddi" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>Dual-Tier asymmetric combat matrix (CQC, bio-mechanical leverage)</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="shield" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>Lathi-Kaushal (traditional quarterstaff) and Talwar tactical mastery</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="campaign" size={18} style={{ color: '#DC143C', flexShrink: 0 }} />
                <span>7–10 Day residential immersive warrior camps across districts</span>
              </li>
            </ul>
            <Link to="/mardini" className={`${s.streamBtn} ${s.streamBtnMardini}`}>
              <span>Explore Mission Mardini</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Stream 02 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#166534' }}>02</span>
              <span className={s.streamBadge} style={{ background: 'rgba(22, 101, 52, 0.1)', color: '#166534' }}>
                Healing
              </span>
            </div>
            <h3 className={s.streamName}>Shakti Bhava</h3>
            <div className={s.streamDev}>शक्ति भव · Emotional Sovereignty</div>
            <p className={s.streamSummary}>
              Counseling. Anonymized case studies. Breaking silence on trafficking, PTSD, puberty, and depression. The space where survivors become warriors.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="emergency" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>Tactical frontline extractions & anti-trafficking rescue operations</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="psychology" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>Non-verbal behavioral profiling & micro-expression risk detection</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="spa" size={18} style={{ color: '#166534', flexShrink: 0 }} />
                <span>Somatic PTSD stabilization & post-extraction psychological reclamation</span>
              </li>
            </ul>
            <Link to="/shakti-bhava" className={`${s.streamBtn} ${s.streamBtnBhava}`}>
              <span>Explore Shakti Bhava</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Stream 03 */}
          <div className={s.streamCard}>
            <div className={s.streamCardHead}>
              <span className={s.streamNum} style={{ color: '#4338CA' }}>03</span>
              <span className={s.streamBadge} style={{ background: 'rgba(67, 56, 202, 0.1)', color: '#4338CA' }}>
                Discourse
              </span>
            </div>
            <h3 className={s.streamName}>Shakti Varta</h3>
            <div className={s.streamDev}>शक्ति वार्ता · Intellectual Sovereignty</div>
            <p className={s.streamSummary}>
              White papers. Research. Podcasts. Seminars. The intellectual engine that backs the revolution with verified knowledge and historical truth.
            </p>
            <ul className={s.streamHighlights}>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="history_edu" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>De-colonizing feminine historiography & Veerangana archives</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="menu_book" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>Epistemic research white papers on Kshatra-Dharma & cognitive sovereignty</span>
              </li>
              <li className={s.streamHighlightItem}>
                <GoogleIcon name="mic" size={18} style={{ color: '#4338CA', flexShrink: 0 }} />
                <span>500+ University keynotes & high-impact youth consciousness seminars</span>
              </li>
            </ul>
            <Link to="/shakti-varta" className={`${s.streamBtn} ${s.streamBtnVarta}`}>
              <span>Explore Shakti Varta</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        {/* ── THE TRI-STREAM CONVERGENCE ────────────────────────────── */}
        <div className={s.convergenceSection}>
          <span className={s.eyebrow}>The Lifecycle of Sovereignty</span>
          <h2 className={s.heading} style={{ marginBottom: '0.75rem' }}>
            How The Three Streams Converge in Practice
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', maxWidth: '75ch', lineHeight: 1.65 }}>
            A young woman entering Shakti Sabha does not experience isolated silos. She journeys through an integrated metamorphosis that transforms crisis into civilizational leadership:
          </p>

          <div className={s.convergenceGrid}>
            <div className={s.convStep}>
              <div className={s.convStepNum}>1</div>
              <h4 className={s.convStepTitle}>Extraction & Safety (Shakti Bhava)</h4>
              <p className={s.convStepDesc}>
                Immediate physical de-escalation, rapid crisis response, non-verbal profiling, and stabilization from domestic or predatory coercive environments.
              </p>
            </div>
            <div className={s.convStep}>
              <div className={s.convStepNum}>2</div>
              <h4 className={s.convStepTitle}>Combat Fortification (Mission Mardini)</h4>
              <p className={s.convStepDesc}>
                7–10 days of rigorous physical conditioning, mastering empty-hand leverage and weapons, overwriting biological freeze responses with decisive muscle memory.
              </p>
            </div>
            <div className={s.convStep}>
              <div className={s.convStepNum}>3</div>
              <h4 className={s.convStepTitle}>Intellectual Sovereignty (Shakti Varta)</h4>
              <p className={s.convStepDesc}>
                Deep-rooted ideological grounding in Vedic philosophy, public advocacy training, and peer mentorship to defend and awaken subsequent generations.
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CALL TO ACTION ────────────────────────────────── */}
        <div className={s.bottomCta}>
          <span className={s.eyebrow}>Join the Movement</span>
          <h2 className={s.heading} style={{ marginBottom: '0.75rem' }}>
            Stand with Shakti Sabha
          </h2>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', maxWidth: '65ch', margin: '0 auto', lineHeight: 1.6 }}>
            Whether you seek tactical training for your institution, crisis intervention guidance, or wish to contribute to civilizational research, our doors are open.
          </p>
          <div className={s.ctaButtons}>
            <Link to="/events" className={s.primaryBtn}>
              <GoogleIcon name="event" size={18} />
              View Upcoming Warrior Camps
            </Link>
            <Link to="/sahyog" className={s.secondaryBtn}>
              Support Our Mission
            </Link>
            <Link to="/about" className={s.secondaryBtn}>
              Read Founder Dossier
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
