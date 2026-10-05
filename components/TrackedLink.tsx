'use client'
import type { CSSProperties, ReactNode } from 'react'
import { FIT_CALL_URL } from '@/lib/cohort2'

type Props = {
  href: string
  location: string
  style?: CSSProperties
  className?: string
  target?: string
  rel?: string
  children: ReactNode
}

export default function TrackedLink({ href, location, style, className, target, rel, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      target={target}
      rel={rel}
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', 'cta_click', { location, destination: href })
          if (href === FIT_CALL_URL) (window as any).gtag('event', 'fit_call_click', { location })
        }
      }}
    >
      {children}
    </a>
  )
}
