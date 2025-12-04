import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTodos, getTransactions, getReports } from '../../../src/api/index.js'

// 模拟依赖
vi.mock('../../../src/utils/request.js', () => ({
  default: {
    get: vi.fn()
  }
}))

vi.mock('../../../src/utils/dataTransform.js', () => ({
  transformTodoData: vi.fn(),
  transformTransactionData: vi.fn(),
  transformReportData: vi.fn()
}))

import request from '../../../src/utils/request.js'
import { transformTodoData, transformTransactionData, transformReportData } from '../../../src/utils/dataTransform.js'

describe('API函数测试', () => {
  beforeEach(() => {
    // 清除所有模拟调用记录
    vi.clearAllMocks()
  })

  describe('getTodos函数', () => {
    it('应该正确调用request.get并传递参数', async () => {
      // 准备测试数据
      const params = { page: 1, size: 10 }
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], pagination: { total: 0, page: 1, size: 10, pages: 0 } }
      
      // 设置模拟返回值
      request.get.mockResolvedValue(mockResponse)
      transformTodoData.mockReturnValue(mockTransformedData)
      
      // 调用函数
      const result = await getTodos(params)
      
      // 验证调用
      expect(request.get).toHaveBeenCalledWith('/todos', { params })
      expect(transformTodoData).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual(mockTransformedData)
    })

    it('应该处理空参数的情况', async () => {
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], pagination: { total: 0, page: 1, size: 10, pages: 0 } }
      
      request.get.mockResolvedValue(mockResponse)
      transformTodoData.mockReturnValue(mockTransformedData)
      
      // 不传递参数
      const result = await getTodos()
      
      expect(request.get).toHaveBeenCalledWith('/todos', { params: {} })
      expect(result).toEqual(mockTransformedData)
    })

    it('应该正确处理错误情况', async () => {
      const params = { page: 1 }
      const mockError = new Error('网络错误')
      
      // 设置模拟抛出错误
      request.get.mockRejectedValue(mockError)
      
      // 验证错误被抛出
      await expect(getTodos(params)).rejects.toThrow('网络错误')
      
      // 验证transformTodoData未被调用
      expect(transformTodoData).not.toHaveBeenCalled()
    })
  })

  describe('getTransactions函数', () => {
    it('应该正确调用request.get并传递参数', async () => {
      // 准备测试数据
      const params = { page: 1, size: 10 }
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], pagination: { total: 0, page: 1, size: 10, pages: 0 } }
      
      // 设置模拟返回值
      request.get.mockResolvedValue(mockResponse)
      transformTransactionData.mockReturnValue(mockTransformedData)
      
      // 调用函数
      const result = await getTransactions(params)
      
      // 验证调用
      expect(request.get).toHaveBeenCalledWith('/transactions', { params })
      expect(transformTransactionData).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual(mockTransformedData)
    })

    it('应该处理空参数的情况', async () => {
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], pagination: { total: 0, page: 1, size: 10, pages: 0 } }
      
      request.get.mockResolvedValue(mockResponse)
      transformTransactionData.mockReturnValue(mockTransformedData)
      
      // 不传递参数
      const result = await getTransactions()
      
      expect(request.get).toHaveBeenCalledWith('/transactions', { params: {} })
      expect(result).toEqual(mockTransformedData)
    })

    it('应该正确处理错误情况', async () => {
      const params = { page: 1 }
      const mockError = new Error('服务器错误')
      
      // 设置模拟抛出错误
      request.get.mockRejectedValue(mockError)
      
      // 验证错误被抛出
      await expect(getTransactions(params)).rejects.toThrow('服务器错误')
      
      // 验证transformTransactionData未被调用
      expect(transformTransactionData).not.toHaveBeenCalled()
    })
  })

  describe('getReports函数', () => {
    it('应该正确调用request.get并传递参数', async () => {
      // 准备测试数据
      const params = { page: 1, size: 10 }
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], total: 0, page: 1, size: 10, pages: 0 }
      
      // 设置模拟返回值
      request.get.mockResolvedValue(mockResponse)
      transformReportData.mockReturnValue(mockTransformedData)
      
      // 调用函数
      const result = await getReports(params)
      
      // 验证调用
      expect(request.get).toHaveBeenCalledWith('/reports/', { params })
      expect(transformReportData).toHaveBeenCalledWith(mockResponse)
      expect(result).toEqual(mockTransformedData)
    })

    it('应该处理空参数的情况', async () => {
      const mockResponse = { items: [], total: 0 }
      const mockTransformedData = { data: [], total: 0, page: 1, size: 10, pages: 0 }
      
      request.get.mockResolvedValue(mockResponse)
      transformReportData.mockReturnValue(mockTransformedData)
      
      // 不传递参数
      const result = await getReports()
      
      expect(request.get).toHaveBeenCalledWith('/reports/', { params: {} })
      expect(result).toEqual(mockTransformedData)
    })

    it('应该正确处理错误情况', async () => {
      const params = { page: 1 }
      const mockError = new Error('请求超时')
      
      // 设置模拟抛出错误
      request.get.mockRejectedValue(mockError)
      
      // 验证错误被抛出
      await expect(getReports(params)).rejects.toThrow('请求超时')
      
      // 验证transformReportData未被调用
      expect(transformReportData).not.toHaveBeenCalled()
    })
  })
})