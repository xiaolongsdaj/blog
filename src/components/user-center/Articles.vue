<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2 class="tab-title">我的文章</h2>
      <el-button type="primary" @click="handleCreateArticle">
        <el-icon><Plus /></el-icon> 创建文章
      </el-button>
    </div>
    <div v-if="userArticles.length > 0" class="article-list">
      <el-card
        v-for="article in userArticles"
        :key="article.id"
        class="article-card"
      >
        <template #header>
          <div class="card-header">
            <router-link :to="`/article/${article.id}`" class="article-title">{{ article.title }}</router-link>
            <div class="article-actions">
              <el-button type="primary" size="small" @click="editArticle(article)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteArticle(article.id)">删除</el-button>
            </div>
          </div>
        </template>
        <div class="article-content">
          <p class="summary">{{ article.summary }}</p>
          <div class="article-meta">
            <!-- <span class="category">{{ article.category?.name || '无分类' }}</span> -->
            <span class="date">{{ formatDate(article.createdAt) }}</span>
            <span class="views">
              <el-icon><View /></el-icon> {{ article.viewCount }}
            </span>
            <span class="comments">
              <el-icon><ChatDotRound /></el-icon> {{ article.commentCount }}
            </span>
          </div>
          <div class="article-tags">
            <template v-for="(tagItem, itemIndex) in article.tags" :key="itemIndex">
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
        </div>
      </el-card>
    </div>
    <div v-else class="empty-state">
      <el-empty description="您还没有发布任何文章" />
    </div>
    <el-pagination
      v-if="userArticles.length > 0"
      layout="total, prev, pager, next"
      :total="userArticlesTotal"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />

    <!-- 文章编辑/创建模态框 -->
    <el-dialog
      v-model="showArticleModal"
      :title="isEditing ? '编辑文章' : '创建文章'"
      width="80%"
      class="article-modal"
    >
      <el-form
        :model="articleForm"
        :rules="articleRules"
        ref="articleFormRef"
        label-width="120px"
        class="article-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="tiptap-editor" style="position: relative; z-index: 1;">
            <EditorContent :editor="editor" class="editor-content" />
            <div class="editor-toolbar">
              <!-- 文字样式 -->
              <button 
                @click.prevent="editor?.commands.toggleBold()"
                :class="{ active: editor?.isActive('bold') }"
                class="toolbar-button"
                title="粗体"
              >
                B
              </button>
              <button 
                @click.prevent="editor?.commands.toggleItalic()"
                :class="{ active: editor?.isActive('italic') }"
                class="toolbar-button"
                title="斜体"
              >
                I
              </button>
              <button 
                @click.prevent="editor?.commands.toggleUnderline()"
                :class="{ active: editor?.isActive('underline') }"
                class="toolbar-button"
                title="下划线"
              >
                U
              </button>
              <button 
                @click.prevent="editor?.commands.toggleStrike()"
                :class="{ active: editor?.isActive('strike') }"
                class="toolbar-button"
                title="删除线"
              >
                S
              </button>
              <button 
                @click.prevent="editor?.commands.toggleCode()"
                :class="{ active: editor?.isActive('code') }"
                class="toolbar-button"
                title="行内代码"
              >
                <code>{}</code>
              </button>
              
              <!-- 分割线 -->
              <div class="toolbar-divider"></div>
              
              <!-- 标题与段落 -->
              <button 
                @click.prevent="editor?.commands.toggleHeading({ level: 1 })"
                :class="{ active: editor?.isActive('heading', { level: 1 }) }"
                class="toolbar-button"
                title="一级标题"
              >
                H1
              </button>
              <button 
                @click.prevent="editor?.commands.toggleHeading({ level: 2 })"
                :class="{ active: editor?.isActive('heading', { level: 2 }) }"
                class="toolbar-button"
                title="二级标题"
              >
                H2
              </button>
              <button 
                @click.prevent="editor?.commands.toggleHeading({ level: 3 })"
                :class="{ active: editor?.isActive('heading', { level: 3 }) }"
                class="toolbar-button"
                title="三级标题"
              >
                H3
              </button>
              <button 
                @click.prevent="editor?.commands.setParagraph()"
                :class="{ active: editor?.isActive('paragraph') }"
                class="toolbar-button"
                title="普通段落"
              >
                P
              </button>
              
              <!-- 分割线 -->
              <div class="toolbar-divider"></div>
              
              <!-- 列表功能 -->
              <button 
                @click.prevent="editor?.commands.toggleBulletList()"
                :class="{ active: editor?.isActive('bulletList') }"
                class="toolbar-button"
                title="无序列表"
              >
                •
              </button>
              <button 
                @click.prevent="editor?.commands.toggleOrderedList()"
                :class="{ active: editor?.isActive('orderedList') }"
                class="toolbar-button"
                title="有序列表"
              >
                1.
              </button>
              <button 
                @click.prevent="editor?.commands.toggleTaskList()"
                :class="{ active: editor?.isActive('taskList') }"
                class="toolbar-button"
                title="任务列表"
              >
                ✓
              </button>
              
              <!-- 分割线 -->
              <div class="toolbar-divider"></div>
              
              <!-- 插入内容 -->
              <button 
                @click.prevent="insertImage()"
                class="toolbar-button"
                title="插入图片"
              >
                🖼️
              </button>
              <button 
                @click.prevent="insertLink()"
                class="toolbar-button"
                title="插入链接"
              >
                🔗
              </button>
              <button 
                @click.prevent="editor?.commands.toggleBlockquote()"
                :class="{ active: editor?.isActive('blockquote') }"
                class="toolbar-button"
                title="引用块"
              >
                ">
              </button>
              <button 
                @click.prevent="editor?.commands.toggleCodeBlock()"
                :class="{ active: editor?.isActive('codeBlock') }"
                class="toolbar-button"
                title="代码块"
              >
                {}
              </button>
              <button 
                @click.prevent="editor?.commands.setHorizontalRule()"
                class="toolbar-button"
                title="分割线"
              >
                ─
              </button>
              <!-- 分割线 -->
              <div class="toolbar-divider"></div>
              
              <!-- 工具类 -->
              <button 
                @click.prevent="editor?.commands.undo()"
                class="toolbar-button"
                title="撤销"
              >
                ↩️
              </button>
              <button 
                @click.prevent="editor?.commands.redo()"
                class="toolbar-button"
                title="重做"
              >
                ↪️
              </button>
              <button 
                @click.prevent="editor?.commands.setContent('')"
                class="toolbar-button"
                title="清除内容"
              >
                🗑️
              </button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="articleForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="公共" value="PUBLISHED" />
            <el-option label="私有" value="PRIVATE" />
            <el-option label="草稿" value="DRAFT" />
          </el-select>
        </el-form-item>

        <el-form-item label="可见性" prop="visibility">
          <el-switch
            v-model="articleForm.visibility"
            active-value="PUBLIC"
            inactive-value="PRIVATE"
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item label="分类" prop="categories">
          <el-input
            v-model="categoryInput"
            placeholder="请输入分类，多个分类用逗号分隔"
            style="width: 100%"
            @blur="handleCategoryInput"
          />
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-input
            v-model="tagInput"
            placeholder="请输入标签，多个标签用逗号分隔"
            style="width: 100%"
            @blur="handleTagInput"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showArticleModal = false">取消</el-button>
          <el-button type="primary" @click="submitArticleForm">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import articleApi from '../../api/article'
