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
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">T+</span>
          </div>
          <span className="hidden font-bold sm:inline-block">TechWiki+</span>
        </Link>

        {/* Search Bar */}
        <div className="mx-4 flex-1 md:mx-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60" />
            <input
              type="search"
              placeholder="기술 문서 검색..."
              className="h-11 w-full rounded-md border border-border/80 bg-gray-50 dark:bg-card pl-10 pr-3 text-sm shadow-sm placeholder:text-foreground/50 hover:border-primary/50 focus:border-primary focus:border-2 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/docs"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            문서
          </Link>
          <Link
            href="/contribute"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            기여하기
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            리더보드
          </Link>
          
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={toggleDarkMode}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none ml-6"
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
        <div className="flex items-center gap-6">

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
        <div className="border-t md:hidden">
          <nav className="container grid gap-6 p-6">
            <Link
              href="/docs"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              문서
            </Link>
            <Link
              href="/contribute"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              기여하기
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              리더보드
            </Link>
            <hr className="border-t" />
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
})

export default Header