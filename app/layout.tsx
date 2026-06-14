import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'

export const metadata: Metadata = {
  title: 'Rene & Ramona — 12 June 2027',
  description: 'Together with our families, we invite you to celebrate our wedding. 12 June 2027 · Phoenix Cernica, Pantelimon, Romania.',
  keywords: ['wedding', 'Rene', 'Ramona', 'June 2027', 'Phoenix Cernica', 'nunta', 'svadba'],
  openGraph: {
    title: 'Rene & Ramona — 12 June 2027',
    description: 'Together with our families, we invite you to celebrate our wedding.',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rene & Ramona Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rene & Ramona — 12 June 2027',
    description: 'Together with our families, we invite you to celebrate our wedding.',
  },
  robots: { index: false, follow: false }, // private wedding site
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#C9A84C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
