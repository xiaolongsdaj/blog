

// 用户类型定义
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
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
}

// 登录响应类型
export interface LoginResponse {
  user: User
  token: string
}

// 用户API服务
const userApi = {
  // 登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟返回数据
    const mockUser: User = {
      id: 1,
      username: data.username,
      email: 'user@example.com',
      avatar: 'https://via.placeholder.com/150',
      bio: '这是一个用户简介',
      createdAt: '2023-01-01T00:00:00',
      updatedAt: '2023-01-01T00:00:00'
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    return {
      user: mockUser,
      token: mockToken
    }
    
    // 实际API请求
    // return apiClient.post('/auth/login', data)
  },

  // 注册
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟返回数据
    const mockUser: User = {
      id: 2,
      username: data.username,
      email: data.email,
      avatar: 'https://via.placeholder.com/150',
      bio: '',
      createdAt: '2023-01-01T00:00:00',
      updatedAt: '2023-01-01T00:00:00'
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    return {
      user: mockUser,
      token: mockToken
    }
    
    // 实际API请求
    // return apiClient.post('/auth/register', data)
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟返回数据
    const mockUser: User = {
      id: 1,
      username: 'currentuser',
      email: 'user@example.com',
      avatar: 'https://via.placeholder.com/150',
      bio: '这是一个用户简介',
      createdAt: '2023-01-01T00:00:00',
      updatedAt: '2023-01-01T00:00:00'
    }
    
    return mockUser
    
    // 实际API请求
    // return apiClient.get('/user')
  },

  // 更新用户信息
  updateUser: async (data: Partial<User>): Promise<User> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 模拟返回更新后的数据
    const mockUser: User = {
      id: 1,
      username: data.username || 'currentuser',
      email: data.email || 'user@example.com',
      avatar: data.avatar || 'https://via.placeholder.com/150',
      bio: data.bio || '这是一个用户简介',
      createdAt: '2023-01-01T00:00:00',
      updatedAt: new Date().toISOString()
    }
    
    return mockUser
    
    // 实际API请求
    // return apiClient.put('/user', data)
  },

  // 更新用户密码
  updatePassword: async (): Promise<void> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // 实际API请求
    // return apiClient.put('/user/password', { currentPassword, newPassword })
  },

  // 上传头像
  uploadAvatar: async (): Promise<string> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟返回头像URL
    return 'https://via.placeholder.com/150?avatar=' + Date.now()
    
    // 实际API请求
    // const formData = new FormData()
    // formData.append('avatar', file)
    // return apiClient.post('/user/avatar', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
  }
}

export default userApi
