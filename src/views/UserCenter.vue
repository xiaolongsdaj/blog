<template>
  <div class="user-center-page">
    <div class="container">
      <div class="user-center-header">
        <h1>用户中心</h1>
      </div>

      <div class="user-center-content">
        <!-- 左侧导航 -->
        <div class="sidebar">
          <div class="user-profile">
            <el-avatar :size="120" :src="userInfo?.avatar || 'http://localhost:3000/uploads/file-1766157600984-819031621.png'" />
            <h2>{{ userInfo?.username }}</h2>
            <p class="email">{{ userInfo?.email }}</p>
          </div>

          <el-menu
            :default-active="activeTab"
            class="nav-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="articles">
              <el-icon><Document /></el-icon>
              <span>我的文章</span>
            </el-menu-item>
            <el-menu-item index="comments">
              <el-icon><ChatDotRound /></el-icon>
              <span>我的评论</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>账号设置</span>
            </el-menu-item>
          </el-menu>

          <el-button type="danger" @click="handleLogout" class="logout-btn">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>

        <!-- 右侧内容 -->
        <div class="main-content">
          <!-- 个人信息 -->
          <div v-if="activeTab === 'profile'" class="tab-content">
            <h2 class="tab-title">个人信息</h2>
            <el-form :model="userInfo" :rules="profileRules" ref="profileFormRef" label-width="120px" class="profile-form">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  :http-request="handleAvatarUpload"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserProfile">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 我的文章 -->
          <div v-if="activeTab === 'articles'" class="tab-content">
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
                      <span class="category">{{ article.category?.name || '无分类' }}</span>
                      <span class="date">{{ formatDate(article.createdAt) }}</span>
                      <span class="views">
                        <el-icon><View /></el-icon> {{ article.viewCount }}
                      </span>
                    <span class="comments">
                      <el-icon><ChatDotRound /></el-icon> {{ article.commentCount }}
                    </span>
                  </div>
                  <div class="article-tags">
                    <el-tag v-for="tag in article.tags" :key="tag.id" size="small">{{ tag.name }}</el-tag>
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
          </div>

          <!-- 我的评论 -->
          <div v-if="activeTab === 'comments'" class="tab-content">
            <h2 class="tab-title">我的评论</h2>
            <div v-if="userComments.length > 0" class="comment-list">
              <el-card
                v-for="comment in userComments"
                :key="comment.id"
                class="comment-card"
              >
                <div class="comment-content">
                  <p>{{ comment.content }}</p>
                </div>
                <div class="comment-meta">
                  <span class="date">{{ formatDate(comment.createdAt) }}</span>
                  <router-link :to="`/article/${comment.articleId}`" class="article-link">
                    {{ comment.article.title }}
                  </router-link>
                  <el-button type="danger" size="small" class="delete-btn" @click="deleteComment(comment.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </div>
              </el-card>
            </div>
            <div v-else class="empty-state">
              <el-empty description="您还没有发表任何评论" />
            </div>
            <el-pagination
              v-if="userComments.length > 0"
              layout="total, prev, pager, next"
              :total="userCommentsTotal"
              :page-size="10"
              @current-change="handlePageChange"
            />
          </div>

          <!-- 账号设置 -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <h2 class="tab-title">账号设置</h2>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px" class="settings-form">
              <el-form-item label="当前密码" prop="currentPassword">
                <el-input v-model="passwordForm.currentPassword" type="password" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

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
        <el-input
          v-model="articleForm.content"
          type="textarea"
          :rows="10"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <!-- <el-form-item label="分类">
        <el-select
          v-model="articleForm.categoryId"
          placeholder="请选择分类"
          style="width: 100%"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标签">
        <el-select
          v-model="articleForm.tags"
          multiple
          placeholder="请选择标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="状态" prop="status">
        <el-select v-model="articleForm.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="草稿" value="DRAFT" />
          <el-option label="公共" value="PUBLISHED" />
          <el-option label="私有" value="PRIVATE" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="封面图">
        <el-upload
          class="image-uploader"
          action="#"
          :show-file-list="true"
          :on-success="handleCoverUpload"
          :before-upload="beforeCoverUpload"
        >
          <el-button type="primary">
            <el-icon><Plus /></el-icon> 上传封面图
          </el-button>
        </el-upload>
        <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="cover-preview" />
      </el-form-item> -->
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showArticleModal = false">取消</el-button>
        <el-button type="primary" @click="submitArticleForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useCommentStore } from '../stores/comment'
import articleApi from '../api/article'
import type { Article } from '../api/article'
import type { Comment } from '../api/comment'

import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const commentStore = useCommentStore()


// 当前激活的标签页
const activeTab = ref('profile')

