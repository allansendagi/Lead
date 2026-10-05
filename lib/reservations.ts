import { Resend } from 'resend'
import {
  COHORT_NAME, COHORT_DATE_LONG, COHORT_TIME_DOHA, COHORT_TIME_DUBAI,
  PRICE_USD, PRICE_AED, PRICE_QAR, INVOICE_EMAIL, BANK,
} from './cohort2'

const SUPA_URL = process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'allan@safehavenai.world'
const ADMIN_EMAIL = process.env.RESERVATION_NOTIFY_EMAIL || 'allan@safehavenai.world'

export type Method = 'bank_transfer' | 'whatsapp' | 'paypal'
export type Currency = 'AED' | 'USD'
export type Status = 'pending' | 'confirmed'

// Details collected on the checkout form, beyond name and email.
export type BuyerDetails = {
  whatsapp: string
  company: string
  role: string
  workflow: string
  billingAddress?: string
}

// ── Supabase (native fetch — matches this project's existing convention) ──
async function dbUpsert(row: Record<string, unknown>, conflictColumn?: string) {
  const url = conflictColumn
    ? `${SUPA_URL}/rest/v1/workshop_reservations?on_conflict=${conflictColumn}`
    : `${SUPA_URL}/rest/v1/workshop_reservations`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPA_KEY as string,
      Authorization: `Bearer ${SUPA_KEY}`,
      Prefer: conflictColumn ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
    },
    body: JSON.stringify(row),
  })
  const text = await res.text()
  let body: unknown
  try { body = JSON.parse(text) } catch { body = text }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  return Array.isArray(body) ? body[0] : body
}

async function markEmailSent(id: string) {
  await fetch(`${SUPA_URL}/rest/v1/workshop_reservations?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPA_KEY as string,
      Authorization: `Bearer ${SUPA_KEY}`,
    },
    body: JSON.stringify({ confirmation_email_sent: true }),
  })
}

// ── Email ──────────────────────────────────────────────────────────────
export function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function detailRows(d: BuyerDetails) {
  const rows: [string, string][] = [
    ['WhatsApp', d.whatsapp],
    ['Company', d.company],
    ['Role', d.role],
    ['Workflow', d.workflow],
  ]
  if (d.billingAddress) rows.push(['Billing address', d.billingAddress])
  return rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;vertical-align:top;">${k}</td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')
}

function buildEmailHtml(opts: { name: string; seats: number; total: number; currency: Currency; method: Method; waUrl: string }) {
  const { seats, total, currency, method } = opts
  const firstName = esc(opts.name.trim().split(' ')[0] || 'there')
  const p = 'font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#D8D2C6;margin:0 0 16px;'
  const bankRows = [
    ['Bank', BANK.bank],
    ['Account name', BANK.accountName],
    ['Account number', BANK.accountNumber],
    ['IBAN', BANK.iban],
    ['SWIFT / BIC', BANK.swift],
    ['Currency', BANK.currency],
  ]
    .map(([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-top:1px solid #2a2a2a;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#A39C90;text-transform:uppercase;letter-spacing:0.04em;">${label}</td>
          <td style="padding:10px 0;border-top:1px solid #2a2a2a;font-family:'Courier New',monospace;font-size:14px;color:#F5F1EA;text-align:right;">${esc(value)}</td>
        </tr>`)
    .join('')

  let paymentBlock: string
  if (method === 'bank_transfer') {
    paymentBlock = `
        <p style="${p}">
          Transfer <strong style="color:#F5F1EA;">AED ${total.toLocaleString('en-US')}</strong> or <strong style="color:#F5F1EA;">QAR ${(PRICE_QAR * seats).toLocaleString('en-US')}</strong> using the details below, then send proof of payment
          on WhatsApp so Allan can confirm your seat${seats > 1 ? 's' : ''}.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161513;border-radius:12px;padding:0 18px;margin:0 0 24px;">
          ${bankRows}
        </table>`
  } else if (method === 'paypal') {
    paymentBlock = `
        <p style="${p}">
          Paid in full via PayPal, <strong style="color:#F5F1EA;">${currency} ${total}</strong>. Nothing else to do;
          your seat${seats > 1 ? 's are' : ' is'} confirmed.
        </p>`
  } else {
    paymentBlock = `
        <p style="${p}">
          You started a reservation via WhatsApp. Message Allan there to confirm your seat${seats > 1 ? 's' : ''}
          and arrange payment.
        </p>`
  }

  return `
  <div style="background:#080808;padding:40px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#0c0c0c;border:1px solid #2a2a2a;border-radius:16px;overflow:hidden;">
      <div style="background:#C2410C;padding:18px 28px;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#F5F1EA;margin:0;">
          ${esc(COHORT_NAME)}
        </p>
      </div>
      <div style="padding:32px 28px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;color:#F5F1EA;margin:0 0 16px;">
          Hi ${firstName}, ${method === 'paypal' ? "you're in" : 'your seat is reserved'}.
        </h1>
        <p style="${p}">
          <strong style="color:#F5F1EA;">${COHORT_DATE_LONG}</strong><br>
          ${COHORT_TIME_DOHA} / ${COHORT_TIME_DUBAI}<br>
          Live online &middot; ${seats} seat${seats > 1 ? 's' : ''}
        </p>
        ${paymentBlock}
        <p style="${p}">What happens next: a short pre-work email follows, to help you list your workflow&apos;s steps. Your session link arrives 24 hours before we start.</p>
        <a href="${esc(opts.waUrl || 'https://wa.me/97450176561')}" style="display:inline-block;background:#C2410C;color:#F5F1EA;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.04em;text-transform:uppercase;padding:14px 24px;border-radius:10px;">
          Message Allan on WhatsApp
        </a>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#6b6b6b;margin:24px 0 0;">
          Full refund if you don&apos;t leave with a specification you&apos;d use. Ask by email within 48 hours of the session. Questions? Reply to this email, or write to ${INVOICE_EMAIL}.
        </p>
      </div>
    </div>
  </div>`
}

