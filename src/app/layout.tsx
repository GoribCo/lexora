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

export const metadata: Metadata = {
  title: {
    default: 'Lexora – Language Learning',
    template: '%s | Lexora',
  },
  description: 'Learn languages step by step with Lexora. Structured CEFR-based lessons from Bengali to German and more.',
  keywords: ['language learning', 'German', 'Bengali', 'CEFR', 'lessons'],
  openGraph: {
    title: 'Lexora – Language Learning',
    description: 'Structured language learning from Bengali to German.',
    type: 'website',
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
