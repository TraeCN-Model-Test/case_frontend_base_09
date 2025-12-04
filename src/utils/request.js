import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 基础URL
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
    return response.data
  },
  error => {
    // 响应错误处理
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default service