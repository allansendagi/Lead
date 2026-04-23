'use client'
import Link from 'next/link'

interface CTAButtonProps {
  text?: string
  href?: string
  fullWidth?: boolean
  location?: string
}

export default function CTAButton({
  text = 'Take the free AI Readiness Assessment →',
  href = '/',
  fullWidth = false,
  location = 'page',
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', 'cta_click', { location })
        }
      }}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1C1714',
        color: '#fff',
        padding: '15px 28px',
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 600,
        textDecoration: 'none',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {text}
    </Link>
  )
}
