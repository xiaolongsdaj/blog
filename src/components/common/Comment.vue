<template>
  <div class="comment-container">
    <!-- 评论统计 -->
    <div class="comment-header">
      <h3 class="comment-title">
        <el-icon><ChatDotRound /></el-icon>
        评论 ({{ comments.length }})
      </h3>
    </div>

    <!-- 评论表单 -->
    <div v-if="isLoggedIn" class="comment-form-section">
      <el-card class="comment-form-card">
        <el-form :model="commentForm" :rules="commentRules" ref="commentFormRef" class="comment-form">
          <el-form-item prop="content">
            <el-input
              v-model="commentForm.content"
              type="textarea"
              :rows="4"
              placeholder="写下你的评论..."
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitComment"
              :loading="submittingComment"
              class="submit-btn"
            >
              发表评论
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 登录提示 -->
    <div v-else class="login-prompt">
      <el-card>
        <p>请先<a href="/login">登录</a>后再发表评论</p>
      </el-card>
    </div>

    <!-- 评论列表 -->
    <div class="comments-section">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 空状态 -->
      <div v-else-if="comments.length === 0" class="empty-comments">
        <el-empty description="暂无评论，快来抢沙发吧！" />
      </div>

      <!-- 评论列表 -->
      <div v-else class="comments-list">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <!-- 评论头部 -->
          <div class="comment-header-info">
            <el-avatar :size="40" :src="comment.user?.avatar || 'https://via.placeholder.com/40'" />
            <div class="comment-author-info">
              <span class="author-name">{{ comment.user?.username || '匿名用户' }}</span>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
            </div>
          </div>

          <!-- 评论内容 -->
          <div class="comment-content">
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="comment-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useUserStore } from '../../stores/user'
import { useCommentStore } from '../../stores/comment'
import { ElMessage } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'

// 定义组件属性
import type { Comment } from '../../api/comment'

interface Props {
  articleId: number
  initialComments?: Comment[]
  total?: number
  loading?: boolean
  page?: number
  pageSize?: number
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  initialComments: () => [],
  total: 0,
  loading: false,
  page: 1,
  pageSize: 10
})

// 定义事件
const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>()

// Store
const userStore = useUserStore()
const commentStore = useCommentStore()

// 评论数据
const comments = ref(props.initialComments)
const total = ref(props.total)
const loading = ref(props.loading)

// 当前页码和每页大小
const currentPage = computed({
  get: () => props.page,
  set: (value) => emit('update:page', value)
})

const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:pageSize', value)
})

// 用户登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 评论表单
const commentFormRef = ref()
const commentForm = reactive({
  content: ''
})

// 提交状态
const submittingComment = ref(false)
// 表单验证规则
const commentRules = {
  content: [
    { required: true, message: '请输入评论内容', trigger: 'blur' },
    { min: 1, max: 500, message: '评论内容长度在 1 到 500 个字符', trigger: 'blur' }
  ]
}


// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 提交评论
const submitComment = async () => {
  if (!commentFormRef.value) return

  await commentFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submittingComment.value = true
      try {
        await commentStore.postComment(
          props.articleId,
          commentForm.content
        )
        commentForm.content = ''

        // 发表成功后重新获取评论列表
        const { comments: newComments, total: newTotal } = await commentStore.getComments(props.articleId, currentPage.value, pageSize.value)
        comments.value = newComments
        total.value = newTotal

        ElMessage.success('评论发表成功')
      } catch (error) {
        console.error('发表评论失败:', error)
        ElMessage.error('评论发表失败，请稍后重试')
      } finally {
        submittingComment.value = false
      }
    }
  })
}

