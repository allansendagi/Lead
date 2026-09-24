import { Resend } from 'resend'

const SUPA_URL = process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'allan@safehavenai.world'
const ADMIN_EMAIL = process.env.RESERVATION_NOTIFY_EMAIL || 'allan@safehavenai.world'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export type TaskPickerLead = {
  email: string
  name?: string
  workflow: string
  taskText: string
  predictability: number
  dataAvailability: number
  complexity: number
  frequency: number
  classification: 'fixed' | 'estimate'
  automationFit: 'Low' | 'Medium' | 'High'
  aiPotential: 'Low' | 'Medium' | 'High'
  ip?: string
  userAgent?: string | null
}

async function dbInsert(lead: TaskPickerLead) {
  const res = await fetch(`${SUPA_URL}/rest/v1/task_picker_leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPA_KEY as string,
      Authorization: `Bearer ${SUPA_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      email: lead.email,
      name: lead.name || null,
      workflow: lead.workflow,
      task_text: lead.taskText,
      predictability: lead.predictability,
      data_availability: lead.dataAvailability,
      complexity: lead.complexity,
      frequency: lead.frequency,
      classification: lead.classification,
      automation_fit: lead.automationFit,
      ai_potential: lead.aiPotential,
      ip: lead.ip || null,
      user_agent: lead.userAgent || null,
    }),
  })
  const text = await res.text()
  let body: unknown
  try { body = JSON.parse(text) } catch { body = text }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  return Array.isArray(body) ? body[0] : body
}

async function sendAdminNotification(lead: TaskPickerLead, saved: boolean) {
  const resend = new Resend(RESEND_API_KEY)
  const classificationLabel = lead.classification === 'fixed' ? 'Fixed rule (not AI)' : 'Requires estimation'
  await resend.emails.send({
    from: `AI Value Sandbox <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `Task picker lead — ${esc(lead.name || lead.email)} (${lead.aiPotential} AI potential)`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.7;">
        <p><strong>${esc(lead.name || 'Someone')}</strong> completed the task picker at /pick-your-task.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Email</td><td>${esc(lead.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Workflow</td><td>${esc(lead.workflow)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Task</td><td>${esc(lead.taskText)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Scores</td><td>Predictability ${lead.predictability}, Data ${lead.dataAvailability}, Complexity ${lead.complexity}, Frequency ${lead.frequency}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Classification</td><td>${classificationLabel}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Automation Fit</td><td>${lead.automationFit}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">AI Potential</td><td>${lead.aiPotential}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#6b7280;">Saved to database</td><td>${saved ? 'Yes' : 'No — Supabase not configured'}</td></tr>
        </table>
      </div>`,
  })
}

export async function saveTaskPickerLead(lead: TaskPickerLead): Promise<{ saved: boolean; notified: boolean }> {
  let saved = false
  if (SUPA_URL && SUPA_KEY) {
    try {
      await dbInsert(lead)
      saved = true
    } catch (err) {
      console.error('[task-picker] db insert failed:', err)
    }
  } else {
    console.warn('[task-picker] Supabase not configured — lead not saved to database')
  }

  let notified = false
  if (RESEND_API_KEY) {
    try {
      await sendAdminNotification(lead, saved)
      notified = true
    } catch (err) {
      console.error('[task-picker] admin notification failed:', err)
    }
  }

  return { saved, notified }
}
