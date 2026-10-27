import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Course } from '../lib/supabase'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
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
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'c-5',
    title: 'Dharma, Paurush & Civilizational Discourse',
    category: 'Philosophy & History',
    level: 'Intermediate',
    duration: '5 Weeks',
    modules: '10 Lectures + Source Texts',
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
  { icon: 'checkroom', title: 'Aaryaveera Flame Tee', price: '₹799', tag: '100% Organic Cotton' },
  { icon: 'menu_book', title: 'The Legal Collage Handbook', price: '₹450', tag: 'Paperback · 220 Pages' },
  { icon: 'sports_martial_arts', title: 'Traditional Bamboo Lathi Staff', price: '₹650', tag: 'Seasoned Wood · 5.5 ft' },
  { icon: 'shopping_bag', title: 'Shakti Sabha Warrior Tote', price: '₹399', tag: 'Durable Canvas' },
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [dbCourses, setDbCourses] = useState<CourseItem[]>([])

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          const mapped: CourseItem[] = (data as Course[]).map(c => ({
            id: c.id,
            title: c.title,
            category: c.instructor ? `Instructor: ${c.instructor}` : 'Shakti Academy',
            level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : 'All Levels',
            duration: c.duration || 'Flexible',
            modules: c.syllabus ? `${c.syllabus.length} Modules` : 'Structured Curriculum',
            price: c.price ? `₹${c.price}` : 'Free',
            desc: c.description || '',
            image: c.cover_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
          }))
          setDbCourses(mapped)
        }
      } catch (err) {
        console.warn('Courses fetch error:', err)
      }
    }
    loadCourses()
  }, [])

  const allCourses = [...dbCourses, ...COURSES_DATA]

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              Structured Curriculum
            </span>
            <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>Available Video Masterclasses</h2>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#6B7280' }}>
            Showing {allCourses.length} Certified Courses
          </div>
        </div>

        {/* Courses Grid */}
        <div className={cp.coursesGrid}>
          {allCourses.map(course => (
            <div key={course.id} className={cp.courseCard}>
              <div className={cp.imgWrap}>
                <img src={course.image} alt={course.title} className={cp.courseImg} loading="lazy" />
                <span className={cp.badgeLevel}>{course.level}</span>
              </div>

              <div className={cp.courseBody}>
                <div className={cp.category}>{course.category}</div>
                <h3 className={cp.courseTitle}>{course.title}</h3>
                <p className={cp.descText}>{course.desc}</p>

                <div className={cp.metaGrid}>
                  <div className={cp.metaItem}>
                    <GoogleIcon name="schedule" size={16} style={{ color: '#DC143C' }} />
                    <span>{course.duration}</span>
                  </div>
                  <div className={cp.metaItem}>
                    <GoogleIcon name="play_circle" size={16} style={{ color: '#DC143C' }} />
                    <span>{course.modules}</span>
                  </div>
                </div>

                <div className={cp.cardFooter}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', display: 'block' }}>One-time Fee</span>
                    <span className={cp.priceText}>{course.price}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course.title)}
                    className={cp.enrollBtn}
                  >
                    Enroll Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment Confirmation Modal */}
        {selectedCourse && (
          <div className={cp.modalOverlay} onClick={() => setSelectedCourse(null)}>
            <div className={cp.modalContent} onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <GoogleIcon name="school" size={48} style={{ color: '#DC143C', marginBottom: '0.5rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.4rem', color: '#111827' }}>Enrollment Intake</h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', marginTop: '0.25rem' }}>{selectedCourse}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Redirecting to secure Razorpay payment gateway...'); setSelectedCourse(null) }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Full Name</label>
                  <input required type="text" placeholder="Your name as it should appear on certificate" style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Email Address (LMS Login)</label>
                  <input required type="email" placeholder="you@email.com" style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>WhatsApp / Mobile</label>
                  <input required type="tel" placeholder="+91..." style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setSelectedCourse(null)} style={{ flex: 1, padding: '0.7rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 2, padding: '0.7rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Proceed to Pay →</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Technical Architecture Specs (SRS Section 11 Compliance) */}
        <div className={cp.techSpecsBox}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
              LMS Platform Architecture
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', margin: '0.4rem 0 0' }}>
              Built for Security, Speed & Retention
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', marginTop: '0.5rem' }}>
              Our bespoke streaming infrastructure prevents content leaks and screen-scraping while delivering crisp video even on 2G/3G rural networks.
            </p>
          </div>

          <div className={cp.specsGrid}>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="shield" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>DRM CloudFront</h4>
              <p className={cp.specText}>Time-limited signed URLs and dynamic watermarking prevent unauthorized video downloading and recording.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="trending_up" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>Progress Tracking</h4>
              <p className={cp.specText}>Automatic module completion tracking, formative comprehension quizzes, and structured note-taking.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="stay_current_portrait" size={32} style={{ color: '#DC143C' }} />
              </div>
              <h4 className={cp.specTitle}>Responsive Player</h4>
              <p className={cp.specText}>0.5x to 2x speed adjustment, multi-language subtitle tracks (Hindi & English), and mobile offline caching.</p>
            </div>
            <div className={cp.specCard}>
              <div className={cp.specIcon}>
                <GoogleIcon name="verified" size={32} style={{ color: '#DC143C' }} />
              </div>
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
                  <GoogleIcon name={item.icon} size={36} style={{ color: '#DC143C' }} />
                </div>
                <div className={cp.storeInfo}>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>{item.tag}</div>
                  <h4 className={cp.storeTitle}>{item.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span className={cp.storePrice}>{item.price}</span>
                    <button style={{ padding: '0.35rem 0.85rem', background: '#111827', color: '#FFFFFF', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Order Kit →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
