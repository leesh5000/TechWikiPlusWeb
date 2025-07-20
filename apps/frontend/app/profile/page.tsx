'use client'

import { useState } from 'react'
import { User, Mail, Calendar, Shield, Trophy, FileText, CheckCircle, DollarSign, Settings, LogOut, TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import AuthGuard from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'

// Mock 활동 데이터
const mockActivities = {
  contributions: [
    { id: 1, documentId: 3, title: 'React Hooks 완벽 가이드', date: '2025-01-18', points: 50, status: 'approved' },
    { id: 2, documentId: 5, title: 'TypeScript 고급 패턴', date: '2025-01-15', points: 30, status: 'approved' },
    { id: 3, documentId: 8, title: 'Next.js 13 App Router', date: '2025-01-12', points: 45, status: 'pending' },
  ],
  reviews: [
    { id: 1, documentId: 11, title: 'Node.js 성능 최적화', date: '2025-01-19', approved: true },
    { id: 2, documentId: 14, title: 'Docker 베스트 프랙티스', date: '2025-01-17', approved: false },
    { id: 3, documentId: 16, title: 'GraphQL 스키마 설계', date: '2025-01-14', approved: true },
  ],
  points: [
    { id: 1, amount: 50, reason: '문서 검수 승인', date: '2025-01-18' },
    { id: 2, amount: 30, reason: '문서 제안 승인', date: '2025-01-15' },
    { id: 3, amount: 10, reason: '검수 참여', date: '2025-01-14' },
    { id: 4, amount: -1000, reason: '포인트 환급', date: '2025-01-10' },
  ]
}

// 사용자 통계 계산
function calculateStats(user: any) {
  return {
    totalContributions: mockActivities.contributions.length,
    approvedContributions: mockActivities.contributions.filter(c => c.status === 'approved').length,
    totalReviews: mockActivities.reviews.length,
    approvedReviews: mockActivities.reviews.filter(r => r.approved).length,
  }
}

// 레벨 계산 (100포인트당 1레벨)
function calculateLevel(points: number) {
  const level = Math.floor(points / 100) + 1
  const progress = points % 100
  return { level, progress }
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'activity' | 'points'>('activity')

  if (!user) return null

  const stats = calculateStats(user)
  const { level, progress } = calculateLevel(user.points)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCashout = () => {
    if (user.points >= 1000) {
      alert('포인트 환급 신청이 접수되었습니다. 영업일 기준 3-5일 내에 처리됩니다.')
    }
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 프로필 헤더 */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* 사용자 정보 */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                  user.role === 'contributor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                }`}>
                  <Shield className="h-3 w-3" />
                  {user.role === 'admin' ? '관리자' :
                   user.role === 'contributor' ? '기여자' : '일반 사용자'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  가입일: 2024-12-15
                </div>
              </div>

              {/* 레벨 및 진행도 */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">레벨 {level}</span>
                  <span className="text-sm text-muted-foreground">{progress}/100</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                <Settings className="h-4 w-4" />
                설정
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 포인트</p>
                <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            {user.points >= 1000 && (
              <button 
                onClick={handleCashout}
                className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                환급 신청 가능
              </button>
            )}
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">기여 문서</p>
                <p className="text-2xl font-bold">{stats.totalContributions}</p>
                <p className="text-xs text-muted-foreground">{stats.approvedContributions} 승인됨</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">검수 참여</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
                <p className="text-xs text-muted-foreground">{stats.approvedReviews} 승인</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">승인율</p>
                <p className="text-2xl font-bold">
                  {Math.round((stats.approvedContributions / stats.totalContributions) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">평균 이상</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* 활동 내역 */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'activity' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                활동 내역
              </button>
              <button
                onClick={() => setActiveTab('points')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'points' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                포인트 내역
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'activity' ? (
              <div className="space-y-6">
                {/* 최근 기여 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">최근 기여</h3>
                  <div className="space-y-3">
                    {mockActivities.contributions.map(contribution => (
                      <div key={contribution.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                        <div>
                          <p className="font-medium">{contribution.title}</p>
                          <p className="text-sm text-muted-foreground">{contribution.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            contribution.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {contribution.status === 'approved' ? '승인됨' : '대기중'}
                          </span>
                          <span className="text-sm font-medium">+{contribution.points}P</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 검수 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">최근 검수 참여</h3>
                  <div className="space-y-3">
                    {mockActivities.reviews.map(review => (
                      <div key={review.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                        <div>
                          <p className="font-medium">{review.title}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          review.approved 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {review.approved ? '승인' : '거부'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {mockActivities.points.map(point => (
                  <div key={point.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                    <div>
                      <p className="font-medium">{point.reason}</p>
                      <p className="text-sm text-muted-foreground">{point.date}</p>
                    </div>
                    <span className={`text-lg font-bold ${
                      point.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {point.amount > 0 ? '+' : ''}{point.amount}P
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}