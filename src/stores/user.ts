import { defineStore } from 'pinia'
import userApi from '../api/user'
import type { User } from '../api/user'
import type { LoginRequest } from '../api/user'
import type { RegisterRequest } from '../api/user'

interface UserState {
  userInfo: User | null
  token: string | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: (() => {
      const storedUserInfo = localStorage.getItem('userInfo');
      try {
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
      } catch {
        // 处理无效的JSON数据
        localStorage.removeItem('userInfo');
        return null;
      }
    })(),
    token: localStorage.getItem('accessToken'),
    isLoggedIn: !!localStorage.getItem('accessToken')
  }), 

  actions: {
    // 登录
    async login(username: string, password: string) {
      try {
        const loginData: LoginRequest = { username, password }
        
        const response = await userApi.login(loginData)
        console.log('登录响应数据:', response)
        
        // 正确处理响应数据
        const { accessToken, user } = response.data || {}
        console.log('登录成功:', response.data?.accessToken)
        
        this.token = accessToken
        this.userInfo = user
        this.isLoggedIn = true

        // 保存token和userInfo到本地存储
        localStorage.setItem('accessToken', accessToken)
        if (user) {
          localStorage.setItem('userInfo', JSON.stringify(user))
        }

        return true
      } catch (error) {
        console.error('登录失败:', error)
        return false
      }
    },

    // 注册
    async register(username: string, email: string, password: string, confirmPassword: string) {
      try {
        const registerData: RegisterRequest = { username, email, password, confirmPassword }
        const response = await userApi.register(registerData)
        
        const { accessToken, user } = response.data || {}
        
        this.token = accessToken
        this.userInfo = user
        this.isLoggedIn = true

        // 保存token和userInfo到本地存储
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('userInfo', JSON.stringify(user))

        return true
      } catch (error) {
        console.error('注册失败:', error)
        return false
      }
    },

    // 退出登录
    logout() {
      this.token = null
      this.userInfo = null
      this.isLoggedIn = false

      // 清除本地存储中的token和userInfo
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    },

    // 获取用户信息
    async getUserInfo() {
      const token = this.token || localStorage.getItem('accessToken')
      if (!token) return null
      try {
        let userId = this.userInfo?.id
        console.log('当前用户ID:', userId)
        if (!userId) {
          const storedUserInfo = localStorage.getItem('userInfo')
          if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo)
            userId = parsedUserInfo.id
          }
        }
        
        if (!userId) {
          console.error('获取用户信息失败: 无法获取用户ID')
          return null
        }
        
        const response = await userApi.getCurrentUser(userId)
        // 处理头像URL，确保只存储相对路径
        if (response.avatar && response.avatar.includes('http')) {
          response.avatar = response.avatar.replace('http://localhost:3000', '')
        }
        this.userInfo = response
        // 更新localStorage中的用户信息
        localStorage.setItem('userInfo', JSON.stringify(response))
        return response
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },

    // 更新用户信息
    async updateUserInfo(userData: Partial<User>) {
      try {
        const response = await userApi.updateUser(userData)
        this.userInfo = response
        // 更新localStorage中的用户信息
        localStorage.setItem('userInfo', JSON.stringify(response))
        return response
      } catch (error) {
        console.error('更新用户信息失败:', error)
        return null
      }
    },

    // 更新密码
    async updatePassword(currentPassword: string, newPassword: string) {
      try {
        await userApi.updatePassword(currentPassword, newPassword)
        return true
      } catch (error) {
        console.error('更新密码失败:', error)
        return false
      }
    },

    // 上传头像
    async uploadAvatar(file: File) {
      try {
        // 导入 uploadApi 以避免循环依赖
        const { default: uploadApi } = await import('../api/upload')
        const response = await uploadApi.uploadImage(file)
        if (response.success && this.userInfo) {
          // 处理头像URL，确保只存储相对路径
          const avatarUrl = response.data.url
          this.userInfo.avatar = avatarUrl.includes('http') ? avatarUrl.replace('http://localhost:3000', '') : avatarUrl
          // 更新localStorage中的用户信息
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        }
        return response.success ? (response.data.url.includes('http') ? response.data.url.replace('http://localhost:3000', '') : response.data.url) : null
      } catch (error) {
        console.error('上传头像失败:', error)
        return null
      }
    }
  }
})
