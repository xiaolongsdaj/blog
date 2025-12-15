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
            <el-avatar :size="120" :src="userInfo?.avatar || 'https://via.placeholder.com/120'" />
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
            <el-form :model="userInfo" label-width="120px" class="profile-form">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="头像">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-success="handleAvatarUpload"
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
            <h2 class="tab-title">我的文章</h2>
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
                      <el-button type="primary" size="small">编辑</el-button>
                      <el-button type="danger" size="small">删除</el-button>
                    </div>
                  </div>
                </template>
                <div class="article-content">
                  <p class="summary">{{ article.excerpt }}</p>
                  <div class="article-meta">
                    <span class="category">{{ article.categoryName }}</span>
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
              :total="userArticles.length"
              :page-size="5"
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
                    查看文章
                  </router-link>
                  <el-button type="danger" size="small" class="delete-btn">
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
              :total="userComments.length"
              :page-size="5"
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()


// 当前激活的标签页
const activeTab = ref('profile')

// 用户信息表单
const userInfo = reactive({
  id: userStore.userInfo?.id || 0,
  username: userStore.userInfo?.username || '',
  avatar: userStore.userInfo?.avatar,
  email: userStore.userInfo?.email
})

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
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, message: '两次输入的密码不一致', trigger: 'blur' }
  ]
}

// 模拟用户文章列表
const userArticles = ref([
  {
    id: 1,
    title: 'Vue 3 新特性详解',
    excerpt: '本文详细介绍了Vue 3的主要新特性，包括Composition API、Teleport、Suspense等。',
    content: '# Vue 3 新特性详解\n\nVue 3是Vue.js的最新版本，带来了许多令人兴奋的新特性...',
    coverImage: 'https://via.placeholder.com/800x400',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T10:30:00',
    viewCount: 1234,
    commentCount: 56,
    categoryId: 1,
    categoryName: '前端技术',
    tags: [{ id: 1, name: 'Vue' }, { id: 2, name: 'JavaScript' }]
  },
  {
    id: 2,
    title: 'TypeScript 入门指南',
    excerpt: 'TypeScript是JavaScript的超集，提供了类型系统和ES6+的特性支持。',
    content: '# TypeScript 入门指南\n\nTypeScript是一种由Microsoft开发的开源编程语言...',
    coverImage: 'https://via.placeholder.com/800x400',
    createdAt: '2023-06-10T14:20:00',
    updatedAt: '2023-06-10T14:20:00',
    viewCount: 892,
    commentCount: 34,
    categoryId: 1,
    categoryName: '前端技术',
    tags: [{ id: 3, name: 'TypeScript' }, { id: 2, name: 'JavaScript' }]
  }
])

// 模拟用户评论列表
const userComments = ref([
  {
    id: 1,
    articleId: 1,
    articleTitle: 'Vue 3 新特性详解',
    content: '这篇文章写得非常好，让我对Vue 3有了更深入的了解！',
    createdAt: '2023-06-16T15:30:00',
    updatedAt: '2023-06-16T15:30:00'
  },
  {
    id: 2,
    articleId: 2,
    articleTitle: 'TypeScript 入门指南',
    content: '感谢分享，TypeScript确实是前端开发的好帮手！',
    createdAt: '2023-06-11T10:20:00',
    updatedAt: '2023-06-11T10:20:00'
  }
])

// 菜单选择
const handleMenuSelect = (index: string) => {
  activeTab.value = index
}

// 更新用户信息
const updateUserProfile = async () => {
  try {
    await userStore.updateUserInfo(userInfo)
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 头像上传
const handleAvatarUpload = (_response: any, file: any) => {
  // 模拟上传成功
  userInfo.avatar = URL.createObjectURL(file.raw)
  ElMessage.success('头像上传成功')
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
        // 模拟API请求
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
  // 这里可以添加分页逻辑
  console.log('当前页码:', page)
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
})
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

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #303133;
  }
}

.user-center-content {
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* 左侧导航 */
.sidebar {
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
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

  @media (max-width: 768px) {
    padding: 20px;
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
</style>