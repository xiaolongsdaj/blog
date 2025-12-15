import { defineStore } from 'pinia'
// 导入依赖的store
import { useArticleStore } from './article'
// 导入API服务和类型
import commentApi, { type Comment } from '../api/comment'

interface CommentState {
  comments: Comment[]
  currentArticleComments: Comment[]
  loading: boolean
  submitting: boolean
}

export const useCommentStore = defineStore('comment', {
  state: (): CommentState => ({
    comments: [],
    currentArticleComments: [],
    loading: false,
    submitting: false
  }),

  actions: {
    // 获取文章评论
    async getComments(articleId: number, page: number = 1, pageSize: number = 10) {
      this.loading = true
      try {
        const response = await commentApi.getComments(articleId, page, pageSize)
        this.currentArticleComments = response.items
        return { comments: response.items, total: response.total }
      } catch (error) {
        console.error('获取评论失败:', error)
        return { comments: [], total: 0 }
      } finally {
        this.loading = false
      }
    },

    // 发表评论
    async postComment(articleId: number, content: string, parentId?: number) {
      this.submitting = true
      try {
        const newComment = await commentApi.addComment(articleId, content, parentId)
        
        // 设置回复数组
        newComment.replies = newComment.replies || []

        if (parentId) {
          // 回复评论
          const findAndAddReply = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment.id === parentId) {
                (comment.replies ??= []).push(newComment)
                return true
              }
              if (findAndAddReply(comment.replies || [])) {
                return true
              }
            }
            return false
          }

          findAndAddReply(this.currentArticleComments)
        } else {
          // 发表新评论
          this.currentArticleComments.unshift(newComment)
        }

        // 更新文章评论数
        const articleStore = useArticleStore()
        articleStore.incrementCommentCount(articleId)

        return true
      } catch (error) {
        console.error('发表评论失败:', error)
        return false
      } finally {
        this.submitting = false
      }
    },

    // 点赞评论
    async likeComment(commentId: number) {
      const findAndUpdateLike = (comments: Comment[]): boolean => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            if (comment.isLiked) {
              comment.likeCount--
              // 调用API取消点赞
              commentApi.unlikeComment().catch(err => console.error('取消点赞失败:', err))
            } else {
              comment.likeCount++
              // 调用API点赞
              commentApi.likeComment().catch(err => console.error('点赞失败:', err))
            }
            comment.isLiked = !comment.isLiked
            return true
          }
          if (comment.replies && findAndUpdateLike(comment.replies)) {
            return true
          }
        }
        return false
      }

      findAndUpdateLike(this.currentArticleComments)
    },

    // 删除评论
    async deleteComment(commentId: number) {
      const findAndDeleteComment = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i]?.id === commentId) {
            comments.splice(i, 1)
            return true
          }
          if (comments[i]?.replies?.length && findAndDeleteComment(comments[i]?.replies!)) {
            return true
          }
        }
        return false
      }

      const deleted = findAndDeleteComment(this.currentArticleComments)
      if (deleted) {
        try {
          await commentApi.deleteComment()
        } catch (error) {
          console.error('删除评论失败:', error)
        }
      }
    }
  }
})
