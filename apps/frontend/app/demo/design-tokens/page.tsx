'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { spacing, typography, animation, borderRadius, shadows } from '@/lib/design-tokens'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function DesignTokensDemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container py-12">
          <h1 className="mb-8 text-3xl font-bold">디자인 토큰 시스템</h1>
          
          {/* Spacing */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Spacing (8px 기반)</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 rounded-lg border p-4">
                  <div 
                    className="bg-primary"
                    style={{ width: value, height: value }}
                  />
                  <div>
                    <code className="text-sm font-mono">spacing[{key}]</code>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Typography</h2>
            <Card>
              <CardHeader>
                <CardTitle>Font Sizes</CardTitle>
                <CardDescription>일관된 타이포그래피 스케일</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(typography.fontSize).map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-4">
                    <code className="text-sm font-mono w-16">{key}:</code>
                    <span style={{ fontSize: value }}>
                      The quick brown fox jumps over the lazy dog ({value})
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Animation */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Animation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Duration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(animation.duration).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <code className="text-sm font-mono">{key}</code>
                      <Badge variant="secondary">{value}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Easing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(animation.easing).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <code className="text-sm font-mono">{key}</code>
                      <code className="text-xs text-muted-foreground">{value}</code>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Border Radius */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Border Radius</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(borderRadius).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div 
                    className="mx-auto mb-2 h-24 w-24 bg-primary"
                    style={{ borderRadius: value }}
                  />
                  <code className="text-sm font-mono">{key}</code>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Shadows</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(shadows).map(([key, value]) => (
                <div key={key}>
                  <div 
                    className="mb-3 h-32 rounded-lg bg-background dark:bg-card"
                    style={{ boxShadow: value }}
                  />
                  <code className="text-sm font-mono">{key}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Animation Examples */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Animation 예제</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group overflow-hidden">
                <CardHeader className="transition-transform duration-300 group-hover:scale-105">
                  <CardTitle>Scale Animation</CardTitle>
                  <CardDescription>Hover시 확대</CardDescription>
                </CardHeader>
              </Card>
              <Card className="group overflow-hidden">
                <CardHeader className="transition-transform duration-300 group-hover:translate-x-2">
                  <CardTitle>Slide Animation</CardTitle>
                  <CardDescription>Hover시 슬라이드</CardDescription>
                </CardHeader>
              </Card>
              <Card className="group overflow-hidden">
                <CardHeader className="transition-opacity duration-300 group-hover:opacity-70">
                  <CardTitle>Fade Animation</CardTitle>
                  <CardDescription>Hover시 페이드</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}