// 用户信息表单
const userInfo = reactive({
  id: userStore.userInfo?.id || 0,
  username: userStore.userInfo?.username || '',
  avatar: userStore.userInfo?.avatar,
  email: userStore.userInfo?.email
})

// 用户信息表单引用
const profileFormRef = ref()

// 用户信息表单验证规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 6, max: 20, message: '用户名长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}

// 密码修改表单
const passwordFormRef = ref()
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,20}$/, message: '密码必须包含字母,符号和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, message: '两次输入的密码不一致', trigger: 'blur' }
  ]
}

// 用户文章列表
const userArticles = ref<Article[]>([])
const userArticlesTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

// 加载用户文章
const loadUserArticles = async () => {
  if (!userStore.userInfo?.id) return
  
  loading.value = true
  try {
    const response = await articleApi.getUserArticles(userStore.userInfo.id, currentPage.value, pageSize.value)
    userArticles.value = response.data.articles
    userArticlesTotal.value = response.data.pagination.total
  } catch (error) {
    console.error('获取用户文章列表失败:', error)
    ElMessage.error('获取文章列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 用户评论列表
const userComments = ref<Comment[]>([])
const userCommentsTotal = ref(0)
const commentsLoading = ref(false)

// 加载用户评论
const loadUserComments = async () => {
  if (!userStore.userInfo?.id) return
  
  commentsLoading.value = true
  try {
    const { comments, total } = await commentStore.getUserComments(userStore.userInfo.id, currentPage.value, 10)
    userComments.value = comments
    userCommentsTotal.value = total
  } catch (error) {
    console.error('获取用户评论列表失败:', error)
    ElMessage.error('获取评论列表失败，请稍后重试')
  } finally {
    commentsLoading.value = false
  }
}

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
  status: 'DRAFT',
  categoryId: null,
  tags: []
})

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
  ]
}

// 分类和标签数据
// import type { Category, Tag } from '../api/article'
// const categories = ref<Category[]>([])
// const tags = ref<Tag[]>([])

// 加载分类和标签
// const loadCategoriesAndTags = async () => {
//   try {
//     const [categoriesResponse, tagsResponse] = await Promise.all([
//       articleApi.getCategories(),
//       articleApi.getTags()
//     ])
//     categories.value = categoriesResponse.data
//     tags.value = tagsResponse.data
//   } catch (error) {
//     console.error('获取分类和标签失败:', error)
//     ElMessage.error('获取分类和标签失败，请稍后重试')
//   }
// }

// 提交文章表单
const submitArticleForm = async () => {
  if (!articleFormRef.value) return

  await articleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (isEditing.value) {
          // 更新文章
          await articleApi.updateArticle(articleForm.id, articleForm)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          await articleApi.createArticle(articleForm)
          ElMessage.success('文章创建成功')
        }

        // 关闭模态框并重置表单
        showArticleModal.value = false
        resetArticleForm()

        // 刷新文章列表
        await loadUserArticles()
      } catch (error) {
        console.error(isEditing.value ? '更新文章失败:' : '创建文章失败:', error)
        ElMessage.error(isEditing.value ? '更新失败，请稍后重试' : '创建失败，请稍后重试')
      }
    }
  })
}

// 封面图上传成功处理
const handleCoverUpload = (_response: any, file: any) => {
  // 模拟上传成功
  articleForm.coverImage = URL.createObjectURL(file.raw)
  ElMessage.success('封面图上传成功')
}

// 封面图上传前验证
const beforeCoverUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片格式！')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
  }

  return isImage && isLt2M
}

// 编辑文章
const editArticle = async (article: Article) => {
  // 如果还没有加载分类和标签，先加载
  // if (categories.value.length === 0) {
  //   await loadCategoriesAndTags()
  // }
  
  // 填充表单数据，将status转换为大写，提取tags的ID
  Object.assign(articleForm, {
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    coverImage: article.coverImage,
    status: article.status.toUpperCase(),
    categoryId: article.categoryId,
    tags: article.tags.map(tag => tag.id)
  })
  
  // 设置为编辑模式并打开模态框
  isEditing.value = true
  showArticleModal.value = true
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
    status: 'DRAFT',
    categoryId: null,
    tags: []
  })
  
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
    // 如果当前页只有一篇文章且不是第一页，则返回上一页
    if (userArticles.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadUserArticles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 删除评论
const deleteComment = async (commentId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？此操作不可恢复！', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await commentStore.deleteComment(commentId)
    ElMessage.success('评论删除成功')
    
    // 刷新评论列表
    // 如果当前页只有一条评论且不是第一页，则返回上一页
    if (userComments.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    await loadUserComments()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}



// 更新用户信息
const updateUserProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    // 表单验证
    await profileFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        // 创建要更新的数据对象，只包含可编辑字段
        const updateData = {
          id: userInfo.id,
          email: userInfo.email,
          avatar: userInfo.avatar
          // username保持不变，不发送到后端
        }
        
        await userStore.updateUserInfo(updateData)
        ElMessage.success('个人信息更新成功')
      }
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 头像上传
const handleAvatarUpload = async (req: any) => {
  const file = req.file
  try {
    const avatarUrl = await userStore.uploadAvatar(file)
    if (avatarUrl) {
      // 更新本地用户信息
      userInfo.avatar = avatarUrl
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error('头像上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败，请稍后重试')
  }
}

// 头像上传前验证
const beforeAvatarUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片格式！')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
  }

  return isImage && isLt2M
}

