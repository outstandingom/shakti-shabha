import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation/Navigation'
import FireCursor from './components/FireCursor/FireCursor'
import FallingLeaves from './components/FallingLeaves/FallingLeaves'
import { AuthProvider } from './lib/AuthContext'
import HomePage from './pages/HomePage'
import AaryaveeraPage from './pages/AaryaveeraPage'
import SocialWorkPage from './pages/SocialWorkPage'
import EventsPage from './pages/EventsPage'
import ImpactPage from './pages/ImpactPage'
import SahyogPage from './pages/SahyogPage'
import CoursesPage from './pages/CoursesPage'
import HistoryPage from './pages/HistoryPage'
import BrandPage from './pages/BrandPage'
import AboutPage from './pages/AboutPage'
import CaseStudyPage from './pages/CaseStudyPage'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import ArticlesPage from './pages/ArticlesPage'
import CounsellingPage from './pages/CounsellingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import MardiniPage from './pages/MardiniPage'
import ShaktiBhavaPage from './pages/ShaktiBhavaPage'
import ShaktiVartaPage from './pages/ShaktiVartaPage'
import ThreeStreamsPage from './pages/ThreeStreamsPage'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useContext(LenisContext)

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [lenis, pathname])

  return null
}

function LenisProvider() {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    const updateLenis = (time: number) => instance.raf(time * 1000)

    instance.on('scroll', updateScrollTrigger)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      setLenis(null)
      instance.off('scroll', updateScrollTrigger)
      gsap.ticker.remove(updateLenis)
      instance.destroy()
    }
  }, [])

  const value = useMemo(() => lenis, [lenis])

  return (
    <LenisContext.Provider value={value}>
      <ScrollToTop />
      {/* Global fire cursor — fixed, above all content, pointer-events: none */}
      <FireCursor />
      {/* Global falling leaves — fixed across all pages, dynamic mouse physics, pointer-events: none */}
      <FallingLeaves />
      <Navigation />
      <Routes>
        <Route path="/"                     element={<HomePage />} />
        <Route path="/aaryaveera"           element={<AaryaveeraPage />} />
        <Route path="/mardini"              element={<MardiniPage />} />
        <Route path="/mission-mardini"      element={<MardiniPage />} />
        <Route path="/shakti-bhava"         element={<ShaktiBhavaPage />} />
        <Route path="/shakti-varta"         element={<ShaktiVartaPage />} />
        <Route path="/social-work"          element={<SocialWorkPage />} />
        <Route path="/events"               element={<EventsPage />} />
        <Route path="/impact"               element={<ImpactPage />} />
        <Route path="/impact-archive"       element={<ImpactPage />} />
        <Route path="/sahyog"               element={<SahyogPage />} />
        <Route path="/courses"              element={<CoursesPage />} />
        <Route path="/history"              element={<HistoryPage />} />
        <Route path="/gallery"              element={<GalleryPage />} />
        <Route path="/articles"             element={<ArticlesPage />} />
        <Route path="/counselling"          element={<CounsellingPage />} />
        <Route path="/case-study"           element={<CaseStudyPage />} />
        <Route path="/research"             element={<ResearchPage />} />
        <Route path="/brand"                element={<BrandPage />} />
        <Route path="/about"                element={<AboutPage />} />
        <Route path="/three-streams"        element={<ThreeStreamsPage />} />
        <Route path="/streams"              element={<ThreeStreamsPage />} />
        <Route path="/peace-and-revolution" element={<ThreeStreamsPage />} />
        <Route path="/login"                element={<LoginPage />} />
        <Route path="/register"             element={<RegisterPage />} />
        <Route path="/admin"                element={<AdminDashboard />} />
      </Routes>
    </LenisContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LenisProvider />
      </AuthProvider>
    </BrowserRouter>
  )
}
