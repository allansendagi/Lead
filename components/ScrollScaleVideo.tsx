'use client'
import { useEffect, useRef } from 'react'

export default function ScrollScaleVideo({
  src,
  border,
  minScale = 0.8,
  maxScale = 1.25,
}: {
  src: string
  border: string
  minScale?: number
  maxScale?: number
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = viewportH / 2
      const maxDist = viewportH / 2 + rect.height / 2

      const distance = Math.abs(elementCenter - viewportCenter)
      const progress = 1 - Math.min(1, distance / maxDist)
      const scale = minScale + (maxScale - minScale) * progress

      el.style.transform = `scale(${scale})`
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [minScale, maxScale])

  return (
    <div style={{ overflow: 'visible', padding: '70px 0' }}>
      <video
        ref={ref}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%', aspectRatio: '16/9', borderRadius: 16,
          border: `1px solid ${border}`, display: 'block', objectFit: 'cover',
          background: '#0f0f0f', willChange: 'transform', transition: 'transform 80ms linear',
        }}
      />
    </div>
  )
}
