import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '../hooks/useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return empty string when endTime is undefined', () => {
    const { result } = renderHook(() => useCountdown(undefined))
    expect(result.current).toBe('')
  })

  it('should return "검증 종료" when endTime is in the past', () => {
    const pastTime = new Date(Date.now() - 1000).toISOString()
    const { result } = renderHook(() => useCountdown(pastTime))
    expect(result.current).toBe('검증 종료')
  })

  it('should show correct time remaining', () => {
    const futureTime = new Date(Date.now() + 3661000).toISOString() // 1시간 1분 1초 후
    const { result } = renderHook(() => useCountdown(futureTime))
    expect(result.current).toBe('1시간 1분 1초 남음')
  })

  it('should update every second', () => {
    const futureTime = new Date(Date.now() + 5000).toISOString() // 5초 후
    const { result } = renderHook(() => useCountdown(futureTime))
    
    expect(result.current).toBe('5초 남음')
    
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    expect(result.current).toBe('4초 남음')
  })

  it('should stop updating when countdown ends', () => {
    const futureTime = new Date(Date.now() + 2000).toISOString() // 2초 후
    const { result } = renderHook(() => useCountdown(futureTime))
    
    expect(result.current).toBe('2초 남음')
    
    act(() => {
      jest.advanceTimersByTime(3000) // 3초 경과
    })
    
    expect(result.current).toBe('검증 종료')
  })
})