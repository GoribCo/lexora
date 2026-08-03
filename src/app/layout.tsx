import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import UiLanguageProvider from '@/components/UiLanguageProvider'
import BottomNav from '@/components/BottomNav'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import InstallBanner from '@/components/InstallBanner'
import config from '@/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(config.url.site),
  title: {
    default: config.seo.defaultTitle,
    template: config.seo.titleTemplate,
  },
  description: config.seo.defaultDescription,
  keywords: [...config.seo.keywords],
  authors: [{ name: config.app.name }],
  creator: config.app.name,
  openGraph: {
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    url: config.url.site,
    siteName: config.app.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
  },
  alternates: {
    canonical: config.url.site,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: config.theme.colorLight },
    { media: '(prefers-color-scheme: dark)', color: config.theme.colorDark },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />

        {/* Apple PWA — enables "Add to Home Screen" via Safari on iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lexora" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Splash screens for common iPhone sizes */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />

        {/* Prevent auto-detection of phone numbers / emails */}
        <meta name="format-detection" content="telephone=no" />

        {/* Android / Chrome: status bar colour */}
        <meta name="theme-color" content="#4f46e5" />

      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-slate-900 min-h-dvh`}>
        <ThemeProvider>
          <UiLanguageProvider>
          <GoogleAnalytics />
          <ServiceWorkerRegistrar />
          {/*
            max-w-6xl caps the whole layout (sidebar + content) at 1152px.
            On desktop: flex row — sticky sidebar on the left, content fills the rest.
            On mobile: sidebar is hidden, bottom nav is fixed.
          */}
          <div className="max-w-6xl mx-auto min-h-dvh lg:flex lg:items-start">
            <BottomNav />
            <main className="flex-1 min-w-0 min-h-dvh">
              {children}
            </main>
          </div>
          <InstallBanner />
          </UiLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
