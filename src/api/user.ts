import apiClient from './axios'

// 用户类型定义
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
  role: string
  isActive: boolean
}

// 登录请求类型
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求类型
export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 认证响应类型
export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

// 用户API服务
const userApi = {
  // 登录
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/login', data)
  },

  // 注册
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/api/auth/register', data)
  },

  // 获取当前用户信息
  getCurrentUser: async (id: number): Promise<User> => {
    return apiClient.get(`/api/users/${id}`)
  },

  // 更新用户信息
  updateUser: async (data: Partial<User>): Promise<User> => {
    return apiClient.put('/api/users/profile', data)
  },

  // 更新用户密码
  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    return apiClient.put('/api/users/password', { oldPassword: currentPassword, newPassword })
  },

  // 上传头像
  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)
    return apiClient.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
