import request from '../utils/request'
import { transformTodoData, transformTransactionData, transformReportData } from '../utils/dataTransform'

// 获取todos列表
export const getTodos = async (params = {}) => {
  console.log('getTodos called with params:', params)
  try {
    const result = await request.get('/todos', { params })
    console.log('getTodos result:', result)
    // 转换数据格式
    return transformTodoData(result)
  } catch (error) {
    console.error('getTodos error:', error)
    throw error
  }
}

// 获取transactions列表
export const getTransactions = async (params = {}) => {
  console.log('getTransactions called with params:', params)
  try {
    const result = await request.get('/transactions', { params })
    console.log('getTransactions result:', result)
    // 转换数据格式
    return transformTransactionData(result)
  } catch (error) {
    console.error('getTransactions error:', error)
    throw error
  }
}

// 获取reports列表
export const getReports = async (params = {}) => {
  console.log('getReports called with params:', params)
  try {
    const result = await request.get('/reports/', { params })
    console.log('getReports result:', result)
    // 转换数据格式
    return transformReportData(result)
  } catch (error) {
    console.error('getReports error:', error)
    throw error
  }
}