<template>
  <header class="header">
    <div class="header-container">
      <div class="header-left">
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <el-icon><Menu /></el-icon>
        </button>
        
        <!-- Logo -->
        <router-link to="/" class="logo">
          <el-icon><Document /></el-icon>
          <span>个人博客</span>
        </router-link>
      </div>
      
      <!-- 桌面端导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: currentRoute === '/' }">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/category" class="nav-item" :class="{ active: currentRoute.includes('/category') }">
          <el-icon><Collection /></el-icon>
          <span>分类</span>
        </router-link>
        <router-link to="/tag" class="nav-item" :class="{ active: currentRoute.includes('/tag') }">
          <el-icon><Box /></el-icon>
          <span>标签</span>
        </router-link>
        <router-link to="/about" class="nav-item" :class="{ active: currentRoute === '/about' }">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </router-link>
      </nav>
      
      <div class="header-right">

        <!-- 搜索按钮 -->
        <button class="search-btn" >
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            clearable
            @keyup.enter="handleSearch"
            size="small"
          >
            <template #append>
              <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
            </template>
          </el-input>
        </button>
        
        <!-- 星盘时钟按钮 -->
        <!-- <button class="astrolabe-btn" @click="handleAstrolabe">
          <el-icon><Star /></el-icon>
        </button> -->
        
        <!-- 用户菜单 -->
        <div class="user-menu">
          <template v-if="userStore.isLoggedIn">
            <!-- 登录后显示用户头像和下拉菜单 -->
            <el-dropdown>
              <div class="user-avatar">
                <el-avatar :src="userStore.userInfo?.avatar" size="small">{{ userStore.userInfo?.username?.[0] || 'U' }}</el-avatar>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user">
                      <el-icon><User /></el-icon>
                      <span>个人中心</span>
                    </router-link>
                  </el-dropdown-item>
                  
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <!-- 未登录显示登录/注册按钮 -->
            <router-link to="/login" class="login-btn">
              <el-button type="text">登录</el-button>
            </router-link>
            <router-link to="/register" class="register-btn">
              <el-button type="primary" size="small">注册</el-button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 移动端导航菜单 -->
    <div class="mobile-nav" :class="{ visible: mobileMenuVisible }">
      <div class="mobile-nav-content">
        <nav class="mobile-nav-menu">
          <router-link to="/" class="mobile-nav-item" @click="hideMobileMenu">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </router-link>
          <router-link to="/category" class="mobile-nav-item" @click="hideMobileMenu">
            <el-icon><Collection /></el-icon>
            <span>分类</span>
          </router-link>
          <router-link to="/tag" class="mobile-nav-item" @click="hideMobileMenu">
            <el-icon><Box /></el-icon>
            <span>标签</span>
          </router-link>
          <router-link to="/about" class="mobile-nav-item" @click="hideMobileMenu">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </router-link>
          <!-- <div class="mobile-nav-item" @click="handleAstrolabe">
            <el-icon><Star /></el-icon>
          </div> -->
        </nav>
        
        <div class="mobile-user-menu">
          <template v-if="userStore.isLoggedIn">
            <router-link to="/user" class="mobile-nav-item" @click="hideMobileMenu">
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </router-link>
            <div class="mobile-nav-item" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-nav-item" @click="hideMobileMenu">
              <el-icon><User /></el-icon>
              <span>登录</span>
            </router-link>
            <router-link to="/register" class="mobile-nav-item" @click="hideMobileMenu">
              <el-icon><UserFilled /></el-icon>
              <span>注册</span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 星盘时钟全屏容器 -->
    <!-- <div v-if="astrolabeVisible" class="astrolabe-fullscreen" ref="astrolabeContainer">
      <Wallpaper />
    </div> -->
    
    <!-- 遮罩层 -->
    <!-- <div class="overlay" v-if="mobileMenuVisible || searchVisible" @click="closeOverlay"></div> -->
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useUIStore } from '../../stores/ui'
// import Wallpaper from '../common/Wallpaper.vue'
import { 
  Menu, 
  Document, 
  House,
  Collection, 
  InfoFilled, 
  Search, 
  User, 
  SwitchButton, 
  UserFilled,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const uiStore = useUIStore()

const searchKeyword = ref('')
const currentRoute = computed(() => route.path)
const mobileMenuVisible = computed(() => uiStore.mobileMenuVisible)
// const searchVisible = computed(() => uiStore.searchVisible)
// const astrolabeVisible = ref(false)
// const astrolabeContainer = ref<HTMLElement | null>(null)

// 页面加载时，如果有token但没有用户信息，自动获取用户信息
onMounted(() => {
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.getUserInfo()
  }
  // 添加事件监听
  // document.addEventListener('keydown', handleKeydown)
  // document.addEventListener('fullscreenchange', handleFullscreenChange)
  // document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  // document.addEventListener('msfullscreenchange', handleFullscreenChange)
})

