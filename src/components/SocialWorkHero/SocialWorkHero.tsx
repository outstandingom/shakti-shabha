import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import s from './SocialWorkHero.module.css'

const WORDS = [
  'WOMEN.',
  'SURVIVORS.',
  'WARRIORS.',
  'DAUGHTERS.',
  'COMMUNITIES.',
]

export default function SocialWorkHero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Typewriter effect mimicking Typed.js with full React lifecycle safety
  useEffect(() => {
    const currentWord = WORDS[wordIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (charIdx < currentWord.length) {
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev + 1)
        }, 110)
      } else {
        // Pause at completed word
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 1800)
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setCharIdx((prev) => prev - 1)
        }, 50)
      } else {
        setIsDeleting(false)
        setWordIdx((prev) => (prev + 1) % WORDS.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [charIdx, isDeleting, wordIdx])

  const displayedText = WORDS[wordIdx].substring(0, charIdx)

  return (
    <section className={s.infoSection}>
      {/* ── Left Part ── */}
      <div className={s.leftPart}>
        <div className={s.topNav}>
          <Link to="/" className={s.backLink}>
            ← Back to Home
          </Link>
          <span className={s.badge}>
            NGO Archive · 12 Years on the Ground
          </span>
        </div>

        <h1>
          <span className={s.dFlex}>WE WORK FOR</span>
          <span className={s.text}>
            {displayedText}
            <span className={s.cursor}>|</span>
          </span>
        </h1>

        <p>
          Twelve years of fearless grassroots empowerment — organizing martial self-defense
          camps, survivor healing pods, legal literacy circles, and rural leadership across 200+ villages.
        </p>

        <Link to="/events" className={s.bookLink}>
          <span className={s.linktext}>Join Our Mission</span>
          <span className={s.arrow}>
            <span></span>
          </span>
        </Link>
      </div>

      {/* ── Right Part (Animated 3x3 Grid) ── */}
      <div className={s.rightPart}>
        {/* Animated wave lines */}
        <div className={s.bgLine}>
          <img
            src="https://www.yudiz.com/codepen/photography-banner/wave.svg"
            alt="Wave line"
          />
          <img
            src="https://www.yudiz.com/codepen/photography-banner/wave.svg"
            alt="Wave line"
          />
        </div>

        {/* 8-Box Orbiting Grid */}
        <div className={`${s.mainGrid} ${s.dFlex}`}>
          {/* Box 1: Text */}
          <div className={s.box}>
            <span>Lathi-Kaushal</span>
          </div>

          {/* Box 2: Image (Martial Self-Defense) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=900&auto=format&fit=crop&q=80"
                alt="Village Defense Camp"
                loading="eager"
              />
            </div>
          </div>

          {/* Box 3: Text */}
          <div className={s.box}>
            <span>Healing Circles</span>
          </div>

          {/* Box 4: Text */}
          <div className={s.box}>
            <span>Legal Rights</span>
          </div>

          {/* Box 5: Image (Survivor Circle Pods) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
                alt="Survivor Healing Pod"
                loading="lazy"
              />
            </div>
          </div>

          {/* Box 6: Image (Young Leadership & Character) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop&q=80"
                alt="Youth Leadership Academy"
                loading="lazy"
              />
            </div>
          </div>

          {/* Box 7: Text */}
          <div className={s.box}>
            <span>Rural Outreach</span>
          </div>

          {/* Box 8: Image (Community Gathering & Relief) */}
          <div className={s.box}>
            <div className={s.bgImg}>
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=900&auto=format&fit=crop&q=80"
                alt="Rural Community Action"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Triple horizontal circle rings */}
        <div className={s.bgCircleHLine}>
          <img
            src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg"
            alt="Horizontal circle ring"
          />
          <img
            src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg"
            alt="Horizontal circle ring"
          />
          <img
            src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg"
            alt="Horizontal circle ring"
          />
        </div>

        {/* Rotating dashed circle */}
        <div className={s.bgDashCircle}>
          <img
            src="https://www.yudiz.com/codepen/photography-banner/dash-circle.svg"
            alt="Rotating dash circle"
          />
        </div>
      </div>
    </section>
  )
}
