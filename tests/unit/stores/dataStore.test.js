import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDataStore } from '../../../src/stores/dataStore'
import * as api from '../../../src/api/index'

// 模拟API模块
vi.mock('../../../src/api/index', () => ({
  getTodos: vi.fn(),
  getTransactions: vi.fn(),
  getReports: vi.fn()
}))

describe('dataStore', () => {
  let store

  beforeEach(() => {
    // 创建新的Pinia实例并激活
    setActivePinia(createPinia())
    store = useDataStore()
    
    // 清除所有模拟函数的调用记录
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(store.todos).toEqual([])
      expect(store.transactions).toEqual([])
      expect(store.reports).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Actions', () => {
    describe('fetchTodos', () => {
      it('应该成功获取todos数据', async () => {
        // 模拟API返回数据
        const mockTodos = [
          { id: 1, title: 'Todo 1', completed: false },
          { id: 2, title: 'Todo 2', completed: true }
        ]
        api.getTodos.mockResolvedValue(mockTodos)

        // 调用action
        await store.fetchTodos({ page: 1, limit: 10 })

        // 验证API调用
        expect(api.getTodos).toHaveBeenCalledWith({ page: 1, limit: 10 })
        
        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.todos).toEqual(mockTodos)
      })

      it('应该处理获取todos数据时的错误', async () => {
        // 模拟API错误
        const errorMessage = 'Network error'
        api.getTodos.mockRejectedValue(new Error(errorMessage))

        // 调用action
        await store.fetchTodos()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
        expect(store.todos).toEqual([])
      })

      it('应该处理非数组返回值', async () => {
        // 模拟API返回非数组数据
        api.getTodos.mockResolvedValue(null)

        // 调用action
        await store.fetchTodos()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.todos).toEqual([])
      })
    })

    describe('fetchTransactions', () => {
      it('应该成功获取transactions数据', async () => {
        // 模拟API返回数据
        const mockTransactions = [
          { id: 1, amount: 100, type: 'income' },
          { id: 2, amount: -50, type: 'expense' }
        ]
        api.getTransactions.mockResolvedValue(mockTransactions)

        // 调用action
        await store.fetchTransactions({ page: 1, limit: 10 })

        // 验证API调用
        expect(api.getTransactions).toHaveBeenCalledWith({ page: 1, limit: 10 })
        
        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.transactions).toEqual(mockTransactions)
      })

      it('应该处理获取transactions数据时的错误', async () => {
        // 模拟API错误
        const errorMessage = 'Network error'
        api.getTransactions.mockRejectedValue(new Error(errorMessage))

        // 调用action
        await store.fetchTransactions()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
        expect(store.transactions).toEqual([])
      })

      it('应该处理非数组返回值', async () => {
        // 模拟API返回非数组数据
        api.getTransactions.mockResolvedValue(undefined)

        // 调用action
        await store.fetchTransactions()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.transactions).toEqual([])
      })
    })

    describe('fetchReports', () => {
      it('应该成功获取reports数据', async () => {
        // 模拟API返回数据
        const mockReports = [
          { id: 1, report_type: 'monthly', total_expense: 1000 },
          { id: 2, report_type: 'yearly', total_expense: 12000 }
        ]
        api.getReports.mockResolvedValue(mockReports)

        // 调用action
        await store.fetchReports({ page: 1, limit: 10 })

        // 验证API调用
        expect(api.getReports).toHaveBeenCalledWith({ page: 1, limit: 10 })
        
        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.reports).toEqual(mockReports)
      })

      it('应该处理获取reports数据时的错误', async () => {
        // 模拟API错误
        const errorMessage = 'Network error'
        api.getReports.mockRejectedValue(new Error(errorMessage))

        // 调用action
        await store.fetchReports()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
        expect(store.reports).toEqual([])
      })

      it('应该处理非数组返回值', async () => {
        // 模拟API返回非数组数据
        api.getReports.mockResolvedValue('invalid data')

        // 调用action
        await store.fetchReports()

        // 验证状态
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
        expect(store.reports).toEqual([])
      })
    })

    describe('resetState', () => {
      it('应该重置所有状态', async () => {
        // 设置一些初始数据
        store.todos = [{ id: 1, title: 'Test Todo' }]
        store.transactions = [{ id: 1, amount: 100 }]
        store.reports = [{ id: 1, report_type: 'monthly' }]
        store.loading = true
        store.error = 'Some error'

        // 调用resetState
        store.resetState()

        // 验证状态已重置
        expect(store.todos).toEqual([])
        expect(store.transactions).toEqual([])
        expect(store.reports).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
      })
    })
  })

  describe('Getters', () => {
    it('todosCount应该返回todos数组的长度', () => {
      // 设置初始数据
      store.todos = [
        { id: 1, title: 'Todo 1' },
        { id: 2, title: 'Todo 2' },
        { id: 3, title: 'Todo 3' }
      ]

      // 验证getter
      expect(store.todosCount).toBe(3)
    })

    it('transactionsCount应该返回transactions数组的长度', () => {
      // 设置初始数据
      store.transactions = [
        { id: 1, amount: 100 },
        { id: 2, amount: -50 }
      ]

      // 验证getter
      expect(store.transactionsCount).toBe(2)
    })

    it('reportsCount应该返回reports数组的长度', () => {
      // 设置初始数据
      store.reports = [
        { id: 1, report_type: 'monthly' },
        { id: 2, report_type: 'yearly' },
        { id: 3, report_type: 'weekly' }
      ]

      // 验证getter
      expect(store.reportsCount).toBe(3)
    })

    it('空数组应该返回0', () => {
      // 验证空数组情况
      expect(store.todosCount).toBe(0)
      expect(store.transactionsCount).toBe(0)
      expect(store.reportsCount).toBe(0)
    })
  })
})