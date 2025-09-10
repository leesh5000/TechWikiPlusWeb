import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import RecentPosts from '@/components/home/RecentPosts'
import TopContributors from '@/components/home/TopContributors'
import StatsSection from '@/components/home/StatsSection'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <RecentPosts />
        <TopContributors />
        <StatsSection />
      </main>
      <Footer />
    </div>
  )
}