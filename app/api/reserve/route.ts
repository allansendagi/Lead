import { NextResponse } from 'next/server'
import { saveReservationAndNotify, PRICE_PER_SEAT_QAR } from '@/lib/reservations'

export const runtime = 'nodejs'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

// ── Validation ──────────────────────────────────────────────────────────
function isValidName(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length >= 2 && v.trim().length <= 80
}
function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 120
}
function isValidSeats(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 10
}
function isValidMethod(v: unknown): v is 'bank_transfer' | 'whatsapp' {
  return v === 'bank_transfer' || v === 'whatsapp'
}

// ── Handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const origin = ALLOWED_ORIGIN || '*'
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'X-Content-Type-Options': 'nosniff',
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  // Honeypot — silently accept so bots don't learn anything
  if (typeof body.hp === 'string' && body.hp.length > 0) {
    return NextResponse.json({ success: true }, { headers })
  }

  const errors: Record<string, string> = {}
  if (!isValidName(body.name)) errors.name = 'Invalid name'
  if (!isValidEmail(body.email)) errors.email = 'Invalid email'
  if (!isValidSeats(body.seats)) errors.seats = 'Invalid seat count'
  if (!isValidMethod(body.method)) errors.method = 'Invalid method'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400, headers })
  }

  const name = (body.name as string).trim()
  const email = (body.email as string).toLowerCase().trim()
  const seats = body.seats as number
  const method = body.method as 'bank_transfer' | 'whatsapp'
  const total = seats * PRICE_PER_SEAT_QAR
  const waUrl = typeof body.waUrl === 'string' ? body.waUrl : ''

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers.get('user-agent') || null

  const result = await saveReservationAndNotify({
    name, email, seats, total, currency: 'QAR', method, status: 'pending', waUrl, ip, userAgent,
  })

  return NextResponse.json({ success: true, ...result }, { headers })
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
