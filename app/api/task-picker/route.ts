import { NextResponse } from 'next/server'
import { saveTaskPickerLead } from '@/lib/taskPickerLead'

export const runtime = 'nodejs'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

// ── Validation ──────────────────────────────────────────────────────────
function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 120
}
function isValidName(v: unknown): boolean {
  return v === undefined || (typeof v === 'string' && v.trim().length <= 80)
}
function isValidText(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length >= 1 && v.trim().length <= max
}
function isValidScore(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5
}
function isValidClassification(v: unknown): v is 'fixed' | 'estimate' {
  return v === 'fixed' || v === 'estimate'
}
function isValidBand(v: unknown): v is 'Low' | 'Medium' | 'High' {
  return v === 'Low' || v === 'Medium' || v === 'High'
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
  if (!isValidText(body.workflow, 120)) errors.workflow = 'Invalid workflow'
  if (!isValidText(body.taskText, 300)) errors.taskText = 'Invalid task'
  if (!isValidScore(body.predictability)) errors.predictability = 'Invalid score'
  if (!isValidScore(body.dataAvailability)) errors.dataAvailability = 'Invalid score'
  if (!isValidScore(body.complexity)) errors.complexity = 'Invalid score'
  if (!isValidScore(body.frequency)) errors.frequency = 'Invalid score'
  if (!isValidClassification(body.classification)) errors.classification = 'Invalid classification'
  if (!isValidBand(body.automationFit)) errors.automationFit = 'Invalid band'
  if (!isValidBand(body.aiPotential)) errors.aiPotential = 'Invalid band'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400, headers })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = req.headers.get('user-agent') || null

  const result = await saveTaskPickerLead({
    email: (body.email as string).toLowerCase().trim(),
    name: typeof body.name === 'string' ? body.name.trim() : undefined,
    workflow: (body.workflow as string).trim(),
    taskText: (body.taskText as string).trim(),
    predictability: body.predictability as number,
    dataAvailability: body.dataAvailability as number,
    complexity: body.complexity as number,
    frequency: body.frequency as number,
    classification: body.classification as 'fixed' | 'estimate',
    automationFit: body.automationFit as 'Low' | 'Medium' | 'High',
    aiPotential: body.aiPotential as 'Low' | 'Medium' | 'High',
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
