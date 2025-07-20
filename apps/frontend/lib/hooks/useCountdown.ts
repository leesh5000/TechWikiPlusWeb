import { useState, useEffect } from 'react'

export function useCountdown(endTime: string | undefined) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!endTime) return

    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const difference = end - now

      if (difference <= 0) {
        return '검증 종료'
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (hours > 0) {
        return `${hours}시간 ${minutes}분 ${seconds}초 남음`
      } else if (minutes > 0) {
        return `${minutes}분 ${seconds}초 남음`
      } else {
        return `${seconds}초 남음`
      }
    }

    // 초기 시간 설정
    setTimeRemaining(calculateTimeRemaining())

    // 매초마다 업데이트
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining()
      setTimeRemaining(remaining)

      // 검증 종료 시 타이머 정리
      if (remaining === '검증 종료') {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return timeRemaining
}