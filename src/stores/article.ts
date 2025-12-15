import { defineStore } from 'pinia'
import articleApi from '../api/article'
import type { Article, Category, Tag, PaginationResponse } from '../api/article'

interface ArticleState {
  articles: Article[]
  currentArticle: Article | null
  categories: Category[]
  tags: Tag[]
  currentCategory: Category | null
  currentTag: Tag | null
  page: number
  total: number
  loading: boolean
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    currentArticle: null,
    categories: [],
    tags: [],
    currentCategory: null,
    currentTag: null,
    page: 1,
    total: 0,
    loading: false
  }),

  actions: {
    // 获取文章列表
    async getArticles(page: number = 1, pageSize: number = 10, categoryId?: number, tagId?: number, keyword?: string) {
      this.loading = true
      try {
        const response: PaginationResponse<Article> = await articleApi.getArticles(page, pageSize, categoryId, tagId, keyword)
        this.articles = response.items
        this.page = page
        this.total = response.total
        return response.items
      } catch (error) {
        console.error('获取文章列表失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // 获取文章详情
    async getArticleDetail(id: number) {
      this.loading = true
      try {
        const article = await articleApi.getArticleDetail(id)
        this.currentArticle = article
        return article
      } catch (error) {
        console.error('获取文章详情失败:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // 获取分类列表
    async getCategories() {
      try {
        const categories = await articleApi.getCategories()
        this.categories = categories
        return categories
      } catch (error) {
        console.error('获取分类列表失败:', error)
        return []
      }
    },

    // 获取标签列表
    async getTags() {
      try {
        const tags = await articleApi.getTags()
        this.tags = tags
        return tags
      } catch (error) {
        console.error('获取标签列表失败:', error)
        return []
      }
    },

    // 获取分类下的文章
    async getArticlesByCategory(categoryId: number, page: number = 1) {
      this.currentCategory = this.categories.find(c => c.id === categoryId) || null
      return this.getArticles(page, 10, categoryId)
    },

    // 获取标签下的文章
    async getArticlesByTag(tagId: number, page: number = 1) {
      this.currentTag = this.tags.find(t => t.id === tagId) || null
      return this.getArticles(page, 10, undefined, tagId)
    },

    // 搜索文章
    async searchArticles(keyword: string, page: number = 1) {
      return this.getArticles(page, 10, undefined, undefined, keyword)
    },

    // 增加阅读量
    async incrementViewCount(id: number) {
      if (this.currentArticle && this.currentArticle.id === id) {
        this.currentArticle.viewCount++
      }

      const article = this.articles.find(a => a.id === id)
      if (article) {
        article.viewCount++
      }

      try {
        await articleApi.incrementViewCount() 
      } catch (error) {
        console.error('增加阅读量失败:', error)
      }
    },

    // 增加评论数
    async incrementCommentCount(id: number) {
      if (this.currentArticle && this.currentArticle.id === id) {
        this.currentArticle.commentCount++
      }

      const article = this.articles.find(a => a.id === id)
      if (article) {
        article.commentCount++
      }

      try {
        await articleApi.incrementCommentCount()
      } catch (error) {
        console.error('增加评论数失败:', error)
      }
    }
  }
})
