'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useToast } from '@/lib/toast-context'
import { Spinner, ButtonSpinner } from '@/components/ui/Spinner'
import { CardSkeleton, ListItemSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton'

export default function FeedbackDemoPage() {
  const { showSuccess, showError, showInfo, showWarning } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSkeletons, setShowSkeletons] = useState(false)

  const handleAsyncAction = async () => {
    setIsLoading(true)
    showInfo('처리 중', '요청을 처리하고 있습니다...')
    
    // 2초 대기 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    showSuccess('성공', '작업이 성공적으로 완료되었습니다!')
  }

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container py-12">
          <h1 className="mb-8 text-3xl font-bold">피드백 시스템 데모</h1>
          
          {/* Toast 예제 */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Toast 알림</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => showSuccess('성공!', '작업이 성공적으로 완료되었습니다.')}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                성공 Toast
              </button>
              <button
                onClick={() => showError('오류 발생', '요청을 처리하는 중 문제가 발생했습니다.')}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                에러 Toast
              </button>
              <button
                onClick={() => showInfo('알림', '새로운 업데이트가 있습니다.')}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                정보 Toast
              </button>
              <button
                onClick={() => showWarning('주의', '이 작업은 되돌릴 수 없습니다.')}
                className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
              >
                경고 Toast
              </button>
            </div>
          </section>

          {/* 로딩 스피너 예제 */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">로딩 스피너</h2>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="mt-2 text-sm">작은 크기</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className="mt-2 text-sm">중간 크기</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-2 text-sm">큰 크기</p>
              </div>
              <button
                onClick={handleAsyncAction}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner />
                    처리 중...
                  </>
                ) : (
                  '비동기 작업 실행'
                )}
              </button>
            </div>
          </section>

          {/* 스켈레톤 예제 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">스켈레톤 로딩</h2>
            <button
              onClick={toggleSkeletons}
              className="mb-6 rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
            >
              {showSkeletons ? '실제 콘텐츠 보기' : '스켈레톤 보기'}
            </button>
            
            {showSkeletons ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
                <div className="rounded-lg border">
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </div>
                <table className="w-full border-collapse">
                  <tbody>
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                    <TableRowSkeleton columns={5} />
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border bg-card p-6">
                      <h3 className="mb-2 text-lg font-semibold">카드 제목 {i}</h3>
                      <p className="text-muted-foreground">
                        이것은 실제 콘텐츠입니다. 스켈레톤과 비교해보세요.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
                          액션 1
                        </button>
                        <button className="rounded bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                          액션 2
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}