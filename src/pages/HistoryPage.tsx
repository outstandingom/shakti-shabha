import { Link } from 'react-router-dom'

const back: React.CSSProperties = { display:'inline-flex', alignItems:'center', gap:'0.5rem', fontSize:'0.8rem', color:'var(--text-dim)', textDecoration:'none', marginBottom:'2rem', fontFamily:'var(--ff-body)', transition:'color 0.2s' }

export default function HistoryPage() {
  return (
    <main style={{ paddingTop:'6rem', paddingBottom:'6rem', paddingLeft:'3rem', paddingRight:'3rem', maxWidth:'1280px', margin:'0 auto' }}>
      <Link to="/" style={back} onMouseEnter={e => (e.currentTarget.style.color='var(--gold)')} onMouseLeave={e => (e.currentTarget.style.color='var(--text-dim)')}>
        ← Back to Home
      </Link>
      <h1 style={{ fontFamily:'Cinzel, serif', fontWeight:900, fontSize:'clamp(2.5rem,6vw,5rem)', color:'var(--gold)', marginBottom:'0.5rem' }}>History &amp; Today&apos;s Success Girls</h1>
      <p style={{ fontFamily:'Noto Sans Devanagari, sans-serif', fontSize:'1rem', color:'var(--text-mute)', marginBottom:'3rem' }}>इतिहास और सफलता की कहानियाँ</p>
      <p style={{ fontSize:'1rem', color:'var(--text-dim)', maxWidth:'60ch', lineHeight:'1.85', marginBottom:'4rem' }}>Historical women warriors with verified, footnoted sources alongside today&apos;s Shakti Sabha graduates — their stories, their journeys, their proof that the revolution works.</p>
      <div style={{ padding:'3rem', border:'1px solid var(--border)', textAlign:'center', color:'var(--text-mute)', fontSize:'0.875rem' }}>
        Full History content loads here — connected to the backend CMS and admin panel.
      </div>
    </main>
  )
}
