import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Seal from '@/components/credentials/Seal'
import CopyLink from '@/components/credentials/CopyLink'
import { credentials, getCredential, credentialUrl, formatDate, linkedInAddUrl, ISSUER, OPERATOR, type StepLabel } from '@/lib/credentials'

export const dynamicParams = false

export function generateStaticParams() {
  return credentials.map(c => ({ id: c.id }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const c = getCredential(id)
  if (!c) return {}
  const title = `${c.name} · Make AI Work credential`
  const description = c.status === 'revoked'
    ? `This ${ISSUER} credential has been revoked.`
    : `${c.name} built an AI Task Specification for ${lowerFirst(c.task)}`
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: credentialUrl(c.id) },
    openGraph: { title, description, url: credentialUrl(c.id), type: 'website', siteName: ISSUER },
    twitter: { card: 'summary_large_image', title, description },
  }
}

const LABEL_CLASS: Record<StepLabel, string> = {
  'AI assists': 'l-as', 'AI performs': 'l-ai', 'Agent could run it': 'l-ag', 'Stays human': 'l-hu', 'Not worth changing': 'l-no',
}

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export default async function CredentialPage({ params }: Props) {
  const { id } = await params
  const c = getCredential(id)
  if (!c) notFound()

  const url = credentialUrl(c.id)
  const revoked = c.status === 'revoked'
  const statusText = revoked
    ? 'Revoked credential'
    : c.outcome ? 'Valid credential, first test completed' : `Valid credential, issued ${formatDate(c.date)}`

  return (
    <main>
      <article className="cr-sheet" aria-labelledby="cr-name">
        <div className="cr-pills">
          <span className={`cr-pill${revoked ? ' revoked' : ''}`}>{statusText}</span>
          {c.sample && <span className="cr-pill sample">Sample credential, not a real participant</span>}
        </div>

        <div className="cr-hero">
          <div>
            <p className="cr-lead">This records that</p>
            <h1 className="cr-name" id="cr-name">{c.name}</h1>
            <p className="cr-did">
              completed {c.programme}, took one real workflow from their own work, decided which steps AI or an agent
              should take on and which stay human, and produced an AI Task Specification for
            </p>
            <p className="cr-task">{c.task}</p>
            <p className="cr-wf">Workflow: {c.workflow}{c.org ? `, ${c.org}` : ''}</p>
          </div>
          <Seal className="cr-seal" year={c.date.slice(0, 4)} idSuffix={c.id} />
        </div>

        {c.outcome && !revoked && (
          <div className="cr-outcome">
            <b>First test completed, {formatDate(c.outcome.date)}</b>
            <p>{c.outcome.text}</p>
          </div>
        )}
        {revoked && c.revoked && (
          <p className="cr-revnote">This credential was revoked on {formatDate(c.revoked.date)}. {c.revoked.reason}</p>
        )}

        <div className="cr-tb">
          <div><span className="cr-k">Programme</span>{c.programme}, {c.cohort}</div>
          <div><span className="cr-k">Date</span>{formatDate(c.date)}</div>
          <div><span className="cr-k">Format</span>{c.format}</div>
          <div><span className="cr-k">Credential ID</span><b>{c.id}</b></div>
          <div><span className="cr-k">Issued by</span><span className="cr-sig">Allan Sendagi</span><span className="cr-small" style={{ display: "block", marginTop: 4 }}>for {ISSUER}, operated by {OPERATOR}</span></div>
          <div><span className="cr-k">Role</span>Facilitator; author of <i>The AI Roadmap</i></div>
          <div><span className="cr-k">Method</span>Authority-Aware AI Task Canvas</div>
          <div><span className="cr-k">Verify at</span>ainavsystem.com/verify</div>
        </div>

        {!revoked && (
          <div className="cr-actions">
            <a className="cr-btn" href={linkedInAddUrl(c)} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.82-2.05 3.74-2.05 4 0 4.74 2.63 4.74 6.05v5.5h-4v-4.88c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.96h-4z" /></svg>
              Add to LinkedIn
            </a>
            {c.pdf && (
              <a className="cr-btn alt" href={c.pdf} download>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" /></svg>
                Download certificate (PDF)
              </a>
            )}
            <CopyLink url={url} />
          </div>
        )}
      </article>

      <section className="cr-cols" aria-label="About this credential">
        <div>
          <h2>The specification</h2>
          {c.specPublic && c.steps.length > 0 && !revoked ? (
            <>
              <p>The workflow as mapped, with the label given to each step.</p>
              <ul className="cr-steps">
                {c.steps.map(s => (
                  <li key={s.text}><span>{s.text}</span><span className={LABEL_CLASS[s.label]}>{s.label}</span></li>
                ))}
              </ul>
            </>
          ) : (
            <div className="cr-private">
              <b>Kept private by the participant.</b> The full specification covers their workflow, data and decision rules.
              Its owner can share it directly.
            </div>
          )}
        </div>
        <div>
          <h2>What this credential means</h2>
          <p>
            The holder brought a real workflow, labelled every step, and wrote a one-page specification for one AI task:
            what it does, the data it needs, where it must stop and hand to a person, what gets recorded, and how success is measured.
          </p>
          <p>It is a certificate of completion for a 2.5-hour practical session run by {ISSUER}, operated by {OPERATOR}. It is not an accredited qualification.</p>
        </div>
      </section>
    </main>
  )
}
