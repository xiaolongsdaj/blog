<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': !showSidebar }">
    <div class="sidebar-content">
      <!-- 分类列表 -->
      <div class="sidebar-section">
        <div class="sidebar-title">
          <el-icon><Collection /></el-icon>
          <span>分类</span>
        </div>
        <ul class="category-list">
          <li v-for="category in categories" :key="category.id">
            <router-link 
              :to="{ name: 'Category', params: { id: category.id } }"
              class="category-item"
              :class="{ active: currentRoute.includes(`/category/${category.id}`) }"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ category.articleCount }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 标签云 -->
      <div class="sidebar-section">
        <div class="sidebar-title">
          <el-icon><Label /></el-icon>
          <span>标签云</span>
        </div>
        <div class="tag-cloud">
          <router-link 
            v-for="tag in tags" 
            :key="tag.id"
            :to="{ name: 'Tag', params: { id: tag.id } }"
            class="tag-item"
            :class="{ active: currentRoute.includes(`/tag/${tag.id}`) }"
            :style="{ fontSize: getRandomFontSize() + 'px' }"
          >
            {{ tag.name }}
            <span class="tag-count">({{ tag.articleCount }})</span>
          </router-link>
        </div>
      </div>

      <!-- 热门文章 -->
      <div class="sidebar-section">
        <div class="sidebar-title">
          <el-icon><Fire /></el-icon>
          <span>热门文章</span>
        </div>
        <ul class="hot-articles">
          <li v-for="article in hotArticles" :key="article.id">
            <router-link :to="{ name: 'ArticleDetail', params: { id: article.id } }" class="hot-article-item">
              <div class="hot-article-info">
                <h4 class="hot-article-title">{{ article.title }}</h4>
                <div class="hot-article-meta">
                  <span class="view-count">
                    <el-icon><View /></el-icon>
                    {{ article.viewCount }}
                  </span>
                  <span class="comment-count">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ article.commentCount }}
                  </span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 归档 -->
      <div class="sidebar-section">
        <div class="sidebar-title">
          <el-icon><Calendar /></el-icon>
          <span>归档</span>
        </div>
        <ul class="archive-list">
          <li v-for="archive in archives" :key="archive.year + '-' + archive.month">
            <div class="archive-item">
              <span class="archive-date">{{ archive.year }}年{{ archive.month }}月</span>
              <span class="archive-count">{{ archive.articleCount }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '../../stores/article'
import { Collection, View, ChatDotRound, Calendar } from '@element-plus/icons-vue'
import { useUIStore } from '../../stores/ui'

const uiStore = useUIStore()
const showSidebar = computed(() => uiStore.showSidebar)

const route = useRoute()
const articleStore = useArticleStore()

// 计算属性
const currentRoute = computed(() => route.path)
const categories = computed(() => articleStore.categories)
const tags = computed(() => articleStore.tags)
const articles = computed(() => articleStore.articles)

// 模拟热门文章数据（按阅读量排序）
const hotArticles = computed(() => {
  return [...articles.value]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)
})

// 模拟归档数据
const archives = ref([
  { year: 2023, month: 6, articleCount: 8 },
  { year: 2023, month: 5, articleCount: 12 },
  { year: 2023, month: 4, articleCount: 5 },
  { year: 2023, month: 3, articleCount: 10 }
])

// 随机标签字体大小，增加视觉效果
const getRandomFontSize = () => {
  return Math.floor(Math.random() * 4) + 12 // 12-15px
}

// 初始化加载数据
onMounted(() => {
  // 如果还没有加载分类和标签数据，就加载
  if (articleStore.categories.length === 0) {
    articleStore.getCategories()
  }
  if (articleStore.tags.length === 0) {
    articleStore.getTags()
  }
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding: 20px;
  overflow-y: auto;
  transition: width 0.3s ease;

  @media (max-width: 1024px) {
    display: none;
  }
}

.sidebar-collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf5ff;

  .el-icon {
    color: #409eff;
  }
}

/* 分类列表样式 */
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ecf5ff;
    color: #409eff;
  }

  &.active {
    background-color: #ecf5ff;
    color: #409eff;
    font-weight: 500;
  }
}

.category-count {
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 标签云样式 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;

  &:hover {
    background-color: #ecf5ff;
    color: #409eff;
    border-color: #d9ecff;
  }

  &.active {
    background-color: #ecf5ff;
    color: #409eff;
    border-color: #409eff;
  }
}

.tag-count {
  font-size: 11px;
  color: #909399;
}

/* 热门文章样式 */
.hot-articles {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hot-article-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-decoration: none;
  color: #303133;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff;
  }
}

.hot-article-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-article-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;

  .view-count, .comment-count {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .el-icon {
    font-size: 12px;
  }
}

/* 归档样式 */
.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.archive-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }
}

.archive-date {
  font-size: 14px;
}

.archive-count {
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 10px;
}
</style>