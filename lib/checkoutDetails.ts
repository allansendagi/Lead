import type { BuyerDetails } from './reservations'

export function isValidName(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length >= 2 && v.trim().length <= 80
}
export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 120
}

function text(v: unknown, min: number, max: number): v is string {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max
}

// Validates the extra checkout fields. Returns field errors (empty when valid) and the cleaned details.
export function parseBuyerDetails(body: Record<string, unknown>): { errors: Record<string, string>; details: BuyerDetails } {
  const errors: Record<string, string> = {}
  if (!text(body.whatsapp, 5, 30)) errors.whatsapp = 'Invalid WhatsApp number'
  if (!text(body.company, 1, 120)) errors.company = 'Invalid company'
  if (!text(body.role, 1, 120)) errors.role = 'Invalid role'
  if (!text(body.workflow, 3, 300)) errors.workflow = 'Invalid workflow'
  if (body.billingAddress !== undefined && body.billingAddress !== '' && !text(body.billingAddress, 1, 500)) {
    errors.billingAddress = 'Invalid billing address'
  }
  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  return {
    errors,
    details: {
      whatsapp: s(body.whatsapp),
      company: s(body.company),
      role: s(body.role),
      workflow: s(body.workflow),
      billingAddress: s(body.billingAddress) || undefined,
    },
  }
}
