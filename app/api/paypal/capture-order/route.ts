import { NextResponse } from 'next/server'
import { getPaypalAccessToken, paypalConfigured, PAYPAL_API_BASE } from '@/lib/paypal'
import { saveReservationAndNotify } from '@/lib/reservations'
import { isValidName, isValidEmail, parseBuyerDetails } from '@/lib/checkoutDetails'

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

  const { errors, details } = parseBuyerDetails(body)
  if (typeof body.orderID !== 'string' || !body.orderID) errors.orderID = 'Missing order ID'
  if (!isValidName(body.name)) errors.name = 'Invalid name'
  if (!isValidEmail(body.email)) errors.email = 'Invalid email'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const orderID = body.orderID as string
  const name = (body.name as string).trim()
  const email = (body.email as string).toLowerCase().trim()
  // Built server-side, never taken from the request body.
  const waUrl = `https://wa.me/97450176561?text=${encodeURIComponent('Hi Allan, a question about Make AI Work · Cohort 2')}`

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

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers.get('user-agent') || null

  const result = await saveReservationAndNotify({
    name, email, details, waUrl, ip, userAgent, paypalOrderId: orderID,
  })

  return NextResponse.json({ success: true, ...result })
}
