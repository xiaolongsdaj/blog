

import apiClient from './axios'

// 评论类型定义
export interface Comment {
  id: number
  articleId: number
  userId: number
  username: string
  avatar?: string
  content: string
  createdAt: string
  updatedAt: string
  likeCount: number
  isLiked: boolean
  replies?: Comment[]
  parentId?: number
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
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

// 评论API服务
const commentApi = {
  // 获取文章评论列表
  getComments: async (articleId: number, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginationResponse<Comment>>> => {
    return apiClient.get(`/api/articles/${articleId}/comments`, { params: { page, pageSize } })
  },

  // 添加评论
  addComment: async (articleId: number, content: string, parentId?: number): Promise<ApiResponse<Comment>> => {
    return apiClient.post(`/api/articles/${articleId}/comments`, { content, parentId })
  },

  // 点赞评论
  likeComment: async (commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/api/comments/${commentId}/like`)
  },

  // 取消点赞评论
  unlikeComment: async (commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/comments/${commentId}/like`)
  },

  // 删除评论
  deleteComment: async (commentId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/comments/${commentId}`)
  }
}

export default commentApi
