import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'
import cp from './CoursesPage.module.css'

interface CourseItem {
  id: string
  title: string
  category: string
  level: string
  duration: string
  modules: string
  price: string
  desc: string
  image: string
}

const COURSES_DATA: CourseItem[] = [
  {
    id: 'c-1',
    title: 'Self-Defense Foundations & Situational Readiness',
    category: 'Mardini · Self Defense',
    level: 'Beginner',
    duration: '4 Weeks',
    modules: '8 Video Modules + Quizzes',
    price: '₹1,800',
    desc: 'Core biomechanics of human vulnerabilities, escaping holds, improvised weapon defense, and rapid emergency voice command protocols.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-2',
    title: 'Character Building & Mental Fortitude for Young Women',
    category: 'Aaryaveera Leadership',
    level: 'Intermediate',
    duration: '6 Weeks',
    modules: '12 Deep Dives + Journal',
    price: '₹2,200',
    desc: 'Unapologetic boundary setting, overcoming public anxiety, vocal projection, resilience training, and cultivating unshakeable self-worth.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-3',
    title: 'Vedic Parenting & Dharmic Nurturance for Tomorrow',
    category: 'Cultural Education',
    level: 'All Levels',
    duration: '3 Weeks',
    modules: '6 Modules + Community',
    price: '₹1,500',
    desc: 'How classical Indian wisdom, sanskaras, and emotional anchoring build confident children resilient against toxic digital addiction.',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-4',
    title: 'Strategic Leadership for the Modern Bharatiya Warrior',
    category: 'Executive & Youth',
    level: 'Advanced',
    duration: '8 Weeks',
    modules: '16 Modules + Live Mentorship',
    price: '₹3,000',
    desc: 'Community organizing, legal literacy under Bharatiya Nyaya Sanhita, crisis mediation, and grassroots campaign management.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-5',
    title: 'Shakti Varta: Intellectual Discourse & Debating Dogmas',
    category: 'Thought-Lab',
    level: 'Intermediate',
    duration: '4 Weeks',
    modules: '8 Modules + Case Studies',
    price: '₹1,800',
    desc: 'Master the art of rigorous intellectual debate, analyzing Western feminist narratives vs civilizational Bharatiya thought with verified sources.',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-6',
    title: 'Traditional Lathi-Kaushal & Staff Combat Video Guide',
    category: 'Martial Heritage',
    level: 'Beginner to Intermediate',
    duration: '6 Weeks',
    modules: '10 High-Def Form Drills',
    price: '₹2,000',
    desc: 'Step-by-step master angles, footwork, dual-strike blocks, and rhythmic flow drills from experienced Maharashtra lathi masters.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
  },
]

