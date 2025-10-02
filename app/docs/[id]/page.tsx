import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CodeBlock from '@/components/markdown/CodeBlock'
import DocumentActions from '@/components/docs/DocumentActions'
import { postsService } from '@/lib/api/posts.service'
import { Document, VerificationStatus } from '@/lib/types/post.types'
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Share2
} from 'lucide-react'

// Fallback content when document has no content
const fallbackContent = `
# 문서 본문이 없습니다

이 문서는 아직 본문 내용이 작성되지 않았습니다.

문서 작성자에게 내용 추가를 요청해주세요.
`


interface DocPageProps {
  params: Promise<{
    id: string
  }>
}

// Fetch related documents
async function fetchRelatedDocuments(currentId: string | number, tags: { name: string; displayOrder: number }[]): Promise<Document[]> {
  try {
    const response = await postsService.getDocuments({ limit: 10 })
    const tagNames = tags.map(t => t.name.toLowerCase())

    return response.documents
      .filter(d => {
        if (String(d.id) === String(currentId)) return false
        // Find documents with at least one matching tag
        return d.tags.some(t => tagNames.includes(t.name.toLowerCase()))
      })
      .slice(0, 2)
  } catch (error) {
    console.error('Failed to fetch related documents:', error)
    return []
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params

  let doc: Document | null = null
  let relatedDocs: Document[] = []

  try {
    // Fetch the document from API
    doc = await postsService.getDocument(id)

    // Fetch related documents
    if (doc) {
      relatedDocs = await fetchRelatedDocuments(doc.id, doc.tags)
    }
  } catch (error) {
    console.error('Failed to fetch document:', error)
    // If document not found or any error occurs, return 404
    notFound()
  }

  if (!doc) {
    notFound()
  }

  // Use fallback content if no content available
  const displayContent = doc.content || fallbackContent

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="border-b dark:border-border/70 py-4">
          <div className="container">
            <Link
              href="/docs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              문서 목록으로 돌아가기
            </Link>
          </div>
        </section>

        {/* Document Header */}
        <section className="border-b dark:border-border/70 py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Verification Status */}
              <div className="mb-4">
                {doc.verificationStatus === 'verified' ? (
                  <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    검증됨
                  </span>
                ) : doc.verificationStatus === 'verifying' ? (
                  <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <Timer className="mr-1 h-4 w-4" />
                    검수 중
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    미검증
                  </span>
                )}
              </div>

              {/* Tags */}
              {doc.tags && doc.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {[...doc.tags]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        #{tag.name}
                      </span>
                    ))}
                </div>
              )}

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {doc.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(doc.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {doc.viewCount.toLocaleString()} 조회
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  약 {doc.readingTime}분 소요
                </div>
                <div>
                  작성: {doc.author}
                  {doc.verifiedBy && (
                    <>
                      {' | '}
                      검증: {doc.verifiedBy}
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DocumentActions initialDoc={{
                id: doc.id,
                verificationStatus: doc.verificationStatus,
                upvotes: doc.upvotes,
                downvotes: doc.downvotes,
                verificationStartedAt: doc.verificationStartedAt,
                verificationEndAt: doc.verificationEndAt
              }} />
            </div>
          </div>
        </section>

        {/* Document Content */}
        <section className="py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-7 text-foreground">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-6 list-disc">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 ml-6 list-decimal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-border pl-4 my-4 italic text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="bg-muted dark:bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <CodeBlock className={className} inline={false}>
                          {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                      )
                    },
                    a: ({ href, children }) => (
                      <a 
                        href={href}
                        className="text-primary hover:underline"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border border-border dark:border-border/70">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border dark:border-border/70 px-4 py-2 text-left bg-muted dark:bg-muted font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border dark:border-border/70 px-4 py-2 text-left">
                        {children}
                      </td>
                    ),
                    hr: () => (
                      <hr className="my-8 border-border" />
                    )
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </section>


        {/* Related Documents */}
        <section className="border-t dark:border-border/70 bg-muted/30 dark:bg-muted/20 py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h3 className="mb-6 text-xl font-semibold">관련 문서</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedDocs.map(relatedDoc => (
                    <Link
                      key={relatedDoc.id}
                      href={`/docs/${relatedDoc.id}`}
                      className="group block rounded-lg border border-border dark:border-border/70 bg-background dark:bg-card p-4 hover:shadow-md dark:hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all">
                      <div className="mb-2 flex items-center gap-2">
                        {relatedDoc.verificationStatus === 'verified' && (
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <h4 className="mb-1 font-medium group-hover:text-primary">
                        {relatedDoc.title}
                      </h4>
                      {relatedDoc.tags && relatedDoc.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {[...relatedDoc.tags]
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .slice(0, 3)
                            .map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300"
                              >
                                #{tag.name}
                              </span>
                            ))}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {relatedDoc.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}