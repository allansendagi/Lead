import type { Metadata } from 'next'
import { Suspense } from 'react'
import VerifyForm from '@/components/credentials/VerifyForm'
import { verifyIndex } from '@/lib/credentials'

export const metadata: Metadata = {
  title: { absolute: 'Verify a credential · AI Value Sandbox' },
  description: 'Check a Make AI Work credential by its ID.',
  robots: { index: false, follow: true },
}

export default function VerifyPage() {
  return (
    <main>
      <section className="cr-sheet cr-verify" aria-labelledby="cr-vh">
        <h1 id="cr-vh">Verify a credential</h1>
        <p>Enter the credential ID printed on the certificate. It starts with MAW.</p>
        <Suspense fallback={null}>
          <VerifyForm index={verifyIndex()} />
        </Suspense>
      </section>
    </main>
  )
}
