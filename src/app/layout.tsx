import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: '家計簿 - レシート自動読み取り',
  description: 'レシートを撮影するだけで自動で家計簿に記録。カテゴリ別・月別の支出を分析できます。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
