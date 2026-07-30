import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import BottomNav from '@/components/BottomNav'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lexora.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Lexora – Language Learning',
    template: '%s | Lexora',
  },
  description: 'Learn German and Polish from Bengali with structured CEFR lessons. Step-by-step stages from A1 to C2 with vocabulary, flashcards, and spaced repetition.',
  keywords: ['language learning', 'German', 'Polish', 'Bengali', 'CEFR', 'A1 B1 C2', 'flashcards', 'vocabulary'],
  authors: [{ name: 'Lexora' }],
  creator: 'Lexora',
  openGraph: {
    title: 'Lexora – Language Learning',
    description: 'Learn German and Polish from Bengali. Structured CEFR lessons from A1 to C2.',
    url: BASE_URL,
    siteName: 'Lexora',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Lexora – Language Learning',
    description: 'Learn German and Polish from Bengali. Structured CEFR lessons from A1 to C2.',
  },
  alternates: {
    canonical: BASE_URL,
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
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-slate-900 min-h-dvh`}>
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
