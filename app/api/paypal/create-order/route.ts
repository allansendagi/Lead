import { NextResponse } from 'next/server'
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API_BASE } from '@/lib/paypal'
import { COHORT_NAME, PAYPAL_AMOUNT, PAYPAL_CURRENCY } from '@/lib/cohort2'

export const runtime = 'nodejs'

export async function POST() {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 500 })
  }

  try {
    const token = await getPaypalAccessToken()
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `${COHORT_NAME}, 24 October 2026 (AED 1,000)`,
            amount: { currency_code: PAYPAL_CURRENCY, value: PAYPAL_AMOUNT },
          },
        ],
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('[paypal/create-order] PayPal error:', JSON.stringify(data))
      return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 502 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('[paypal/create-order] failed:', (err as Error).message)
    return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 })
  }
}
