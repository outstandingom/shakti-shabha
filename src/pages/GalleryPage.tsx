import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  fetchCategories,
  fetchAllPhotos,
  GALLERY_UPDATE_EVENT,
  GalleryCategoryItem
} from '../data/galleryStore'
import DomeGallery, { DEFAULT_SHAKTI_IMAGES, type DomeGalleryImage } from '../components/DomeGallery/DomeGallery'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import gp from './GalleryPage.module.css'

const AWARDS_IMAGES: EnrichedGalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800&auto=format&fit=crop&q=80',
    alt: 'Rashtriya Nari Shakti Samman Award',
    tag: 'AWARDS',
    desc: 'Founder Harshita Mankar receiving state leadership honor for grassroots safety reforms.',
    categoryId: 'cat-awards',
    categoryName: 'Awards'
  },
  {
    src: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
    alt: 'Excellence in Martial Arts Education Trophy',
    tag: 'AWARDS',
    desc: 'Awarded for training over 50,000 students across 400+ schools in Maharashtra.',
    categoryId: 'cat-awards',
    categoryName: 'Awards'
  },
  {
    src: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=80',
    alt: 'Civic Impact Citation — District Collectorate',
    tag: 'AWARDS',
    desc: 'Official citation from Maharashtra Police & Education Department for crime reduction.',
    categoryId: 'cat-awards',
    categoryName: 'Awards'
  },
  {
    src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    alt: 'Bharatiya Veerta Puraskar Medal',
    tag: 'AWARDS',
    desc: 'Gold Medal recognition for traditional martial revival and civilizational security work.',
    categoryId: 'cat-awards',
    categoryName: 'Awards'
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    alt: 'Social Innovation & Women Safety Conclave Award',
    tag: 'AWARDS',
    desc: 'Presented at the National Women Innovators Summit for the Mission Mardini model.',
    categoryId: 'cat-awards',
    categoryName: 'Awards'
  }
]

const AARYAVEERA_TRAININGS_IMAGES: EnrichedGalleryImage[] = Array.from({ length: 20 }, (_, i) => {
  const trainingUrls = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
  ]
  return {
    src: trainingUrls[i % trainingUrls.length],
    alt: `Aaryaveera Training Drill Session #${i + 1}`,
    tag: 'AARYAVEERA TRAININGS',
    desc: `Batch #${i + 1}: Ethical sovereignty, physical mastery, and civilizational mental toughness.`,
    categoryId: 'cat-trainings',
    categoryName: 'Aaryaveera Trainings'
  }
})

const SELF_DEFENCE_IMAGES: EnrichedGalleryImage[] = Array.from({ length: 13 }, (_, i) => {
  const defenseUrls = [
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80'
  ]
  return {
    src: defenseUrls[i % defenseUrls.length],
    alt: `Self Defence Practical Maneuver #${i + 1}`,
    tag: 'SELF DEFENCE TRAINING',
    desc: `Practical drill #${i + 1}: Choke escapes, improvised weapon disarms, and tactical bamboo lathi strikes.`,
    categoryId: 'cat-selfdefense',
    categoryName: 'Self defence training'
  }
})

const CAMPS_IMAGES: EnrichedGalleryImage[] = Array.from({ length: 10 }, (_, i) => {
  const campUrls = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
  ]
  return {
    src: campUrls[i % campUrls.length],
    alt: `Aaryaveera Residential Camp #${i + 1}`,
    tag: 'AARYAVEERA CAMPS',
    desc: `District Camp #${i + 1}: 5-day dawn martial routine, night perimeter safety, and survivor support pods.`,
    categoryId: 'cat-camps',
    categoryName: 'Aaryaveera Camps'
  }
})

const ALL_IMAGES: EnrichedGalleryImage[] = [
  ...AWARDS_IMAGES,
  ...AARYAVEERA_TRAININGS_IMAGES,
  ...SELF_DEFENCE_IMAGES,
  ...CAMPS_IMAGES
]
const INITIAL_IMAGE_LIMIT = 10
const VISIBLE_CATEGORY_COUNT = 3

export interface EnrichedGalleryImage extends DomeGalleryImage {
  categoryId?: string
  categoryName?: string
}

