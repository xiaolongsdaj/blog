<template>
  <div class="category-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">
          <el-icon><Collection /></el-icon>
          {{ categoryName }}
        </h1>
        <p class="page-description">共有 {{ articles.length }} 篇文章</p>
        
        <!-- 分类标签栏 -->
        <div class="category-tabs" v-if="limitedCategories.length > 0">
          <el-tag
            v-for="category in limitedCategories"
            :key="category.id"
            :type="category.id === categoryId ? 'primary' : ''"
            :effect="category.id === categoryId ? 'dark' : 'plain'"
            class="category-tag"
            @click="switchCategory(category.id)"
          >
            {{ category.name }}
            
          </el-tag>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="article-list">
        <div v-if="loading" class="loading">
          <el-skeleton :rows="5" animated />
        </div>

        <ArticleCard 
          v-else-if="articles.length > 0"
          v-for="article in articles" 
          :key="article.id"
          :article="{
            ...article,
            tags: article.tags.map((tag: { name: string }) => ({
              id: 0, // 后端未返回 id，可统一补 0 或根据业务调整
              name: tag.name
            }))
          }"
        />

        <!-- 无文章提示 -->
        <div v-else class="no-articles">
          <el-empty description="该分类下暂无文章" />
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
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'
import ArticleCard from '../components/common/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

// 状态
const loading = ref(true)
const categoriesLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取分类ID
const categoryId = computed(() => Number(route.params.id))

// 获取文章数据
const articles = computed(() => articleStore.articles)
const total = computed(() => articleStore.total)

// 获取分类列表
const categories = computed(() => articleStore.categories)

// 限制分类标签数量为前10个
const limitedCategories = computed(() => categories.value.slice(0, 10))

// 分类名称
const categoryName = computed(() => {
  const category = articleStore.categories.find(cat => cat.id === categoryId.value)
  return category ? category.name : '分类'
})

// 切换分类
const switchCategory = (id: number) => {
  if (id === categoryId.value) return
  router.push({ name: 'CategoryArticles', params: { id } })
}

// 加载分类文章
const loadCategoryArticles = async () => {
  if (isNaN(categoryId.value)) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    await articleStore.getArticlesByCategory(categoryId.value, currentPage.value)
  } catch (error) {
    console.error('加载分类文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载分类列表
const loadCategories = async () => {
  categoriesLoading.value = true
  try {
    await articleStore.getCategories()
  } catch (error) {
    console.error('加载分类列表失败:', error)
  } finally {
    categoriesLoading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadCategoryArticles()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadCategoryArticles()
}

// 监听路由变化
watch(() => route.params.id, async () => {
  currentPage.value = 1
  // 先加载分类列表，确保分类名称能正确获取
  await loadCategories()
  await loadCategoryArticles()
})

// 初始化
onMounted(async () => {
  // 先加载分类列表
  await loadCategories()
  // 再加载分类文章
  await loadCategoryArticles()
})
</script>

<style scoped lang="scss">
.category-page {
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
      color: #409eff;
    }
  }

  .page-description {
    color: #909399;
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .category-tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .category-tag {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      padding: 6px 16px;

      &:hover {
        transform: translateY(-2px);
      }

      .category-count {
        margin-left: 5px;
        font-size: 0.8rem;
        opacity: 0.8;
      }
    }
  }
}

.loading {
  margin-bottom: 30px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
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