<template>
  <div class="home-page">
    <div class="page-header">
      <h1>最新文章</h1>
      <p>分享技术与生活的点滴</p>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <ArticleCard 
        v-for="article in articles" 
        :key="article.id"
        :article="{
          ...article,
          tags: article.tags.map((tag: { name: string }) => ({
            id: 0,
            name: tag.name
          }))
        }"
      />
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
import ArticleCard from '../components/common/ArticleCard.vue'

const articleStore = useArticleStore()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 获取计算属性
const articles = ref(articleStore.articles)
const total = ref(articleStore.total)
const loading = ref(articleStore.loading)

// 加载文章列表
const loadArticles = async () => {
  await articleStore.getArticles(currentPage.value, pageSize.value)
  articles.value = articleStore.articles
  total.value = articleStore.total
}

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