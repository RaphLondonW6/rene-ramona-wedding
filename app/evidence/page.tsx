import type { Metadata } from 'next'
import EvidenceWall from '@/components/EvidenceWall'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'The Evidence — Ramona & René',
  description: 'The official (and slightly chaotic) photo archives of Ramona & René, 12 June 2027.',
  robots: { index: false, follow: false },
}

export default function EvidencePage() {
  return <EvidenceWall />
}
