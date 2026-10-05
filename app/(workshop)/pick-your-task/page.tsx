import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import TaskFitContents from '@/components/TaskFitContents'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['700', '900'] })

export const metadata: Metadata = {
  title: 'Pick Your Process',
  description: 'A 5-minute exercise from Chapter 6 of The AI Roadmap: find the process worth fixing first, and prepare for the Make AI Work workshop.',
}

export default function PickYourTaskPage() {
  return <TaskFitContents displayFont={fraunces.style.fontFamily} />
}
