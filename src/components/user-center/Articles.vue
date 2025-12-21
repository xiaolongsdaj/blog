<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2 class="tab-title">我的文章</h2>
      <el-button type="primary" @click="handleCreateArticle">
        <el-icon><Plus /></el-icon> 创建文章
      </el-button>
    </div>
    <div v-if="userArticles.length > 0" class="article-list">
      <el-card
        v-for="article in userArticles"
        :key="article.id"
        class="article-card"
      >
        <template #header>
          <div class="card-header">
            <router-link :to="`/article/${article.id}`" class="article-title">{{ article.title }}</router-link>
            <div class="article-actions">
              <el-button type="primary" size="small" @click="editArticle(article)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteArticle(article.id)">删除</el-button>
            </div>
          </div>
        </template>
        <div class="article-content">
          <p class="summary">{{ article.summary }}</p>
          <div class="article-meta">
            <!-- <span class="category">{{ article.category?.name || '无分类' }}</span> -->
            <span class="date">{{ formatDate(article.createdAt) }}</span>
            <span class="views">
              <el-icon><View /></el-icon> {{ article.viewCount }}
            </span>
            <span class="comments">
              <el-icon><ChatDotRound /></el-icon> {{ article.commentCount }}
            </span>
          </div>
          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag.id" size="small">{{ tag.name }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
    <div v-else class="empty-state">
      <el-empty description="您还没有发布任何文章" />
    </div>
    <el-pagination
      v-if="userArticles.length > 0"
      layout="total, prev, pager, next"
      :total="userArticlesTotal"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />

    <!-- 文章编辑/创建模态框 -->
    <el-dialog
      v-model="showArticleModal"
      :title="isEditing ? '编辑文章' : '创建文章'"
      width="80%"
      class="article-modal"
    >
      <el-form
        :model="articleForm"
        :rules="articleRules"
        ref="articleFormRef"
        label-width="120px"
        class="article-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="articleForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入文章内容"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="articleForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="公共" value="PUBLISHED" />
            <el-option label="私有" value="PRIVATE" />
            <el-option label="草稿" value="DRAFT" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showArticleModal = false">取消</el-button>
          <el-button type="primary" @click="submitArticleForm">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import articleApi from '../../api/article'
import type { Article } from '../../api/article'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()

// 用户文章列表
const userArticles = ref<Article[]>([])
const userArticlesTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 文章模态框相关
const showArticleModal = ref(false)
const isEditing = ref(false)
const articleFormRef = ref()

// 文章表单数据
const articleForm = reactive({
  id: 0,
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  status: 'PUBLISHED',
  categoryId: null,
  tags: []
})

// 文章表单验证规则
const articleRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '摘要长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 20, message: '内容长度不能少于 20 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择文章状态', trigger: 'change' }
  ]
}

// 加载用户文章
const loadUserArticles = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const response = await articleApi.getUserArticles(props.userId, currentPage.value, pageSize.value)
    userArticles.value = response.data.articles
    userArticlesTotal.value = response.data.pagination.total
  } catch (error) {
    console.error('获取用户文章列表失败:', error)
    ElMessage.error('获取文章列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 提交文章表单
const submitArticleForm = async () => {
  if (!articleFormRef.value) return

  await articleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (isEditing.value) {
          // 更新文章
          await articleApi.updateArticle(articleForm.id, articleForm)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          await articleApi.createArticle(articleForm)
          ElMessage.success('文章创建成功')
        }

        // 关闭模态框并重置表单
        showArticleModal.value = false
        resetArticleForm()

        // 刷新文章列表
        await loadUserArticles()
        emit('refresh')
      } catch (error) {
        console.error(isEditing.value ? '更新文章失败:' : '创建文章失败:', error)
        ElMessage.error(isEditing.value ? '更新失败，请稍后重试' : '创建失败，请稍后重试')
      }
    }
  })
}

// 编辑文章
const editArticle = async (article: Article) => {
  // 填充表单数据，将status转换为大写，提取tags的ID
  Object.assign(articleForm, {
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    coverImage: article.coverImage,
    status: article.status.toUpperCase(),
    categoryId: article.categoryId,
    tags: article.tags.map(tag => tag.id)
  })
  
  // 设置为编辑模式并打开模态框
  isEditing.value = true
  showArticleModal.value = true
}

// 重置文章表单
const resetArticleForm = () => {
  if (articleFormRef.value) {
    articleFormRef.value.resetFields()
  }
  
  // 重置表单数据
  Object.assign(articleForm, {
    id: 0,
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    status: 'PUBLISHED',
    categoryId: null,
    tags: []
  })
  
  // 设置为创建模式
  isEditing.value = false
}

// 删除文章
const deleteArticle = async (articleId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复！', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await articleApi.deleteArticle(articleId)
    ElMessage.success('文章删除成功')
    
    // 刷新文章列表
    if (userArticles.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadUserArticles()
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadUserArticles()
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

// 监听创建文章按钮点击
const handleCreateArticle = async () => {
  showArticleModal.value = true
}

// 组件挂载时加载数据
loadUserArticles()
</script>

<style scoped lang="scss">
.tab-content {
  min-height: 400px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
  margin: 0;
}

.article-list {
  margin-bottom: 20px;
}

.article-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .article-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #303133;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 70%;

    &:hover {
      color: #409eff;
    }
  }

  .article-actions {
    display: flex;
    gap: 10px;
  }
}

.article-content {
  .summary {
    color: #606266;
    line-height: 1.6;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    align-items: center;
    color: #909399;
    font-size: 0.9rem;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;

    .category {
      background-color: #ecf5ff;
      color: #409eff;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .views, .comments {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .article-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.article-modal {
  .article-form {
    .cover-preview {
      max-width: 200px;
      margin-top: 10px;
      border-radius: 8px;
    }
  }
}
</style>