import type { Metadata } from 'next'
import CheckoutContents from '@/components/CheckoutContents'

export const metadata: Metadata = {
  title: 'Complete Your Enrollment — AI Value Sandbox',
  robots: { index: false, follow: false },
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '97450176561'
// PayPal Client IDs are meant to be public (same trust model as a Stripe
// publishable key) — safe to read server-side and pass to the client.
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''

export default function CheckoutPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <div style={{ padding: '20px 24px' }}>
        <a href="/" style={{ color: '#F5F1EA', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          &larr; Back to the workshop
        </a>
      </div>
      <CheckoutContents waNumber={WA_NUMBER} paypalClientId={PAYPAL_CLIENT_ID} />
    </div>
  )
}
