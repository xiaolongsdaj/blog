

// 文章类型定义
export interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  coverImage?: string
  createdAt: string
  updatedAt: string
  viewCount: number
  commentCount: number
  categoryId: number
  categoryName: string
  tags: Array<{ id: number; name: string }>
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
  getArticles: async (page: number = 1, pageSize: number = 10, _categoryId?: number, _tagId?: number, _keyword?: string): Promise<PaginationResponse<Article>> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟返回数据
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Vue 3 新特性详解',
        excerpt: '本文详细介绍了Vue 3的主要新特性，包括Composition API、Teleport、Suspense等。',
        content: '# Vue 3 新特性详解\n\nVue 3是Vue.js的最新版本，带来了许多令人兴奋的新特性...',
        coverImage: 'https://via.placeholder.com/800x400',
        createdAt: '2023-06-15T10:30:00',
        updatedAt: '2023-06-15T10:30:00',
        viewCount: 1234,
        commentCount: 56,
        categoryId: 1,
        categoryName: '前端技术',
        tags: [{ id: 1, name: 'Vue' }, { id: 2, name: 'JavaScript' }]
      },
      {
        id: 2,
        title: 'TypeScript 入门指南',
        excerpt: 'TypeScript是JavaScript的超集，提供了类型系统和ES6+的特性支持。',
        content: '# TypeScript 入门指南\n\nTypeScript是一种由Microsoft开发的开源编程语言...',
        coverImage: 'https://via.placeholder.com/800x400',
        createdAt: '2023-06-10T14:20:00',
        updatedAt: '2023-06-10T14:20:00',
        viewCount: 892,
        commentCount: 34,
        categoryId: 1,
        categoryName: '前端技术',
        tags: [{ id: 3, name: 'TypeScript' }, { id: 2, name: 'JavaScript' }]
      },
      {
        id: 3,
        title: 'Node.js 异步编程最佳实践',
        excerpt: '本文介绍了Node.js异步编程的各种模式和最佳实践。',
        content: '# Node.js 异步编程最佳实践\n\nNode.js是一个基于Chrome V8引擎的JavaScript运行时...',
        coverImage: 'https://via.placeholder.com/800x400',
        createdAt: '2023-06-05T09:15:00',
        updatedAt: '2023-06-05T09:15:00',
        viewCount: 678,
        commentCount: 28,
        categoryId: 2,
        categoryName: '后端技术',
        tags: [{ id: 4, name: 'Node.js' }, { id: 2, name: 'JavaScript' }]
      },
      {
        id: 4,
        title: 'React Hooks 深度解析',
        excerpt: '深入解析React Hooks的工作原理和使用技巧。',
        content: '# React Hooks 深度解析\n\nReact Hooks是React 16.8版本引入的新特性...',
        coverImage: 'https://via.placeholder.com/800x400',
        createdAt: '2023-06-01T16:45:00',
        updatedAt: '2023-06-01T16:45:00',
        viewCount: 1024,
        commentCount: 42,
        categoryId: 1,
        categoryName: '前端技术',
        tags: [{ id: 5, name: 'React' }, { id: 2, name: 'JavaScript' }]
      },
      {
        id: 5,
        title: 'MySQL 性能优化技巧',
        excerpt: '分享MySQL数据库性能优化的实用技巧和最佳实践。',
        content: '# MySQL 性能优化技巧\n\nMySQL是世界上最流行的开源关系型数据库之一...',
        coverImage: 'https://via.placeholder.com/800x400',
        createdAt: '2023-05-25T11:20:00',
        updatedAt: '2023-05-25T11:20:00',
        viewCount: 756,
        commentCount: 21,
        categoryId: 3,
        categoryName: '数据库',
        tags: [{ id: 6, name: 'MySQL' }, { id: 7, name: '数据库' }]
      }
    ]

    // 模拟分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedArticles = mockArticles.slice(startIndex, endIndex)

    return {
      items: paginatedArticles,
      total: mockArticles.length,
      page,
      pageSize
    }
    
    // 实际API请求
    // return apiClient.get('/articles', { params })
  },

  // 获取文章详情
  getArticleDetail: async (id: number): Promise<Article> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟返回数据
    const mockArticle: Article = {
      id,
      title: 'Vue 3 新特性详解',
      excerpt: '本文详细介绍了Vue 3的主要新特性，包括Composition API、Teleport、Suspense等。',
      content: '# Vue 3 新特性详解\n\nVue 3是Vue.js的最新版本，带来了许多令人兴奋的新特性...',
      coverImage: 'https://via.placeholder.com/800x400',
      createdAt: '2023-06-15T10:30:00',
      updatedAt: '2023-06-15T10:30:00',
      viewCount: 1234,
      commentCount: 56,
      categoryId: 1,
      categoryName: '前端技术',
      tags: [{ id: 1, name: 'Vue' }, { id: 2, name: 'JavaScript' }]
    }

    return mockArticle
    
    // 实际API请求
    // return apiClient.get(`/articles/${id}`)
  },

  // 获取分类列表
  getCategories: async (): Promise<Category[]> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 模拟返回数据
    const mockCategories: Category[] = [
      { id: 1, name: '前端技术', articleCount: 20 },
      { id: 2, name: '后端技术', articleCount: 15 },
      { id: 3, name: '数据库', articleCount: 8 },
      { id: 4, name: '生活随笔', articleCount: 12 }
    ]

    return mockCategories
    
    // 实际API请求
    // return apiClient.get('/categories')
  },

  // 获取标签列表
  getTags: async (): Promise<Tag[]> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 模拟返回数据
    const mockTags: Tag[] = [
      { id: 1, name: 'Vue', articleCount: 15 },
      { id: 2, name: 'JavaScript', articleCount: 25 },
      { id: 3, name: 'TypeScript', articleCount: 12 },
      { id: 4, name: 'Node.js', articleCount: 10 },
      { id: 5, name: 'React', articleCount: 8 },
      { id: 6, name: 'MySQL', articleCount: 7 },
      { id: 7, name: '数据库', articleCount: 9 }
    ]

    return mockTags
    
    // 实际API请求
    // return apiClient.get('/tags')
  },

  // 增加阅读量
  incrementViewCount: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 实际API请求
    // return apiClient.post(`/articles/${id}/views`)
  },

  // 增加评论数
  incrementCommentCount: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 实际API请求
    // return apiClient.post(`/articles/${id}/comments/count`)
  }
}

export default articleApi