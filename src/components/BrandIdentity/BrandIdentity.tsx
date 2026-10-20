import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import s from './BrandIdentity.module.css'

const SWATCHES = [
  { color: '#C2410C', name: 'Revolution Red',  desc: 'Primary · Mardini · Fire' },
  { color: '#C9A96E', name: 'Aaryaveera Gold', desc: 'Signature · Bridge colour' },
  { color: '#14532D', name: 'Forest Night',    desc: 'Peace · Shakti Bhava' },
  { color: '#4D7C61', name: 'Sage',            desc: 'Secondary green · Healing' },
  { color: '#4F46E5', name: 'Varta Indigo',    desc: 'Discourse · Shakti Varta' },
  { color: '#F0EBE3', name: 'Smoke White',     desc: 'Primary text' },
]

export default function BrandIdentity() {
  const secRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-br]', {
        opacity: 0, y: 20, stagger: 0.07, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: secRef.current, start: 'top 75%' }
      })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className={s.section}>
      <div className={s.header}>
        <h2>Brand Identity</h2>
        <p>The visual language of Shakti Sabha — crimson fire, forest peace, and Aaryaveera gold. Full guidelines, logo files, and brand assets on the Brand page.</p>
      </div>
      <div className={s.grid}>
        <div data-br className={s.panel}>
          <p className={s.panelTitle}>Colour Palette</p>
          <div className={s.swatches}>
            {SWATCHES.map(sw => (
              <div key={sw.color} className={s.swatch}>
                <div className={s.swatchColor} style={{ background: sw.color }} />
                <div>
                  <div className={s.swatchName}>{sw.name}</div>
                  <div className={s.swatchHex}>{sw.desc}</div>
                </div>
                <div className={s.swatchHex} style={{ fontFamily: 'monospace' }}>{sw.color}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-br className={s.panel}>
          <p className={s.panelTitle}>Typography</p>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', fontWeight: 900 }}>Cinzel</div>
            <div className={s.typeMeta}>Display · Headings · Cinzel 900 — Classical power, Sanskrit-adjacent</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 400 }}>Outfit</div>
            <div className={s.typeMeta}>Body · UI · Outfit 300–600 — Clean, modern, legible</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontFamily: 'Noto Sans Devanagari, sans-serif', fontSize: '1.5rem' }}>देवनागरी</div>
            <div className={s.typeMeta}>Devanagari · Hindi text · Noto Sans Devanagari</div>
          </div>
          <div className={s.typeRow}>
            <div className={s.typeSample} style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Scale: 7rem · 3rem · 2rem · 1.35rem · 1rem · 0.875rem · 0.8rem · 0.65rem</div>
            <div className={s.typeMeta}>Base unit: 4px · Border radius: 2px (sharp, intentional)</div>
          </div>
        </div>
      </div>
      <div className={s.cta}>
        <Link to="/brand" className="btn-magnetic btn-gold">Full Brand Guidelines →</Link>
      </div>
    </section>
  )
}
