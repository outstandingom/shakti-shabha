import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import s from './Hero.module.css'

type SlideData = {
  id: string
  name: string
  description: string
  image: string
  heightClass: string
}

const GIRL_IMAGES: SlideData[] = [
  {
    id: '1015',
    name: 'Mountain',
    description: 'Discover the breathtaking peaks and serene landscapes that touch the sky.',
    image: 'https://picsum.photos/id/1015/1200/800',
    heightClass: s.h_4_12,
  },
  {
    id: '1043',
    name: 'Forest',
    description: 'Wander through the lush greens and find peace in the heart of nature.',
    image: 'https://picsum.photos/id/1043/1200/800',
    heightClass: s.h_6_12,
  },
  {
    id: '1069',
    name: 'Ocean',
    description: 'Experience the vastness of the deep blue and the rhythm of the waves.',
    image: 'https://picsum.photos/id/1069/1200/800',
    heightClass: s.h_8_12,
  },
  {
    id: '1080',
    name: 'Desert',
    description: 'Find beauty in the golden dunes and the quiet solitude of the sands.',
    image: 'https://picsum.photos/id/1080/1200/800',
    heightClass: s.h_10_12,
  },
  {
    id: '109',
    name: 'City',
    description: 'Explore the vibrant streets, lights, and endless energy of urban life.',
    image: 'https://picsum.photos/id/109/1200/800',
    heightClass: s.h_11_12,
  },
  {
    id: '106',
    name: 'Aurora',
    description: 'Witness the magical dance of colors painting the night sky.',
    image: 'https://picsum.photos/id/106/1200/800',
    heightClass: s.h_10_12,
  },
]

export default function Hero() {
  const secRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  
  // Carousel State
  const [activeIndex, setActiveIndex] = useState(0)

  // GSAP Animation for the Hero Images
  useEffect(() => {
    const images = imgRefs.current.filter((img): img is HTMLImageElement => img !== null)
    const content = contentRef.current

    if (!images.length || !content) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      images.forEach(img => {
        gsap.set(img, { width: '100%', y: '50vh' })
      })
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    const centerIndex = Math.floor(images.length / 2)
    const STAGGER = 0.2
    const DURATION = 1

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Phase 1: Expand widths
      images.forEach((image, index) => {
        const delay = Math.abs(index - centerIndex) * STAGGER
        tl.to(image, { width: '100%', duration: DURATION, ease: 'power2.inOut' }, delay)
      })

      const maxDelay = Math.max(
        ...images.map((_, index) => Math.abs(index - centerIndex) * STAGGER)
      )
      const totalFirstAnimationTime = maxDelay + DURATION

      // Phase 2: Drop images down
      images.forEach((image, index) => {
        const delay = totalFirstAnimationTime + Math.abs(index - centerIndex) * STAGGER
        tl.to(image, { y: '50vh', duration: DURATION, ease: 'power2.out' }, delay)
      })

      // Phase 3: Fade in content
      tl.fromTo(
        content,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: DURATION, ease: 'power2.out' },
        totalFirstAnimationTime + 0.4
      )
    }, secRef)

    return () => ctx.revert()
  }, [])

  // Carousel Logic
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % GIRL_IMAGES.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + GIRL_IMAGES.length) % GIRL_IMAGES.length)
  }

  const handleExplore = () => {
    const nextEl = secRef.current?.nextElementSibling
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  // Helper to get preview indices safely
  const prevIndex = (activeIndex - 1 + GIRL_IMAGES.length) % GIRL_IMAGES.length
  const nextIndex = (activeIndex + 1) % GIRL_IMAGES.length

  return (
    <section ref={secRef} className={s.heroSection}>
      
      {/* Hero Text Content */}
      <div ref={contentRef} className={s.heroContent}>
        <h1 className={s.title}>
          Discover the world <br /> through people
        </h1>
        <button type="button" onClick={handleExplore} className={s.ctaBtn}>
          Start Exploring
        </button>
      </div>

      {/* Decorative Animated Background Images */}
      <div className={s.heroImages}>
        {GIRL_IMAGES.map((item, idx) => (
          <div key={idx} className={s.col}>
            <img
              ref={el => { imgRefs.current[idx] = el }}
              src={item.image}
              alt={item.name}
              className={`${s.imgItem} ${item.heightClass}`}
            />
          </div>
        ))}
      </div>

      {/* Integrated Carousel */}
      <div className={s.carouselWrapper}>
        <div className={s.carouselContainer}>
          
          {/* Carousel Slides */}
          <div className={s.slide}>
            {GIRL_IMAGES.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`${s.carouselItem} ${isActive ? s.active : ''}`}
                  style={{ backgroundImage: `url('${item.image}')` }}
                >
                  <div className={s.itemContent}>
                    <div className={s.itemName}>{item.name}</div>
                    <div className={s.itemDes}>{item.description}</div>
                    <button className={s.itemBtn}>See more</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className={s.buttonGroup}>
            <button className={s.navBtn} onClick={handlePrev}>←</button>
            <button className={s.navBtn} onClick={handleNext}>→</button>
          </div>

          {/* Prev & Next Previews */}
          <div className={s.previewPair}>
            <div
              className={s.previewCard}
              onClick={handlePrev}
              style={{ backgroundImage: `url('${GIRL_IMAGES[prevIndex].image}')` }}
              title="Previous photo"
            >
              <span className={s.tag}>◀ PREV</span>
            </div>
            <div
              className={s.previewCard}
              onClick={handleNext}
              style={{ backgroundImage: `url('${GIRL_IMAGES[nextIndex].image}')` }}
              title="Next photo"
            >
              <span className={s.tag}>NEXT ▶</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
