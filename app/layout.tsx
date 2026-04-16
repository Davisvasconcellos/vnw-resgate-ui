import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import { I18nProvider } from '@/components/i18n/I18nProvider'
import BottomNavWrapper from '@/components/BottomNavWrapper'

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`min-proto-h ${headline.variable} ${body.variable}`}>
        <I18nProvider>
          {children}
          <BottomNavWrapper />
        </I18nProvider>
      </body>
    </html>
  )
}
