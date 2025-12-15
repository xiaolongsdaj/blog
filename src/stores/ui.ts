import { defineStore } from 'pinia'

interface UIState {
  sidebarVisible: boolean
  mobileMenuVisible: boolean
  searchVisible: boolean
  searchHistory: string[]
  scrollPosition: number
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    sidebarVisible: true,
    mobileMenuVisible: false,
    searchVisible: false,
    searchHistory: JSON.parse(localStorage.getItem('searchHistory') || '[]'),
    scrollPosition: 0
  }),

  actions: {
    // 切换侧边栏显示
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
    },

    // 显示侧边栏
    showSidebar() {
      this.sidebarVisible = true
    },

    // 隐藏侧边栏
    hideSidebar() {
      this.sidebarVisible = false
    },

    // 切换移动端菜单显示
    toggleMobileMenu() {
      this.mobileMenuVisible = !this.mobileMenuVisible
    },

    // 显示移动端菜单
    showMobileMenu() {
      this.mobileMenuVisible = true
    },

    // 隐藏移动端菜单
    hideMobileMenu() {
      this.mobileMenuVisible = false
    },

    // 切换搜索框显示
    toggleSearch() {
      this.searchVisible = !this.searchVisible
    },

    // 显示搜索框
    showSearch() {
      this.searchVisible = true
    },

    // 隐藏搜索框
    hideSearch() {
      this.searchVisible = false
    },

    // 添加搜索历史
    addSearchHistory(keyword: string) {
      if (!keyword.trim()) return
      
      // 移除重复项
      const index = this.searchHistory.indexOf(keyword)
      if (index > -1) {
        this.searchHistory.splice(index, 1)
      }
      
      // 添加到开头
      this.searchHistory.unshift(keyword)
      
      // 限制历史记录数量
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10)
      }
      
      // 保存到本地存储
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
    },

    // 清除搜索历史
    clearSearchHistory() {
      this.searchHistory = []
      localStorage.removeItem('searchHistory')
    },

    // 删除单个搜索历史
    deleteSearchHistory(keyword: string) {
      const index = this.searchHistory.indexOf(keyword)
      if (index > -1) {
        this.searchHistory.splice(index, 1)
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      }
    },

    // 保存滚动位置
    saveScrollPosition(position: number) {
      this.scrollPosition = position
    },

    // 重置滚动位置
    resetScrollPosition() {
      this.scrollPosition = 0
    }
  }
})
