import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api', // 实际项目中可以根据环境变量配置不同的baseURL
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从本地存储获取accessToken
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
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
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    if (error.response) {
      // 请求已发出，但服务器响应状态码不在 2xx 范围内
      console.error('API Error:', error.response.status, error.response.data)
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        // 清除本地存储的token信息
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // 跳转到登录页面，携带当前路径作为redirect参数
        const currentPath = window.location.pathname + window.location.search
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
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