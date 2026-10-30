import { useState } from 'react'
import { useCategoryPhotos } from '../../data/galleryStore'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import s from './CategoryPhotoStrip.module.css'

interface CategoryPhotoStripProps {
  categoryKeywords: string | string[]
  title: string
  subtitle?: string
  accentColor?: string
  fallbackUrls?: string[]
}

const DEFAULT_FALLBACKS: Record<string, string[]> = {
  mardini: [
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  ],
  shaktiBhava: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
  ],
  shaktiVarta: [
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
  ]
}

export default function CategoryPhotoStrip({
  categoryKeywords,
  title,
  subtitle,
  accentColor = '#DC143C',
  fallbackUrls = []
}: CategoryPhotoStripProps) {
  // Determine standard fallbacks based on keyword
  const keyStr = (Array.isArray(categoryKeywords) ? categoryKeywords.join(' ') : categoryKeywords).toLowerCase()
  const fallbacks = fallbackUrls.length > 0 ? fallbackUrls : (
    keyStr.includes('mardini') ? DEFAULT_FALLBACKS.mardini :
    keyStr.includes('varta') ? DEFAULT_FALLBACKS.shaktiVarta :
    DEFAULT_FALLBACKS.shaktiBhava
  )

  const photos = useCategoryPhotos(categoryKeywords, 4, fallbacks)
  const [activePhoto, setActivePhoto] = useState<{ url: string; caption?: string } | null>(null)

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <div>
          <div className={s.eyebrow} style={{ color: accentColor }}>
            <GoogleIcon name="photo_camera" size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Live Field &amp; Archive Photos
          </div>
          <h3 className={s.title}>{title}</h3>
          {subtitle && <p className={s.subtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={s.grid}>
        {photos.map((p, idx) => (
          <div
            key={idx}
            className={s.photoCard}
            onClick={() => setActivePhoto(p)}
          >
            <img src={p.url} alt={p.caption || title} loading="lazy" />
            <div className={s.overlay}>
              <div className={s.badge} style={{ background: p.isFromDb ? accentColor : 'rgba(0,0,0,0.6)' }}>
                {p.isFromDb ? 'Direct Field Capture' : 'Archive Reference'}
              </div>
              {p.caption && <div className={s.caption}>{p.caption}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className={s.lightbox} onClick={() => setActivePhoto(null)} data-lenis-prevent="true">
          <div className={s.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className={s.closeBtn} onClick={() => setActivePhoto(null)}>
              <GoogleIcon name="close" size={20} />
            </button>
            <img src={activePhoto.url} alt={activePhoto.caption || title} />
            {activePhoto.caption && <p className={s.lightboxCaption}>{activePhoto.caption}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
