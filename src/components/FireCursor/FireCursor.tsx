import { useEffect, useRef } from 'react'

export default function FireCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    /* Skip on touch-only devices */
    if (window.matchMedia('(hover: none)').matches) return

    const dot  = dotRef.current!
    const ringEl = ringRef.current!

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    document.addEventListener('mousemove', onMove)

    /* Ring smoothly lerps toward cursor */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)

      dot.style.transform  = `translate(${pos.current.x}px, ${pos.current.y}px)`
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    /* Grow ring on clickable elements */
    const grow   = () => ringEl.classList.add('expand')
    const shrink = () => ringEl.classList.remove('expand')

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Solid crimson dot — snaps instantly */}
      <div ref={dotRef} style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '8px',
        height:        '8px',
        marginLeft:    '-4px',
        marginTop:     '-4px',
        borderRadius:  '50%',
        background:    '#DC143C',
        pointerEvents: 'none',
        zIndex:        99999,
        willChange:    'transform',
      }} />

      {/* Trailing ring — lags behind with lerp */}
      <div ref={ringRef} className="cursorRing" style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '32px',
        height:        '32px',
        marginLeft:    '-16px',
        marginTop:     '-16px',
        borderRadius:  '50%',
        border:        '1.5px solid rgba(220, 20, 60, 0.55)',
        pointerEvents: 'none',
        zIndex:        99998,
        willChange:    'transform',
        transition:    'width 0.2s, height 0.2s, margin 0.2s, border-color 0.2s',
      }} />
    </>
  )
}
