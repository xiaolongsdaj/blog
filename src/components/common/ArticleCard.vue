<template>
  <article class="article-item">
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
        <div class="categories">
          <el-icon><Collection /></el-icon>
          <template v-if="article.categories && article.categories.length > 0">
            <template v-for="(categoryItem, itemIndex) in article.categories" :key="categoryItem.id || itemIndex">
              <template v-if="categoryItem.name">
                <template v-for="(category, index) in categoryItem.name.split(/[,，]/).map((t: string) => t.trim()).filter(Boolean)" :key="index">
                  <router-link 
                    :to="{ name: 'CategoryArticles', params: { id: categoryItem.id } }"
                    class="category-tag"
                  >
                    {{ category }}
                  </router-link>
                </template>
              </template>
              <router-link v-else 
                :to="{ name: 'CategoryArticles', params: { id: categoryItem.id } }"
                class="category-tag"
              >
                {{ categoryItem.name || categoryItem }}
              </router-link>
            </template>
          </template>
          <template v-else-if="article.categories">
            <router-link 
              :to="{ name: 'CategoryArticles', params: { id: article.id } }"
              class="category-tag"
            >
          {{ article.categories[0]?.name }}
            </router-link>
          </template>
          <span v-else>无分类</span>
        </div>
        <span class="date">
          <el-icon><Calendar /></el-icon>
          {{ formatDate(article.createdAt) }}
        </span>
        <span class="views">
          <el-icon><View /></el-icon>
          {{ article.viewCount || 0 }}
        </span>
        <span class="comments">
          <el-icon><ChatDotRound /></el-icon>
          {{ article.commentCount || 0 }}
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
        <template v-for="(tagItem, itemIndex) in article.tags" :key="tagItem.id || itemIndex">
          <template v-if="tagItem.name">
            <router-link 
              v-for="(tag, index) in tagItem.name.split(/[,，]/).map((t: string) => t.trim()).filter(Boolean)" 
              :key="index"
              :to="{ name: 'TagArticles', params: { id: tagItem.id } }"
              class="tag"
              :style="{ backgroundColor: getTagColor(itemIndex * 10 + index) }"
            >
              {{ tag }}
            </router-link>
          </template>
          <router-link v-else 
            :to="{ name: 'TagArticles', params: { id: tagItem.id } }"
            class="tag"
            :style="{ backgroundColor: getTagColor(itemIndex) }"
          >
            {{ tagItem.name || tagItem }}
          </router-link>
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Collection, Calendar, View, ChatDotRound } from '@element-plus/icons-vue'

interface Article {
  id: number | string
  title: string
  summary: string
  coverImage?: string
  createdAt: string
  viewCount?: number
  commentCount?: number
  categories?: Array<{ id: number; name: string }>
  tags: Array<{ id: number; name: string }>
}

const props = defineProps<{
  article: Article
}>()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
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
</script>

<style scoped lang="scss">
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
  flex-wrap: wrap;

  .categories, .date, .views, .comments {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .categories {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .el-icon {
    font-size: 0.9rem;
  }

  .category-tag {
    display: inline-block;
    padding: 4px 12px;
    color: #606266;
    background-color: #f5f7fa;
    border-radius: 12px;
    font-size: 0.8rem;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
      transform: translateY(-2px);
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
    display: inline-block;
    padding: 6px 14px;
    color: white;
    border-radius: 20px;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
  }
}
</style>