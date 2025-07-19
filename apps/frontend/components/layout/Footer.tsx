import Link from 'next/link'
import { Github, Twitter, Mail, FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">T+</span>
              </div>
              <span className="font-bold">TechWiki+</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI와 인간이 협업하여 만드는 신뢰할 수 있는 기술 지식 플랫폼
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">제품</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  문서 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-muted-foreground hover:text-foreground">
                  기여하기
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground">
                  리더보드
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  광고 문의
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">문서</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/planning" className="text-muted-foreground hover:text-foreground">
                  <FileText className="mr-1 inline h-3 w-3" />
                  기획서
                </Link>
              </li>
              <li>
                <Link href="/docs/prd" className="text-muted-foreground hover:text-foreground">
                  <FileText className="mr-1 inline h-3 w-3" />
                  PRD
                </Link>
              </li>
              <li>
                <Link href="/docs/trd" className="text-muted-foreground hover:text-foreground">
                  <FileText className="mr-1 inline h-3 w-3" />
                  TRD
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground">
                  API 문서
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">커뮤니티</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/leesh5000/TechWikiPlus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@techwikiplus.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              문의: contact@techwikiplus.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 TechWiki+. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}