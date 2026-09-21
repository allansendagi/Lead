import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'

// Paddle can only reach this over the public internet, so it must run on
// Node (crypto.timingSafeEqual isn't available on the Edge runtime).
export const runtime = 'nodejs'

const SUPA_URL = process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY
const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'allan@safehavenai.world'

const WORKSHOP_DATE = 'October 3, 2026'

// ── Paddle webhook signature verification ──────────────────────────────────
// Header format: "ts=<unix_seconds>;h1=<hex hmac-sha256 of `${ts}:${rawBody}`>"
// https://developer.paddle.com/webhooks/signature-verification
function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const parts = Object.fromEntries(
    header.split(';').map(p => p.split('=')).filter(p => p.length === 2)
  )
  const ts = parts.ts
  const h1 = parts.h1
  if (!ts || !h1) return false

  const expected = crypto.createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex')
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(h1, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// ── Supabase (native fetch — matches api/submit.js's convention) ───────────
async function upsertReservation(row: Record<string, unknown>) {
  const res = await fetch(
    `${SUPA_URL}/rest/v1/workshop_reservations?on_conflict=paddle_transaction_id`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPA_KEY as string,
        Authorization: `Bearer ${SUPA_KEY}`,
        // Paddle retries webhooks on non-2xx responses, so the same event
        // can arrive twice — merge into the existing row instead of erroring.
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(row),
    }
  )
  const text = await res.text()
  let body: unknown
  try { body = JSON.parse(text) } catch { body = text }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  return Array.isArray(body) ? body[0] : body
}

async function markEmailSent(transactionId: string) {
  await fetch(
    `${SUPA_URL}/rest/v1/workshop_reservations?paddle_transaction_id=eq.${encodeURIComponent(transactionId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPA_KEY as string,
        Authorization: `Bearer ${SUPA_KEY}`,
      },
      body: JSON.stringify({ confirmation_email_sent: true }),
    }
  )
}

async function sendConfirmationEmail(to: string, name: string, seats: number) {
  const resend = new Resend(RESEND_API_KEY)
  const firstName = name.trim().split(' ')[0] || 'there'
  await resend.emails.send({
    from: `Allan Sendagi <${FROM_EMAIL}>`,
    to,
    subject: "You're confirmed — AI Value Sandbox",
    html: `
      <p>Hi ${firstName},</p>
      <p>You're confirmed for <strong>AI Value Sandbox</strong> — ${seats} seat${seats > 1 ? 's' : ''}.</p>
      <p><strong>${WORKSHOP_DATE}</strong> &middot; 2.5 hours &middot; Live online</p>
      <p>Bring one real business task you want to improve with AI. No technical background required.</p>
      <p>Questions or need to reschedule? Just reply to this email.</p>
      <p>— Allan</p>
    `,
  })
}

// ── Handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('[paddle-webhook] PADDLE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  // Signature is computed over the exact raw bytes — read as text before any parsing.
  const rawBody = await req.text()
  const signature = req.headers.get('paddle-signature')

  if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
    console.warn('[paddle-webhook] invalid or missing signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { event_type?: string; data?: Record<string, any> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.event_type !== 'transaction.completed') {
    // Ack anything we don't act on so Paddle stops retrying it.
    return NextResponse.json({ received: true })
  }

  const data = event.data || {}
  const transactionId: string | undefined = data.id
  const customer = data.customer || {}
  const item = (data.items || [])[0] || {}
  const totals = data.details?.totals || {}

  const buyerEmail: string | null = customer.email || data.billing_details?.email || null
  const buyerName: string =
    customer.name ||
    [data.billing_details?.first_name, data.billing_details?.last_name].filter(Boolean).join(' ') ||
    ''
  const seats = Number(item.quantity) || 1
  const totalMinorUnits = Number(totals.total) || 0
  const unitMinorUnits = item.price?.unit_price?.amount ? Number(item.price.unit_price.amount) : null
  const currency: string = data.currency_code || 'QAR'

  if (!transactionId || !buyerEmail) {
    console.error('[paddle-webhook] missing transaction id or buyer email', { transactionId, buyerEmail })
    return NextResponse.json({ error: 'Malformed event' }, { status: 400 })
  }

  if (!SUPA_URL || !SUPA_KEY) {
    console.error('[paddle-webhook] Supabase not configured — cannot record reservation')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  let saved: { confirmation_email_sent?: boolean } | undefined
  try {
    saved = await upsertReservation({
      paddle_transaction_id: transactionId,
      paddle_customer_id: data.customer_id || customer.id || null,
      buyer_name: buyerName || null,
      buyer_email: buyerEmail.toLowerCase().trim(),
      seats,
      unit_price_cents: unitMinorUnits,
      total_price_cents: totalMinorUnits,
      currency,
      status: 'paid',
      raw_event: event,
    })
  } catch (err) {
    console.error('[paddle-webhook] db upsert failed:', (err as Error).message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (saved && !saved.confirmation_email_sent && RESEND_API_KEY) {
    try {
      await sendConfirmationEmail(buyerEmail, buyerName, seats)
      await markEmailSent(transactionId)
    } catch (err) {
      console.error('[paddle-webhook] confirmation email failed:', (err as Error).message)
      // The reservation is already recorded — don't fail the webhook over email.
    }
  }

  return NextResponse.json({ received: true })
}
