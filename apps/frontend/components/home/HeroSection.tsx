import Link from 'next/link'
import { ArrowRight, BookOpen, Users, DollarSign, Shield } from 'lucide-react'

export default function HeroSection() {
  const features = [
    {
      icon: Shield,
      title: "정확성",
      description: "커뮤니티 검증"
    },
    {
      icon: DollarSign,
      title: "보상",
      description: "경제적 보상"
    },
    {
      icon: BookOpen,
      title: "접근성",
      description: "무료 열람"
    },
    {
      icon: Users,
      title: "투명성",
      description: "공개 이력"
    }
  ]

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            <span className="mr-1">🚀</span>
            새로운 기술 지식 플랫폼
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI와 인간이 협업하여 만드는
            <span className="block text-primary">신뢰할 수 있는 기술 지식 플랫폼</span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            매일 생성되는 AI 기술 문서를 전문가들이 검증하고 개선합니다.
            기여자들은 공정한 보상을 받으며, 모든 콘텐츠는 무료로 제공됩니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              문서 둘러보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contribute"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background dark:bg-card px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              기여 시작하기
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg border border-border bg-card dark:bg-card p-6 text-center shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all"
            >
              <feature.icon className="mb-3 h-10 w-10 text-primary" />
              <h3 className="mb-1 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}