async function sendConfirmationEmail(opts: { to: string; name: string; seats: number; total: number; currency: Currency; method: Method; waUrl: string }) {
  const resend = new Resend(RESEND_API_KEY)
  await resend.emails.send({
    from: `Allan Sendagi <${FROM_EMAIL}>`,
    to: opts.to,
    subject: `${opts.method === 'paypal' ? "You're in" : "You're reserved"} — ${COHORT_NAME}, 24 October (${opts.seats} seat${opts.seats > 1 ? 's' : ''})`,
    html: buildEmailHtml(opts),
  })
}

async function sendAdminNotification(opts: { name: string; email: string; seats: number; total: number; currency: Currency; method: Method; details: BuyerDetails; saved: boolean }) {
  const resend = new Resend(RESEND_API_KEY)
  const methodLabel = { bank_transfer: 'Bank transfer', whatsapp: 'WhatsApp', paypal: 'PayPal (paid)' }[opts.method]
  const note = {
    bank_transfer: "They'll message you on WhatsApp once they've paid, with proof of payment.",
    whatsapp: "They've been sent to WhatsApp to reach you directly.",
    paypal: 'Payment already confirmed via PayPal, no action needed.',
  }[opts.method]
  await resend.emails.send({
    from: `${COHORT_NAME} <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `New reservation — ${esc(opts.name)} (${opts.seats} seat${opts.seats > 1 ? 's' : ''})`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;">
        <p><strong>${esc(opts.name)}</strong> reserved ${opts.seats} seat${opts.seats > 1 ? 's' : ''} for ${esc(COHORT_NAME)}.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Email</td><td>${esc(opts.email)}</td></tr>
          ${detailRows(opts.details)}
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Seats</td><td>${opts.seats}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Total</td><td>${opts.currency} ${opts.total}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Method</td><td>${methodLabel}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Saved to database</td><td>${opts.saved ? 'Yes (name, email, seats, amount only)' : 'No, Supabase not configured'}</td></tr>
        </table>
        <p style="color:#6b7280;font-size:13px;">${note}</p>
      </div>`,
  })
}

