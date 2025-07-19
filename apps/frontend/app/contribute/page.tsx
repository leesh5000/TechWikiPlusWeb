import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Edit,
  Search,
  MessageSquare,
  ArrowRight,
  Star,
  Trophy,
  Target
} from 'lucide-react'

export default function ContributePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                지식 공유로 더 나은{' '}
                <span className="text-primary">개발 문화</span>를 만들어가세요
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                TechWiki+는 AI가 생성한 기술 문서를 커뮤니티가 함께 검증하고 개선하는 플랫폼입니다.
                여러분의 경험과 지식이 모든 개발자에게 도움이 됩니다.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="#ways-to-contribute"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  기여 방법 알아보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  문서 둘러보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ways to Contribute */}
        <section id="ways-to-contribute" className="py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  다양한 방법으로 기여하세요
                </h2>
                <p className="text-lg text-muted-foreground">
                  경험 수준과 관심사에 따라 다양한 방식으로 참여할 수 있습니다
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Document Review */}
                <div className="rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">문서 검토하기</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    AI가 생성한 문서의 정확성을 검토하고 개선점을 제안하세요
                  </p>
                  <div className="text-xs text-primary font-medium">
                    ⏱️ 5-15분 소요
                  </div>
                </div>

                {/* Content Creation */}
                <div className="rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Edit className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">새 문서 작성</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    아직 다뤄지지 않은 기술이나 새로운 관점의 문서를 작성하세요
                  </p>
                  <div className="text-xs text-primary font-medium">
                    ⏱️ 30분-2시간 소요
                  </div>
                </div>

                {/* Improvement */}
                <div className="rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">문서 개선하기</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    기존 문서에 예제를 추가하거나 더 자세한 설명을 제공하세요
                  </p>
                  <div className="text-xs text-primary font-medium">
                    ⏱️ 10-30분 소요
                  </div>
                </div>

                {/* Bug Reports */}
                <div className="rounded-lg border p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">오류 신고하기</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    오타, 잘못된 정보, 깨진 링크 등을 발견하면 신고해 주세요
                  </p>
                  <div className="text-xs text-primary font-medium">
                    ⏱️ 1-5분 소요
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  기여 프로세스
                </h2>
                <p className="text-lg text-muted-foreground">
                  간단한 4단계로 기여를 시작하세요
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    1
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">관심 분야 선택</h3>
                  <p className="text-sm text-muted-foreground">
                    본인의 전문 분야나 관심 있는 기술 영역을 선택하세요
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    2
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">문서 찾기</h3>
                  <p className="text-sm text-muted-foreground">
                    검토가 필요한 문서나 개선할 수 있는 내용을 찾아보세요
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    3
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">기여하기</h3>
                  <p className="text-sm text-muted-foreground">
                    검토, 수정, 개선 사항을 제안하거나 직접 편집하세요
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    4
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">인정받기</h3>
                  <p className="text-sm text-muted-foreground">
                    기여가 승인되면 포인트와 뱃지를 획득하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  기여자 혜택
                </h2>
                <p className="text-lg text-muted-foreground">
                  기여할수록 더 많은 혜택과 인정을 받을 수 있습니다
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="rounded-lg border p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">포인트 시스템</h3>
                  <p className="text-sm text-muted-foreground">
                    기여 유형과 품질에 따라 포인트를 획득하고 레벨업하세요
                  </p>
                </div>

                <div className="rounded-lg border p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">성취 뱃지</h3>
                  <p className="text-sm text-muted-foreground">
                    다양한 활동과 마일스톤 달성으로 특별한 뱃지를 수집하세요
                  </p>
                </div>

                <div className="rounded-lg border p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">리더보드</h3>
                  <p className="text-sm text-muted-foreground">
                    월간/주간 기여자 랭킹에 이름을 올리고 커뮤니티에서 인정받으세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                지금 바로 시작하세요
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
                작은 기여부터 시작해서 점차 더 많은 영향력을 발휘해보세요.
                여러분의 지식과 경험이 다른 개발자들에게 큰 도움이 됩니다.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-background/90"
                >
                  <Target className="mr-2 h-4 w-4" />
                  기여할 문서 찾기
                </Link>
                <Link
                  href="/contribute/guidelines"
                  className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
                >
                  기여 가이드라인 보기
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// 메타데이터 최적화
export const metadata = {
  title: '기여 시작하기 | TechWiki+',
  description: 'TechWiki+ 커뮤니티에 기여하는 방법을 알아보세요. AI 생성 기술 문서를 검토하고 개선하여 더 나은 개발 문화를 만들어가세요.',
  keywords: ['기여', '문서 검토', '기술 문서', '개발자 커뮤니티', 'AI', '지식 공유']
}