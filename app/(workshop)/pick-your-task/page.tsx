import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import TaskFitContents from '@/components/TaskFitContents'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['700', '900'] })

export const metadata: Metadata = {
  title: 'Pick Your Task — AI Value Sandbox',
  description: 'A five-minute pre-work exercise from Chapter 6 of The AI Roadmap — find one business task worth pressure-testing before the workshop.',
}

export default function PickYourTaskPage() {
  return <TaskFitContents displayFont={fraunces.style.fontFamily} />
}
