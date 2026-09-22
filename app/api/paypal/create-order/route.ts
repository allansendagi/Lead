import { NextResponse } from 'next/server'
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API_BASE } from '@/lib/paypal'
import { PRICE_PER_SEAT_USD } from '@/lib/reservations'

export const runtime = 'nodejs'

function isValidSeats(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 10
}

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

  const seats = body.seats as number
  const total = (seats * PRICE_PER_SEAT_USD).toFixed(2)

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
            description: `AI Value Sandbox — ${seats} seat${seats > 1 ? 's' : ''}`,
            amount: { currency_code: 'USD', value: total },
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
