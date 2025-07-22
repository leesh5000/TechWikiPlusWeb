'use client'

import dynamic from 'next/dynamic'
import { memo, useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// 동적 임포트로 번들 크기 최적화
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />
})

const CodeBlock = dynamic(() => import('./CodeBlock'), {
  loading: () => <div className="animate-pulse h-20 bg-muted rounded-lg" />
})

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [sanitizedContent, setSanitizedContent] = useState(content)

  useEffect(() => {
    // 클라이언트 사이드에서만 DOMPurify 실행
    if (typeof window !== 'undefined') {
      // 안전한 HTML 태그와 속성만 허용
      const clean = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'a', 'ul', 'ol', 'li', 'blockquote',
          'strong', 'em', 'code', 'pre', 'table',
          'thead', 'tbody', 'tr', 'th', 'td', 'img',
          'br', 'hr', 'div', 'span'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'rel', 'class', 'id',
          'src', 'alt', 'width', 'height'
        ],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
      })
      setSanitizedContent(clean)
    }
  }, [content])
  return (
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
      {sanitizedContent}
    </ReactMarkdown>
  )
})

export default MarkdownRenderer