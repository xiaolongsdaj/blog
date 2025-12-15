import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      // 请求已发出，但服务器响应状态码不在 2xx 范围内
      console.error('API Error:', error.response.status, error.response.data)
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        // 清除本地存储的token
        localStorage.removeItem('token')
        // 跳转到登录页面
        window.location.href = '/login'
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('API Error: No response received', error.request)
    } else {
      // 请求配置时发生错误
      console.error('API Error: Request configuration failed', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient