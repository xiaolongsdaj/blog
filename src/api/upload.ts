import apiClient from './axios'

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 上传文件响应类型
export interface UploadResponse {
  url: string
  filename: string
}

// 上传API服务
const uploadApi = {
  // 单文件上传
  uploadImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post(`/api/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 多文件上传
  uploadImages: async (files: File[]): Promise<ApiResponse<UploadResponse[]>> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    return apiClient.post(`/api/upload/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default uploadApi
