import AdminLayout from '@/components/admin/AdminLayout'
import AuthGuard from '@/components/AuthGuard'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'TechWiki+ 관리자',
  description: 'TechWiki+ 관리자 페이지',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  )
}