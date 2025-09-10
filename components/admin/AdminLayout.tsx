'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import { Bell, Search } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="검색..."
                className="h-9 w-64 rounded-md border border-input bg-background pl-10 pr-3 text-sm"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative rounded-md p-2 hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}