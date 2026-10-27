import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import DomeGallery, { DEFAULT_SHAKTI_IMAGES, type DomeGalleryImage } from '../components/DomeGallery/DomeGallery'
import gp from './GalleryPage.module.css'

const EXTRA_GALLERY_IMAGES: DomeGalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    alt: 'Lathi-Kaushal Dual Staff Defense',
    tag: 'LATHI & SWORD',
    desc: 'Demonstration of two-handed defensive staff circular sweeps at the Wardha district camp.'
  },
  {
    src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    alt: 'Traditional Maratha Talwar Parries',
    tag: 'LATHI & SWORD',
    desc: 'Practicing ancient sword stances, balance shifts, and rapid diagonal strikes.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    alt: 'Joint-Lock & Escape Biomechanics',
    tag: 'AARYAVEERA CAMPS',
    desc: 'Intensive tactile counter-assault training during the 5-day residential Aaryaveera camp.'
  },
  {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    alt: 'Trauma Release & Peer Healing Circle',
    tag: 'SHAKTI BHAVA',
    desc: 'Guided somatic therapy and group affirmation circles for domestic abuse survivors.'
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    alt: 'School Campus Street-Smart Training',
    tag: 'SCHOOL OUTREACH',
    desc: 'Empowering adolescent students with situational danger reflexes and confidence.'
  },
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    alt: 'Aaryaveera Warrior Batch Convocation',
    tag: 'AARYAVEERA CAMPS',
    desc: 'Over 120 girls receiving their verified physical warrior certificates in Pune.'
  },
  {
    src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    alt: 'Confidential Survivor Listening Circle',
    tag: 'SHAKTI BHAVA',
    desc: 'Safe, empathetic space where women share personal journeys and receive emotional anchoring.'
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    alt: 'High School Legal Literacy Assembly',
    tag: 'SCHOOL OUTREACH',
    desc: 'Instructing female students on self-defense rights, emergency helplines, and legal remedies.'
  },
]

const ALL_IMAGES = [...DEFAULT_SHAKTI_IMAGES, ...EXTRA_GALLERY_IMAGES]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [dbImages, setDbImages] = useState<DomeGalleryImage[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('gallery_photos').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery_categories').select('*'),
    ]).then(([photosRes, catsRes]) => {
      const photos = photosRes.data || []
      const cats = catsRes.data || []
      const catMap = new Map<string, string>()
      cats.forEach((c: { id: string; name: string }) => catMap.set(c.id, c.name.toUpperCase()))

      if (photos.length > 0) {
        const mapped: DomeGalleryImage[] = photos.map((p: { url: string; caption?: string; category_id?: string }) => ({
          src: p.url,
          alt: p.caption || 'Shakti Sabha Gallery Photo',
          tag: p.category_id ? (catMap.get(p.category_id) || 'COMMUNITY') : 'COMMUNITY',
          desc: p.caption || '',
        }))
        setDbImages(mapped)
      }
    }).catch(err => console.warn('Gallery photos fetch error:', err))
  }, [])

  const allGalleryImages = useMemo(() => {
    return [...dbImages, ...ALL_IMAGES]
  }, [dbImages])

  const displayedImages = useMemo(() => {
    if (activeCategory === 'ALL') return allGalleryImages
    return allGalleryImages.filter(img => img.tag?.toLowerCase().includes(activeCategory.toLowerCase()))
  }, [activeCategory, allGalleryImages])

  return (
    <div className={gp.pageContainer}>
      {/* Header Bar */}
      <div className={gp.headerSection}>
        <Link to="/" className={gp.backLink}>
          ← Back to Home
        </Link>
        <br />
        <span className={gp.badge}>
          SRS Section 7 · 12-Year Media Vault
        </span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={gp.title}
        >
          Media & Impact <span className={gp.titleHighlight}>Gallery</span>
        </motion.h1>

        <p className={gp.hindiSubtitle}>
          मीडिया गैलरी · 12 वर्षों का जीवंत इतिहास
        </p>

        <p className={gp.desc}>
          Explore our interactive 3D media sphere archiving twelve years of on-ground camps,
          traditional Lathi-Kaushal combat, survivor circles, and village self-defense across Maharashtra.
        </p>

        {/* Filter Category Tabs */}
        <div className={gp.filterRow}>
          {[
            { id: 'ALL', label: 'All Media Vault' },
            { id: 'LATHI', label: 'Lathi & Sword' },
            { id: 'AARYAVEERA', label: 'Aaryaveera Camps' },
            { id: 'SHAKTI BHAVA', label: 'Survivor Circles' },
            { id: 'SCHOOL', label: 'School Outreach' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`${gp.filterBtn} ${activeCategory === tab.id ? gp.filterBtnActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Dome Gallery Sphere */}
      <div className={gp.sphereWrapper}>
        <DomeGallery
          images={displayedImages}
          fit={0.46}
          fitBasis="auto"
          minRadius={460}
          maxRadius={1150}
          padFactor={0.2}
          overlayBlurColor="#0D090B"
          maxVerticalRotationDeg={10}
          dragSensitivity={18}
          enlargeTransitionMs={320}
          segments={35}
          dragDampening={2}
          imageBorderRadius="18px"
          openedImageBorderRadius="20px"
          grayscale={false}
          autoRotateSpeed={0.12}
        />

        <div className={gp.interactiveHint}>
          <span>✦</span> Drag or swipe in any direction to rotate the 3D sphere · Click any image to view details
        </div>
      </div>

      {/* Bottom Archive Metrics */}
      <div className={gp.galleryFooter}>
        <div className={gp.footerGrid}>
          <div className={gp.statItem}>
            <span className={gp.statNum}>12+</span>
            <span className={gp.statText}>Years of Archive</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>400+</span>
            <span className={gp.statText}>Schools Reached</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>50,000+</span>
            <span className={gp.statText}>Women Trained</span>
          </div>
          <div className={gp.statItem}>
            <span className={gp.statNum}>100%</span>
            <span className={gp.statText}>On-Ground Documented</span>
          </div>
          <div>
            <button
              onClick={() => alert('Downloading official 12-Year Media & Press Kit (PDF)...')}
              style={{
                padding: '0.65rem 1.75rem',
                borderRadius: '9999px',
                background: '#DC143C',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              Download Press Kit (PDF) →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
