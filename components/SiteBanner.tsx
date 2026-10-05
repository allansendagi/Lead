'use client'
import { useEffect, useRef } from 'react'
import TrackedLink from './TrackedLink'
import { FIT_CALL_URL } from '@/lib/cohort2'

// Top bar shown on every page. It publishes its height as --banner-h so the
// fixed navigation on the (site) pages can sit directly beneath it.
export default function SiteBanner() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () => document.documentElement.style.setProperty('--banner-h', `${el.offsetHeight}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const link = (
    <TrackedLink
      href={FIT_CALL_URL}
      location="banner"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit', textDecoration: 'underline', font: 'inherit', letterSpacing: 'inherit' }}
    >
      Book a fit call &rarr;
    </TrackedLink>
  )

  return (
    <div
      ref={ref}
      id="site-banner"
      style={{
        position: 'sticky', top: 0, zIndex: 9100, width: '100%',
        background: '#C2410C', color: '#F5F1EA', textAlign: 'center',
        padding: '10px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
        lineHeight: 1.5, fontFamily: 'var(--font, system-ui, sans-serif)',
      }}
    >
      <span className="banner-desktop">
        Launch cohort completed &middot; Next cohort: Saturday 24 October &middot; 10 seats &middot; AED 1,000 &middot;
        Full refund if it&apos;s not useful &middot; {link}
      </span>
      <span className="banner-mobile">
        Cohort 2 &middot; 24 Oct &middot; AED 1,000 &middot; {link}
      </span>
      <style>{`
        #site-banner .banner-mobile { display: none; }
        @media (max-width: 639px) {
          #site-banner .banner-desktop { display: none; }
          #site-banner .banner-mobile { display: inline; }
        }
      `}</style>
    </div>
  )
}
