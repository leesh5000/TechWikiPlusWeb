'use client'

import Link from 'next/link'
import { useState, useEffect, memo } from 'react'
import { Search, Menu, X, Moon, Sun, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    // localStorage에서 테마 설정 가져오기
    const theme = localStorage.getItem('theme')
    
    if (theme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      // 테마 설정이 없으면 시스템 테마 따라가기
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark')
      }
      
      // 시스템 테마 변경 감지
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          setIsDarkMode(e.matches)
          if (e.matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // 모바일 메뉴 열림/닫힘에 따른 body 스크롤 제어
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }
    
    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.body.classList.remove('mobile-menu-open')
    }
  }, [isMenuOpen])

  // ESC 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMenuOpen])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 sm:h-18 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">T+</span>
          </div>
          <span className="hidden font-bold sm:inline-block">TechWiki+</span>
        </Link>

        {/* Search Bar */}
        <div className="mx-2 flex-1 sm:mx-4 md:mx-8">
          <div className="relative max-w-lg">
            <label htmlFor="header-search" className="sr-only">
              기술 문서 검색
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-foreground/60" aria-hidden="true" />
            <input
              id="header-search"
              type="search"
              placeholder="검색..."
              className="h-10 sm:h-11 w-full rounded-md border border-border/80 bg-gray-50 dark:bg-card pl-9 sm:pl-10 pr-3 text-sm shadow-sm placeholder:text-foreground/50 hover:border-primary/50 focus:border-primary focus:border-2 focus:outline-none transition-all"
              aria-label="기술 문서 검색"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-2 md:flex">
          <Link
            href="/docs"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            문서
          </Link>
          <Link
            href="/contribute"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            기여하기
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            리더보드
          </Link>
          
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={toggleDarkMode}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
              aria-label="다크모드 토글"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden md:inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
              >
                <User className="h-4 w-4 mr-2" />
                {user.username}
              </Link>
              <button
                onClick={logout}
                className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                aria-label="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none"
            >
              로그인
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none md:hidden"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          id="mobile-menu" 
          className="fixed inset-0 top-16 sm:top-18 z-50 animate-fade-in bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav 
            className="container flex h-full flex-col items-center justify-start gap-2 animate-slide-in pt-12" 
            role="navigation" 
            aria-label="모바일 메뉴"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 주요 네비게이션 */}
            <div className="flex flex-col w-full max-w-xs gap-2">
              <Link
                href="/docs"
                className="flex h-14 items-center justify-center rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                문서
              </Link>
              <Link
                href="/contribute"
                className="flex h-14 items-center justify-center rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                기여하기
              </Link>
              <Link
                href="/leaderboard"
                className="flex h-14 items-center justify-center rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                리더보드
              </Link>
            </div>

            {/* 구분선 */}
            <div className="my-6 h-px w-full max-w-xs bg-border" />

            {/* 설정 및 계정 */}
            <div className="flex flex-col w-full max-w-xs gap-2">
              {mounted && (
                <button
                  onClick={() => {
                    toggleDarkMode()
                    setIsMenuOpen(false)
                  }}
                  className="flex h-14 items-center justify-center gap-3 rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                  aria-label="다크모드 토글"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5" />
                      라이트 모드
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      다크 모드
                    </>
                  )}
                </button>
              )}
              
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex h-14 items-center justify-center gap-3 rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {user.username}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex h-14 items-center justify-center gap-3 rounded-lg text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
                  >
                    <LogOut className="h-5 w-5" />
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex h-14 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
})

export default Header