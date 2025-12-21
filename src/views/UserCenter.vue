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
            <Profile 
              :initial-user-info="userInfo as any"
              @update="updateUserInfo"
              @refresh="refreshData"
            />
          </div>

          <!-- 我的文章 -->
          <div v-if="activeTab === 'articles'" class="tab-content">
            <Articles 
              :user-id="userStore.userInfo?.id || 0"
              @refresh="refreshData"
            />
          </div>

          <!-- 我的评论 -->
          <div v-if="activeTab === 'comments'" class="tab-content">
            <Comments 
              :user-id="userStore.userInfo?.id || 0"
              @refresh="refreshData"
            />
          </div>

          <!-- 账号设置 -->
          <div v-if="activeTab === 'settings'" class="tab-content">
            <Settings @refresh="refreshData" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

// 导入组件
import Profile from '../components/user-center/Profile.vue'
import Articles from '../components/user-center/Articles.vue'
import Comments from '../components/user-center/Comments.vue'
import Settings from '../components/user-center/Settings.vue'

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

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeTab.value = key
}

// 更新用户信息
const updateUserInfo = (updatedInfo: any) => {
  Object.assign(userInfo, updatedInfo)
}

// 刷新数据
const refreshData = () => {
  userStore.getUserInfo()
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/')
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

// 监听用户信息变化
watch(
  () => userStore.userInfo,
  (newInfo) => {
    if (newInfo) {
      Object.assign(userInfo, newInfo)
    }
  },
  { deep: true }
)


</script>

<style scoped lang="scss">
.user-center-page {
  padding: 40px 0;
  min-height: 700px;

  @media (max-width: 1024px) {
    padding: 30px 0;
  }

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    padding: 15px 0;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
}

.user-center-header {
  margin-bottom: 40px;
  text-align: center;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #303133;
  }

  @media (max-width: 1024px) {
    margin-bottom: 30px;

    h1 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 25px;

    h1 {
      font-size: 1.6rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;

    h1 {
      font-size: 1.4rem;
    }
  }
}

.user-center-content {
  display: flex;
  gap: 40px;
  min-height: 700px; /* 使用最小高度替代固定高度 */
  overflow: hidden;

  @media (max-width: 1024px) {
    gap: 30px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    overflow: visible;
  }
}

/* 左侧导航 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
  height: 700px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    width: 240px;
    height: 700px;
  }

  @media (max-width: 768px) {
    width: 100%;
    position: static;
    height: 700px;
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
  min-width: 0; /* 确保内容区域可以正确收缩 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 40px;
  overflow-y: auto;
  height: 700px; /* 占满父容器高度 */

  @media (max-width: 1024px) {
    padding: 30px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    overflow-y: visible;
    height: 700px;
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