import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechWiki+ | AI와 인간이 협업하는 기술 지식 플랫폼',
  description: 'AI가 생성한 고품질의 기술 문서를 커뮤니티가 검증하고 개선하는 크라우드소싱 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}