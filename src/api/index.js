import mockApi from '../utils/mockData'

// 直接使用模拟数据，因为后端服务不可用
console.warn('Using mock data for all API requests')

// 获取todos列表
export const getTodos = async (params = {}) => {
  console.log('getTodos called with params:', params)
  const result = await mockApi.getTodos(params)
  console.log('getTodos result:', result)
  return result
}

// 获取transactions列表
export const getTransactions = async (params = {}) => {
  console.log('getTransactions called with params:', params)
  const result = await mockApi.getTransactions(params)
  console.log('getTransactions result:', result)
  return result
}

// 获取reports列表
export const getReports = async (params = {}) => {
  console.log('getReports called with params:', params)
  const result = await mockApi.getReports(params)
  console.log('getReports result:', result)
  return result
}