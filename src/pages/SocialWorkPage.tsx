import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'

const CASES = [
  { title: 'Village Defense Camp', location: 'Nagpur, Maharashtra', description: '340 women trained in Lathi-Kaushal and traditional self-defense techniques over a 3-day residential camp.', year: '2023', image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80' },
  { title: 'Survivor Circle', location: 'Amravati, Maharashtra', description: 'Anonymous support group for survivors of trafficking and domestic violence, with trained counselors present.', year: '2022', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80' },
  { title: 'Shakti Varta Seminar', location: 'Pune, Maharashtra', description: 'Academic seminar on historical women warriors of Maharashtra with 200+ attendees from universities.', year: '2023', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80' },
  { title: 'Sword Training Camp', location: 'Wardha, Maharashtra', description: 'Revival of Bharatiya martial arts tradition — sword, staff, and lathi training for 150 village girls.', year: '2022', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80' },
  { title: 'Youth Leadership Program', location: 'Yavatmal, Maharashtra', description: 'Aaryaveera certification for girls aged 14-20. Full 6-week leadership, fitness and discourse programme.', year: '2024', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80' },
]

const STATS = [
  { count: '12+', label: 'Years of Impact' },
  { count: '50,000+', label: 'Women Reached' },
  { count: '200+', label: 'Villages Served' },
  { count: '3', label: 'Active Programmes' },
]

export default function SocialWorkPage() {
  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={s.banner} style={{ background: 'linear-gradient(145deg, #A80E2D 0%, #DC143C 55%, #B01030 100%)' }}>
        <div className={s.bannerInner}>
          <Link to="/" className={s.back}>← Back to Home</Link>
          <span className={s.bannerEyebrow}>12 Years · On the Ground</span>
          <h1 className={s.bannerTitle}>Social Work Archive</h1>
          <p className={s.bannerHindi}>सामाजिक कार्य</p>
          <p className={s.bannerDesc}>Twelve years of going where others didn't. Every case study, every camp, every circle of healing — documented here.</p>
        </div>
      </div>

      {/* Stats */}
      <div className={s.statsGrid}>
        {STATS.map((st, i) => (
          <div key={i} className={s.statBox}>
            <div className={s.statCount}>{st.count}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className={s.section}>
        <h2 className={s.sectionTitle}>Case Studies & Field Reports</h2>
        <div className={s.caseGrid}>
          {CASES.map((c, i) => (
            <div key={i} className={s.caseCard}>
              <div className={s.caseImg}>
                <img src={c.image} alt={c.title} />
              </div>
              <div className={s.caseBody}>
                <div className={s.caseYear}>{c.year}</div>
                <h3 className={s.caseTitle}>{c.title}</h3>
                <div className={s.caseLoc}>{c.location}</div>
                <p className={s.caseDesc}>{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
