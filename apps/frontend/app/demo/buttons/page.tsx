'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Save, 
  Trash2, 
  ChevronRight, 
  Download, 
  Plus,
  Edit,
  Heart,
  Share2,
  Settings
} from 'lucide-react'

export default function ButtonsDemoPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container py-12">
          <h1 className="mb-8 text-3xl font-bold">Button 컴포넌트 데모</h1>
          
          {/* Variants */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Variants</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </section>

          {/* Sizes */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Sizes</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </section>

          {/* Icon Buttons */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Icon Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button size="icon" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="icon-sm" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon-lg" variant="secondary">
                <Plus className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* With Icons */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">With Icons</h2>
            <div className="flex flex-wrap gap-4">
              <Button leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
              <Button rightIcon={<ChevronRight className="h-4 w-4" />} variant="outline">
                Next Step
              </Button>
              <Button 
                leftIcon={<Download className="h-4 w-4" />} 
                variant="secondary"
              >
                Download
              </Button>
              <Button 
                leftIcon={<Heart className="h-4 w-4" />}
                rightIcon={<span className="text-xs">42</span>}
                variant="ghost"
              >
                Like
              </Button>
            </div>
          </section>

          {/* Loading States */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Loading States</h2>
            <div className="flex flex-wrap gap-4">
              <Button loading>
                Saving...
              </Button>
              <Button loading variant="secondary">
                Processing
              </Button>
              <Button onClick={handleClick} loading={isLoading}>
                {isLoading ? 'Loading...' : 'Click Me'}
              </Button>
            </div>
          </section>

          {/* Disabled States */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Disabled States</h2>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button disabled variant="secondary">Disabled</Button>
              <Button disabled variant="outline">Disabled</Button>
              <Button disabled variant="ghost">Disabled</Button>
            </div>
          </section>

          {/* Full Width */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Full Width</h2>
            <div className="max-w-md space-y-4">
              <Button fullWidth>Full Width Button</Button>
              <Button fullWidth variant="outline" leftIcon={<Share2 className="h-4 w-4" />}>
                Share Document
              </Button>
            </div>
          </section>

          {/* Combined Examples */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">실제 사용 예시</h2>
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">문서 액션</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" leftIcon={<Edit className="h-3 w-3" />}>
                    편집
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Share2 className="h-3 w-3" />}>
                    공유
                  </Button>
                  <Button size="sm" variant="ghost" leftIcon={<Download className="h-3 w-3" />}>
                    다운로드
                  </Button>
                  <Button size="sm" variant="destructive" leftIcon={<Trash2 className="h-3 w-3" />}>
                    삭제
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">폼 액션</h3>
                <div className="flex gap-3">
                  <Button variant="outline">취소</Button>
                  <Button leftIcon={<Save className="h-4 w-4" />}>저장</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}