import type { Article } from '../../api/article'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Image } from '@tiptap/extension-image'
import { TextAlign } from '@tiptap/extension-text-align'

const props = defineProps<{
  userId: number
}>()

const emit = defineEmits<{
  refresh: []
}>()


// 用户文章列表
const userArticles = ref<Article[]>([])
const userArticlesTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 分类和标签列表

// 文章模态框相关
const showArticleModal = ref(false)
const isEditing = ref(false)
const articleFormRef = ref()

// 文章表单数据
const articleForm = reactive({
  id: 0,
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  status: 'PUBLISHED',
  visibility: 'PUBLIC',
  categories: [] as string[],
  tags: [] as string[]
})

// 分类和标签输入
const categoryInput = ref('')
const tagInput = ref('')

// 富文本编辑器实例
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      },
      link: {
        openOnClick: true
      }
    }),
    TaskList,
    TaskItem.configure({
      nested: true
    }),
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    })
  ],
  content: '',
  onUpdate: ({ editor: currentEditor }) => {
    articleForm.content = currentEditor.getHTML()
  }
})

// 监听文章表单内容变化，同步到编辑器
watch(
  () => articleForm.content,
  (newContent) => {
    
    if (editor && editor.value) {
    
      
      // 移除初始化状态检查，直接尝试设置内容
      try {
        editor.value.commands.setContent(newContent || '')
      } catch (error) {
      }
    } else {
    }
  }
)

