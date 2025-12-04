import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8000/api', // 基础URL，指向真实的后台服务
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    // 请求错误处理
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 处理响应数据
    const res = response.data
    
    // 如果响应中包含特定错误码，则视为错误
    if (res.code && res.code !== 200) {
      console.error('API Error:', res.message || '未知错误')
      return Promise.reject(new Error(res.message || '未知错误'))
    }
    
    return res
  },
  error => {
    // 响应错误处理
    console.error('Response error:', error)
    
    // 处理HTTP错误状态码
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          error.message = data.detail || '请求参数错误'
          break
        case 401:
          error.message = '未授权，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求的资源不存在'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        default:
          error.message = data.detail || `连接错误 ${status}`
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      error.message = '网络连接异常，请检查服务器状态'
    } else {
      // 请求配置错误
      error.message = error.message || '请求配置错误'
    }
    
    return Promise.reject(error)
  }
)

export default service