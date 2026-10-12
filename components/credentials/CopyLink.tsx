'use client'
import { useState } from 'react'

export default function CopyLink({ url }: { url: string }) {
  const [note, setNote] = useState('')
  const short = url.replace('https://www.', '')
  return (
    <>
      <button
        type="button"
        className="cr-btn alt"
        onClick={() => {
          navigator.clipboard?.writeText(url).then(() => setNote(`Link copied: ${short}`), () => setNote(short))
        }}
      >
        Copy link
      </button>
      <span className="cr-small" aria-live="polite">{note}</span>
    </>
  )
}