// 文章表单验证规则
const articleRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '摘要长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 20, message: '内容长度不能少于 20 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择文章状态', trigger: 'change' }
  ],
}

// 加载用户文章
const loadUserArticles = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const response = await articleApi.getUserArticles(props.userId, currentPage.value, pageSize.value)
    userArticles.value = response.data.articles
    userArticlesTotal.value = response.data.pagination.total
  } catch (error) {
    console.error('获取用户文章列表失败:', error)
    ElMessage.error('获取文章列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理分类输入
const handleCategoryInput = () => {
  // 分割输入的分类，去除空格和空字符串
  articleForm.categories = categoryInput.value.split(',').map(item => item.trim()).filter(Boolean)
  console.log('分类输入:', articleForm.categories)
}

// 处理标签输入
const handleTagInput = () => {
  // 分割输入的标签，去除空格和空字符串
  articleForm.tags = tagInput.value.split(',').map(item => item.trim()).filter(Boolean)
  console.log('标签输入:', articleForm.tags)
}

// 提交文章表单
const submitArticleForm = async () => {
  if (!articleFormRef.value) return

  await articleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 准备提交的数据
        const submitData = {
          title: articleForm.title,
          content: articleForm.content,
          summary: articleForm.summary,
          status: articleForm.status,
          visibility: articleForm.visibility,
          categories: articleForm.categories,
          tags: articleForm.tags.map(tag => ({
            name: tag
          }))
        }

        if (isEditing.value) {
          // 更新文章
          await articleApi.updateArticle(articleForm.id, submitData)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          await articleApi.createArticle(submitData)
          ElMessage.success('文章创建成功')
        }

        // 关闭模态框并重置表单
        showArticleModal.value = false
        resetArticleForm()

        // 刷新文章列表
        await loadUserArticles()
        emit('refresh')
      } catch (error) {
        console.error(isEditing.value ? '更新文章失败:' : '创建文章失败:', error)
        ElMessage.error(isEditing.value ? '更新失败，请稍后重试' : '创建失败，请稍后重试')
      }
    }
  })
}

// 编辑文章
const editArticle = async (article: Article) => {
  
  // 提取分类名称
  const categoryNames = article.categoryId ? article.categoryId.toString() : '无分类'
  
  // 提取标签名称
  const tagNames = article.tags ? article.tags.map(tag => tag.name).join(', ') : ''
  
  // 填充表单数据，将status转换为大写
  Object.assign(articleForm, {
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    coverImage: article.coverImage,
    status: article.status.toUpperCase(),
    visibility: (article as any).visibility !== undefined ? (article as any).visibility : (article.isPrivate ? 'PRIVATE' : 'PUBLIC'),
    categories: article.categoryId ? [article.categoryId] : [],
    tags: article.tags ? article.tags.map(tag => tag.name) : []
  })
  
  // 填充分类和标签输入框
  categoryInput.value = categoryNames
  tagInput.value = tagNames
  
  // 设置为编辑模式并打开模态框
  isEditing.value = true
  showArticleModal.value = true
  
  // 等待模态框渲染完成后，设置编辑器内容
  setTimeout(() => {
    
    if (editor && editor.value) {
      
      
      // 尝试直接设置编辑器内容，不依赖初始化状态
      try {
        // 先清空内容，再设置新内容
        editor.value.commands.setContent('')
        editor.value.commands.setContent(article.content || '')
        
        // 强制更新表单中的content字段
        articleForm.content = article.content || ''
       
        
        // 检查设置后的内容
        setTimeout(() => {
          if (editor && editor.value) {
            
          }
        }, 500)
      } catch (error) {
        
        
        // 备选方案：直接更新articleForm.content，通过watch同步
        articleForm.content = article.content || ''
        
      }
    } else {
      
    }
  }, 2000)
}

