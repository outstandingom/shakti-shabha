import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  selector?: string
  y?: number
  duration?: number
  stagger?: number
  delay?: number
  start?: string
  ease?: string
  scale?: number
}

/**
 * useScrollReveal — Premium motion hook (Shakti Sabha design system)
 * Applies GSAP fade-up scroll-triggered entrance to child elements.
 * Personality: elegant, 350-600ms, cubic-bezier(0.4,0,0.2,1), 0% overshoot.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return

    const {
      selector = '[data-reveal]',
      y = 32,
      duration = 0.75,
      stagger = 0.08,
      delay = 0,
      start = 'top 82%',
      ease = 'power3.out',
      scale,
    } = options

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = { opacity: 0, y }
      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none none',
        },
      }

      if (scale !== undefined) {
        fromVars.scale = scale
        toVars.scale = 1
      }

      gsap.fromTo(selector, fromVars, toVars)
    }, ref)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}
