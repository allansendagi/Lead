import { Resend } from 'resend'

const SUPA_URL = process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'allan@safehavenai.world'
const ADMIN_EMAIL = process.env.RESERVATION_NOTIFY_EMAIL || 'allan@safehavenai.world'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export type Cohort2WaitlistEntry = {
  email: string
  name?: string
  source?: string
  ip?: string
  userAgent?: string | null
}

async function dbInsert(entry: Cohort2WaitlistEntry) {
  const res = await fetch(`${SUPA_URL}/rest/v1/cohort2_waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPA_KEY as string,
      Authorization: `Bearer ${SUPA_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      email: entry.email,
      name: entry.name || null,
      source: entry.source || null,
      ip: entry.ip || null,
      user_agent: entry.userAgent || null,
    }),
  })
  const text = await res.text()
  let body: unknown
  try { body = JSON.parse(text) } catch { body = text }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  return Array.isArray(body) ? body[0] : body
}

async function sendAdminNotification(entry: Cohort2WaitlistEntry, saved: boolean) {
  const resend = new Resend(RESEND_API_KEY)
  await resend.emails.send({
    from: `AI Value Sandbox <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `Cohort 2 waitlist — ${esc(entry.name || entry.email)}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;">
        <p><strong>${esc(entry.name || 'Someone')}</strong> joined the Cohort 2 waitlist.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Email</td><td>${esc(entry.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Source</td><td>${esc(entry.source || 'workshop page')}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Saved to database</td><td>${saved ? 'Yes' : 'No — Supabase not configured'}</td></tr>
        </table>
      </div>`,
  })
}

export async function saveCohort2WaitlistEntry(entry: Cohort2WaitlistEntry): Promise<{ saved: boolean; notified: boolean }> {
  let saved = false
  if (SUPA_URL && SUPA_KEY) {
    try {
      await dbInsert(entry)
      saved = true
    } catch (err) {
      console.error('[cohort2-waitlist] db insert failed:', err)
    }
  } else {
    console.warn('[cohort2-waitlist] Supabase not configured — entry not saved to database')
  }

  let notified = false
  if (RESEND_API_KEY) {
    try {
      await sendAdminNotification(entry, saved)
      notified = true
    } catch (err) {
      console.error('[cohort2-waitlist] admin notification failed:', err)
    }
  }

  return { saved, notified }
}
