'use client'

import { useState } from 'react'
import { Search, Filter, Download, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react'
import AdminGuard from '@/components/admin/AdminGuard'

// Mock 데이터
const mockPointsData = {
  summary: {
    totalPoints: 125000,
    pendingCashouts: 3,
    pendingCashoutAmount: 3500,
    monthlyDistributed: 15000,
    monthlyRefunded: 5000,
    activeUsers: 234
  },
  transactions: [
    {
      id: 1,
      userId: 3,
      username: 'developer123',
      type: 'earned',
      amount: 50,
      reason: '문서 검수 승인',
      status: 'completed',
      date: '2025-01-20 14:30',
      adminNote: null
    },
    {
      id: 2,
      userId: 5,
      username: 'techwriter',
      type: 'earned',
      amount: 100,
      reason: '월간 최다 기여자 보너스',
      status: 'completed',
      date: '2025-01-19 09:00',
      adminNote: '1월 TOP 3 기여자'
    },
    {
      id: 3,
      userId: 8,
      username: 'reviewer99',
      type: 'spent',
      amount: -1000,
      reason: '포인트 환급',
      status: 'pending',
      date: '2025-01-18 16:45',
      adminNote: null,
      cashoutDetails: {
        bankName: '카카오뱅크',
        accountNumber: '****-**-***456',
        accountHolder: '김검수'
      }
    },
    {
      id: 4,
      userId: 12,
      username: 'newbie2025',
      type: 'earned',
      amount: 30,
      reason: '문서 제안 승인',
      status: 'completed',
      date: '2025-01-18 11:20',
      adminNote: null
    },
    {
      id: 5,
      userId: 15,
      username: 'poweruser',
      type: 'spent',
      amount: -2000,
      reason: '포인트 환급',
      status: 'completed',
      date: '2025-01-15 10:00',
      adminNote: '처리 완료 - 2025-01-18'
    },
    {
      id: 6,
      userId: 20,
      username: 'contributor7',
      type: 'refund',
      amount: 45,
      reason: '검수 반려 - 포인트 환원',
      status: 'completed',
      date: '2025-01-14 15:30',
      adminNote: '중복 문서로 인한 반려'
    }
  ],
  cashoutRequests: [
    {
      id: 3,
      userId: 8,
      username: 'reviewer99',
      amount: 1000,
      requestDate: '2025-01-18 16:45',
      status: 'pending',
      bankInfo: {
        bankName: '카카오뱅크',
        accountNumber: '****-**-***456',
        accountHolder: '김검수'
      }
    },
    {
      id: 7,
      userId: 25,
      username: 'expert2024',
      amount: 1500,
      requestDate: '2025-01-17 13:20',
      status: 'pending',
      bankInfo: {
        bankName: '국민은행',
        accountNumber: '****-***-**1234',
        accountHolder: '이전문'
      }
    },
    {
      id: 8,
      userId: 30,
      username: 'veteran',
      amount: 1000,
      requestDate: '2025-01-16 09:15',
      status: 'pending',
      bankInfo: {
        bankName: '신한은행',
        accountNumber: '***-**-******89',
        accountHolder: '박베테'
      }
    }
  ]
}

export default function AdminPointsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'cashouts'>('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent' | 'refund'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all')

  // 필터링된 거래 내역
  const filteredTransactions = mockPointsData.transactions.filter(transaction => {
    const matchesSearch = transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || 
                       (filterType === 'earned' && transaction.type === 'earned') ||
                       (filterType === 'spent' && transaction.type === 'spent') ||
                       (filterType === 'refund' && transaction.type === 'refund')
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCashoutApprove = (id: number) => {
    alert(`환급 요청 #${id} 승인 처리되었습니다.`)
  }

  const handleCashoutReject = (id: number) => {
    const reason = prompt('반려 사유를 입력하세요:')
    if (reason) {
      alert(`환급 요청 #${id} 반려 처리되었습니다.`)
    }
  }

  const exportData = () => {
    alert('포인트 거래 내역을 Excel 파일로 다운로드합니다.')
  }

  return (
    <AdminGuard requiredRole="admin">
      <div className="p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">포인트 관리</h1>
          <p className="text-muted-foreground">사용자 포인트 거래 내역 및 환급 요청을 관리합니다.</p>
        </div>

        {/* 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 포인트</p>
                <p className="text-2xl font-bold">{mockPointsData.summary.totalPoints.toLocaleString()}P</p>
                <p className="text-xs text-muted-foreground mt-1">활성 사용자: {mockPointsData.summary.activeUsers}명</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">대기중인 환급</p>
                <p className="text-2xl font-bold">{mockPointsData.summary.pendingCashouts}건</p>
                <p className="text-xs text-muted-foreground mt-1">총 {mockPointsData.summary.pendingCashoutAmount.toLocaleString()}P</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">이번 달 현황</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+{mockPointsData.summary.monthlyDistributed.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">-{mockPointsData.summary.monthlyRefunded.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-card rounded-lg border">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'transactions' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                거래 내역
              </button>
              <button
                onClick={() => setActiveTab('cashouts')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'cashouts' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                환급 요청
                {mockPointsData.summary.pendingCashouts > 0 && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {mockPointsData.summary.pendingCashouts}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === 'transactions' ? (
            <div>
              {/* 필터 및 검색 */}
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="사용자명 또는 사유 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">전체 유형</option>
                      <option value="earned">획득</option>
                      <option value="spent">사용</option>
                      <option value="refund">환불</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">전체 상태</option>
                      <option value="completed">완료</option>
                      <option value="pending">대기중</option>
                    </select>
                    <button
                      onClick={exportData}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 거래 내역 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">날짜</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">사용자</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">유형</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">사유</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">포인트</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">관리자 메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id} className="border-b hover:bg-accent/50">
                        <td className="px-4 py-3 text-sm">{transaction.date}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium">{transaction.username}</div>
                          <div className="text-xs text-muted-foreground">ID: {transaction.userId}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            transaction.type === 'earned' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            transaction.type === 'spent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {transaction.type === 'earned' ? '획득' : 
                             transaction.type === 'spent' ? '사용' : '환불'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{transaction.reason}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}P
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {transaction.adminNote || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              {/* 환급 요청 목록 */}
              <div className="p-6">
                {mockPointsData.cashoutRequests.length > 0 ? (
                  <div className="space-y-4">
                    {mockPointsData.cashoutRequests.map(request => (
                      <div key={request.id} className="bg-background rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{request.username}</h4>
                              <span className="text-sm text-muted-foreground">ID: {request.userId}</span>
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                대기중
                              </span>
                            </div>
                            <div className="grid gap-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">신청 금액:</span>
                                <span className="font-medium">{request.amount.toLocaleString()}P</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">신청 일시:</span>
                                <span>{request.requestDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">은행 정보:</span>
                                <span>{request.bankInfo.bankName} {request.bankInfo.accountNumber} ({request.bankInfo.accountHolder})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCashoutApprove(request.id)}
                              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleCashoutReject(request.id)}
                              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                              반려
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">대기중인 환급 요청이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}