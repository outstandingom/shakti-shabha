import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import v from './ShaktiVartaPage.module.css'

export default function ShaktiVartaPage() {
  return (
    <main className={v.page}>
      {/* ── TOP HERO BANNER ────────────────────────────────────────── */}
      <div className={v.hero}>
        <div className={v.heroInner}>
          <Link to="/" className={v.backLink}>← Back to Home</Link>
          <span className={v.badge}>03 · Discourse · बौद्धिक विमर्श</span>
          <h1 className={v.title}>Shakti Varta</h1>
          <p className={v.hindiSubtitle}>शक्ति वार्ता · Vedic Epistemology, Research & Public Discourse</p>
          <p className={v.desc}>
            White papers. Research. Podcasts. Seminars. The intellectual engine that backs the revolution with verified knowledge and historical truth.
          </p>
        </div>
      </div>

      <div className={v.section}>
        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div className={v.statsGrid}>
          <div className={v.statCard}>
            <div className={v.statNumber}>500+</div>
            <div className={v.statLabel}>Keynotes & Symposiums</div>
            <div className={v.statDesc}>Convened across premier universities, residential hostels, and cultural forums.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>25,000+</div>
            <div className={v.statLabel}>Students Awakened</div>
            <div className={v.statDesc}>Consciousness deconstruction sessions dismantling consumerist & self-alienating narratives.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>200+</div>
            <div className={v.statLabel}>Fellowship Scholars</div>
            <div className={v.statDesc}>Young women actively reading foundational Vedic, Upanishadic, and historical texts.</div>
          </div>
          <div className={v.statCard}>
            <div className={v.statNumber}>12 Years</div>
            <div className={v.statLabel}>Archival Epigraphy</div>
            <div className={v.statDesc}>Documenting deciphered inscriptions and forgotten warrior queens of Bharat.</div>
          </div>
        </div>

        {/* ── THE INTELLECTUAL ENGINE ───────────────────────────────── */}
        <div className={v.overviewBox}>
          <span className={v.eyebrow}>The Thought Doctrine</span>
          <h2 className={v.heading} style={{ marginBottom: '1rem' }}>
            Rooted in Epistemology, Armed with Truth
          </h2>
          <blockquote className={v.overviewQuote}>
            "A society that forgets its warrior women soon raises apologetic victims. The revolution of the body without the fortification of the mind is fragile.”
          </blockquote>
          <p className={v.overviewText}>
            Shakti Varta is the intellectual core of Shakti Sabha. Anchoring modern empowerment in timeless Sanskrit epistemology, Harshita Mankar leads an independent research cell that counters Western reductionist frameworks. We do not borrow imported ideologies — we reconstruct the unapologetic sovereign legacy of Gargi, Rani Lakshmibai, Rani Abbakka, and countless forgotten sentinels of Indian civilization.
          </p>
        </div>

        {/* ── FOUR THOUGHT WINGS ────────────────────────────────────── */}
        <div className={v.sectionHeader}>
          <span className={v.eyebrow}>Research & Outreach Wings</span>
          <h2 className={v.heading}>The Four Pillars of Discourse</h2>
          <p className={v.lead}>
            Connecting timeless ancient sciences with contemporary legal forensics, digital media series, and grassroots intellectual fellowships.
          </p>
        </div>

        <div className={v.wingsGrid}>
          {/* Wing 1 */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="history_edu" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>Historical Reclamation Project</h3>
            </div>
            <p className={v.wingDesc}>
              Spearheading independent archival and epigraphical research across India to reconstruct uncensored records of women warriors erased from mainstream history.
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Original translation of regional palm-leaf manuscripts and copper-plate grants.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Publishing verified investigative monographs with primary archival citations.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Exposing the distortions of colonial and pseudo-secular historiography.</div>
              </li>
            </ul>
          </div>

          {/* Wing 2 */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="menu_book" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>Vedic Epistemology & Fellowship</h3>
            </div>
            <p className={v.wingDesc}>
              Connecting youth to the authentic teachings of the Bhagavad Gita, Upanishads, and Maharshi Dayananda's Satyarth Prakash to establish intellectual clarity.
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Shakti Varta Digital Fellowship for 200+ selected young women.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Weekly philosophical debates (Shastrartha) on Dharma, duty, and ethics.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Demystifying ancient Sanskrit philosophical concepts for modern application.</div>
              </li>
            </ul>
          </div>

          {/* Wing 3 */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="podcasts" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>Podcasts & Forensic Series</h3>
            </div>
            <p className={v.wingDesc}>
              Short-form and long-form investigative audio series breaking down geopolitical subversion, non-verbal psychology, and real-life rescue stories.
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>"Aaryaveera Dialogues" examining noble courage, Paurush, and Kshatra-Dharma.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Survivor interviews profiling real victories over coercive grooming networks.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Reaching thousands of youth globally across YouTube, Spotify, and Telegram.</div>
              </li>
            </ul>
          </div>

          {/* Wing 4 */}
          <div className={v.wingCard}>
            <div className={v.wingHeader}>
              <GoogleIcon name="record_voice_over" size={28} style={{ color: '#4338CA' }} />
              <h3 className={v.wingTitle}>Institutional Keynotes & Seminars</h3>
            </div>
            <p className={v.wingDesc}>
              Conducting high-impact youth awakening symposiums across residential colleges, police academies, and national conferences.
            </p>
            <ul className={v.wingBullets}>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Dismantling toxic media narratives and hyper-consumerist conditioning.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Teaching situational awareness and cyber hygiene to teenage girls.</div>
              </li>
              <li className={v.wingBullet}>
                <span>●</span>
                <div>Reviving pride in civilizational roots and personal responsibility.</div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── CALL TO ACTION BANNER ─────────────────────────────────── */}
        <div className={v.ctaBanner}>
          <h2 className={v.ctaTitle}>Engage With Our Research & Thought-Lab</h2>
          <p className={v.ctaText}>
            Dive deep into our peer-reviewed monographs, investigative case archives, and philosophical white papers.
          </p>
          <div className={v.ctaButtons}>
            <Link to="/articles" className={v.btnPrimary}>
              <span>Read Articles & White Papers</span>
              <GoogleIcon name="arrow_forward" size={16} />
            </Link>
            <Link to="/history" className={v.btnOutline}>
              <span>Explore Veeranganas Archive</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
