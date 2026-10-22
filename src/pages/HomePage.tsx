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
      <footer style={{ padding:'3.5rem 3rem', borderTop:'1px solid var(--border)', background:'var(--theme-bg, #FFFFFF)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem' }}>
        <div style={{ fontFamily:'Cinzel, serif', fontWeight:700, fontSize:'1.1rem', color:'var(--theme-primary, #DC143C)' }}>
          Shakti Sabha <span style={{ fontFamily:'Noto Sans Devanagari, sans-serif', fontSize:'0.85rem', color:'var(--theme-text-subtle, #777777)', marginLeft:'0.4rem' }}>शक्ति सभा</span>
        </div>
        <div style={{ fontSize:'0.78rem', color:'var(--theme-text-muted, #555555)' }}>FCRA Compliant · Domestic Payments Only · SRS v1.2</div>
        <div style={{ fontSize:'0.78rem', color:'var(--theme-text-subtle, #777777)' }}>Built by PrintingTask</div>
      </footer>
    </main>
  )
}
