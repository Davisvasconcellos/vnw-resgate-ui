import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import { I18nProvider } from '@/components/i18n/I18nProvider'
import BottomNavWrapper from '@/components/BottomNavWrapper'
import { Toaster } from 'react-hot-toast'

import { ReduxProvider } from '@/store/Provider'

const headline = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-headline',
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VNW Resgate — Apoio em Emergências',
  description: 'Plataforma de apoio em situações de emergência — conectando pessoas afetadas a voluntários e recursos em tempo real.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VNW Resgate',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#ba1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-proto-h ${headline.variable} ${body.variable}`}>
        <ReduxProvider>
          <I18nProvider>
            {children}
            <BottomNavWrapper />
            <Toaster position="top-center" />
          </I18nProvider>
        </ReduxProvider>
      </body>

    </html>
  )
}
