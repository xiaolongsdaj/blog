<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="输入关键词搜索"
          clearable
          @input="debouncedSearch"
          size="large"
        >
          <template #prepend>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 搜索结果信息 -->
      <div class="search-info">
        <h2 class="search-title">
          搜索结果
          <span class="keyword">"{{ currentKeyword }}"</span>
        </h2>
        <p class="search-stats">
          共找到 {{ articles.length }} 篇相关文章
        </p>
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
                  <!-- 高亮搜索关键词 -->
                  <span v-html="highlightKeyword(article.title)"></span>
                </router-link>
              </h3>
              <p class="article-excerpt">
                <span v-html="highlightKeyword(article.summary)"></span>
              </p>
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
            </div>
            <div v-if="article.coverImage" class="article-cover">
              <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }">
                <img :src="article.coverImage" :alt="article.title" loading="lazy" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-else class="no-results">
          <el-empty description="未找到相关文章" />
          <div class="search-tips">
            <h3>搜索建议：</h3>
            <ul>
              <li>尝试使用其他关键词</li>
              <li>检查拼写是否正确</li>
              <li>使用更通用的词语</li>
            </ul>
            <el-button type="primary" @click="$router.push('/')" style="margin-top: 20px;">
              返回首页
            </el-button>
          </div>
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
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

// 状态
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 防抖定时器
let debounceTimer: number | null = null

// 获取当前搜索关键词
const currentKeyword = computed(() => route.query.keyword as string || '')

// 获取文章数据
const articles = computed(() => articleStore.articles)
const total = computed(() => articleStore.total)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 高亮关键词
const highlightKeyword = (text: string) => {
  if (!currentKeyword.value) return text
  const regex = new RegExp(`(${currentKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 加载搜索结果
const loadSearchResults = async () => {
  if (!currentKeyword.value) return

  loading.value = true
  try {
    await articleStore.searchArticles(currentKeyword.value, currentPage.value)
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  
  router.push({
    path: '/search',
    query: { keyword: searchKeyword.value.trim() }
  })
}

// 防抖搜索
const debouncedSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = window.setTimeout(() => {
    handleSearch()
  }, 500)
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadSearchResults()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadSearchResults()
}

// 监听路由变化
watch(() => route.query.keyword, (newKeyword) => {
  searchKeyword.value = newKeyword as string || ''
  currentPage.value = 1
  loadSearchResults()
})

// 初始化
onMounted(() => {
  searchKeyword.value = currentKeyword.value
  loadSearchResults()
})
</script>

<style scoped lang="scss">
.search-page {
  padding: 30px 0;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-area {
  margin-bottom: 40px;
  text-align: center;
}

.search-area .el-input {
  max-width: 600px;
  margin: 0 auto;
}

.search-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;

  .keyword {
    color: #409eff;
  }
}

.search-stats {
  color: #909399;
  font-size: 1rem;
}

.loading {
  margin-bottom: 30px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.article-item {
  display: flex;
  gap: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 15px;
  }
}

.article-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

.article-excerpt {
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.highlight {
  color: #409eff;
  font-weight: 600;
  background-color: #ecf5ff;
  padding: 2px 4px;
  border-radius: 3px;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #909399;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .el-icon {
    font-size: 0.85rem;
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

.article-cover {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 6px;
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
    height: 180px;
  }
}

.no-results {
  text-align: center;
  padding: 60px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-tips {
  margin-top: 30px;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  h3 {
    color: #303133;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  ul {
    list-style: disc;
    padding-left: 20px;
    color: #606266;
    margin-bottom: 20px;

    li {
      margin-bottom: 8px;
    }
  }
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