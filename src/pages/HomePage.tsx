import Hero         from '../components/Hero/Hero'
import Profile      from '../components/Profile/Profile'
import About        from '../components/About/About'
import Aaryaveera   from '../components/Aaryaveera/Aaryaveera'
import SocialWork   from '../components/SocialWork/SocialWork'
import Events       from '../components/Events/Events'
import Sahyog       from '../components/Sahyog/Sahyog'
import Courses      from '../components/Courses/Courses'
import HistoryGirls from '../components/HistoryGirls/HistoryGirls'
import Footer       from '../components/Footer/Footer'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Profile />
      <About />
      <Aaryaveera />
      <SocialWork />
      <Events />
      <Sahyog />
      <Courses />
      <HistoryGirls />
      <Footer />
    </main>
  )
}
