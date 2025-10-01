'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { postsService } from '@/lib/api/posts.service'
import { useToast } from '@/lib/toast-context'

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [postId, setPostId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get postId from params
    params.then(({ id }) => {
      setPostId(id)
      loadPost(id)
    })
  }, [params])

  const loadPost = async (id: string) => {
    setIsLoading(true)
    try {
      const post = await postsService.getPost(id)
      setTitle(post.title)
      setBody(post.body || '')
      setTags(post.tags.map(tag => tag.name))
    } catch (error) {
      console.error('Failed to load post:', error)
      const errorMessage = error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.'
      showError('게시글 로드 실패', errorMessage)
      // Redirect back to documents page after error
      setTimeout(() => router.push('/admin/documents'), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !body.trim()) {
      showError('입력 오류', '제목과 본문은 필수 항목입니다.')
      return
    }

    if (body.trim().length < 30) {
      showError('입력 오류', '본문은 최소 30자 이상이어야 합니다.')
      return
    }

    setIsSubmitting(true)

    try {
      await postsService.updatePost(postId, {
        title: title.trim(),
        body: body.trim(),
        tags: tags.length > 0 ? tags : []
      })

      showSuccess('게시글 수정 완료', '게시글이 성공적으로 수정되었습니다.')

      // 관리자 문서 목록 페이지로 이동
      router.push('/admin/documents')
    } catch (error) {
      console.error('Failed to update post:', error)
      const errorMessage = error instanceof Error ? error.message : '게시글 수정에 실패했습니다.'
      showError('게시글 수정 실패', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/documents"
            className="p-2 rounded-md hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">게시글 수정</h1>
            <p className="text-muted-foreground">게시글 정보를 수정합니다</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              제목 <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요 (최대 150자)"
              maxLength={150}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {title.length}/150
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              태그
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-md border border-input hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleRemoveTag(tag)}
                      className="group inline-flex items-center gap-0 rounded-full bg-primary/10 pl-3 pr-0 py-1 text-sm cursor-pointer"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveTag(tag)
                        }}
                        className="flex items-center justify-center py-1 group-hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="rounded-lg border bg-card p-6">
          <label htmlFor="body" className="block text-sm font-medium mb-2">
            본문 <span className="text-destructive">*</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="게시글 본문을 마크다운 형식으로 작성하세요 (최소 30자)"
            rows={20}
            maxLength={50000}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
            <p>마크다운 문법을 사용할 수 있습니다. 코드 블록, 링크, 이미지 등을 지원합니다.</p>
            <p className={body.length < 30 ? 'text-destructive' : ''}>
              {body.length}/50000 (최소 30자)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/documents"
            className="px-4 py-2 rounded-md border border-input hover:bg-accent"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '수정 중...' : '게시글 수정'}
          </button>
        </div>
      </form>
    </div>
  )
}
