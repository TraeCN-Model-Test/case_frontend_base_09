import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CashLogView from '../../src/views/CashLogView.vue'
import ElementPlus from 'element-plus'
import { useDataStore } from '../../src/stores/dataStore'
import * as api from '../../src/api/index'

// Mock API calls
vi.mock('../../src/api/index', () => ({
  getTodos: vi.fn().mockResolvedValue({ data: [] }),
  getTransactions: vi.fn().mockResolvedValue({ data: [] }),
  getReports: vi.fn().mockResolvedValue({ data: [] })
}))

// 模拟Element Plus组件
vi.mock('element-plus', () => {
  // 创建模拟的ElMessage
  const mockElMessage = {
    success: vi.fn(),
    error: vi.fn()
  }
  
  return {
    default: { install: vi.fn() },
    ElMessage: mockElMessage,
    ElTable: { template: '<table><slot /></table>' },
    ElTableColumn: { template: '<th><slot /></th>' },
    ElButton: { template: '<button><slot /></button>' },
    ElInput: { template: '<input />' },
    ElSelect: { template: '<select><slot /></select>' },
    ElOption: { template: '<option><slot /></option>' },
    ElDatePicker: { template: '<input type="date" />' },
    ElDialog: { template: '<div><slot /></div>' },
    ElForm: { template: '<form><slot /></form>' },
    ElFormItem: { template: '<div><slot /></div>' },
    ElCard: { template: '<div><slot /></div>' },
    ElRow: { template: '<div><slot /></div>' },
    ElCol: { template: '<div><slot /></div>' },
    ElPagination: { template: '<div><slot /></div>' }
  }
})

describe('CashLogView.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    // 创建Pinia实例
    const pinia = createPinia()
    setActivePinia(pinia)

    wrapper = mount(CashLogView, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          // 图标组件stub
          'el-icon': true,
          'List': true,
          'Wallet': true,
          'Document': true,
          // 完全模拟DataList组件，避免渲染内部结构
          'DataList': true
        }
      }
    })

    store = useDataStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    expect(wrapper.find('.cash-log-view').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toBe('CashLog 财务管理系统')
    expect(wrapper.find('.description').text()).toBe('统一管理您的财务数据、交易记录和报表信息')
  })

  it('renders all three data lists', () => {
    const dataLists = wrapper.findAllComponents({ name: 'DataList' })
    expect(dataLists.length).toBe(3)
  })

  it('renders stats cards', () => {
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards.length).toBe(3)
    expect(statCards[0].find('.stat-label').text()).toBe('待办事项')
    expect(statCards[1].find('.stat-label').text()).toBe('交易记录')
    expect(statCards[2].find('.stat-label').text()).toBe('财务报表')
  })

  it('fetches data on mount', async () => {
    // 验证mounted时是否调用了API
    expect(api.getTodos).toHaveBeenCalled()
    expect(api.getTransactions).toHaveBeenCalled()
    expect(api.getReports).toHaveBeenCalled()
  })

  it('updates stats when data changes', async () => {
    // 设置模拟数据
    const mockTodos = [{ id: 1, title: 'Test Todo' }]
    const mockTransactions = [{ id: 1, amount: 100 }]
    const mockReports = [{ id: 1, total_income: 1000 }]

    // 更新store状态
    store.todos = mockTodos
    store.transactions = mockTransactions
    store.reports = mockReports

    // 验证统计卡片是否更新
    expect(wrapper.findAll('.stat-number')[0].text()).toBe('1')
    expect(wrapper.findAll('.stat-number')[1].text()).toBe('1')
    expect(wrapper.findAll('.stat-number')[2].text()).toBe('1')
  })

  it('handles search event from FilterForm', async () => {
    const filterForm = wrapper.findComponent({ name: 'FilterForm' })
    const mockParams = { type: 'income', status: 'completed' }

    // 触发search事件
    await filterForm.vm.$emit('search', mockParams)

    // 验证API是否使用正确的参数调用
    expect(api.getTodos).toHaveBeenCalledWith(mockParams)
    expect(api.getTransactions).toHaveBeenCalledWith(mockParams)
    expect(api.getReports).toHaveBeenCalledWith(mockParams)
  })

  it('handles reset event from FilterForm', async () => {
    const filterForm = wrapper.findComponent({ name: 'FilterForm' })

    // 先设置一些数据
    store.todos = [{ id: 1, title: 'Test Todo' }]

    // 触发reset事件
    await filterForm.vm.$emit('reset')

    // 验证API是否使用空参数调用
    expect(api.getTodos).toHaveBeenCalledWith({})
    expect(api.getTransactions).toHaveBeenCalledWith({})
    expect(api.getReports).toHaveBeenCalledWith({})
  })

  it('shows loading state when fetching data', async () => {
    // 模拟API调用延迟
    const originalGetTodos = api.getTodos
    api.getTodos = vi.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ data: [] }), 100)
      })
    })

    // 重新挂载组件
    wrapper = mount(CashLogView, {
      global: {
        plugins: [createPinia(), ElementPlus],
        stubs: {
          'el-icon': true,
          'List': true,
          'Wallet': true,
          'Document': true
        }
      }
    })

    // 验证loading状态
    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.findComponent({ name: 'FilterForm' }).props('loading')).toBe(true)

    // 恢复原始实现
    api.getTodos = originalGetTodos
  })

  it('shows success message when data fetch succeeds', async () => {
      const { ElMessage } = await vi.importMock('element-plus')
      
      // 等待组件挂载和数据加载完成
      await wrapper.vm.$nextTick()
      
      // 验证成功消息是否显示
      expect(ElMessage.success).toHaveBeenCalledWith('数据加载成功')
    })

  it('shows error message when data fetch fails', async () => {
      const { ElMessage } = await vi.importMock('element-plus')
      
      // 模拟API调用失败
      api.getTodos = vi.fn().mockRejectedValue(new Error('API Error'))
      
      // 重新挂载组件
      wrapper = mount(CashLogView, {
        global: {
          plugins: [createPinia(), ElementPlus],
          stubs: {
            'el-icon': true,
            'List': true,
            'Wallet': true,
            'Document': true
          }
        }
      })
      
      // 等待异步操作完成
      await wrapper.vm.$nextTick()
      
      // 验证错误消息是否显示
      expect(ElMessage.error).toHaveBeenCalledWith('数据加载失败，请稍后重试')
    })
})