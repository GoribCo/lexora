'use client'

import { useEffect } from 'react'
import { trackOpportunitiesView, trackOpportunitiesCtaClick } from '@/lib/analytics'

interface Props {
  pair: string
}

export function OpportunitiesTracker({ pair }: Props) {
  useEffect(() => {
    trackOpportunitiesView(pair)
  }, [pair])
  return null
}

interface CtaProps {
  pair: string
  children: React.ReactNode
  href: string
  className?: string
}

export function OpportunitiesCtaLink({ pair, children, href, className }: CtaProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackOpportunitiesCtaClick(pair)}
    >
      {children}
    </a>
  )
}
