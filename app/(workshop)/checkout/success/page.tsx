import type { Metadata } from 'next'
import SuccessContents from '@/components/SuccessContents'

export const metadata: Metadata = {
  title: "You're in · Cohort 2",
  robots: { index: false, follow: false },
}

export default function SuccessPage() {
  return <SuccessContents />
}
