

// 评论类型定义
export interface Comment {
  id: number
  articleId: number
  userId: number
  username: string
  avatar?: string
  content: string
  createdAt: string
  likeCount: number
  isLiked: boolean
  replies?: Comment[]
  parentId?: number
}

// 评论API服务
const commentApi = {
  // 获取文章评论列表
  getComments: async (articleId: number, page: number = 1, pageSize: number = 10): Promise<{ items: Comment[], total: number }> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 模拟返回数据
    const mockComments: Comment[] = [
      {
        id: 1,
        articleId,
        userId: 2,
        username: 'user1',
        avatar: 'https://via.placeholder.com/100',
        content: '这是一篇很好的文章，学到了很多！',
        createdAt: '2023-06-20T14:30:00',
        likeCount: 5,
        isLiked: false,
        replies: [
          {
            id: 2,
            articleId,
            userId: 1,
            username: 'author',
            avatar: 'https://via.placeholder.com/100',
            content: '感谢您的支持！',
            createdAt: '2023-06-20T15:45:00',
            likeCount: 2,
            isLiked: false,
            parentId: 1
          }
        ]
      },
      {
        id: 3,
        articleId,
        userId: 3,
        username: 'user2',
        avatar: 'https://via.placeholder.com/100',
        content: '写得很详细，对我帮助很大。',
        createdAt: '2023-06-21T09:15:00',
        likeCount: 3,
        isLiked: true
      }
    ]
    
    // 模拟分页
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedComments = mockComments.slice(startIndex, endIndex)
    
    return {
      items: paginatedComments,
      total: mockComments.length
    }
    
    // 实际API请求
    // return apiClient.get(`/articles/${articleId}/comments`, { params: { page, pageSize } })
  },

  // 添加评论
  addComment: async (articleId: number, content: string, parentId?: number): Promise<Comment> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟返回数据
    const newComment: Comment = {
      id: Date.now(),
      articleId,
      userId: 1,
      username: 'currentuser',
      avatar: 'https://via.placeholder.com/100',
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      parentId
    }
    
    return newComment
    
    // 实际API请求
    // return apiClient.post(`/articles/${articleId}/comments`, { content, parentId })
  },

  // 点赞评论
  likeComment: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 实际API请求
    // return apiClient.post(`/comments/${commentId}/like`)
  },

  // 取消点赞评论
  unlikeComment: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 实际API请求
    // return apiClient.delete(`/comments/${commentId}/like`)
  },

  // 删除评论
  deleteComment: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 实际API请求
    // return apiClient.delete(`/comments/${commentId}`)
  }
}

export default commentApi
