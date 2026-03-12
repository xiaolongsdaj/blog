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

        // 保存token到本地存储
        localStorage.setItem('accessToken', accessToken)
        // console.log('登录后状态:', {
        //   token: this.token,
        //   userInfo: this.userInfo,
        //   isLoggedIn: this.isLoggedIn,
        //   localStorageToken: localStorage.getItem('accessToken')
        // })

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
        
        this.token = response.data?.accessToken
        this.userInfo = response.data?.user
        this.isLoggedIn = true

        // 保存token到本地存储
        if (response.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
        }

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
      localStorage.removeItem('accessToken')
    },

    // 获取用户信息
    async getUserInfo() {
      const token = this.token || localStorage.getItem('accessToken')
      if (!token) {
        return null
      }

      try {
        const response = await userApi.getCurrentUser()
        if (response && response.success && response.data) {
          this.userInfo = response.data
          this.isLoggedIn = true
          return response.data
        } else {
          return null
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },

    // 初始化用户信息
    async initialize() {
      const token = this.token || localStorage.getItem('accessToken')
      if (token) {
        await this.getUserInfo()
      } else {
      }
    },

    // 更新用户信息
    async updateUserInfo(userData: Partial<User>) {
      try {
        const response = await userApi.updateUser(userData)
        if (response && response.success && response.data) {
          this.userInfo = response.data
          return response.data
        } else {
          return null
        }
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

    // 上传头像（暂时注释，因为API未实现）
    // async uploadAvatar(file: File) {
    //   try {
    //     const response = await userApi.uploadAvatar(file)
    //     if (this.userInfo) {
    //       this.userInfo.avatar = response.avatar
    //     }
    //     return response.avatar
    //   } catch (error) {
    //     console.error('上传头像失败:', error)
    //     return null
    //   }
    // }
  }
})
