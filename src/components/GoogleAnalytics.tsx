'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import config from '@/config'
import { trackPageView } from '@/lib/analytics'

const GA_ID = config.analytics.gaId

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    trackPageView(url)
  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      {/* Load gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Initialize dataLayer and gtag */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
      {/* Track route changes — Suspense required by Next.js for useSearchParams */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}
