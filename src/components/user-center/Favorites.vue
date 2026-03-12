<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2 class="tab-title">我的收藏</h2>
    </div>
    <div v-if="favoriteArticles.length > 0" class="article-list">
      <el-card
        v-for="article in favoriteArticles"
        :key="article.id"
        class="article-card"
      >
        <template #header>
          <div class="card-header">
            <router-link :to="`/article/${article.id}`" class="article-title">{{ article.title }}</router-link>
          </div>
        </template>
        <div class="article-content">
          <p class="summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span class="date">{{ formatDate(article.createdAt) }}</span>
            <span class="views">
              <el-icon><View /></el-icon> {{ article.viewCount }}
            </span>
            <span class="comments">
              <el-icon><ChatDotRound /></el-icon> {{ article.commentCount }}
            </span>
          </div>
          <div class="article-tags">
            <template v-for="(tagItem, itemIndex) in article.tags" :key="tagItem || itemIndex">
              <template v-if="tagItem.name">
                <span 
                  v-for="(tag, index) in tagItem.name.split(/[,，]/).map((t: string) => t.trim()).filter(Boolean)" 
                  :key="index" 
                  class="tag-item" 
                  :style="{ backgroundColor: getTagColor(itemIndex * 10 + index) }"
                >
                  {{ tag }}
                </span>
              </template>
              <span v-else class="tag-item" :style="{ backgroundColor: getTagColor(itemIndex) }">
                {{ tagItem.name || tagItem }}
              </span>
            </template>
          </div>
        </div>
      </el-card>
    </div>
    <div v-else class="empty-state">
      <el-empty description="您还没有收藏任何文章" />
    </div>
    <el-pagination
      v-if="favoriteArticles.length > 0"
      layout="total, prev, pager, next"
      :total="favoriteArticlesTotal"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import articleApi from '../../api/article'
import type { Article } from '../../api/article'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  refresh: []
}>()

// 收藏文章列表
const favoriteArticles = ref<Article[]>([])
const favoriteArticlesTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 加载用户收藏的文章
const loadFavoriteArticles = async () => {
  loading.value = true
  try {
    const response = await articleApi.getUserFavoriteArticles(currentPage.value, pageSize.value)
    favoriteArticles.value = response.data.articles
    favoriteArticlesTotal.value = response.data.pagination.total
  } catch (error) {
    console.error('获取用户收藏文章列表失败:', error)
    ElMessage.error('获取收藏文章列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadFavoriteArticles()
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

// 获取标签颜色
const getTagColor = (index: number) => {
  const colors = [
    '#f56c6c', // 红色
    '#67c23a', // 绿色
    '#e6a23c', // 橙色
    '#409eff', // 蓝色
    '#909399', // 灰色
    '#722ed1', // 紫色
    '#13c2c2', // 青色
    '#faad14'  // 黄色
  ]
  return colors[index % colors.length]
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadFavoriteArticles()
})
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

    .tag-item {
      display: inline-block;
      padding: 4px 12px;
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }
    }
  }
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}
</style>