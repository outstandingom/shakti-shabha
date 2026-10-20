import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './About.module.css'

const PILLARS = [
  { num:'01', tag:'Revolution', tagColor:'var(--ember)', accent:'var(--fire)', name:'Mardini', dev:'मर्दिनी', text:'Self-defense. Lathi-Kaushal. Sword training. Village camps across Maharashtra and beyond. The revolution that begins in the body and spreads to the spirit.', link:'/social-work', linkLabel:'Explore Social Work' },
  { num:'02', tag:'Healing',    tagColor:'var(--sage)',  accent:'var(--sage)', name:'Shakti Bhava', dev:'शक्ति भव', text:'Counseling. Anonymized case studies. Breaking silence on trafficking, PTSD, puberty, and depression. The space where survivors become warriors.', link:'/history', linkLabel:'Read Survivor Stories' },
  { num:'03', tag:'Discourse',  tagColor:'var(--indigo-pale)', accent:'var(--indigo)', name:'Shakti Varta', dev:'शक्ति वार्ता', text:'White papers. Research. Podcasts. Seminars. The intellectual engine that backs the revolution with verified knowledge and historical truth.', link:'/aaryaveera', linkLabel:'Discover Aaryaveera' },
]

export default function About() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-ab="header"]', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
      gsap.from('[data-ab="pillar"]', {
        opacity: 0, y: 32, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-ab="pillars"]', start: 'top 78%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div data-ab="header" className={s.header}>
        <h2>The Union of Peace &amp; Revolution</h2>
        <p>Everything Shakti Sabha builds lives within one of three streams — each distinct in method, unified in purpose: dignity, safety, and awakening for every woman who stands with us.</p>
      </div>
      <div data-ab="pillars" className={s.pillars}>
        {PILLARS.map(p => (
          <div key={p.name} data-ab="pillar" className={s.pillar}>
            <span className={s.accent} style={{ background: p.accent }} />
            <div className={s.number}>{p.num}</div>
            <div className={s.pillarTag} style={{ color: p.tagColor }}>{p.tag}</div>
            <div className={s.pillarName}>{p.name}</div>
            <div className={s.pillarDev}>{p.dev}</div>
            <p className={s.pillarText}>{p.text}</p>
            <Link to={p.link} className={s.pillarLink}>{p.linkLabel} →</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
