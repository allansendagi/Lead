import type { Metadata } from 'next'
import CheckoutContents from '@/components/CheckoutContents'

export const metadata: Metadata = {
  title: 'Complete Your Enrollment — AI Value Sandbox',
  robots: { index: false, follow: false },
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '97450176561'
const WA_MSG = encodeURIComponent(
  "Hi Allan, I'd like to reserve a seat for the AI Value Sandbox workshop."
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

export default function CheckoutPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div style={{ padding: '20px 24px' }}>
        <a href="/" style={{ color: '#F5F1EA', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          &larr; Back to the workshop
        </a>
      </div>
      <CheckoutContents waUrl={WA_URL} />
    </div>
  )
}