// 修改密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 调用user store中的updatePassword方法
        await userStore.updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
        ElMessage.success('密码修改成功')
        // 重置表单
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        console.error('修改密码失败:', error)
        ElMessage.error('修改失败，请检查当前密码是否正确')
      }
    }
  })
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  if (activeTab.value === 'articles') {
    loadUserArticles()
  } else if (activeTab.value === 'comments') {
    loadUserComments()
  }
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

// 监听标签页变化，当切换到对应标签时加载相应数据
const handleMenuSelect = (index: string) => {
  activeTab.value = index
  if (index === 'articles') {
    loadUserArticles()
    // loadCategoriesAndTags()
  } else if (index === 'comments') {
    loadUserComments()
  }
}

// 初始化
onMounted(() => {
  // 如果用户未登录，跳转到登录页面
  if (!userStore.isLoggedIn) {
    router.push('/login')
  }

  // 获取用户信息
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.getUserInfo()
  }
  
  // 根据当前激活的标签页加载相应数据
  // if (activeTab.value === 'articles') {
  //   loadUserArticles()
  //   loadCategoriesAndTags()
  // } else if (activeTab.value === 'comments') {
  //   loadUserComments()
  // }
})

// 监听创建文章按钮点击，确保打开模态框前加载分类和标签数据
const handleCreateArticle = async () => {
  // if (categories.value.length === 0) {
  //   await loadCategoriesAndTags()
  // }
  showArticleModal.value = true
}
</script>

<style scoped lang="scss">
.user-center-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-center-header {
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #303133;
  }
}

.user-center-content {
  display: flex;
  gap: 40px;
  height: calc(100vh - 200px); /* 设置固定高度，减去头部和边距 */
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
}

/* 左侧导航 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  height: calc(100% - 40px);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    position: static;
    height: auto;
  }
}

.user-profile {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background-color: #f5f7fa;
  border-radius: 12px;

  .el-avatar {
    margin-bottom: 20px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #303133;
    margin-bottom: 10px;
  }

  .email {
    color: #909399;
    font-size: 0.9rem;
  }
}

.nav-menu {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;

  .el-menu-item {
    height: 60px;
    line-height: 60px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: #ecf5ff;
      color: #409eff;
    }

    &.is-active {
      background-color: #409eff;
      color: #fff;
    }

    .el-icon {
      font-size: 1.2rem;
      margin-right: 12px;
    }
  }
}

.logout-btn {
  width: 100%;
  height: 48px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 73, 73, 0.3);
  }
}

/* 右侧内容 */
.main-content {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 40px;
  overflow-y: auto;
  max-height: 100%;

  @media (max-width: 768px) {
    padding: 20px;
    overflow-y: visible;
    max-height: none;
  }
}

.tab-content {
  min-height: 400px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 个人信息表单 */
.profile-form {
  max-width: 600px;

  .el-form-item {
    margin-bottom: 25px;
  }

  .avatar-uploader {
    text-align: center;

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      cursor: pointer;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .article-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #303133;
      text-decoration: none;
      transition: color 0.3s ease;

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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .article-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #909399;

      .category {
        color: #409eff;
        font-weight: 500;
      }

      .el-icon {
        margin-right: 5px;
      }
    }

    .article-tags {
      display: flex;
      gap: 10px;
    }
  }
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .comment-content {
    margin-bottom: 15px;

    p {
      color: #606266;
      line-height: 1.6;
    }
  }

  .comment-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #909399;

    .article-link {
      color: #409eff;
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: #66b1ff;
      }
    }

    .delete-btn {
      margin-left: auto;
    }
  }
}

/* 设置表单 */
.settings-form {
  max-width: 600px;

  .el-form-item {
    margin-bottom: 25px;
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* 分页 */
.el-pagination {
  margin-top: 40px;
  text-align: center;
}

/* 文章模态框 */
.article-modal {
  .article-form {
    max-width: 100%;
  }

  .image-uploader {
    margin-bottom: 20px;
  }

  .cover-preview {
    max-width: 200px;
    max-height: 150px;
    border-radius: 8px;
  }
}
</style>