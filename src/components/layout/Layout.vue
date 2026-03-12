<template>
  <div class="layout-container">
    <Header />
    <main class="main-content">
      <div class="content-wrapper">
        <!-- <Sidebar v-if="sidebarVisible" /> -->
        <div class="main-area" :class="{ 'sidebar-hidden': !sidebarVisible }">
          <router-view />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useUIStore } from '../../stores/ui'
import { useUserStore } from '../../stores/user'

const uiStore = useUIStore()
const userStore = useUserStore()
const sidebarVisible = ref(uiStore.sidebarVisible)
const route = useRoute()

// 初始化用户信息
onMounted(async () => {  
  await userStore.initialize()
})

// 监听路由变化，隐藏移动端菜单
watch(() => route.path, () => {
  uiStore.hideMobileMenu()
  uiStore.hideSearch()
})

// 监听侧边栏显示状态
watch(() => uiStore.sidebarVisible, (newValue) => {
  sidebarVisible.value = newValue
})
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;

  @media (max-width: 768px) {
    padding: 10px;
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .content-wrapper {
    padding: 0;
  }
}

.main-area {
  flex: 1;
  transition: margin-left 0.3s ease;

  &.sidebar-hidden {
    margin-left: 0;
  }
}
</style>
