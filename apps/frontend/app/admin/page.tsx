'use client'

import { FileText, Users, CheckSquare, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock 데이터
const dailyStats = [
  { date: '1/14', documents: 45, users: 120, reviews: 89 },
  { date: '1/15', documents: 52, users: 135, reviews: 95 },
  { date: '1/16', documents: 48, users: 142, reviews: 102 },
  { date: '1/17', documents: 58, users: 158, reviews: 110 },
  { date: '1/18', documents: 62, users: 165, reviews: 125 },
  { date: '1/19', documents: 70, users: 180, reviews: 140 },
  { date: '1/20', documents: 65, users: 172, reviews: 135 },
]

const categoryStats = [
  { category: 'React', count: 156 },
  { category: 'TypeScript', count: 142 },
  { category: 'DevOps', count: 128 },
  { category: 'Next.js', count: 115 },
  { category: 'Python', count: 98 },
]

const recentActivities = [
  { id: 1, type: 'document', action: '새 문서 생성', user: 'AI Writer', time: '5분 전' },
  { id: 2, type: 'review', action: '검수 완료', user: '김개발자', time: '12분 전' },
  { id: 3, type: 'user', action: '신규 가입', user: '이코더', time: '23분 전' },
  { id: 4, type: 'review', action: '검수 시작', user: '박리뷰어', time: '45분 전' },
  { id: 5, type: 'point', action: '포인트 환급 요청', user: '최기여자', time: '1시간 전' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground">TechWiki+ 전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="전체 문서"
          value="1,234"
          description="이번 주 +45"
          icon={<FileText className="h-5 w-5 text-primary" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="활성 사용자"
          value="8,921"
          description="이번 주 +312"
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="검수 대기"
          value="45"
          description="평균 대기 시간 2.5일"
          icon={<CheckSquare className="h-5 w-5 text-primary" />}
          trend={{ value: 3.1, isPositive: false }}
        />
        <StatsCard
          title="월 수익"
          value="₩3,450,000"
          description="광고 수익"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          trend={{ value: 18.7, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Trend Chart */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">일별 활동 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="문서"
              />
              <Line 
                type="monotone" 
                dataKey="reviews" 
                stroke="#10b981" 
                strokeWidth={2}
                name="검수"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">카테고리별 문서 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="text-lg font-semibold">최근 활동</h3>
          </div>
          <div className="divide-y">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    activity.type === 'document' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    activity.type === 'review' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                    activity.type === 'user' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {activity.type === 'document' ? <FileText className="h-4 w-4" /> :
                     activity.type === 'review' ? <CheckSquare className="h-4 w-4" /> :
                     activity.type === 'user' ? <Users className="h-4 w-4" /> :
                     <TrendingUp className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="text-lg font-semibold">시스템 알림</h3>
          </div>
          <div className="space-y-4 p-4">
            <div className="flex gap-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 p-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900 dark:text-yellow-100">검수 지연 경고</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">15개 문서가 48시간 이상 검수 대기 중입니다.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">예정된 작업</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">오후 3시에 AI 문서 자동 생성이 예정되어 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}