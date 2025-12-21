<template>
  <div class="article-detail">
    <div class="article-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 文章内容 -->
      <div v-else-if="article" class="article-content">
        <!-- 文章头部 -->
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
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
        </header>

        <!-- 文章正文 -->
        <div class="article-body">
          <div class="markdown-body" v-html="renderedContent"></div>
        </div>

        <!-- 文章操作 -->
        <div class="article-actions">
          <button class="action-btn">
            <el-icon><Star /></el-icon>
            <span>点赞</span>
          </button>
          <button class="action-btn">
            <el-icon><Share /></el-icon>
            <span>分享</span>
          </button>
          <button class="action-btn">
            <el-icon><CopyDocument /></el-icon>
            <span>复制链接</span>
          </button>
        </div>
      </div>

      <!-- 文章不存在 -->
      <div v-else class="article-not-found">
        <el-empty description="文章不存在或已被删除" />
        <el-button type="primary" @click="$router.push('/')" style="margin-top: 20px;">
          返回首页
        </el-button>
      </div>
    </div>
    <!-- 导入评论组件 -->
    <div class="comments-section">
      <Comment :article-id="articleId" />
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import articleApi from '../api/article'
// import commentApi from '../api/comment'
import Comment from '../components/common/Comment.vue'
import { marked } from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-json'

// 初始化marked
const markedOptions: any = {
  highlight: function(code: string, lang: string): string {
    const language = Prism.languages[lang] || Prism.languages.markup
    return Prism.highlight(code, language as Prism.Grammar, lang)
  },
  breaks: true,
  gfm: true
}
marked.setOptions(markedOptions)

const route = useRoute()

// 状态变量
const article = ref<any>(null)
// const comments = ref<any[]>([])

// // 表单引用
// const commentFormRef = ref()

// // 评论表单
// const commentForm = ref({
//   content: ''
// })



// 状态
const loading = ref(true)
// const submittingComment = ref(false)
// const showLoadMore = ref(false)

// 获取文章ID
const articleId = computed(() => Number(route.params.id))

// 渲染后的内容
const renderedContent = computed(() => {
  if (!article.value || !article.value.content) return ''
  return marked(article.value.content)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 加载文章详情
const loadArticleDetail = async () => {
  if (isNaN(articleId.value)) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    // 直接调用API获取文章详情
    const articleResponse = await articleApi.getArticleDetail(articleId.value)
    article.value = articleResponse.data
    console.log(123,article.value)
    // 直接调用API获取评论
    // const commentsResponse = await commentApi.getComments(articleId.value)
    // comments.value = commentsResponse.data.comments
    // console.log(123,comments.value[0].id)
  } catch (error) {
    console.error('加载文章详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交评论
// const submitComment = async () => {
//   if (!commentFormRef.value) return

//   await commentFormRef.value.validate(async (valid: boolean) => {
//     if (valid) {
//       submittingComment.value = true
//       try {
//         await commentApi.addComment(articleId.value, commentForm.value.content)
//         // 清空表单
//         commentForm.value.content = ''
//       } catch (error) {
//         console.error('提交评论失败:', error)
//       } finally {
//         submittingComment.value = false
//       }
//     }
//   })
// }


// // 加载更多评论
// const loadMoreComments = () => {
//   // 实际项目中这里应该加载更多评论
//   showLoadMore.value = false
// }

// 监听路由变化
watch(() => route.params.id, () => {
  loadArticleDetail()
})

// 初始化
onMounted(() => {
  loadArticleDetail()
})
</script>

<style scoped lang="scss">
.article-detail {
  padding: 20px 0;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
}

.loading {
  margin: 30px 0;
}

.article-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.article-header {
  margin-bottom: 20px;
}

.article-title {
  font-size: 2rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
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
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }
  }
}

.article-cover {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;

  .cover-image {
    width: 100%;
    height: auto;
    display: block;
  }
}

.article-body {
  margin-bottom: 30px;

  .markdown-body {
    line-height: 1.8;
    color: #303133;

    h1, h2, h3, h4, h5, h6 {
      margin: 24px 0 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 {
      font-size: 2rem;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.5rem;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    h3 {
      font-size: 1.25rem;
    }

    p {
      margin-bottom: 16px;
    }

    ul, ol {
      margin: 0 0 16px 20px;
      padding-left: 20px;
    }

    li {
      margin-bottom: 8px;
    }

    blockquote {
      margin: 0 0 16px;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }

    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      padding: 0.2em 0.4em;
      font-size: 85%;
    }

    pre {
      margin: 0 0 16px;
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 6px;

      code {
        background-color: transparent;
        padding: 0;
        font-size: 100%;
        line-height: inherit;
      }
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }

    th, td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 16px 0;
    }
  }
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;

  .tag-item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    background-color: #f5f7fa;
    color: #606266;
    border-radius: 20px;
    font-size: 0.9rem;
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

.article-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #f5f7fa;
    color: #606266;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
    }
  }
}

.article-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 20px;

  .nav-item {
    flex: 1;
    min-width: 200px;

    a {
      display: flex;
      flex-direction: column;
      gap: 5px;
      color: #606266;
      transition: color 0.3s ease;

      &:hover {
        color: #409eff;
      }
    }

    .nav-label {
      font-size: 0.9rem;
      color: #909399;
    }

    .nav-title {
      font-weight: 500;
      line-height: 1.4;
    }
  }
}

.article-not-found {
  text-align: center;
  padding: 60px 0;
}

/* 评论区样式 */
.comments-section {
  max-width: 800px;
  margin: 40px auto 0;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
    margin-top: 30px;
  }
}

.comments-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;

  .el-icon {
    color: #409eff;
  }
}

.comment-form {
  margin-bottom: 40px;
}

.login-prompt {
  margin-bottom: 40px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .comment-author {
    font-weight: 600;
    color: #303133;
  }

  .comment-date {
    font-size: 0.85rem;
    color: #909399;
  }
}

.comment-body {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #303133;
}

.comment-actions {
  display: flex;
  gap: 15px;

  .comment-action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    color: #909399;
    cursor: pointer;
    font-size: 0.9rem;
    transition: color 0.3s ease;

    &:hover {
      color: #409eff;
    }

    .el-icon {
      font-size: 0.9rem;
    }
  }
}

.replies-list {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.reply-item {
  display: flex;
  gap: 10px;
}

.reply-to {
  color: #409eff;
  font-weight: 500;
}

.reply-form {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

.load-more {
  text-align: center;
}
</style>