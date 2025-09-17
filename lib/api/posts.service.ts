import { apiClient } from './client'
import { 
  Post, 
  PostScrollResponse, 
  Document, 
  PostFilters,
  transformPostToDocument,
  PostApiError
} from '@/lib/types/post.types'
import { AxiosError } from 'axios'

class PostsService {
  /**
   * Get paginated posts from the API
   * @param filters - Filter options including pagination
   * @returns PostScrollResponse with posts and pagination info
   */
  async getPosts(filters: PostFilters = {}): Promise<PostScrollResponse> {
    try {
      const params: Record<string, any> = {
        limit: filters.limit || 20,
        cursor: filters.cursor || null
      }

      // Remove null cursor to avoid sending it in the request
      if (!params.cursor) {
        delete params.cursor
      }

      const response = await apiClient.get<PostScrollResponse>('/api/v1/posts', {
        params
      })

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      
      // Handle specific API errors
      if (axiosError.response?.data?.code === 'INVALID_PAGINATION_LIMIT') {
        throw new Error('Invalid pagination limit. Must be between 1 and 100')
      }
      
      if (axiosError.response?.data?.code === 'INVALID_POST_ID_FORMAT') {
        throw new Error('Invalid cursor format')
      }
      
      // Default error
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to fetch posts'
      )
    }
  }

  /**
   * Get posts and transform them to frontend Document format
   * @param filters - Filter options
   * @returns Array of Document objects with pagination info
   */
  async getDocuments(filters: PostFilters = {}): Promise<{
    documents: Document[]
    hasNext: boolean
    nextCursor: string | null
  }> {
    const response = await this.getPosts(filters)
    
    const documents = response.posts.map(post => 
      transformPostToDocument(post)
    )
    
    return {
      documents,
      hasNext: response.hasNext,
      nextCursor: response.nextCursor
    }
  }

  /**
   * Get a single post by ID
   * @param postId - The post ID
   * @returns Post object with full body content
   */
  async getPost(postId: string): Promise<Post> {
    try {
      const response = await apiClient.get<Post>(`/api/v1/posts/${postId}`)
      
      // The detail API returns modifiedAt instead of updatedAt
      if (response.data.modifiedAt && !response.data.updatedAt) {
        response.data.updatedAt = response.data.modifiedAt
      }
      
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      
      if (axiosError.response?.status === 404) {
        throw new Error('Post not found')
      }
      
      if (axiosError.response?.status === 400) {
        throw new Error('Invalid post ID format')
      }
      
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to fetch post'
      )
    }
  }

  /**
   * Get a single document (transformed post) by ID
   * @param postId - The post ID
   * @returns Document object
   */
  async getDocument(postId: string): Promise<Document> {
    const post = await this.getPost(postId)
    return transformPostToDocument(post)
  }

  /**
   * Search posts with optional filters
   * @param searchQuery - Search query string
   * @param filters - Additional filters
   * @returns PostScrollResponse
   */
  async searchPosts(
    searchQuery: string, 
    filters: PostFilters = {}
  ): Promise<PostScrollResponse> {
    // Note: This assumes the backend supports search via query params
    // If not, this would need to be implemented differently
    try {
      const params: Record<string, any> = {
        q: searchQuery,
        limit: filters.limit || 20,
        cursor: filters.cursor || null,
        status: filters.status?.join(','),
        tags: filters.tags?.join(',')
      }

      // Clean up undefined/null params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null) {
          delete params[key]
        }
      })

      const response = await apiClient.get<PostScrollResponse>('/api/v1/posts/search', {
        params
      })

      return response.data
    } catch (error) {
      // If search endpoint doesn't exist, fall back to regular getPosts
      // and filter client-side (not ideal for large datasets)
      console.warn('Search endpoint not available, falling back to client-side filtering')
      
      const allPosts = await this.getPosts(filters)
      const query = searchQuery.toLowerCase()
      
      const filteredPosts = allPosts.posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(query))
      )
      
      return {
        posts: filteredPosts,
        hasNext: allPosts.hasNext,
        nextCursor: allPosts.nextCursor
      }
    }
  }

  /**
   * Create a new post
   * @param postData - Post creation data
   * @returns Created post
   */
  async createPost(postData: {
    title: string
    body: string
    tags: string[]
  }): Promise<Post> {
    try {
      const response = await apiClient.post<Post>('/api/v1/posts', postData)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to create post'
      )
    }
  }

  /**
   * Update an existing post
   * @param postId - The post ID to update
   * @param postData - Updated post data
   * @returns Updated post
   */
  async updatePost(
    postId: string,
    postData: {
      title?: string
      body?: string
      tags?: string[]
    }
  ): Promise<Post> {
    try {
      const response = await apiClient.put<Post>(`/api/v1/posts/${postId}`, postData)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to update post'
      )
    }
  }

  /**
   * Delete a post
   * @param postId - The post ID to delete
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/posts/${postId}`)
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to delete post'
      )
    }
  }

  /**
   * Vote on a post
   * @param postId - The post ID
   * @param voteType - 'upvote' or 'downvote'
   */
  async votePost(postId: string, voteType: 'upvote' | 'downvote'): Promise<void> {
    try {
      await apiClient.post(`/api/v1/posts/${postId}/vote`, { type: voteType })
    } catch (error) {
      const axiosError = error as AxiosError<PostApiError>
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to vote on post'
      )
    }
  }
}

// Export singleton instance
export const postsService = new PostsService()

// Export class for testing
export default PostsService