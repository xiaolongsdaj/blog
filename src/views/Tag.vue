<template>
  <div class="tag-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">
          <el-icon><Label /></el-icon>
          {{ tagName }}
        </h1>
        <p class="page-description">共有 {{ articles.length }} 篇文章</p>
      </div>

      <!-- 文章列表 -->
      <div class="article-list">
        <div v-if="loading" class="loading">
          <el-skeleton :rows="5" animated />
        </div>

        <div v-else-if="articles.length > 0">
          <div 
            v-for="article in articles" 
            :key="article.id"
            class="article-item"
          >
            <div class="article-info">
              <h3 class="article-title">
                <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }">
                  {{ article.title }}
                </router-link>
              </h3>
              <p class="article-excerpt">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="date">
                  <el-icon><Calendar /></el-icon>
                  {{ formatDate(article.createdAt) }}
                </span>
                <span class="category">
                  <el-icon><Collection /></el-icon>
                  <router-link :to="{ name: 'CategoryArticles', params: { id: article.category.id } }">
                    {{ article.category.name }}
                  </router-link>
                </span>
                <span class="views">
                  <el-icon><View /></el-icon>
                  {{ article.viewCount }}
                </span>
                <span class="comments">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ article.commentCount }}
                </span>
              </div>
              
              <!-- 文章标签 -->
              <div class="article-tags">
                <router-link 
                  v-for="tag in article.tags" 
                  :key="tag.id"
                  :to="{ name: 'TagArticles', params: { id: tag.id } }"
                  class="tag-item"
                >
                  <el-icon><Label /></el-icon>
                  {{ tag.name }}
                </router-link>
              </div>
            </div>
            <div v-if="article.coverImage" class="article-cover">
              <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }">
                <img :src="article.coverImage" :alt="article.title" loading="lazy" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- 无文章提示 -->
        <div v-else class="no-articles">
          <el-empty description="该标签下暂无文章" />
          <el-button type="primary" @click="$router.push('/')" style="margin-top: 20px;">
            返回首页
          </el-button>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30]"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '../stores/article'

const route = useRoute()
const articleStore = useArticleStore()

// 状态
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取标签ID
const tagId = computed(() => Number(route.params.id))

// 获取文章数据
const articles = computed(() => articleStore.articles)
const total = computed(() => articleStore.total)

// 标签名称
const tagName = computed(() => {
  const tag = articleStore.tags.find(tag => tag.id === tagId.value)
  return tag ? tag.name : '标签'
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 加载标签文章
const loadTagArticles = async () => {
  if (isNaN(tagId.value)) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    await articleStore.getArticlesByTag(tagId.value, currentPage.value)
  } catch (error) {
    console.error('加载标签文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadTagArticles()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadTagArticles()
}

// 监听路由变化
watch(() => route.params.id, () => {
  currentPage.value = 1
  loadTagArticles()
})

// 初始化
onMounted(() => {
  loadTagArticles()
})
</script>

<style scoped lang="scss">
.tag-page {
  padding: 30px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;

  .page-title {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 2rem;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;

    .el-icon {
      color: #67c23a;
    }
  }

  .page-description {
    color: #909399;
    font-size: 1rem;
  }
}

.loading {
  margin-bottom: 30px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.article-item {
  display: flex;
  gap: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 25px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
}

.article-excerpt {
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #909399;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .el-icon {
    font-size: 0.9rem;
  }

  .category a {
    color: #909399;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  .tag-item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    background-color: #f0f9eb;
    color: #67c23a;
    border-radius: 15px;
    font-size: 0.85rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
    }

    .el-icon {
      font-size: 0.8rem;
    }
  }
}

.article-cover {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
}

.no-articles {
  text-align: center;
  padding: 60px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>