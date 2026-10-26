import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'
import ap from './ArticlesPage.module.css'

interface ArticleItem {
  id: string
  tag: string
  title: string
  excerpt: string
  author: string
  readTime: string
  image: string
}

const ARTICLES_LIST: ArticleItem[] = [
  {
    id: 'art-1',
    tag: 'Itihaas',
    title: 'गार्गी — जिसने याज्ञवल्क्य से दार्शनिक बहस जीती',
    excerpt: 'Brihadaranyaka Upanishad ke darbar mein ek aisi mahila ka parcham jisne purush-pradhan dhyan ko hila kar rakh diya.',
    author: 'Shakti Sabha Research Cell',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-2',
    tag: 'Veerangana',
    title: 'रानी अब्बक्का — पहली anti-colonial naval commander',
    excerpt: 'Portuguese armada ko chaar baar samundar mein dhool chatane wali Ullal ki rani ki an-kahi veerata.',
    author: 'Aaryaveera Archives',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-3',
    tag: 'Wellness',
    title: 'Indian Women aur Anxiety — jo bolna mushkil lagta hai',
    excerpt: 'Ghar, career aur expectations ke bojh tale dabi sanson ko samajhna — clinical psychological insights.',
    author: 'Dr. Shruti Kulkarni',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-4',
    tag: 'Identity',
    title: 'Vedic India mein women ka actual role — textbooks ne kya chhupa diya',
    excerpt: 'Epigraphical evidence aur shastra praman jo batate hain ki Bharatiya nari hamesha se swatantra aur shaktishali thi.',
    author: 'Shakti Varta Collective',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
  },
]

export default function ArticlesPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [activeArticle, setActiveArticle] = useState<string | null>(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={ap.hero}>
        <div className={ap.heroInner}>
          <Link to="/" className={ap.backLink}>← Back to Home</Link>
          <span className={ap.badge}>Content Ka Dil · Latest Investigations</span>
          <h1 className={ap.title}>Featured Articles & Investigations</h1>
          <p className={ap.hindiSubtitle}>गहन शोध, इतिहास एवं मानसिक स्वास्थ्य</p>
          <p className={ap.desc}>
            Indian women ke liye — psychological support, historical identity, aur ek aisi community jo tumhari taraf hai.
            Ancient roots. Modern strength.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className={s.section}>

        {/* Big Featured Article */}
        <div className={ap.featuredBox}>
          <div className={ap.featuredImg}>
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80"
              alt="Mental Health Depression in Indian Women"
            />
          </div>
          <div className={ap.featuredBody}>
            <div className={ap.featuredTag}>
              <span>●</span> Mental Health & Psychology
            </div>
            <h2 className={ap.featuredTitle}>
              महिलाओं में Depression के 10 छुपे हुए लक्षण — जो बाहर नहीं दिखते
            </h2>
            <p className={ap.featuredExcerpt}>
              जब दर्द दिखता नहीं पर अंदर से तोड़ता है — एक Psychologist और PTSD Counselor की नज़र से।
              Ghariloo zimmewari, social conditioning aur unspoken exhaustion ko kaise pehchanein aur kaise apni shakti wapas paayein.
            </p>
            <div className={ap.featuredMeta}>
              <span>✍ Shakti Sabha Team</span>
              <span>⏱ 8 min read</span>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => setActiveArticle('महिलाओं में Depression के 10 छुपे हुए लक्षण')}
                style={{ padding: '0.75rem 2rem', background: '#DC143C', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Read Investigation →
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Article reading */}
        {activeArticle && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 999999
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
              position: 'relative'
            }}>
              <button
                onClick={() => setActiveArticle(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ✕
              </button>
              <div style={{ fontSize: '0.72rem', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Shakti Sabha Investigation · Verified Clinical Review
              </div>
              <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.6rem', color: '#111827', marginBottom: '1rem', lineHeight: 1.3 }}>
                {activeArticle}
              </h2>
              <div style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '1rem', fontWeight: 600 }}>
                  Clinical psychological observations reveal that high-functioning depression in Indian women frequently masks behind relentless caregiving, chronic fatigue labeled as 'weakness', and silent psychosomatic pain.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  1. High irritability rather than overt sadness.<br />
                  2. Guilt when resting or taking personal time.<br />
                  3. Chronic somatic digestive and spinal stiffness.<br />
                  4. Over-functioning at work or household chores to avoid intrusive thoughts.<br />
                  5. Loss of joy in traditional rituals and personal grooming.
                </p>
                <p>
                  Our Shakti Bhava counseling circles provide confidential, judgment-free support led by certified therapists. You do not have to carry this alone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4 Foundation Articles Grid */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase' }}>
                Foundation Articles
              </span>
              <h2 className={s.sectionTitle} style={{ marginBottom: 0, marginTop: '0.35rem' }}>
                Veerangana & Itihaas Archive
              </h2>
            </div>
            <Link to="/research" style={{ fontSize: '0.85rem', color: '#DC143C', fontWeight: 600 }}>
              View Thought-Lab White Papers →
            </Link>
          </div>

          <div className={ap.articlesGrid}>
            {ARTICLES_LIST.map(article => (
              <div key={article.id} className={ap.articleCard}>
                <div className={ap.cardImg}>
                  <img src={article.image} alt={article.title} />
                </div>
                <div className={ap.cardBody}>
                  <div className={ap.cardTag}>● {article.tag}</div>
                  <h3 className={ap.cardTitle}>{article.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.6, marginTop: '0.25rem' }}>
                    {article.excerpt}
                  </p>
                </div>
                <div className={ap.cardFooter}>
                  <span>{article.author}</span>
                  <button
                    onClick={() => setActiveArticle(article.title)}
                    style={{ background: 'none', border: 'none', color: '#DC143C', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    {article.readTime} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Shakti Dispatch Newsletter Box */}
        <div className={ap.dispatchBox}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8C98A', fontWeight: 700 }}>
              Section 9 · Weekly Insights
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#FFFFFF', margin: '0.5rem 0 1rem' }}>
              The Shakti Dispatch
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Har hafte — ek naya article, ek forgotten heroine ki kahani, ek psychological insight. Seedha aapke inbox mein.
            </p>

            {subscribed ? (
              <div style={{ padding: '1.25rem', background: 'rgba(220, 20, 60, 0.2)', border: '1px solid #DC143C', borderRadius: '12px', color: '#FFB3BA' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>💌</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Sabha mein swagat hai!</div>
                <div style={{ fontSize: '0.85rem' }}>You are now subscribed to The Shakti Dispatch.</div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  style={{
                    flex: '1 1 300px',
                    maxWidth: '400px',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.85rem 2.25rem',
                    borderRadius: '9999px',
                    background: '#DC143C',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  Join Sabha →
                </button>
              </form>
            )}

            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '1.25rem' }}>
              ✦ Free hai. Kabhi bhi unsubscribe kar sakte hain. No spam.
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
