import { NextResponse } from 'next/server'
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API_BASE } from '@/lib/paypal'
import { saveReservationAndNotify, PRICE_PER_SEAT_USD } from '@/lib/reservations'

export const runtime = 'nodejs'

function isValidName(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length >= 2 && v.trim().length <= 80
}
function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 120
}
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

  const errors: Record<string, string> = {}
  if (typeof body.orderID !== 'string' || !body.orderID) errors.orderID = 'Missing order ID'
  if (!isValidName(body.name)) errors.name = 'Invalid name'
  if (!isValidEmail(body.email)) errors.email = 'Invalid email'
  if (!isValidSeats(body.seats)) errors.seats = 'Invalid seat count'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const orderID = body.orderID as string
  const name = (body.name as string).trim()
  const email = (body.email as string).toLowerCase().trim()
  const seats = body.seats as number
  const waUrl = typeof body.waUrl === 'string' ? body.waUrl : ''

  // ── Capture the payment server-side — this is the source of truth, not
  // anything the client claims happened. ─────────────────────────────────
  let capture: any
  try {
    const token = await getPaypalAccessToken()
    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    capture = await res.json()
    if (!res.ok) {
      console.error('[paypal/capture-order] PayPal error:', JSON.stringify(capture))
      return NextResponse.json({ error: 'Payment capture failed' }, { status: 502 })
    }
  } catch (err) {
    console.error('[paypal/capture-order] failed:', (err as Error).message)
    return NextResponse.json({ error: 'Payment capture failed' }, { status: 500 })
  }

  const captureStatus = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.status
  if (capture.status !== 'COMPLETED' || captureStatus !== 'COMPLETED') {
    console.error('[paypal/capture-order] capture not completed:', capture.status, captureStatus)
    return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
  }

  const total = seats * PRICE_PER_SEAT_USD
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers.get('user-agent') || null

  const result = await saveReservationAndNotify({
    name, email, seats, total, currency: 'USD', method: 'paypal', status: 'confirmed',
    waUrl, ip, userAgent, paypalOrderId: orderID,
  })

  return NextResponse.json({ success: true, ...result })
}
