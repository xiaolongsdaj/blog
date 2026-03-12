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
        
        <!-- 标签标签栏 -->
        <div class="tag-tabs" v-if="limitedTags.length > 0">
          <el-tag
            v-for="tag in limitedTags"
            :key="tag.id"
            :type="tag.id === tagId ? 'success' : ''"
            :effect="tag.id === tagId ? 'dark' : 'plain'"
            class="tag-tag"
            @click="switchTag(tag.id)"
          >
            {{ tag.name }}
            
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
            tags: article.tags.map((t: any) => ({ id: t.id ?? 0, name: t.name }))
          }"
        />

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
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'
import ArticleCard from '../components/common/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

// 状态
const loading = ref(true)
const tagsLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取标签ID
const tagId = computed(() => Number(route.params.id))

// 获取文章数据
const articles = computed(() => articleStore.articles)
const total = computed(() => articleStore.total)

// 获取标签列表
const tags = computed(() => articleStore.tags)

// 限制标签数量为前10个
const limitedTags = computed(() => tags.value.slice(0, 10))

// 标签名称
const tagName = computed(() => {
  const tag = articleStore.tags.find(tag => tag.id === tagId.value)
  return tag ? tag.name : '标签'
})

// 切换标签
const switchTag = (id: number) => {
  if (id === tagId.value) return
  router.push({ name: 'TagArticles', params: { id } })
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

// 加载标签列表
const loadTags = async () => {
  tagsLoading.value = true
  try {
    await articleStore.getTags()
  } catch (error) {
    console.error('加载标签列表失败:', error)
  } finally {
    tagsLoading.value = false
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
watch(() => route.params.id, async () => {
  currentPage.value = 1
  // 先加载标签列表，确保标签名称能正确获取
  await loadTags()
  await loadTagArticles()
})

// 初始化
onMounted(async () => {
  // 先加载标签列表
  await loadTags()
  // 再加载标签文章
  await loadTagArticles()
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
    margin-bottom: 20px;
  }

  .tag-tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .tag-tag {
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      padding: 6px 16px;

      &:hover {
        transform: translateY(-2px);
      }

      .tag-count {
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