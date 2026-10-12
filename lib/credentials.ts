// Make AI Work credentials. Each cohort is one JSON file in data/credentials/.
// Records are validated when this module loads, so a bad file fails `next build`.
import cohort2 from '@/data/credentials/cohort-2.json'

export const STEP_LABELS = ['AI assists', 'AI performs', 'Agent could run it', 'Stays human', 'Not worth changing'] as const
export type StepLabel = (typeof STEP_LABELS)[number]

export type Credential = {
  id: string
  sample?: boolean
  name: string
  org: string | null
  programme: string
  cohort: string
  date: string // YYYY-MM-DD
  format: string
  task: string
  workflow: string
  status: 'valid' | 'revoked'
  revoked: { date: string; reason: string } | null
  outcome: { date: string; text: string } | null
  specPublic: boolean
  steps: { text: string; label: StepLabel }[]
  pdf: string | null
  privatePdf: string | null // never rendered on any page
}

export const SITE = 'https://www.ainavsystem.com'
export const ISSUER = 'AI Value Sandbox'
export const OPERATOR = 'SafeHaven LLC'
export const CREDENTIAL_NAME = 'Make AI Work: AI Task Specification'

const ID_RE = /^MAW-C\d+-\d{3}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function validate(all: Credential[]): Credential[] {
  const seen = new Set<string>()
  for (const c of all) {
    const where = `credential ${c.id || '(no id)'}`
    if (!c.id || !ID_RE.test(c.id)) throw new Error(`${where}: id must look like MAW-C2-007`)
    if (seen.has(c.id)) throw new Error(`${where}: duplicate id`)
    seen.add(c.id)
    if (!c.name?.trim()) throw new Error(`${where}: missing name`)
    if (!c.task?.trim()) throw new Error(`${where}: missing task`)
    if (!DATE_RE.test(c.date)) throw new Error(`${where}: date must be YYYY-MM-DD`)
    if (c.status !== 'valid' && c.status !== 'revoked') throw new Error(`${where}: status must be valid or revoked`)
    if (c.status === 'revoked' && !c.revoked) throw new Error(`${where}: revoked credentials need a date and reason`)
    if (c.outcome && !DATE_RE.test(c.outcome.date)) throw new Error(`${where}: outcome date must be YYYY-MM-DD`)
    for (const s of c.steps) {
      if (!STEP_LABELS.includes(s.label)) throw new Error(`${where}: unknown step label "${s.label}"`)
    }
    if (c.privatePdf && !c.privatePdf.startsWith('/credentials/p/')) throw new Error(`${where}: privatePdf must live in /credentials/p/`)
  }
  return all
}

export const credentials: Credential[] = validate([...(cohort2 as Credential[])])

export function getCredential(id: string): Credential | undefined {
  const key = id.trim().toUpperCase()
  return credentials.find(c => c.id === key)
}

export function credentialUrl(id: string) {
  return `${SITE}/c/${id}`
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d} ${months[m - 1]} ${y}`
}

export function linkedInAddUrl(c: Credential) {
  const [y, m] = c.date.split('-')
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: CREDENTIAL_NAME,
    organizationName: ISSUER,
    issueYear: y,
    issueMonth: String(Number(m)),
    certUrl: credentialUrl(c.id),
    certId: c.id,
  })
  return `https://www.linkedin.com/profile/add?${p.toString()}`
}

// The only fields the public verify page receives. No PDF paths.
export type VerifyEntry = Pick<Credential, 'id' | 'name' | 'programme' | 'cohort' | 'date' | 'status' | 'task' | 'sample'> & { reason: string | null }

export function verifyIndex(): VerifyEntry[] {
  return credentials.map(c => ({
    id: c.id, name: c.name, programme: c.programme, cohort: c.cohort, date: c.date,
    status: c.status, task: c.task, sample: c.sample, reason: c.revoked?.reason ?? null,
  }))
}
