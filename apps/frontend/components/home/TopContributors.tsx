import Link from 'next/link'
import { Trophy, Medal, Award, TrendingUp, Edit3, DollarSign } from 'lucide-react'

// Mock data - 실제로는 API에서 가져옴
const mockContributors = [
  {
    id: 1,
    rank: 1,
    username: "devmaster",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=devmaster`,
    points: 15420,
    contributions: 234,
    earnings: 924.20,
    badge: "gold"
  },
  {
    id: 2,
    rank: 2,
    username: "codewarrior",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=codewarrior`,
    points: 12350,
    contributions: 189,
    earnings: 741.00,
    badge: "silver"
  },
  {
    id: 3,
    rank: 3,
    username: "techguru",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=techguru`,
    points: 10890,
    contributions: 167,
    earnings: 653.40,
    badge: "bronze"
  },
  {
    id: 4,
    rank: 4,
    username: "bugfixer",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=bugfixer`,
    points: 8920,
    contributions: 145,
    earnings: 535.20,
    badge: null
  },
  {
    id: 5,
    rank: 5,
    username: "docmaster",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=docmaster`,
    points: 7650,
    contributions: 128,
    earnings: 459.00,
    badge: null
  }
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-orange-600" />
    default:
      return <span className="flex h-5 w-5 items-center justify-center text-sm font-semibold">{rank}</span>
  }
}

export default function TopContributors() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            이번 달 인기 기여자
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            문서 개선에 기여한 전문가들을 만나보세요
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Leaderboard */}
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-7 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
              <div>순위</div>
              <div className="col-span-2">기여자</div>
              <div className="text-center">포인트</div>
              <div className="text-center">기여 수</div>
              <div className="text-center">수익</div>
              <div className="text-center">추세</div>
            </div>

            {mockContributors.map((contributor) => (
              <div
                key={contributor.id}
                className="grid grid-cols-7 items-center gap-4 border-b p-4 transition-colors hover:bg-muted/50"
              >
                {/* Rank */}
                <div className="flex items-center">
                  {getRankIcon(contributor.rank)}
                </div>

                {/* User Info */}
                <div className="col-span-2 flex items-center space-x-3">
                  <img
                    src={contributor.avatar}
                    alt={contributor.username}
                    className="h-10 w-10 rounded-full border bg-background"
                  />
                  <div>
                    <Link
                      href={`/users/${contributor.username}`}
                      className="font-medium hover:text-primary"
                    >
                      @{contributor.username}
                    </Link>
                    {contributor.badge && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {contributor.badge === "gold" && "🥇 Gold"}
                        {contributor.badge === "silver" && "🥈 Silver"}
                        {contributor.badge === "bronze" && "🥉 Bronze"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="text-center">
                  <div className="font-semibold">{contributor.points.toLocaleString()}</div>
                </div>

                {/* Contributions */}
                <div className="text-center">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Edit3 className="mr-1 h-3 w-3" />
                    {contributor.contributions}
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-center">
                  <div className="flex items-center justify-center font-medium text-green-600 dark:text-green-400">
                    <DollarSign className="h-3 w-3" />
                    {contributor.earnings.toFixed(2)}
                  </div>
                </div>

                {/* Trend */}
                <div className="flex justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="mb-4 text-muted-foreground">
              문서 개선에 기여하고 보상을 받아보세요
            </p>
            <Link
              href="/contribute"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              기여 시작하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}