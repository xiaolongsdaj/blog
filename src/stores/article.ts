import { defineStore } from 'pinia'
import articleApi from '../api/article'
import type { Article, Category, Tag } from '../api/article'

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
    // 首页获取文章列表
    async getArticles(page: number = 1, limit: number = 10,) {
      this.loading = true
      try {
        const response = await articleApi.getArticles(page, limit)
        this.articles = response.data.articles
        this.page = page
        this.total = response.data.pagination.total
        console.log(123321,response.data)
        return response.data
      } catch (error) {
        console.error('获取文章列表失败:', error)
        return { articles: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
      } finally {
        this.loading = false
      }
    },

    // 获取文章详情
    async getArticleDetail(id: number) {
      this.loading = true
      try {
        const response = await articleApi.getArticleDetail(id)
        this.currentArticle = response.data
        console.log(66666,this.currentArticle)
        return response.data
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
        const response = await articleApi.getCategories()
        this.categories = response.data
        return response.data
      } catch (error) {
        console.error('获取分类列表失败:', error)
        return []
      }
    },

    // 获取标签列表
    async getTags() {
      try {
        const response = await articleApi.getTags()
        this.tags = response.data
        return response.data
      } catch (error) {
        console.error('获取标签列表失败:', error)
        return []
      }
    },

    // 获取分类下的文章
    async getArticlesByCategory(categoryId: number, page: number = 1) {
      // 确保分类列表已加载
      if (this.categories.length === 0) {
        await this.getCategories()
      }
      
      this.currentCategory = this.categories.find(c => c.id === categoryId) || null
      const categoryName = this.currentCategory?.name || ''
      console.log('分类ID:', categoryId, '分类名称:', categoryName)
      
      this.loading = true
      try {
        const response = await articleApi.getArticlesByCategory(categoryName, page, 10)
        this.articles = response.data.articles
        this.page = page
        this.total = response.data.pagination.total
        return response.data
      } catch (error) {
        console.error('获取分类文章失败:', error)
        return { articles: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
      } finally {
        this.loading = false
      }
    },

    // 获取标签下的文章
    async getArticlesByTag(tagId: number, page: number = 1) {
      // 确保标签列表已加载
      if (this.tags.length === 0) {
        await this.getTags()
      }
      
      this.currentTag = this.tags.find(t => t.id === tagId) || null
      const tagName = this.currentTag?.name || ''
      console.log('标签ID:', tagId, '标签名称:', tagName)
      
      this.loading = true
      try {
        const response = await articleApi.getArticlesByTag(tagName, page, 10)
        this.articles = response.data.articles
        this.page = page
        this.total = response.data.pagination.total
        return response.data
      } catch (error) {
        console.error('获取标签文章失败:', error)
        return { articles: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 } }
      } finally {
        this.loading = false
      }
    },

    // // 搜索文章
    // async searchArticles(keyword: string, page: number = 1) {
    //   return this.getArticles(page, 10, undefined, undefined, keyword)
    // },

    // 增加阅读量
    // async incrementViewCount(id: number) {
    //   if (this.currentArticle && this.currentArticle.id === id) {
    //     this.currentArticle.viewCount++
    //   }

    //   const article = this.articles.find(a => a.id === id)
    //   if (article) {
    //     article.viewCount++
    //   }

    //   try {
    //     await articleApi.incrementViewCount(id)
    //   } catch (error) {
    //     console.error('增加阅读量失败:', error)
    //   }
    // },

    // // 增加评论数
    // async incrementCommentCount(id: number) {
    //   if (this.currentArticle && this.currentArticle.id === id) {
    //     this.currentArticle.commentCount++
    //   }

    //   const article = this.articles.find(a => a.id === id)
    //   if (article) {
    //     article.commentCount++
    //   }

    //   try {
    //     await articleApi.incrementCommentCount(id)
    //   } catch (error) {
    //     console.error('增加评论数失败:', error)
    //   }
    // }
  }
})
