import { useEffect, useRef, useState } from 'react'

export default function FireCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    /* Skip on touch-only devices */
    if (window.matchMedia('(hover: none)').matches) return

    const ringEl = ringRef.current
    if (!ringEl) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onEnter = () => setIsVisible(true)
    const onLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    /* Ring smoothly lerps toward cursor */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.15)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.15)

      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    /* Delegated hover detection: works across all pages & dynamically loaded routes/elements */
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, label, [data-interactive]')
      if (interactive) {
        ringEl.classList.add('expand')
      } else {
        ringEl.classList.remove('expand')
      }
    }

    document.addEventListener('mouseover', onMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  return (
    /* Luminous Crimson Follower Ring — visible across all light & dark pages */
    <div
      ref={ringRef}
      className="cursorRing"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '30px',
        height: '30px',
        marginLeft: '-15px',
        marginTop: '-15px',
        borderRadius: '50%',
        border: '1.8px solid rgba(220, 20, 60, 0.75)',
        background: 'rgba(220, 20, 60, 0.08)',
        boxShadow: '0 0 10px rgba(220, 20, 60, 0.25)',
        pointerEvents: 'none',
        zIndex: 99998,
        willChange: 'transform',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease, width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), margin 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background 0.2s, box-shadow 0.2s',
      }}
    />
  )
}
