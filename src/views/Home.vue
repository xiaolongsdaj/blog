<template>
  <div class="home-page">
    <div class="page-header">
      <h1>最新文章</h1>
      <p>分享技术与生活的点滴</p>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <article 
        v-for="article in articles" 
        :key="article.id"
        class="article-item"
      >
        <!-- 文章封面 -->
        <div class="article-cover" v-if="article.coverImage">
          <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }">
            <img 
              :src="article.coverImage" 
              :alt="article.title"
              loading="lazy"
              class="cover-image"
            />
          </router-link>
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <div class="article-meta">
            <span class="category">
              <el-icon><Collection /></el-icon>
              <router-link v-if="article.category" :to="{ name: 'CategoryArticles', params: { id: article.category.id } }">
                {{ article.category.name }}
              </router-link>
              <span v-else>无分类</span>
            </span>
            <span class="date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(article.createdAt) }}
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

          <!-- 文章标题 -->
          <h2 class="article-title">
            <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }">
              {{ article.title }}
            </router-link>
          </h2>

          <!-- 文章摘要 -->
          <div class="article-summary">
            {{ article.summary }}
          </div>

          <!-- 文章标签 -->
          <div class="article-tags">
            <router-link 
              v-for="tag in article.tags" 
              :key="tag.id"
              :to="{ name: 'TagArticles', params: { id: tag.id } }"
              class="tag"
            >
              <el-icon><Label /></el-icon>
              {{ tag.name }}
            </router-link>
          </div>
        </div>
      </article>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 分页组件 -->
    <div v-if="!loading && total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && articles.length === 0" class="empty-state">
      <el-empty description="暂无文章" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '../stores/article'

const articleStore = useArticleStore()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 获取计算属性
const articles = ref(articleStore.articles)
const total = ref(articleStore.total)
const loading = ref(articleStore.loading)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 加载文章列表
const loadArticles = async () => {
  await articleStore.getArticles(currentPage.value, pageSize.value)
  articles.value = articleStore.articles
  total.value = articleStore.total
}
console.log(1111111,)

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadArticles()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadArticles()
}

// 初始化加载数据
onMounted(() => {
  loadArticles()
})
</script>

<style scoped lang="scss">
.home-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #303133;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: #606266;
  }
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
}

.article-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    display: flex;
  }
}

.article-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 300px;
    height: 100%;
  }
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.article-content {
  padding: 20px;
  flex: 1;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #909399;

  .category, .date, .views, .comments {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .el-icon {
    font-size: 0.9rem;
  }

  .category a {
    color: #909399;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }
}

.article-title {
  margin: 0 0 15px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;

  a {
    color: inherit;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }
}

.article-summary {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 1rem;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  .tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    background-color: #f5f7fa;
    color: #606266;
    border-radius: 20px;
    font-size: 0.85rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
    }

    .el-icon {
      font-size: 0.85rem;
    }
  }
}

.loading {
  margin: 30px 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}
</style>