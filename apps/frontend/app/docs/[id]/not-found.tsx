import Link from 'next/link'
import { ArrowLeft, FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <FileX className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">문서를 찾을 수 없습니다</h1>
        <p className="mb-6 text-muted-foreground">
          요청하신 문서가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            문서 목록으로 돌아가기
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}