import { FileText, Users, DollarSign, Edit3, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: FileText,
    value: "1,234",
    label: "총 문서 수",
    change: "+12%",
    changeType: "positive" as const
  },
  {
    icon: Users,
    value: "5,678",
    label: "활성 기여자",
    change: "+23%",
    changeType: "positive" as const
  },
  {
    icon: DollarSign,
    value: "$45,678",
    label: "이번 달 지급 보상",
    change: "+18%",
    changeType: "positive" as const
  },
  {
    icon: Edit3,
    value: "23,456",
    label: "편집 요청",
    change: "+34%",
    changeType: "positive" as const
  }
]

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            플랫폼 현황
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            TechWiki+의 성장과 커뮤니티 활동을 한눈에 확인하세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-card p-6"
            >
              {/* Background Pattern */}
              <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/5" />
              
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>

                {/* Label */}
                <p className="mb-2 text-sm text-muted-foreground">{stat.label}</p>

                {/* Change */}
                <div className="flex items-center text-sm">
                  <TrendingUp className={`mr-1 h-4 w-4 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-muted-foreground">이번 달</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="mb-4 text-xl font-semibold">
            함께 만들어가는 기술 지식의 미래
          </h3>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            TechWiki+는 AI 기술과 인간의 전문성을 결합하여 더 나은 기술 문서를 만들어갑니다.
            여러분의 기여가 전 세계 개발자들에게 도움이 됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}