

import apiClient from './axios'

// 文章类型定义
export interface Article {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  coverImage?: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  category: { id: number; name: string; slug: string }
  tags: Array<{ id: number; name: string; slug: string }>
}

// 分类类型定义
export interface Category {
  id: number
  name: string
  articleCount: number
}

// 标签类型定义
export interface Tag {
  id: number
  name: string
  articleCount: number
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// 文章API服务
const articleApi = {
  // 获取文章列表
  getArticles: async (page: number = 1, pageSize: number = 10, categoryId?: number, tagId?: number, keyword?: string): Promise<ApiResponse<PaginationResponse<Article>>> => {
    const params = { page, pageSize, categoryId, tagId, keyword }
    return apiClient.get('/articles', { params })
  },

  // 获取文章详情
  getArticleDetail: async (id: number): Promise<ApiResponse<Article>> => {
    return apiClient.get(`/articles/${id}`)
  },

  // 获取分类列表
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/categories')
  },

  // 获取标签列表
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get('/tags')
  },

  // 增加阅读量
  incrementViewCount: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/articles/${id}/views`)
  },

  // 增加评论数
  incrementCommentCount: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/articles/${id}/comments/count`)
  },

  // 获取用户文章列表
  getUserArticles: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    return apiClient.get(`/users/${userId}/articles`, { params: { page, limit } })
  }
}

export default articleApi