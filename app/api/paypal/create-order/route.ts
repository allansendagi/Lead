import { NextResponse } from 'next/server'
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API_BASE } from '@/lib/paypal'
import { COHORT_NAME, PAYPAL_CURRENCY, PRICE_AED, paypalTotal } from '@/lib/cohort2'
import { isValidSeats } from '@/lib/checkoutDetails'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!paypalConfigured()) {
    return NextResponse.json({ error: 'PayPal is not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!isValidSeats(body.seats)) {
    return NextResponse.json({ error: 'Invalid seat count' }, { status: 400 })
  }
  const seats = body.seats

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
            description: `${COHORT_NAME}, 24 October 2026: ${seats} seat${seats > 1 ? 's' : ''} (AED ${(PRICE_AED * seats).toLocaleString('en-US')})`,
            amount: { currency_code: PAYPAL_CURRENCY, value: paypalTotal(seats) },
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
