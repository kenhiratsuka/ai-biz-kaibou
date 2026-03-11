import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SITE_URL = process.env.SITE_URL ?? 'https://ai-biz-kaibou.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'AIビジネス解剖室 | 既存ビジネス×AI自動化の設計図メディア',
    template: '%s | AIビジネス解剖室',
  },
  description: '「この業種、AIで自動化したらいくら稼げる？」を深掘り解説。副業・フリーランスとして今日から動けるレベルの設計図を毎日お届けします。',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'AIビジネス解剖室',
    locale: 'ja_JP',
    type: 'website',
    url: SITE_URL,
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ai_biz_kaibou',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