// onUnmounted(() => {
//   // 移除事件监听
//   document.removeEventListener('keydown', handleKeydown)
//   document.removeEventListener('fullscreenchange', handleFullscreenChange)
//   document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
//   document.removeEventListener('msfullscreenchange', handleFullscreenChange)
//   // 退出全屏
//   if (astrolabeVisible.value) {
//     exitFullscreen()
//   }
// })

// 监听用户信息变化
watch(
  () => userStore.userInfo,
  (newInfo) => {
    console.log('Header组件 - 用户信息已更新:', newInfo)
  },
  { deep: true }
)

// 切换移动端菜单显示
const toggleMobileMenu = () => {
  uiStore.toggleMobileMenu()
}

// 隐藏移动端菜单
const hideMobileMenu = () => {
  uiStore.hideMobileMenu()
}

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    // 添加到搜索历史
    uiStore.addSearchHistory(searchKeyword.value)
    // 隐藏搜索框
    uiStore.hideSearch()
    // 清空搜索关键词
    searchKeyword.value = ''
    // 跳转到搜索页面，使用search作为查询参数
    router.push({ name: 'Search', query: { search: searchKeyword.value } })
  }
}

// 处理退出登录
const handleLogout = () => {
  userStore.logout()
  hideMobileMenu()
  router.push('/')
}

// 进入全屏
// const enterFullscreen = (element: HTMLElement) => {
//   if (element.requestFullscreen) {
//     element.requestFullscreen()
//   } else if (element.webkitRequestFullscreen) {
//     element.webkitRequestFullscreen()
//   } else if (element.msRequestFullscreen) {
//     element.msRequestFullscreen()
//   }
// }

// 退出全屏
// const exitFullscreen = () => {
//   if (document.exitFullscreen) {
//     document.exitFullscreen()
//   } else if (document.webkitExitFullscreen) {
//     document.webkitExitFullscreen()
//   } else if (document.msExitFullscreen) {
//     document.msExitFullscreen()
//   }
// }

// 处理星盘时钟
// const handleAstrolabe = () => {
//   hideMobileMenu()
//   astrolabeVisible.value = true
//   // 延迟一下，确保DOM已经渲染
//   setTimeout(() => {
//     if (astrolabeContainer.value) {
//       enterFullscreen(astrolabeContainer.value)
//     }
//   }, 100)
// }

// 监听ESC键
// const handleKeydown = (event: KeyboardEvent) => {
//   if (event.key === 'Escape' && astrolabeVisible.value) {
//     astrolabeVisible.value = false
//     exitFullscreen()
//   }
// }

// 监听全屏变化
// const handleFullscreenChange = () => {
//   if (!document.fullscreenElement && astrolabeVisible.value) {
//     astrolabeVisible.value = false
//   }
// }

// 关闭遮罩层
// const closeOverlay = () => {
//   uiStore.hideMobileMenu()
//   uiStore.hideSearch()
// }


</script>

<style scoped lang="scss">
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;

  .el-icon {
    font-size: 20px;
    color: #409eff;
  }
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
}

.nav-menu {
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
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
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.search-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #606266;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }
}

.astrolabe-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d9ecff;
    border-color: #409eff;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
}

.search-box {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  opacity: 0;
  transition: all 0.3s ease;
  overflow: hidden;

  &.visible {
    width: 200px;
    opacity: 1;

    @media (max-width: 768px) {
      width: 150px;
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-btn, .register-btn {
  padding: 0;
}

.user-avatar {
  cursor: pointer;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #606266;

  &:hover {
    color: #409eff;
  }
}

/* 移动端导航菜单 */
.mobile-nav {
  position: fixed;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100vh;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 200;
  transition: left 0.3s ease;

  &.visible {
    left: 0;
  }
}

.mobile-nav-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #ecf5ff;
    color: #409eff;
  }
}

.mobile-user-menu {
  border-top: 1px solid #ebeef5;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

/* 星盘时钟全屏容器 */
.astrolabe-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #0a0a2a;
  overflow: hidden;
}

/* 全屏状态下的样式 */
:fullscreen .astrolabe-fullscreen {
  width: 100%;
  height: 100%;
}

:-webkit-full-screen .astrolabe-fullscreen {
  width: 100%;
  height: 100%;
}

:-ms-fullscreen .astrolabe-fullscreen {
  width: 100%;
  height: 100%;
}
</style>