// Invoice request: the buyer asked to pay by bank transfer. Returns false if the email could not be sent.
export async function sendInvoiceRequest(opts: { name: string; email: string; seats: number; details: BuyerDetails }): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('[reservations] RESEND_API_KEY not set — invoice request not sent')
    return false
  }
  const resend = new Resend(RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: `${COHORT_NAME} <${FROM_EMAIL}>`,
    to: INVOICE_EMAIL,
    replyTo: opts.email,
    subject: 'Invoice request: Cohort 2',
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;">
        <p><strong>${esc(opts.name)}</strong> asked for an invoice for ${esc(COHORT_NAME)} (${COHORT_DATE_LONG}), $${PRICE_USD * opts.seats} (AED ${(PRICE_AED * opts.seats).toLocaleString('en-US')} or QAR ${(PRICE_QAR * opts.seats).toLocaleString('en-US')}) for ${opts.seats} seat${opts.seats > 1 ? 's' : ''}.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Name</td><td>${esc(opts.name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Email</td><td>${esc(opts.email)}</td></tr>
          ${detailRows(opts.details)}
        </table>
        <p style="color:#6b7280;font-size:13px;">Reply to this email to reach the buyer. Promised turnaround: one working day.</p>
      </div>`,
  })
  if (error) {
    console.error('[reservations] invoice request email failed:', JSON.stringify(error))
    return false
  }
  return true
}

// ── Public entry point ────────────────────────────────────────────────
export async function saveReservationAndNotify(opts: {
  name: string
  email: string
  seats: number
  total: number
  currency: Currency
  method: Method
  status: Status
  details: BuyerDetails
  waUrl: string
  ip?: string
  userAgent?: string | null
  paypalOrderId?: string
}): Promise<{ id: string | null; saved: boolean; emailSent: boolean }> {
  let reservationId: string | null = null
  let saved = false

  if (SUPA_URL && SUPA_KEY) {
    try {
      const row = await dbUpsert(
        {
          name: opts.name,
          email: opts.email,
          seats: opts.seats,
          total_amount: opts.total,
          currency: opts.currency,
          payment_method: opts.method,
          status: opts.status,
          user_agent: opts.userAgent ?? null,
          ip_address: opts.ip ?? 'unknown',
          ...(opts.paypalOrderId ? { paypal_order_id: opts.paypalOrderId } : {}),
        },
        opts.paypalOrderId ? 'paypal_order_id' : undefined
      )
      reservationId = row?.id || null
      saved = true
    } catch (err) {
      console.error('[reservations] db upsert failed:', (err as Error).message)
    }
  } else {
    console.warn('[reservations] Supabase not configured — reservation not persisted')
  }

  let emailSent = false
  if (RESEND_API_KEY) {
    try {
      await sendConfirmationEmail({
        to: opts.email, name: opts.name, seats: opts.seats, total: opts.total,
        currency: opts.currency, method: opts.method, waUrl: opts.waUrl,
      })
      emailSent = true
      if (reservationId) await markEmailSent(reservationId)
    } catch (err) {
      console.error('[reservations] confirmation email failed:', (err as Error).message)
    }

    try {
      await sendAdminNotification({
        name: opts.name, email: opts.email, seats: opts.seats, total: opts.total,
        currency: opts.currency, method: opts.method, details: opts.details, saved,
      })
    } catch (err) {
      console.error('[reservations] admin notification failed:', (err as Error).message)
    }
  } else {
    console.warn('[reservations] RESEND_API_KEY not set — confirmation email not sent')
  }

  return { id: reservationId, saved, emailSent }
}
