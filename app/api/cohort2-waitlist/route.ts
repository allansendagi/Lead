import { NextResponse } from 'next/server'
import { saveCohort2WaitlistEntry } from '@/lib/cohort2Waitlist'

export const runtime = 'nodejs'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

// ── Validation ──────────────────────────────────────────────────────────
function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 120
}
function isValidName(v: unknown): boolean {
  return v === undefined || (typeof v === 'string' && v.trim().length <= 80)
}
function isValidSource(v: unknown): boolean {
  return v === undefined || (typeof v === 'string' && v.trim().length <= 60)
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
  if (!isValidEmail(body.email)) errors.email = 'Invalid email'
  if (!isValidName(body.name)) errors.name = 'Invalid name'
  if (!isValidSource(body.source)) errors.source = 'Invalid source'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400, headers })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers.get('user-agent') || null

  const result = await saveCohort2WaitlistEntry({
    email: (body.email as string).toLowerCase().trim(),
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    source: typeof body.source === 'string' ? body.source.trim() : undefined,
    ip,
    userAgent,
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
