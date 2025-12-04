import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDataStore } from '../../src/stores/dataStore'
import * as api from '../../src/api/index'

// Mock API calls
vi.mock('../../src/api/index', () => ({
  getTodos: vi.fn(),
  getTransactions: vi.fn(),
  getReports: vi.fn()
}))

describe('dataStore', () => {
  let store

  beforeEach(() => {
    // 创建Pinia实例
    const pinia = createPinia()
    setActivePinia(pinia)

    // 创建store实例
    store = useDataStore()

    // 重置mock
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct state', () => {
    expect(store.todos).toEqual([])
    expect(store.transactions).toEqual([])
    expect(store.reports).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('has correct getters', () => {
    // 设置测试数据
    store.todos = [1, 2, 3]
    store.transactions = [1, 2]
    store.reports = [1]

    expect(store.todosCount).toBe(3)
    expect(store.transactionsCount).toBe(2)
    expect(store.reportsCount).toBe(1)
  })

  it('fetchTodos updates state correctly on success', async () => {
    const mockData = [{ id: 1, title: 'Test Todo' }]
    api.getTodos.mockResolvedValue({ data: mockData })

    await store.fetchTodos()

    expect(api.getTodos).toHaveBeenCalledWith({})
    expect(store.todos).toEqual(mockData)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchTodos handles error correctly', async () => {
    // 模拟API调用失败，返回没有message属性的错误
    const mockError = new Error()
    delete mockError.message
    api.getTodos.mockRejectedValue(mockError)

    await store.fetchTodos()

    expect(api.getTodos).toHaveBeenCalledWith({})
    expect(store.todos).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('获取todos数据失败')
  })

  it('fetchTodos accepts params', async () => {
    const mockData = [{ id: 1, title: 'Test Todo' }]
    const mockParams = { status: 'completed' }
    api.getTodos.mockResolvedValue({ data: mockData })

    await store.fetchTodos(mockParams)

    expect(api.getTodos).toHaveBeenCalledWith(mockParams)
    expect(store.todos).toEqual(mockData)
  })

  it('fetchTransactions updates state correctly on success', async () => {
    const mockData = [{ id: 1, amount: 100 }]
    api.getTransactions.mockResolvedValue({ data: mockData })

    await store.fetchTransactions()

    expect(api.getTransactions).toHaveBeenCalledWith({})
    expect(store.transactions).toEqual(mockData)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchTransactions handles error correctly', async () => {
    // 模拟API调用失败，返回没有message属性的错误
    const mockError = new Error()
    delete mockError.message
    api.getTransactions.mockRejectedValue(mockError)

    await store.fetchTransactions()

    expect(api.getTransactions).toHaveBeenCalledWith({})
    expect(store.transactions).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('获取transactions数据失败')
  })

  it('fetchReports updates state correctly on success', async () => {
    const mockData = [{ id: 1, total_income: 1000 }]
    api.getReports.mockResolvedValue({ data: mockData })

    await store.fetchReports()

    expect(api.getReports).toHaveBeenCalledWith({})
    expect(store.reports).toEqual(mockData)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchReports handles error correctly', async () => {
    // 模拟API调用失败，返回没有message属性的错误
    const mockError = new Error()
    delete mockError.message
    api.getReports.mockRejectedValue(mockError)

    await store.fetchReports()

    expect(api.getReports).toHaveBeenCalledWith({})
    expect(store.reports).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('获取reports数据失败')
  })

  it('resetState resets all state properties', () => {
    // 设置一些状态
    store.todos = [{ id: 1 }]
    store.transactions = [{ id: 1 }]
    store.reports = [{ id: 1 }]
    store.loading = true
    store.error = 'Some error'

    store.resetState()

    expect(store.todos).toEqual([])
    expect(store.transactions).toEqual([])
    expect(store.reports).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('handles API response without data property', async () => {
    const mockData = [{ id: 1, title: 'Test Todo' }]
    // 模拟API直接返回数据，而不是包裹在data对象中
    api.getTodos.mockResolvedValue(mockData)

    await store.fetchTodos()

    expect(store.todos).toEqual(mockData)
  })
})