export default function GalleryPage() {
  const [selectedCatId, setSelectedCatId] = useState<string>('ALL')
  const [categories, setCategories] = useState<GalleryCategoryItem[]>([])
  const [dbImages, setDbImages] = useState<EnrichedGalleryImage[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const loadMedia = () => {
    Promise.all([
      fetchAllPhotos(),
      fetchCategories()
    ]).then(([photos, cats]) => {
      // Only use categories from database
      setCategories(cats)
      const catMap = new Map<string, string>()
      cats.forEach(c => catMap.set(c.id, c.name))

      if (photos.length > 0) {
        const mapped: EnrichedGalleryImage[] = photos.map(p => {
          const catName = p.category_id ? (catMap.get(p.category_id) || 'Gallery') : 'Gallery'
          return {
            src: p.url,
            alt: p.caption || catName,
            tag: catName.toUpperCase(),
            desc: p.caption || 'Authentic on-ground field photograph',
            categoryId: p.category_id || '',
            categoryName: catName
          }
        })
        setDbImages(mapped)
      } else {
        setDbImages([])
      }
    }).catch(err => console.warn('Gallery photos fetch error:', err))
  }

  useEffect(() => {
    loadMedia()
    window.addEventListener(GALLERY_UPDATE_EVENT, loadMedia)
    window.addEventListener('storage', loadMedia)

    return () => {
      window.removeEventListener(GALLERY_UPDATE_EVENT, loadMedia)
      window.removeEventListener('storage', loadMedia)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [dropdownOpen])

    const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId)
    setDropdownOpen(false)
  }

  const allGalleryImages = useMemo(() => {
    return dbImages.length > 0 ? dbImages : (ALL_IMAGES as EnrichedGalleryImage[])
  }, [dbImages])

  // Split categories: top 3 vs remaining
  const visibleCategories = useMemo(() => {
    return categories.slice(0, VISIBLE_CATEGORY_COUNT)
  }, [categories])

  const moreCategories = useMemo(() => {
    return categories.slice(VISIBLE_CATEGORY_COUNT)
  }, [categories])

  // Check if active category is inside the "more" dropdown
  const isMoreCategoryActive = useMemo(() => {
    return moreCategories.some(c => c.id === selectedCatId)
  }, [moreCategories, selectedCatId])

  const activeCategoryObj = useMemo(() => {
    return categories.find(c => c.id === selectedCatId)
  }, [categories, selectedCatId])

  // Filtered by category ID or Name
  const filteredImages = useMemo(() => {
    if (selectedCatId === 'ALL') return allGalleryImages
    const activeCat = categories.find(c => c.id === selectedCatId)
    const activeName = activeCat?.name?.toLowerCase() || ''
    return allGalleryImages.filter(img =>
      img.categoryId === selectedCatId ||
      (activeName && (
        img.categoryName?.toLowerCase() === activeName ||
        img.tag?.toLowerCase() === activeName ||
        img.tag?.toLowerCase().includes(activeName)
      ))
    )
  }, [selectedCatId, allGalleryImages, categories])

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

        {/* Compact Category Filter: Show 2-3 + Dropdown for remaining */}
        <div className={gp.filterRow}>
          {/* 1. All Media */}
          <button
            onClick={() => handleSelectCategory('ALL')}
            className={`${gp.filterBtn} ${selectedCatId === 'ALL' ? gp.filterBtnActive : ''}`}
          >
            All Media
            <span className={gp.countPill}>{allGalleryImages.length}</span>
          </button>

          {/* 2. Top 2-3 Database Categories */}
          {visibleCategories.map(cat => {
            const count = allGalleryImages.filter(img => {
              const targetName = cat.name.toLowerCase()
              return img.categoryId === cat.id ||
                img.categoryName?.toLowerCase() === targetName ||
                img.tag?.toLowerCase() === targetName ||
                img.tag?.toLowerCase().includes(targetName)
            }).length
            const isSelected = selectedCatId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`${gp.filterBtn} ${isSelected ? gp.filterBtnActive : ''}`}
              >
                {cat.name}
                <span className={gp.countPill}>{count}</span>
              </button>
            )
          })}

          {/* 3. If a category from "more" is currently active, show it as an active pill */}
          {isMoreCategoryActive && activeCategoryObj && (
            <button
              onClick={() => handleSelectCategory(activeCategoryObj.id)}
              className={`${gp.filterBtn} ${gp.filterBtnActive}`}
            >
              {activeCategoryObj.name}
              <span className={gp.countPill}>
                {filteredImages.length}
              </span>
            </button>
          )}

          {/* 4. Dropdown for Remaining Database Categories */}
          {moreCategories.length > 0 && (
            <div className={gp.dropdownWrapper} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className={`${gp.dropdownToggle} ${dropdownOpen ? gp.dropdownToggleActive : ''}`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>
                  {isMoreCategoryActive ? `Category: ${activeCategoryObj?.name}` : `More Categories (${moreCategories.length})`}
                </span>
                <span className={`${gp.arrowIcon} ${dropdownOpen ? gp.arrowOpen : ''}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className={gp.dropdownMenu} role="menu">
                  {moreCategories.map(cat => {
                    const count = allGalleryImages.filter(img => {
              const targetName = cat.name.toLowerCase()
              return img.categoryId === cat.id ||
                img.categoryName?.toLowerCase() === targetName ||
                img.tag?.toLowerCase() === targetName ||
                img.tag?.toLowerCase().includes(targetName)
            }).length
                    const isSelected = selectedCatId === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`${gp.dropdownItem} ${isSelected ? gp.dropdownItemActive : ''}`}
                        role="menuitem"
                      >
                        <span>{cat.name}</span>
                        <span className={gp.countPill}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        </div>

      {/* 3D Dome Gallery Sphere */}
      <div className={gp.sphereWrapper}>
        {filteredImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9CA3AF' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No photos uploaded in this category yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Upload authentic field photos from the Admin Dashboard to populate this collection.</p>
          </div>
        ) : (
          <DomeGallery
            images={filteredImages}
          fit={0.46}
          fitBasis="auto"
          minRadius={460}
          maxRadius={1150}
          padFactor={0.2}
          overlayBlurColor="#FFFFFF"
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
        )}

        <div className={gp.interactiveHint}>
          <GoogleIcon name="touch_app" size={15} />
          <span>Drag or swipe in any direction to rotate the 3D sphere · Click any image to view details</span>
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
