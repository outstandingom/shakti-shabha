import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './Sahyog.module.css'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    icon: '🏢',
    tag: 'Corporates',
    title: 'CSR & Sponsorship',
    desc: 'Partner through dedicated CSR initiatives, sponsor grassroots self-defense camps, and receive verified social impact audits.',
    benefits: ['Tax-exempt CSR documentation', 'Direct village-level camp sponsorship', 'Employee volunteering days'],
  },
  {
    icon: '🌱',
    tag: 'NGOs & Alliances',
    title: 'Partner Network',
    desc: 'Collaborate with Shakti Sabha on ground-level rescue, rehabilitation, psychological counseling, and legal discourse.',
    benefits: ['Joint intervention camps', 'Resource & legal knowledge sharing', 'Cross-organizational visibility'],
  },
  {
    icon: '🎓',
    tag: 'Students & Youth',
    title: 'Internships',
    desc: 'Immerse in field-level social work, earn verified certification, and learn directly alongside front-line activists.',
    benefits: ['Field immersion certificates', 'College academic credit support', 'Direct mentorship from leadership'],
  },
]

export default function Sahyog() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: secRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.from('[data-sy="text"]', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
      }).from(
        '[data-sy="card"]',
        {
          opacity: 0,
          y: 25,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      )
    }, secRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.inner}>
        {/* Header Block */}
        <div className={s.header}>
          <div data-sy="text" className={s.eyebrow}>
            Partnerships &amp; Support
          </div>

          <div data-sy="text" className={s.titleWrap}>
            <h2 className={s.title}>Our Sahyog</h2>
            <span className={s.hindi}>सहयोग — Together We Rise</span>
          </div>

          <p data-sy="text" className={s.desc}>
            Shakti Sabha stands with organizations, institutions, and individuals
            who believe in the same truth — that every woman deserves safety,
            dignity, and opportunity. Our Sahyog program builds bridges across
            sectors for collective action.
          </p>
        </div>

        {/* 3 Main Pillars Cards Grid */}
        <div className={s.grid}>
          {PILLARS.map((p) => (
            <div key={p.title} data-sy="card" className={s.card}>
              <div className={s.cardTop}>
                <span className={s.cardIcon}>{p.icon}</span>
                <span className={s.cardTag}>{p.tag}</span>
              </div>

              <h3 className={s.cardTitle}>{p.title}</h3>
              <p className={s.cardDesc}>{p.desc}</p>

              <div className={s.benefitList}>
                {p.benefits.map((b) => (
                  <div key={b} className={s.benefitItem}>
                    <span className={s.bullet}>✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div data-sy="text" className={s.ctaWrap}>
          <Link to="/sahyog" className={s.ctaBtn}>
            Become a Partner →
          </Link>
          <span className={s.ctaNote}>FCRA &amp; 80G Certified for Domestic CSR Contributions</span>
        </div>
      </div>
    </section>
  )
}
