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
    userInfo: null,
    token: localStorage.getItem('token'),
    isLoggedIn: !!localStorage.getItem('token')
  }),

  actions: {
    // 登录
    async login(username: string, password: string) {
      try {
        const loginData: LoginRequest = { username, password }
        const response = await userApi.login(loginData)
        
        this.token = response.token
        this.userInfo = response.user
        this.isLoggedIn = true

        // 保存token到本地存储
        localStorage.setItem('token', response.token)

        return true
      } catch (error) {
        console.error('登录失败:', error)
        return false
      }
    },

    // 注册
    async register(username: string, email: string, password: string) {
      try {
        const registerData: RegisterRequest = { username, email, password }
        const response = await userApi.register(registerData)
        
        this.token = response.token
        this.userInfo = response.user
        this.isLoggedIn = true

        // 保存token到本地存储
        localStorage.setItem('token', response.token)

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

      // 清除本地存储中的token
      localStorage.removeItem('token')
    },

    // 获取用户信息
    async getUserInfo() {
      if (!this.token) return null

      try {
        const user = await userApi.getCurrentUser()
        this.userInfo = user
        return user
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },

    // 更新用户信息
    async updateUserInfo(userData: Partial<User>) {
      try {
        const updatedUser = await userApi.updateUser(userData)
        this.userInfo = updatedUser
        return updatedUser
      } catch (error) {
        console.error('更新用户信息失败:', error)
        return null
      }
    },

    // 更新密码
    async updatePassword(_currentPassword: string, _newPassword: string) {
      try {
        await userApi.updatePassword()
        return true
      } catch (error) {
        console.error('更新密码失败:', error)
        return false
      }
    },

    // 上传头像
    async uploadAvatar(_file: File) {
      try {
        const avatarUrl = await userApi.uploadAvatar()
        if (this.userInfo) {
          this.userInfo.avatar = avatarUrl
        }
        return avatarUrl
      } catch (error) {
        console.error('上传头像失败:', error)
        return null
      }
    }
  }
})
