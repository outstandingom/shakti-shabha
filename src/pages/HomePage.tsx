import Hero         from '../components/Hero/Hero'
import Profile      from '../components/Profile/Profile'
import About        from '../components/About/About'
import Aaryaveera   from '../components/Aaryaveera/Aaryaveera'
import BrandIdentity from '../components/BrandIdentity/BrandIdentity'
import SocialWork   from '../components/SocialWork/SocialWork'
import Events       from '../components/Events/Events'
import Sahyog       from '../components/Sahyog/Sahyog'
import Courses      from '../components/Courses/Courses'
import HistoryGirls from '../components/HistoryGirls/HistoryGirls'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Profile />
      <About />
      <Aaryaveera />
      <BrandIdentity />
      <SocialWork />
      <Events />
      <Sahyog />
      <Courses />
      <HistoryGirls />
      <footer style={{ padding:'3rem', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontFamily:'Cinzel, serif', fontWeight:700, fontSize:'1rem', color:'var(--gold)' }}>
          Shakti Sabha <span style={{ fontFamily:'Noto Sans Devanagari, sans-serif', fontSize:'0.8rem', color:'var(--text-mute)', marginLeft:'0.4rem' }}>शक्ति सभा</span>
        </div>
        <div style={{ fontSize:'0.75rem', color:'var(--text-mute)' }}>FCRA Compliant · Domestic Payments Only · SRS v1.2</div>
        <div style={{ fontSize:'0.75rem', color:'var(--text-mute)' }}>Built by PrintingTask</div>
      </footer>
    </main>
  )
}