// 重置文章表单
const resetArticleForm = () => {
  if (articleFormRef.value) {
    articleFormRef.value.resetFields()
  }
  
  // 重置表单数据
  Object.assign(articleForm, {
    id: 0,
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    categories: [],
    tags: []
  })
  
  // 重置输入框
  categoryInput.value = ''
  tagInput.value = ''
  
  // 重置编辑器内容
  if (editor && editor.value) {
    editor.value?.commands.setContent('')
  }
  
  // 设置为创建模式
  isEditing.value = false
}

// 删除文章
const deleteArticle = async (articleId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复！', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await articleApi.deleteArticle(articleId)
    ElMessage.success('文章删除成功')
    
    // 刷新文章列表
    if (userArticles.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadUserArticles()
    emit('refresh')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadUserArticles()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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

// 插入图片
const insertImage = () => {
  if (!editor) return
  
  const src = prompt('请输入图片URL:')
  if (src) {
    editor.value?.commands.setImage({ src })
  }
}

// 插入链接
const insertLink = () => {
  if (!editor) return
  
  const href = prompt('请输入链接URL:')
  if (href) {
    const text = prompt('请输入链接文本:') || href
    editor.value?.commands.insertContent({
      type: 'text',
      text,
      marks: [{
        type: 'link',
        attrs: { href }
      }]
    })
  }
}


// 监听创建文章按钮点击
const handleCreateArticle = async () => {
  // 重置表单，确保创建新文章时表单为空
  resetArticleForm()
  showArticleModal.value = true
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadUserArticles()
})
</script>

<style scoped lang="scss">
.tab-content {
  min-height: 400px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
  margin: 0;
}

.article-list {
  margin-bottom: 20px;
}

.article-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .article-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #303133;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 70%;

    &:hover {
      color: #409eff;
    }
  }

  .article-actions {
    display: flex;
    gap: 10px;
  }
}

.article-content {
  .summary {
    color: #606266;
    line-height: 1.6;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    align-items: center;
    color: #909399;
    font-size: 0.9rem;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 10px;

    .category {
      background-color: #ecf5ff;
      color: #409eff;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .views, .comments {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .article-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .tag-item {
      display: inline-block;
      padding: 4px 12px;
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }
    }
  }
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.article-modal {
  .article-form {
    .cover-preview {
      max-width: 200px;
      margin-top: 10px;
      border-radius: 8px;
    }
    
    .tiptap-editor {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }
    
    .editor-content {
      min-height: 400px;
      max-height: 600px;
      overflow-y: auto;
      padding: 10px;
      background-color: white;
      position: relative;
      z-index: 1;
    }
    
    .editor-content :deep(.ProseMirror) {
      min-height: 380px;
      outline: none;
    }
    
    .editor-toolbar {
      display: flex;
      gap: 8px;
      padding: 10px;
      background-color: #f5f7fa;
      border-top: 1px solid #dcdfe6;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }
    
    .toolbar-button {
      padding: 6px 12px;
      border: 1px solid #dcdfe6;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      min-width: 40px;
      text-align: center;
      color: #303133;
      font-weight: 500;
      
      &:hover {
        background-color: #ecf5ff;
        border-color: #c6e2ff;
        color: #409eff;
      }
      
      &.active {
        background-color: #409eff;
        color: white;
        border-color: #409eff;
      }
    }
    
    .toolbar-divider {
      width: 1px;
      height: 24px;
      background-color: #dcdfe6;
      margin: 0 8px;
    }
  }
}
</style>