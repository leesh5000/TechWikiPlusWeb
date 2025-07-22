'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Calendar, Filter, Download, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import AuthGuard from '@/components/AuthGuard'
import Link from 'next/link'

// Mock 포인트 데이터
const mockPointsData = {
  summary: {
    totalPoints: 1250,
    monthlyEarned: 350,
    monthlySpent: 0,
    pendingPoints: 45,
    availableForCashout: 1250,
    lifetimeEarned: 2250,
    lifetimeSpent: 1000
  },
  history: [
    { id: 1, type: 'earned', amount: 50, reason: '문서 검수 승인', category: 'review', date: '2025-01-18', status: 'completed' },
    { id: 2, type: 'earned', amount: 30, reason: '문서 제안 승인', category: 'contribution', date: '2025-01-15', status: 'completed' },
    { id: 3, type: 'earned', amount: 10, reason: '검수 참여', category: 'review', date: '2025-01-14', status: 'completed' },
    { id: 4, type: 'spent', amount: -1000, reason: '포인트 환급', category: 'cashout', date: '2025-01-10', status: 'completed' },
    { id: 5, type: 'earned', amount: 100, reason: '월간 최다 기여자 보너스', category: 'bonus', date: '2025-01-01', status: 'completed' },
    { id: 6, type: 'earned', amount: 45, reason: '문서 검수 (대기중)', category: 'review', date: '2025-01-19', status: 'pending' },
  ],
  monthlyStats: [
    { month: '2024-10', earned: 450, spent: 0 },
    { month: '2024-11', earned: 380, spent: 0 },
    { month: '2024-12', earned: 520, spent: 0 },
    { month: '2025-01', earned: 350, spent: 1000 },
  ]
}

// 포인트 획득 방법
const pointsGuide = [
  { action: '문서 제안 승인', points: '30-50', description: '새로운 문서 작성 또는 대규모 수정' },
  { action: '검수 참여', points: '10', description: '다른 사용자의 문서 검수' },
  { action: '검수 승인', points: '5', description: '제출한 검수가 승인됨' },
  { action: '월간 최다 기여자', points: '100', description: '월별 상위 3명' },
  { action: '품질 보너스', points: '20-50', description: '특별히 우수한 기여' },
]

export default function PointsPage() {
  const { user } = useAuth()
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent'>('all')
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'week'>('all')

  if (!user) return null

  // 필터링된 히스토리
  const filteredHistory = mockPointsData.history.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false
    
    if (filterPeriod !== 'all') {
      const itemDate = new Date(item.date)
      const now = new Date()
      
      if (filterPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (itemDate < weekAgo) return false
      } else if (filterPeriod === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        if (itemDate < monthAgo) return false
      }
    }
    
    return true
  })

  const handleCashout = () => {
    if (mockPointsData.summary.availableForCashout >= 1000) {
      alert('포인트 환급 신청이 접수되었습니다. 영업일 기준 3-5일 내에 처리됩니다.')
    }
  }

  const exportHistory = () => {
    // CSV 내보내기 기능 (실제 구현 시)
    alert('포인트 내역을 CSV 파일로 다운로드합니다.')
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">포인트 관리</h1>
          <p className="text-muted-foreground">포인트 현황을 확인하고 환급을 신청할 수 있습니다.</p>
        </div>

        {/* 포인트 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">보유 포인트</h3>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{mockPointsData.summary.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">환급 가능: {mockPointsData.summary.availableForCashout.toLocaleString()}P</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">이번 달 획득</h3>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">+{mockPointsData.summary.monthlyEarned}</p>
            <p className="text-xs text-muted-foreground mt-1">대기중: {mockPointsData.summary.pendingPoints}P</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">이번 달 사용</h3>
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">-{mockPointsData.summary.monthlySpent}</p>
            <p className="text-xs text-muted-foreground mt-1">환급 포함</p>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">누적 획득</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{mockPointsData.summary.lifetimeEarned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">총 {mockPointsData.summary.lifetimeSpent.toLocaleString()}P 사용</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 포인트 히스토리 */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold">포인트 내역</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">전체</option>
                      <option value="earned">획득</option>
                      <option value="spent">사용</option>
                    </select>
                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value as any)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">전체 기간</option>
                      <option value="month">최근 30일</option>
                      <option value="week">최근 7일</option>
                    </select>
                    <button
                      onClick={exportHistory}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map(item => (
                    <div key={item.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.reason}</p>
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                대기중
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className="capitalize">{
                              item.category === 'review' ? '검수' :
                              item.category === 'contribution' ? '기여' :
                              item.category === 'bonus' ? '보너스' :
                              item.category === 'cashout' ? '환급' : item.category
                            }</span>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.type === 'earned' ? '+' : ''}{item.amount}P
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    조건에 맞는 포인트 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 환급 신청 */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">포인트 환급</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">환급 가능 포인트</p>
                  <p className="text-2xl font-bold">{mockPointsData.summary.availableForCashout.toLocaleString()}P</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• 최소 환급 포인트: 1,000P</p>
                  <p>• 1P = 1원 환율 적용</p>
                  <p>• 영업일 기준 3-5일 소요</p>
                </div>
                <button
                  onClick={handleCashout}
                  disabled={mockPointsData.summary.availableForCashout < 1000}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    mockPointsData.summary.availableForCashout >= 1000
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {mockPointsData.summary.availableForCashout >= 1000
                    ? '환급 신청하기'
                    : `${1000 - mockPointsData.summary.availableForCashout}P 더 필요`}
                </button>
              </div>
            </div>

            {/* 포인트 획득 가이드 */}
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">포인트 획득 방법</h3>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {pointsGuide.map((guide, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{guide.action}</p>
                      <p className="font-bold text-primary">{guide.points}P</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{guide.description}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center w-full mt-4 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                문서 기여하러 가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}