// 分页大小变化
const handleSizeChange = async (newSize: number) => {
  loading.value = true
  try {
    const { comments: newComments, total: newTotal } = await commentStore.getComments(props.articleId, 1, newSize)
    comments.value = newComments
    total.value = newTotal
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

// 当前页码变化
const handleCurrentChange = async (newPage: number) => {
  loading.value = true
  try {
    const { comments: newComments, total: newTotal } = await commentStore.getComments(props.articleId, newPage, pageSize.value)
    comments.value = newComments
    total.value = newTotal
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}
// 监听文章ID变化
watch(() => props.articleId, async (newArticleId) => {
  if (newArticleId) {
    loading.value = true
    try {
      // 获取评论列表
      const { comments: newComments, total: newTotal } = await commentStore.getComments(newArticleId, currentPage.value, pageSize.value)
      comments.value = newComments
      total.value = newTotal
    } catch (error) {
      console.error('获取评论列表失败:', error)
      ElMessage.error('获取评论列表失败')
    } finally {
      loading.value = false
    }
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.comment-container {
  margin-top: 40px;

  @media (max-width: 992px) {
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 15px;
  }
}

.comment-header {
  margin-bottom: 24px;

  .comment-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
    gap: 10px;

    .el-icon {
      color: #409eff;
    }
  }

  @media (max-width: 992px) {
    margin-bottom: 22px;

    .comment-title {
      font-size: 1.35rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;

    .comment-title {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;

    .comment-title {
      font-size: 1.15rem;
      gap: 8px;
    }
  }
}

.comment-form-section {
  margin-bottom: 30px;

  @media (max-width: 992px) {
    margin-bottom: 28px;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
}

.comment-form-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.comment-form {
  .el-textarea {
    margin-bottom: 16px;

    .el-textarea__inner {
      border-radius: 8px;
      resize: none;
    }
  }

  .submit-btn {
    border-radius: 8px;
    padding: 8px 24px;
  }

  @media (max-width: 992px) {
    .el-textarea {
      margin-bottom: 14px;
    }

    .submit-btn {
      padding: 7px 22px;
    }
  }

  @media (max-width: 768px) {
    .el-textarea {
      margin-bottom: 12px;

      .el-textarea__inner {
        font-size: 0.9rem;
      }
    }

    .submit-btn {
      padding: 6px 20px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .el-textarea {
      margin-bottom: 10px;

      .el-textarea__inner {
        font-size: 0.85rem;
      }
    }

    .submit-btn {
      padding: 5px 18px;
      font-size: 0.85rem;
    }
  }
}

.login-prompt {
  margin-bottom: 30px;

  .el-card {
    text-align: center;
    padding: 24px;
    border-radius: 12px;

    p {
      color: #606266;

      a {
        color: #409eff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  @media (max-width: 992px) {
    margin-bottom: 28px;

    .el-card {
      padding: 22px;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;

    .el-card {
      padding: 20px;

      p {
        font-size: 0.9rem;
      }
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;

    .el-card {
      padding: 16px;

      p {
        font-size: 0.85rem;
      }
    }
  }
}

.comments-section {
  margin-bottom: 30px;

  @media (max-width: 992px) {
    margin-bottom: 28px;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
}

.loading-state {
  padding: 40px 0;
}

.empty-comments {
  padding: 60px 0;
  text-align: center;

  @media (max-width: 992px) {
    padding: 50px 0;
  }

  @media (max-width: 768px) {
    padding: 40px 0;
  }

  @media (max-width: 480px) {
    padding: 30px 0;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 992px) {
    gap: 22px;
  }

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
}

.comment-item {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 992px) {
    padding: 18px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
}

  .comment-header-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .el-avatar {
      flex-shrink: 0;
    }

    .comment-author-info {
      display: flex;
      flex-direction: column;

      .author-name {
        font-weight: 600;
        color: #303133;
        font-size: 0.95rem;
      }

      .comment-date {
        font-size: 0.8rem;
        color: #909399;
        margin-top: 2px;
      }
    }

    @media (max-width: 992px) {
      gap: 11px;
      margin-bottom: 11px;

      .comment-author-info {
        .author-name {
          font-size: 0.925rem;
        }

        .comment-date {
          font-size: 0.775rem;
        }
      }
    }

    @media (max-width: 768px) {
      gap: 10px;
      margin-bottom: 10px;

      .el-avatar {
        width: 32px !important;
        height: 32px !important;
      }

      .comment-author-info {
        .author-name {
          font-size: 0.9rem;
        }

        .comment-date {
          font-size: 0.75rem;
        }
      }
    }

    @media (max-width: 480px) {
      gap: 8px;
      margin-bottom: 8px;

      .comment-author-info {
        .author-name {
          font-size: 0.85rem;
        }

        .comment-date {
          font-size: 0.7rem;
        }
      }
    }
  }

  .comment-content {
    margin-bottom: 16px;

    p {
      color: #606266;
      line-height: 1.7;
      font-size: 0.95rem;
    }

    @media (max-width: 992px) {
      margin-bottom: 14px;

      p {
        font-size: 0.925rem;
        line-height: 1.65;
      }
    }

    @media (max-width: 768px) {
      margin-bottom: 10px;

      p {
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }

    @media (max-width: 480px) {
      margin-bottom: 8px;

      p {
        font-size: 0.85rem;
        line-height: 1.5;
      }
    }
  }

  .comment-actions {
    display: flex;
    gap: 24px;
    font-size: 0.85rem;

    .action-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #909399;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #409eff;
      }

      .el-icon {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 992px) {
      gap: 22px;
      font-size: 0.825rem;

      .action-btn {
        .el-icon {
          font-size: 0.775rem;
        }
      }
    }

    @media (max-width: 768px) {
      gap: 20px;
      font-size: 0.8rem;

      .action-btn {
        .el-icon {
          font-size: 0.75rem;
        }
      }
    }

    @media (max-width: 480px) {
      gap: 16px;
      font-size: 0.75rem;

      .action-btn {
        gap: 3px;
        .el-icon {
          font-size: 0.7rem;
        }
      }
    }
  }

  .replies-list {
    margin-top: 20px;
    margin-left: 52px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 992px) {
      margin-top: 18px;
      margin-left: 40px;
      gap: 14px;
    }

    @media (max-width: 768px) {
      margin-top: 16px;
      margin-left: 20px;
      gap: 12px;
    }

    @media (max-width: 480px) {
      margin-top: 12px;
      margin-left: 16px;
      gap: 8px;
    }

    .reply-item {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #ecf5ff;
      }

      @media (max-width: 992px) {
        padding: 14px;
      }

      @media (max-width: 768px) {
        padding: 12px;
      }

      @media (max-width: 480px) {
        padding: 10px;
        border-radius: 6px;
      }
    }

      .reply-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .el-avatar {
          flex-shrink: 0;
        }

        .reply-author-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;

          .author-name {
            font-weight: 600;
            color: #303133;
          }

          .reply-to {
            color: #909399;
          }

          .target-author {
            color: #409eff;
            font-weight: 500;
          }

          .reply-date {
            color: #909399;
          }
        }

        @media (max-width: 992px) {
          gap: 7px;
          margin-bottom: 7px;

          .reply-author-info {
            gap: 7px;
            font-size: 0.825rem;
          }
        }

        @media (max-width: 768px) {
          gap: 6px;
          margin-bottom: 6px;

          .el-avatar {
            width: 28px !important;
            height: 28px !important;
          }

          .reply-author-info {
            gap: 6px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          gap: 4px;
          margin-bottom: 4px;

          .el-avatar {
            width: 24px !important;
            height: 24px !important;
          }

          .reply-author-info {
            gap: 4px;
            font-size: 0.75rem;
            flex-wrap: wrap;
          }
        }
      }

      .reply-content {
        margin-bottom: 12px;

        p {
          color: #606266;
          line-height: 1.6;
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          margin-bottom: 10px;

          p {
            font-size: 0.825rem;
            line-height: 1.55;
          }
        }

        @media (max-width: 768px) {
          margin-bottom: 8px;

          p {
            font-size: 0.8rem;
            line-height: 1.5;
          }
        }

        @media (max-width: 480px) {
          margin-bottom: 6px;

          p {
            font-size: 0.75rem;
            line-height: 1.4;
          }
        }
      }

      .reply-actions {
        display: flex;
        gap: 20px;
        font-size: 0.8rem;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #909399;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: #409eff;
          }

          .el-icon {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 992px) {
          gap: 18px;
          font-size: 0.775rem;

          .action-btn {
            .el-icon {
              font-size: 0.725rem;
            }
          }
        }

        @media (max-width: 768px) {
          gap: 16px;
          font-size: 0.75rem;

          .action-btn {
            .el-icon {
              font-size: 0.7rem;
            }
          }
        }

        @media (max-width: 480px) {
          gap: 12px;
          font-size: 0.7rem;

          .action-btn {
            gap: 3px;
            .el-icon {
              font-size: 0.65rem;
            }
          }
        }
      }
    }
  

  .reply-form-section {
    margin-top: 20px;
    margin-left: 52px;

    @media (max-width: 992px) {
      margin-top: 18px;
      margin-left: 40px;
    }

    @media (max-width: 768px) {
      margin-top: 16px;
      margin-left: 20px;
    }

    @media (max-width: 480px) {
      margin-top: 12px;
      margin-left: 16px;
    }
  }

  .reply-form-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .reply-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f2f5;

      span {
        font-weight: 500;
        color: #303133;
      }
    }

    .reply-form {
      .el-textarea {
        margin-bottom: 12px;

        .el-textarea__inner {
          border-radius: 6px;
          resize: none;
        }
      }

      .submit-btn {
        border-radius: 6px;
        padding: 6px 20px;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 992px) {
      .reply-form-header {
        margin-bottom: 14px;
        padding-bottom: 11px;
        font-size: 0.95rem;
      }

      .reply-form {
        .el-textarea {
          margin-bottom: 11px;
        }

        .submit-btn {
          padding: 5.5px 18px;
          font-size: 0.825rem;
        }
      }
    }

    @media (max-width: 768px) {
      .reply-form-header {
        margin-bottom: 12px;
        padding-bottom: 10px;
        font-size: 0.9rem;
      }

      .reply-form {
        .el-textarea {
          margin-bottom: 10px;

          .el-textarea__inner {
            font-size: 0.85rem;
          }
        }

        .submit-btn {
          padding: 5px 16px;
          font-size: 0.8rem;
        }
      }
    }

    @media (max-width: 480px) {
      border-radius: 6px;

      .reply-form-header {
        margin-bottom: 10px;
        padding-bottom: 8px;
        font-size: 0.85rem;
      }

      .reply-form {
        .el-textarea {
          margin-bottom: 8px;

          .el-textarea__inner {
            font-size: 0.8rem;
            border-radius: 4px;
          }
        }

        .submit-btn {
          padding: 4px 14px;
          font-size: 0.75rem;
          border-radius: 4px;
        }
      }
    }
  }


.comment-pagination {
  margin-top: 40px;
  text-align: center;

  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 0 10px;

    .el-pagination {
      font-size: 0.85rem;
    }
  }
}

.loading-state {
  padding: 40px 0;
}
</style>