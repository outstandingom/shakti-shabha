import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation/Navigation'
import FireCursor from './components/FireCursor/FireCursor'
import HomePage from './pages/HomePage'
import AaryaveeraPage from './pages/AaryaveeraPage'
import SocialWorkPage from './pages/SocialWorkPage'
import EventsPage from './pages/EventsPage'
import SahyogPage from './pages/SahyogPage'
import CoursesPage from './pages/CoursesPage'
import HistoryPage from './pages/HistoryPage'
import BrandPage from './pages/BrandPage'
import AboutPage from './pages/AboutPage'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time: number) {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <LenisProvider />
      <ScrollToTop />
      {/* Global fire cursor — fixed, above all content, pointer-events: none */}
      <FireCursor />
      <Navigation />
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/aaryaveera"          element={<AaryaveeraPage />} />
        <Route path="/social-work"         element={<SocialWorkPage />} />
        <Route path="/events"              element={<EventsPage />} />
        <Route path="/sahyog"              element={<SahyogPage />} />
        <Route path="/courses"             element={<CoursesPage />} />
        <Route path="/history"             element={<HistoryPage />} />
        <Route path="/brand"               element={<BrandPage />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/peace-and-revolution" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
