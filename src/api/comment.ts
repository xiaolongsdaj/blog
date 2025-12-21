

import apiClient from './axios'

// 用户类型定义
export interface User {
  id: number
  username: string
  avatar: string
}

// 文章类型定义
export interface Article {
  id: number
  title: string
  slug: string
}

// 评论类型定义
export interface Comment {
  id: number
  content: string
  status: string
  likeCount: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  userId: number
  articleId: number
  parentId: number | null
  user: User
  article: Article
  _count: {
    likes: number
  }
  replies?: Comment[]
  isLiked?: boolean
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 分页响应类型
export interface PaginationResponse<T> {
  comments: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// 评论API服务
const commentApi = {
  // 获取文章评论列表
  getComments: async (articleId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Comment>>> => {
    return apiClient.get(`/api/comments/article/${articleId}`, { params: { page, limit } })
  },

  // 添加评论
  addComment: async (articleId: number, content: string, parentId?: number): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/api/articles/${articleId}/comments`, { content, parentId })
  },
  //获取用户评论列表
  getUserComments: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Comment>>> => {
    return apiClient.get(`/api/comments/user/${userId}`, { params: { page, limit } })
  },

  // 点赞评论
  // likeComment: async (commentId: number): Promise<ApiResponse<void>> => {
  //   return apiClient.post(`/api/comments/${commentId}/like`)
  // },

  // // 取消点赞评论
  // unlikeComment: async (commentId: number): Promise<ApiResponse<void>> => {
  //   return apiClient.delete(`/api/comments/${commentId}/like`)
  // },

  // 删除评论
  deleteComment: async (commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/comments/${commentId}`)
  }
}

export default commentApi
