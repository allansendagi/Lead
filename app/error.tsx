'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Something went wrong</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>We had trouble loading this page. Please try again.</p>
      <button
        onClick={reset}
        style={{ background: '#1C1714', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
      >
        Try again
      </button>
    </div>
  )
}
