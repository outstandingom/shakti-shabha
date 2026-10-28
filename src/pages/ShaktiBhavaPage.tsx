import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import b from './ShaktiBhavaPage.module.css'

export default function ShaktiBhavaPage() {
  return (
    <main className={b.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={b.hero}>
        <div className={b.heroInner}>
          <Link to="/" className={b.backLink}>← Back to Home</Link>
          <span className={b.badge}>02 · Healing · भावनात्मक संप्रभुता</span>
          <h1 className={b.title}>Shakti Bhava</h1>
          <p className={b.hindiSubtitle}>शक्ति भव · Counseling, Trauma Profiling & Crisis Rescue</p>
          <p className={b.desc}>
            Counseling. Anonymized case studies. Breaking silence on trafficking, PTSD, puberty, and depression. The space where survivors become warriors.
          </p>
        </div>
      </div>

      <div className={b.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={b.statsGrid}>
          <div className={b.statCard}>
            <div className={b.statNumber}>13</div>
            <div className={b.statLabel}>Minors Rescued</div>
            <div className={b.statDesc}>Directly directed tactical extractions from organized human trafficking rings across jurisdictional borders.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>250+</div>
            <div className={b.statLabel}>Exploitation Cases Handled</div>
            <div className={b.statDesc}>Grooming, psychological coercion, blackmail, and predatory mitigation interventions.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>500+</div>
            <div className={b.statLabel}>Women in Clinical Care</div>
            <div className={b.statDesc}>Confidential tele-counseling and somatic nervous system trauma recovery.</div>
          </div>
          <div className={b.statCard}>
            <div className={b.statNumber}>100%</div>
            <div className={b.statLabel}>HIPAA / Privacy Code</div>
            <div className={b.statDesc}>Zero disclosure. Complete pseudonymity and encrypted case archiving.</div>
          </div>
        </div>

        {/* ── PHILOSOPHY OVERVIEW ───────────────────────────────────── */}
        <div className={b.overviewBox}>
          <span className={b.eyebrow}>The Healing Doctrine</span>
          <h2 className={b.heading} style={{ marginBottom: '1rem' }}>
            Where Trauma Turns into Unshakeable Sovereignty
          </h2>
          <blockquote className={b.overviewQuote}>
            "Healing is not forgetting; it is the scientific reclamation of your nervous system and self-worth from those who attempted to diminish it.”
          </blockquote>
          <p className={b.overviewText}>
            Shakti Bhava was founded to fill a catastrophic void in conventional advocacy: statutory support systems are often overburdened, slow, and overly procedural, leaving traumatized young women in psychological isolation. Through specialized somatic de-escalation, non-verbal threat profiling, and 1-on-1 counseling, Harshita Mankar and our clinical team create a fortress of confidentiality where healing is active, scientific, and transformational.
          </p>
        </div>

        {/* ── CORE HEALING MODALITIES ───────────────────────────────── */}
        <div className={b.sectionHeader}>
          <span className={b.eyebrow}>Clinical & Field Frameworks</span>
          <h2 className={b.heading}>Four Pillars of Reclamation</h2>
          <p className={b.lead}>
            Integrated somatic, psychological, and frontline intervention frameworks developed specifically for the socio-cultural realities faced by Indian girls.
          </p>
        </div>

        <div className={b.modalitiesGrid}>
          {/* Pillar 1 */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="emergency" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>Anti-Trafficking & Crisis Rescue</h3>
            </div>
            <p className={b.modalityDesc}>
              Executing frontline interventions where vulnerable minors have been coerced, abducted, or trapped in organized predatory rings.
            </p>
            <ul className={b.modalityBullets}>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Tactical coordination with law enforcement and safe transit houses.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Immediate post-extraction medical, nutritional, and emotional triage.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Safe family reintegration or long-term independent guardianship.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="psychology" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>Non-Verbal Behavioral Profiling</h3>
            </div>
            <p className={b.modalityDesc}>
              Using micro-expression analysis and baseline behavioral profiling to identify coercive grooming, emotional blackmail, and entrapment before physical harm occurs.
            </p>
            <ul className={b.modalityBullets}>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Detecting subtle coercive manipulation in domestic and social environments.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Neutralizing systemic gaslighting and Stockholm-syndrome conditioning.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Cognitive de-escalation protocols for intense emotional ambushes.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="spa" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>Somatic PTSD Stabilization</h3>
            </div>
            <p className={b.modalityDesc}>
              Trauma lives in the nervous system. Our somatic therapy integrates traditional Vedic breath science with modern neurobiology to release chronic hyperarousal.
            </p>
            <ul className={b.modalityBullets}>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Overcoming somatic panic spikes, chronic tremors, and insomnia.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Nervous system regulation via Prana-Vayu and vagus nerve toning.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Rebuilding bodily autonomy, tactile comfort, and grounded presence.</div>
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className={b.modalityCard}>
            <div className={b.modalityHeader}>
              <GoogleIcon name="chat" size={28} style={{ color: '#059669' }} />
              <h3 className={b.modalityTitle}>1-on-1 Confidential Tele-Counseling</h3>
            </div>
            <p className={b.modalityDesc}>
              A zero-judgment safe haven accessible across India. Speak freely with empathetic female clinical psychologists under complete pseudonymity.
            </p>
            <ul className={b.modalityBullets}>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Support for depression, severe anxiety, and self-harm ideation.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>Guidance through puberty, boundary setting, and relationship distress.</div>
              </li>
              <li className={b.modalityBullet}>
                <span>●</span>
                <div>First 30-minute intake assessment provided completely free of cost.</div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── CALL TO ACTION BANNER ─────────────────────────────────── */}
        <div className={b.ctaBanner}>
          <h2 className={b.ctaTitle}>Reach Out in Complete Safety</h2>
          <p className={b.ctaText}>
            You do not have to fight alone. Whether you need immediate advice, ongoing counseling, or assistance for a loved one in crisis, our counselors are ready.
          </p>
          <div className={b.ctaButtons}>
            <Link to="/counselling#book-session" className={b.btnPrimary}>
              <span>Book Confidential Intake Session</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
            <Link to="/counselling" className={b.btnOutline}>
              <span>Explore All Counseling Services</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
