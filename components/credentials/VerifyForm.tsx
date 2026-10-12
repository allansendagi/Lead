'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { VerifyEntry } from '@/lib/credentials'

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export default function VerifyForm({ index }: { index: VerifyEntry[] }) {
  const params = useSearchParams()
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<string | null>(null)

  useEffect(() => {
    const fromUrl = params?.get('id')
    if (fromUrl) { setValue(fromUrl.toUpperCase()); setChecked(fromUrl.trim().toUpperCase()) }
  }, [params])

  const hit = checked ? index.find(e => e.id === checked) : undefined

  return (
    <>
      <form
        className="cr-vform"
        onSubmit={e => {
          e.preventDefault()
          const id = value.trim().toUpperCase()
          setChecked(id)
          const u = new URL(window.location.href)
          if (id) u.searchParams.set('id', id); else u.searchParams.delete('id')
          window.history.replaceState(null, '', u.toString())
        }}
      >
        <label htmlFor="cr-vid">Credential ID</label>
        <input id="cr-vid" name="id" autoComplete="off" spellCheck={false} placeholder="MAW-C2-007" value={value} onChange={e => setValue(e.target.value)} />
        <button className="cr-btn" type="submit">Check</button>
      </form>

      <div aria-live="polite">
        {checked === '' && <div className="cr-vres">Enter the credential ID from the certificate, for example MAW-C2-007.</div>}
        {checked && !hit && (
          <div className="cr-vres">
            <span className="cr-pill revoked">No match</span>
            <h2>No credential with the ID {checked}</h2>
            <p className="cr-small">Check the ID against the certificate. IDs look like MAW-C2-007. If it still does not match, the certificate was not issued by AI Value Sandbox.</p>
          </div>
        )}
        {hit && (
          <div className="cr-vres">
            <span className={`cr-pill${hit.status === 'revoked' ? ' revoked' : ''}`}>{hit.status === 'revoked' ? 'Revoked' : 'Valid'}</span>
            {hit.sample && <span className="cr-pill sample" style={{ marginLeft: 8 }}>Sample</span>}
            <h2>{hit.name}</h2>
            <dl>
              <dt>Credential</dt><dd>{hit.id}</dd>
              <dt>Programme</dt><dd>{hit.programme}, {hit.cohort}</dd>
              <dt>Issued</dt><dd>{formatDate(hit.date)}</dd>
              {hit.status === 'revoked'
                ? (<><dt>Reason</dt><dd>{hit.reason}</dd></>)
                : (<><dt>Built</dt><dd>{hit.task}</dd></>)}
            </dl>
            {hit.status !== 'revoked' && <p className="cr-small" style={{ marginTop: 12 }}>Full record: <a href={`/c/${hit.id}`}>ainavsystem.com/c/{hit.id}</a></p>}
          </div>
        )}
      </div>
    </>
  )
}
