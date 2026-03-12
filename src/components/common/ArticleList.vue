<template>
  <div class="article-list-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空状态 -->
    <div v-else-if="articles.length === 0" class="empty-state">
      <el-empty description="暂无文章" />
    </div>

    <!-- 文章列表 -->
    <div v-else class="articles-wrapper">
      <el-card
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        hoverable
      >
        <!-- 文章封面图 -->
        <div v-if="article.coverImage" class="article-cover">
          <el-image
            :src="article.coverImage"
            :lazy="true"
            fit="cover"
          ></el-image>
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <!-- 文章标题 -->
          <h3 class="article-title">
            <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
          </h3>

          <!-- 文章摘要 -->
          <p class="article-summary">{{ article.summary }}</p>

          <!-- 文章标签 -->
          <div v-if="article.tags && article.tags.length > 0" class="article-tags">
            <template v-for="(tagItem, itemIndex) in article.tags" :key="tagItem.id || itemIndex">
              <template v-if="tagItem.name">
                <span 
                  v-for="(tag, index) in tagItem.name.split(/[,，]/).map(t => t.trim()).filter(Boolean)" 
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

          <!-- 文章元数据 -->
          <div class="article-meta">
            <span class="category" :to="`/category/${article.categoryId}`">
              <el-icon><Folder /></el-icon> {{ article.categoryName }}
            </span>
            <span class="date">
              <el-icon><Calendar /></el-icon> {{ formatDate(article.createdAt) }}
            </span>
            <span class="views">
              <el-icon><View /></el-icon> {{ article.viewCount }}
            </span>
            <span class="comments">
              <el-icon><ChatDotRound /></el-icon> {{ article.commentCount }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页组件 -->
    <div v-if="total > 0 && pageSize > 0" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义组件属性
interface Props {
  articles: Array<{
    id: number
    title: string
    summary: string
    content: string
    coverImage?: string
    createdAt: string
    updatedAt: string
    viewCount: number
    commentCount: number
    categoryId: number
    categoryName: string
    tags: Array<{ id: number; name: string }>
  }>
  total: number
  loading?: boolean
  page?: number
  pageSize?: number
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  page: 1,
  pageSize: 10
})

// 定义事件
const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>()



// 当前页码和每页大小
const currentPage = computed({
  get: () => props.page,
  set: (value) => emit('update:page', value)
})

const pageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:pageSize', value)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
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

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 处理每页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
}
</script>

<style scoped lang="scss">
.article-list-container {
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 10px 0;
  }
}

.loading-state {
  padding: 40px 0;
}

.empty-state {
  padding: 60px 0;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
}

.articles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }
}

.article-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .article-cover {
    width: 100%;
    height: 240px;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    @media (max-width: 992px) {
      height: 200px;
    }

    @media (max-width: 768px) {
      height: 180px;
    }

    @media (max-width: 480px) {
      height: 150px;
    }
  }

  .article-content {
    padding: 24px;

    @media (max-width: 992px) {
      padding: 22px;
    }

    @media (max-width: 768px) {
      padding: 20px;
    }

    @media (max-width: 480px) {
      padding: 16px;
    }
  }

  .article-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
    line-height: 1.4;
    transition: color 0.3s ease;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: #409eff;
      }
    }

    @media (max-width: 992px) {
      font-size: 1.35rem;
    }

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }

    @media (max-width: 480px) {
      font-size: 1.15rem;
      margin-bottom: 12px;
    }
  }

  .article-summary {
    color: #606266;
    line-height: 1.7;
    margin-bottom: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    @media (max-width: 480px) {
      margin-bottom: 12px;
      line-height: 1.6;
    }
  }

  .article-tags {
    margin-bottom: 16px;

    .tag-item {
      display: inline-block;
      padding: 4px 12px;
      margin-right: 8px;
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }
    }

    @media (max-width: 768px) {
      margin-bottom: 12px;

      .tag-item {
        margin-right: 6px;
        font-size: 0.8rem;
        padding: 3px 10px;
      }
    }

    @media (max-width: 480px) {
      .tag-item {
        margin-right: 4px;
        font-size: 0.75rem;
        padding: 2px 8px;
      }
    }
  }

  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-size: 0.9rem;
    color: #909399;

    span {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #409eff;
      }

      .el-icon {
        font-size: 0.85rem;
      }
    }

    .category {
      color: #409eff;
      font-weight: 500;
    }

    @media (max-width: 992px) {
      gap: 16px;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      gap: 12px;
      font-size: 0.8rem;

      span {
        gap: 3px;

        .el-icon {
          font-size: 0.75rem;
        }
      }
    }

    @media (max-width: 480px) {
      gap: 10px;
      font-size: 0.75rem;
    }
  }
}

.pagination {
  margin-top: 40px;
  text-align: center;

  @media (max-width: 992px) {
    margin-top: 35px;
  }

  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 0 10px;

    .el-pagination {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    margin-top: 25px;

    .el-pagination {
      font-size: 0.8rem;
    }
  }
}
</style>