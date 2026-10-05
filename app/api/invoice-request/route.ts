import { NextResponse } from 'next/server'
import { sendInvoiceRequest } from '@/lib/reservations'
import { isValidName, isValidEmail, parseBuyerDetails } from '@/lib/checkoutDetails'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot — silently accept so bots don't learn anything
  if (typeof body.hp === 'string' && body.hp.length > 0) {
    return NextResponse.json({ success: true })
  }

  const { errors, details } = parseBuyerDetails(body)
  if (!isValidName(body.name)) errors.name = 'Invalid name'
  if (!isValidEmail(body.email)) errors.email = 'Invalid email'
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const sent = await sendInvoiceRequest({
    name: (body.name as string).trim(),
    email: (body.email as string).toLowerCase().trim(),
    details,
  })
  if (!sent) {
    return NextResponse.json({ error: 'Could not send the invoice request' }, { status: 502 })
  }
  return NextResponse.json({ success: true })
}
