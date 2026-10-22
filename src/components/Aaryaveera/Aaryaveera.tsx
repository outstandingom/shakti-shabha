import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Aaryaveera.module.css'

const CARDS = [
  { 
    icon: '⚔', 
    title: 'Self-Defense & Training', 
    text: 'Aaryaveera Camps and Warrior Certification. The trained body is the first declaration of freedom.' 
  },
  { 
    icon: '🔥', 
    title: 'Character & Leadership', 
    text: 'Courses that build the Aaryaveera spirit — noble, fearless, anchored in Dharma and cultural roots.' 
  },
  { 
    icon: '◎', 
    title: 'Dialogue & Research', 
    text: '"Aaryaveera Dialogues" under Shakti Varta — honest discourse on true masculinity, Paurush, and Dharma.' 
  },
]

export default function Aaryaveera() {
  const secRef  = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { 
          trigger: secRef.current, 
          start: 'top 70%', 
          toggleActions: 'play none none none' 
        }
      })
      tl.from('[data-av="eyebrow"]', { opacity: 0, y: 10, duration: 0.4 })
        .from('[data-av="title"]',   { y: '110%', duration: 1, ease: 'power4.out' }, '-=0.2')
        .from('[data-av="sub"]',     { opacity: 0, y: 14, duration: 0.5 }, '-=0.4')
        .from('[data-av="motto"]',   { opacity: 0, duration: 0.5 }, '-=0.3')
        .from('[data-av="card"]',    { opacity: 0, y: 24, stagger: 0.1, duration: 0.5 }, '-=0.2')
        .from('[data-av="cta"]',     { opacity: 0, y: 12, duration: 0.4 }, '-=0.1')

      // Breathing glow
      gsap.to(glowRef.current, {
        opacity: 0.5, 
        scale: 1.1, 
        repeat: -1, 
        yoyo: true, 
        duration: 3.5, 
        ease: 'sine.inOut'
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div ref={glowRef} className={s.glow} />
      <div className={s.inner}>
        <span data-av="eyebrow" className={s.eyebrow}>
          Signature Initiative · Aaryaveera
        </span>
        <div className={s.titleClip}>
          <span data-av="title" className={s.title}>
            AARYAVEERA
          </span>
        </div>
        <span data-av="sub" className={s.sub}>
          आर्यवीरा · The Warrior Spirit
        </span>
        <span data-av="motto" className={s.motto}>
          "Shakti Se Shanti — From Strength, Peace"
        </span>
        <p className={s.poweredBy}>Powered by PrintingTask</p>

        <div className={s.grid}>
          {CARDS.map(c => (
            <div key={c.title} data-av="card" className={s.card}>
              <div className={s.icon}>{c.icon}</div>
              <div className={s.cardTitle}>{c.title}</div>
              <p className={s.cardText}>{c.text}</p>
            </div>
          ))}
        </div>

        <div data-av="cta" className={s.cta}>
          <Link to="/aaryaveera" className={s.btnWarriorGold}>
            Full Aaryaveera Programme
          </Link>
          <Link to="/courses" className={s.btnWarriorOutline}>
            Enroll in a Course
          </Link>
        </div>
      </div>
    </section>
  )
}
