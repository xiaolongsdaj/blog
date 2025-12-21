<template>
  <div class="tab-content">
    <h2 class="tab-title">我的评论</h2>
    <div v-if="userComments.length > 0" class="comment-list">
      <el-card
        v-for="comment in userComments"
        :key="comment.id"
        class="comment-card"
      >
        <div class="comment-content">
          <p>{{ comment.content }}</p>
        </div>
        <div class="comment-meta">
          <span class="date">{{ formatDate(comment.createdAt) }}</span>
          <router-link :to="`/article/${comment.articleId}`" class="article-link">
            {{ comment.article.title }}
          </router-link>
          <el-button type="danger" size="small" class="delete-btn" @click="deleteComment(comment.id)">
            <el-icon><Delete /></el-icon> 删除
          </el-button>
        </div>
      </el-card>
    </div>
    <div v-else class="empty-state">
      <el-empty description="您还没有发表任何评论" />
    </div>
    <el-pagination
      v-if="userComments.length > 0"
      layout="total, prev, pager, next"
      :total="userCommentsTotal"
      :page-size="10"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCommentStore } from '../../stores/comment'
import type { Comment } from '../../api/comment'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()
const commentStore = useCommentStore()

// 评论列表数据
const userComments = ref<Comment[]>([])
const userCommentsTotal = ref(0)
const currentPage = ref(1)
const commentsLoading = ref(false)

// 加载用户评论
const loadUserComments = async () => {
  if (!props.userId) return
  
  commentsLoading.value = true
  try {
    const { comments, total } = await commentStore.getUserComments(props.userId, currentPage.value, 10)
    userComments.value = comments
    userCommentsTotal.value = total
  } catch (error) {
    console.error('获取用户评论列表失败:', error)
    ElMessage.error('获取评论列表失败，请稍后重试')
  } finally {
    commentsLoading.value = false
  }
}

// 页面变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadUserComments()
}

// 删除评论
const deleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？此操作不可恢复！', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await commentStore.deleteComment(commentId)
    ElMessage.success('评论删除成功')
    
    // 刷新评论列表
    if (userComments.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadUserComments()
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserComments()
})
</script>

<style scoped>
.comment-list {
  margin-bottom: 20px;
}

.comment-card {
  margin-bottom: 20px;
}

.comment-content {
  margin-bottom: 15px;
}

.comment-content p {
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.date {
  margin-right: 15px;
}

.article-link {
  flex: 1;
  color: #409EFF;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 15px;
}

.article-link:hover {
  text-decoration: underline;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}
</style>