const MERCH_DATA = [
  { icon: '👕', title: 'Aaryaveera Flame Tee', price: '₹799', tag: '100% Organic Cotton' },
  { icon: '📚', title: 'The Legal Collage Handbook', price: '₹450', tag: 'Paperback · 220 Pages' },
  { icon: '🥋', title: 'Traditional Bamboo Lathi Staff', price: '₹650', tag: 'Seasoned Wood · 5.5 ft' },
  { icon: '👜', title: 'Shakti Sabha Warrior Tote', price: '₹399', tag: 'Durable Canvas' },
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={cp.hero}>
        <div className={cp.heroInner}>
          <Link to="/" className={cp.backLink}>← Back to Home</Link>
          <span className={cp.badge}>SRS Section 11 · DRM Protected LMS</span>
          <h1 className={cp.title}>Courses & Learning</h1>
          <p className={cp.hindiSubtitle}>पाठ्यक्रम एवं ज्ञान मंच · Self-Defense & Leadership</p>
          <p className={cp.desc}>
            Structured, high-definition online masterclasses protected by AWS CloudFront signed URLs to prevent unauthorized piracy.
            Earn the prestigious Aaryaveera Warrior Certification and gain lifetime access to updates and private student forums.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={s.section}>

        {/* Featured Aaryaveera Certification Banner */}
        <div className={cp.certBox}>
          <div>
            <div className={cp.certHeader}>
              <span className={cp.certTag}>Signature Program</span>
              <span style={{ color: '#D4AF37', fontSize: '0.8rem', fontWeight: 600 }}>6-Week Intensive</span>
            </div>
            <h2 className={cp.certTitle}>
              Aaryaveera Warrior Certification
            </h2>
            <p className={cp.certDesc}>
              The comprehensive flagship curriculum designed by Shakti Sabha. Blends physical self-defense, psychological grounding,
              ancient Dharmic ethos, and modern legal protection frameworks into a transformational 6-week journey.
            </p>

            <div className={cp.syllabusList}>
              <div className={cp.syllabusItem}>
                <span className={cp.checkIcon}>✓</span>
                <span><strong>Weeks 1–2:</strong> Biomechanical Self-Defense, Escape Protocols & Voice Conditioning</span>
              </div>
              <div className={cp.syllabusItem}>
                <span className={cp.checkIcon}>✓</span>
                <span><strong>Weeks 3–4:</strong> Psychological Boundary Defense, Overcoming Trauma & Fear Management</span>
              </div>
              <div className={cp.syllabusItem}>
                <span className={cp.checkIcon}>✓</span>
                <span><strong>Weeks 5–6:</strong> Dharmic Leadership, Legal Rights under BNS, and Community Defense</span>
              </div>
              <div className={cp.syllabusItem}>
                <span className={cp.checkIcon}>✓</span>
                <span><strong>Final Capstone:</strong> Video Submission Exam + Digital & Embossed Physical Certificate</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className={s.goldBtn}
                onClick={() => {
                  setSelectedCourse('Aaryaveera Warrior Certification')
                  setTimeout(() => setSelectedCourse(null), 3000)
                }}
              >
                Enroll in Program — ₹4,500 →
              </button>
              <a href="#all-courses" className={s.goldOutlineBtn}>
                View All Courses
              </a>
            </div>
          </div>

          <div className={cp.certCardRight}>
            <div className={cp.certBadgeImg}>⚔</div>
            <div style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Official Credential
            </div>
            <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '1rem' }}>
              Aaryaveera Graduate
            </h3>
            <div className={cp.certPrice}>₹4,500</div>
            <div className={cp.certPeriod}>One-time investment · Lifetime access</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: '1rem' }}>
              Includes physical embossed certificate delivered anywhere in India + verified QR credential.
            </div>
          </div>
        </div>

        {/* Course Catalog */}
        <div id="all-courses" style={{ marginTop: '5rem' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
            Comprehensive Syllabus
          </span>
          <h2 className={s.sectionTitle} style={{ marginTop: '0.4rem' }}>All Online Courses</h2>

          <div className={cp.coursesGrid}>
            {COURSES_DATA.map(course => (
              <div key={course.id} className={cp.courseCard}>
                <div className={cp.courseImg}>
                  <img src={course.image} alt={course.title} />
                  <div className={cp.drmBadge}>
                    <span>🔒</span> DRM Encrypted
                  </div>
                </div>

                <div className={cp.courseBody}>
                  <div className={cp.courseCategory}>{course.category}</div>
                  <h3 className={cp.courseTitle}>{course.title}</h3>
                  <div className={cp.courseMeta}>
                    <span>⏱ {course.duration}</span>
                    <span>📊 {course.level}</span>
                  </div>
                  <p className={cp.courseDesc}>{course.desc}</p>
                </div>

                <div className={cp.courseFooter}>
                  <div>
                    <div className={cp.coursePrice}>{course.price}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{course.modules}</div>
                  </div>
                  <button
                    className={cp.enrollBtn}
                    onClick={() => {
                      setSelectedCourse(course.title)
                      setTimeout(() => setSelectedCourse(null), 3000)
                    }}
                  >
                    Enroll Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Modal / Toast */}
        {selectedCourse && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: '#111827',
            color: '#FFFFFF',
            padding: '1.25rem 2rem',
            borderRadius: '12px',
            border: '1px solid #C9A96E',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: 9999,
          }}>
            <div style={{ fontWeight: 700, color: '#E8C98A', marginBottom: '0.25rem' }}>Initiating Domestic Gateway</div>
            <div style={{ fontSize: '0.85rem', color: '#E5E7EB' }}>Course: <strong>{selectedCourse}</strong></div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.4rem' }}>*DRM CloudFront streaming credentials will be emailed upon checkout.</div>
          </div>
        )}

        {/* LMS Platform Architecture Specs */}
        <div className={cp.techSpecsSection}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Enterprise Grade LMS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.75rem', color: '#111827', marginTop: '0.35rem' }}>
              Built for Security, Speed & Retention
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '0.5rem' }}>
              Our bespoke streaming infrastructure prevents content leaks and screen-scraping while delivering crisp video even on 2G/3G rural networks.
            </p>
          </div>

          <div className={cp.specsGrid}>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>🛡</div>
              <h4 className={cp.specTitle}>DRM CloudFront</h4>
              <p className={cp.specText}>Time-limited signed URLs and dynamic watermarking prevent unauthorized video downloading and recording.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>📈</div>
              <h4 className={cp.specTitle}>Progress Tracking</h4>
              <p className={cp.specText}>Automatic module completion tracking, formative comprehension quizzes, and structured note-taking.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>📱</div>
              <h4 className={cp.specTitle}>Responsive Player</h4>
              <p className={cp.specText}>0.5x to 2x speed adjustment, multi-language subtitle tracks (Hindi & English), and mobile offline caching.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>📜</div>
              <h4 className={cp.specTitle}>Digital Credential</h4>
              <p className={cp.specText}>Cryptographically tamper-proof PDF certificates with public verification hashes for academic credit.</p>
            </div>
          </div>
        </div>

        {/* E-Commerce Store Teaser */}
        <div className={cp.storeSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
                SRS Section 11 · Value Store
              </span>
              <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>Aaryaveera Merchandise & Books</h2>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>
              *100% of merchandise proceeds directly fund free rural village camps.
            </div>
          </div>

          <div className={cp.storeGrid}>
            {MERCH_DATA.map((item, idx) => (
              <div key={idx} className={cp.storeCard}>
                <div className={cp.storeImg}>
                  {item.icon}
                </div>
                <div className={cp.storeInfo}>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>{item.tag}</div>
                  <h4 className={cp.storeTitle}>{item.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span className={cp.storePrice}>{item.price}</span>
                    <button
                      onClick={() => alert(`Item "${item.title}" added to order draft.`)}
                      style={{ padding: '0.4rem 1rem', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Order →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FCRA Compliance Notice */}
        <div style={{ marginTop: '4rem', padding: '1.25rem 2rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', fontSize: '0.82rem', color: '#991B1B', lineHeight: 1.6 }}>
          <strong>Legal & FCRA Compliance Notice:</strong> Shakti Sabha collects domestic transactions in Indian Rupees (INR) exclusively via certified domestic payment gateways (Razorpay / RuPay / UPI). In strict adherence to the Foreign Contribution Regulation Act (FCRA), international donation and payment flows are disabled.
        </div>

      </div>
    </main>
  )
}
