'use client'

import { useState } from 'react'
import { Save, RotateCcw, FileText, CheckSquare, Coins, Shield, Bell, Wrench, Calendar, Clock, AlertCircle } from 'lucide-react'
import AdminGuard from '@/components/admin/AdminGuard'

// Mock 데이터
const mockSettings = {
  aiGeneration: {
    enabled: true,
    schedule: 'daily',
    time: '03:00',
    model: 'gpt-4',
    maxDocsPerDay: 50,
    categories: ['React', 'TypeScript', 'Next.js', 'DevOps'],
  },
  review: {
    duration: 72,
    minReviewers: 3,
    autoApprovalScore: 80,
    autoRejectionScore: 30,
    pointsPerReview: 100,
  },
  points: {
    documentCreation: 500,
    reviewApproval: 100,
    goodReview: 50,
    minWithdrawal: 10000,
    withdrawalFee: 3.5,
    levelUpThreshold: 5000,
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeout: 60,
    ipWhitelist: [],
    apiRateLimit: 1000,
  },
  notifications: {
    emailEnabled: true,
    slackEnabled: false,
    alertThresholds: {
      pendingReviews: 50,
      lowQualityScore: 40,
      highTraffic: 10000,
    },
  },
  maintenance: {
    backupSchedule: 'daily',
    backupTime: '02:00',
    cacheCleanup: 'weekly',
    logRetention: 30,
  },
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // TODO: API 호출로 설정 저장
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    setHasChanges(false)
  }

  const updateSettings = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">시스템 설정</h1>
            <p className="text-muted-foreground">TechWiki+ 시스템 전반의 설정을 관리합니다</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </div>

        {/* AI 문서 생성 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI 문서 생성 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">자동 생성 활성화</label>
                <p className="text-sm text-muted-foreground">AI 문서 자동 생성 기능을 활성화합니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiGeneration.enabled}
                  onChange={(e) => updateSettings('aiGeneration', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">생성 주기</label>
                <select
                  value={settings.aiGeneration.schedule}
                  onChange={(e) => updateSettings('aiGeneration', 'schedule', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="hourly">매시간</option>
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                </select>
              </div>
              <div>
                <label className="font-medium">생성 시간</label>
                <input
                  type="time"
                  value={settings.aiGeneration.time}
                  onChange={(e) => updateSettings('aiGeneration', 'time', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">AI 모델</label>
                <select
                  value={settings.aiGeneration.model}
                  onChange={(e) => updateSettings('aiGeneration', 'model', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              <div>
                <label className="font-medium">일일 최대 생성 수</label>
                <input
                  type="number"
                  value={settings.aiGeneration.maxDocsPerDay}
                  onChange={(e) => updateSettings('aiGeneration', 'maxDocsPerDay', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 검수 정책 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <CheckSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">검수 정책 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">검수 기간 (시간)</label>
                <input
                  type="number"
                  value={settings.review.duration}
                  onChange={(e) => updateSettings('review', 'duration', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium">최소 검수자 수</label>
                <input
                  type="number"
                  value={settings.review.minReviewers}
                  onChange={(e) => updateSettings('review', 'minReviewers', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">자동 승인 점수</label>
                <input
                  type="number"
                  value={settings.review.autoApprovalScore}
                  onChange={(e) => updateSettings('review', 'autoApprovalScore', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="font-medium">자동 반려 점수</label>
                <input
                  type="number"
                  value={settings.review.autoRejectionScore}
                  onChange={(e) => updateSettings('review', 'autoRejectionScore', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="font-medium">검수 포인트</label>
              <input
                type="number"
                value={settings.review.pointsPerReview}
                onChange={(e) => updateSettings('review', 'pointsPerReview', parseInt(e.target.value))}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 포인트 시스템 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <Coins className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">포인트 시스템 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="font-medium">문서 작성 포인트</label>
                <input
                  type="number"
                  value={settings.points.documentCreation}
                  onChange={(e) => updateSettings('points', 'documentCreation', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium">검수 승인 포인트</label>
                <input
                  type="number"
                  value={settings.points.reviewApproval}
                  onChange={(e) => updateSettings('points', 'reviewApproval', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium">우수 리뷰 포인트</label>
                <input
                  type="number"
                  value={settings.points.goodReview}
                  onChange={(e) => updateSettings('points', 'goodReview', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="font-medium">최소 환급액</label>
                <input
                  type="number"
                  value={settings.points.minWithdrawal}
                  onChange={(e) => updateSettings('points', 'minWithdrawal', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium">환급 수수료 (%)</label>
                <input
                  type="number"
                  value={settings.points.withdrawalFee}
                  onChange={(e) => updateSettings('points', 'withdrawalFee', parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  step="0.1"
                />
              </div>
              <div>
                <label className="font-medium">레벨업 기준 포인트</label>
                <input
                  type="number"
                  value={settings.points.levelUpThreshold}
                  onChange={(e) => updateSettings('points', 'levelUpThreshold', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">보안 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">2단계 인증 필수</label>
                <p className="text-sm text-muted-foreground">모든 관리자에게 2단계 인증을 요구합니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorEnabled}
                  onChange={(e) => updateSettings('security', 'twoFactorEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">세션 타임아웃 (분)</label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="font-medium">API 요청 제한 (시간당)</label>
                <input
                  type="number"
                  value={settings.security.apiRateLimit}
                  onChange={(e) => updateSettings('security', 'apiRateLimit', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">알림 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">이메일 알림</label>
                <p className="text-sm text-muted-foreground">중요 이벤트 발생 시 이메일로 알림을 보냅니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailEnabled}
                  onChange={(e) => updateSettings('notifications', 'emailEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Slack 알림</label>
                <p className="text-sm text-muted-foreground">Slack 채널로 실시간 알림을 보냅니다</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.slackEnabled}
                  onChange={(e) => updateSettings('notifications', 'slackEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">알림 임계값</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm">검수 대기 문서</label>
                  <input
                    type="number"
                    value={settings.notifications.alertThresholds.pendingReviews}
                    onChange={(e) => {
                      const newThresholds = { ...settings.notifications.alertThresholds, pendingReviews: parseInt(e.target.value) }
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, alertThresholds: newThresholds }
                      }))
                      setHasChanges(true)
                    }}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm">낮은 품질 점수</label>
                  <input
                    type="number"
                    value={settings.notifications.alertThresholds.lowQualityScore}
                    onChange={(e) => {
                      const newThresholds = { ...settings.notifications.alertThresholds, lowQualityScore: parseInt(e.target.value) }
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, alertThresholds: newThresholds }
                      }))
                      setHasChanges(true)
                    }}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm">높은 트래픽</label>
                  <input
                    type="number"
                    value={settings.notifications.alertThresholds.highTraffic}
                    onChange={(e) => {
                      const newThresholds = { ...settings.notifications.alertThresholds, highTraffic: parseInt(e.target.value) }
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, alertThresholds: newThresholds }
                      }))
                      setHasChanges(true)
                    }}
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 유지보수 설정 */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">유지보수 설정</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">백업 주기</label>
                <select
                  value={settings.maintenance.backupSchedule}
                  onChange={(e) => updateSettings('maintenance', 'backupSchedule', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="hourly">매시간</option>
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                </select>
              </div>
              <div>
                <label className="font-medium">백업 시간</label>
                <input
                  type="time"
                  value={settings.maintenance.backupTime}
                  onChange={(e) => updateSettings('maintenance', 'backupTime', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">캐시 정리 주기</label>
                <select
                  value={settings.maintenance.cacheCleanup}
                  onChange={(e) => updateSettings('maintenance', 'cacheCleanup', e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>
              <div>
                <label className="font-medium">로그 보관 기간 (일)</label>
                <input
                  type="number"
                  value={settings.maintenance.logRetention}
                  onChange={(e) => updateSettings('maintenance', 'logRetention', parseInt(e.target.value))}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 변경사항 알림 */}
        {hasChanges && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-900 dark:text-yellow-100">저장되지 않은 변경사항이 있습니다</span>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}