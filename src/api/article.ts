

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
  status: string
  isPrivate: boolean
  deletedAt: string | null
  userId: number
  categoryId: number | null
  category: { id: number; name: string; slug: string } | null
  tags: Array<{name: string}>
  user: { id: number; username: string; avatar: string | null }
  _count: { comments: number; likes: number }
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
  success: boolean
  message: string
  data: T
}

// 分页响应类型
export interface PaginationResponse<T> {
  articles: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// 文章API服务
const articleApi = {
  // 首页获取所有文章列表
  getArticles: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    const params = { page, limit }
    return apiClient.get('/api/articles', { params })
  },

  // 搜索文章
  searchArticles: async (search: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    const params = { page, limit, search: search };
    return apiClient.get('/api/articles', { params });
  },

  // 获取文章详情
  getArticleDetail: async (id: number): Promise<ApiResponse<Article>> => {
    return apiClient.get(`/api/articles/${id}`)
  },
    // 获取用户文章列表
  getUserArticles: async (userId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    return apiClient.get(`/api/articles/user/${userId}`, { params: { page, limit } })
  },

  // 创建文章
  createArticle: async (articleData: Partial<Article>): Promise<ApiResponse<Article>> => {
    return apiClient.post('/api/articles', articleData)
  },

  // 更新文章
  updateArticle: async (id: number, articleData: Partial<Article>): Promise<ApiResponse<Article>> => {
    return apiClient.put(`/api/articles/${id}`, articleData)
  },

  // 删除文章
  deleteArticle: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/articles/${id}`)
  },

  // 获取分类列表
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get('/api/articles/categories')
  },

  // 获取标签列表
  getTags: async (): Promise<ApiResponse<Tag[]>> => {
    return apiClient.get('/api/articles/tags')
  },

  // 获取分类下的文章
  getArticlesByCategory: async (categoryName: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    const params = { page, limit, category: categoryName }
    return apiClient.get('/api/articles', { params })
  },

  // 获取标签下的文章
  getArticlesByTag: async (tagName: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    const params = { page, limit, tag: tagName }
    return apiClient.get('/api/articles', { params })
  },

  // // 增加阅读量
  // incrementViewCount: async (id: number): Promise<ApiResponse<void>> => {
  //   return apiClient.post(`/articles/${id}/views`)
  // },

  // // 增加评论数
  // incrementCommentCount: async (id: number): Promise<ApiResponse<void>> => {
  //   return apiClient.post(`/articles/${id}/comments/count`)
  // },

  // 点赞文章
  likeArticle: async (articleId: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/api/articles/${articleId}/like`)
  },

  // 取消点赞文章
  unlikeArticle: async (articleId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/articles/${articleId}/like`)
  },

  // 收藏文章
  favoriteArticle: async (articleId: number): Promise<ApiResponse<void>> => {
    return apiClient.post(`/api/articles/${articleId}/favorite`)
  },

  // 取消收藏文章
  unfavoriteArticle: async (articleId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/api/articles/${articleId}/favorite`)
  },

  // 获取用户收藏的文章列表
  getUserFavoriteArticles: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    return apiClient.get('/api/articles/user/favorites', { params: { page, limit } })
  },

  // 获取用户点赞的文章列表
  getUserLikedArticles: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginationResponse<Article>>> => {
    return apiClient.get('/api/articles/user/liked', { params: { page, limit } })
  },

}

export default articleApi