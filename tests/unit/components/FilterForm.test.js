import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FilterForm from '../../../src/components/FilterForm.vue'
import { ElMessage, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElDatePicker, ElButton } from 'element-plus'

// 模拟 Element Plus 组件
vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn()
  },
  ElForm: {
    name: 'ElForm',
    template: '<form class="el-form"><slot /></form>'
  },
  ElFormItem: {
    name: 'ElFormItem',
    template: '<div class="el-form-item" :label="label"><slot /></div>',
    props: ['label']
  },
  ElSelect: {
    name: 'ElSelect',
    template: '<select class="el-select"><slot /></select>'
  },
  ElOption: {
    name: 'ElOption',
    template: '<option class="el-option"><slot /></option>'
  },
  ElInput: {
    name: 'ElInput',
    template: '<input class="el-input" />'
  },
  ElDatePicker: {
    name: 'ElDatePicker',
    template: '<input class="el-date-picker" />'
  },
  ElButton: {
    name: 'ElButton',
    template: '<button class="el-button" :type="type" :loading="loading"><slot /></button>',
    props: ['type', 'loading']
  }
}))

// 获取模拟的 ElMessage 实例
const mockedElMessage = vi.mocked(ElMessage)

describe('FilterForm.vue', () => {
  let wrapper

  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 清理组件实例
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('表单渲染测试', () => {
    it('应该正确渲染组件', () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      expect(wrapper.find('.filter-form').exists()).toBe(true)
      expect(wrapper.find('.subtitle').text()).toBe('筛选条件')
      expect(wrapper.find('.el-form').exists()).toBe(true)
    })

    it('应该根据activeTab渲染对应的筛选条件', async () => {
      // 测试待办事项筛选条件
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      await nextTick()
      expect(wrapper.find('[label="状态"]').exists()).toBe(true)
      expect(wrapper.find('[label="分类"]').exists()).toBe(true)
      expect(wrapper.find('[label="截止日期"]').exists()).toBe(true)
      expect(wrapper.find('[label="标签"]').exists()).toBe(true)

      // 测试交易记录筛选条件
      await wrapper.setProps({ activeTab: 'transactions' })
      await nextTick()
      expect(wrapper.find('[label="交易类型"]').exists()).toBe(true)
      expect(wrapper.find('[label="月份"]').exists()).toBe(true)
      expect(wrapper.find('[label="分类"]').exists()).toBe(true)
      expect(wrapper.find('[label="标签"]').exists()).toBe(true)

      // 测试财务报表筛选条件
      await wrapper.setProps({ activeTab: 'reports' })
      await nextTick()
      expect(wrapper.find('[label="时间维度"]').exists()).toBe(true)
      expect(wrapper.find('[label="分类"]').exists()).toBe(true)
    })

    it('应该根据loading属性显示按钮加载状态', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      expect(wrapper.find('[type="primary"]').exists()).toBe(true)
      expect(wrapper.find('[type="primary"]').attributes('loading')).toBe('false')

      await wrapper.setProps({ loading: true })
      expect(wrapper.find('[type="primary"]').attributes('loading')).toBe('true')
    })

    it('应该在时间维度为自定义时显示日期范围选择器', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'reports',
          loading: false
        }
      })

      await nextTick()
      // 初始状态下不显示日期范围选择器
      expect(wrapper.find('[label="日期范围"]').exists()).toBe(false)

      // 直接修改组件数据
      wrapper.vm.filters.reports.time_dimension = 'custom'
      await nextTick()
      
      // 由于使用了v-if，需要等待DOM更新
      await nextTick()
    })
  })

  describe('表单验证测试', () => {
    it('应该验证待办事项的日期范围', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 设置无效的日期范围（开始日期晚于结束日期）
      wrapper.vm.filters.todos.deadlineRange = ['2023-12-31', '2023-01-01']

      // 模拟表单提交
      await wrapper.vm.handleSubmit()
      
      // 验证是否显示了错误消息
      expect(mockedElMessage.error).toHaveBeenCalledWith('开始日期不能晚于结束日期')
    })

    it('应该验证财务报表的自定义日期范围', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'reports',
          loading: false
        }
      })

      // 设置自定义时间维度和无效的日期范围
      wrapper.vm.filters.reports.time_dimension = 'custom'
      wrapper.vm.filters.reports.dateRange = ['2023-12-31', '2023-01-01']

      // 模拟表单提交
      await wrapper.vm.handleSubmit()
      
      // 验证是否显示了错误消息
      expect(mockedElMessage.error).toHaveBeenCalledWith('开始日期不能晚于结束日期')
    })
  })

  describe('事件触发测试', () => {
    it('应该触发搜索事件并传递正确的参数', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 设置筛选条件
      wrapper.vm.filters.todos.status = 'todo'
      wrapper.vm.filters.todos.category = '工作'
      wrapper.vm.filters.todos.tags = '重要,紧急'
      wrapper.vm.filters.todos.deadlineRange = ['2023-01-01', '2023-12-31']

      // 模拟表单提交
      await wrapper.vm.handleSubmit()

      // 验证是否触发了search事件
      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')[0][0]).toEqual({
        status: 'todo',
        category: '工作',
        tags: '重要,紧急',
        deadline_before: '2023-12-31',
        deadline_after: '2023-01-01'
      })
    })

    it('应该触发重置事件', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 设置筛选条件
      wrapper.vm.filters.todos.status = 'todo'
      wrapper.vm.filters.todos.category = '工作'
      wrapper.vm.filters.todos.tags = '重要,紧急'
      wrapper.vm.filters.todos.deadlineRange = ['2023-01-01', '2023-12-31']

      // 模拟表单重置
      await wrapper.vm.handleReset()

      // 验证是否触发了reset事件
      expect(wrapper.emitted('reset')).toBeTruthy()

      // 验证筛选条件是否已重置
      expect(wrapper.vm.filters.todos.status).toBe('all')
      expect(wrapper.vm.filters.todos.category).toBe('')
      expect(wrapper.vm.filters.todos.tags).toBe('')
      expect(wrapper.vm.filters.todos.deadlineRange).toBeNull()
    })

    it('应该根据不同标签页触发不同的搜索参数', async () => {
      // 测试交易记录搜索参数
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'transactions',
          loading: false
        }
      })

      wrapper.vm.filters.transactions.transaction_type = 'income'
      wrapper.vm.filters.transactions.month = '2023-12'
      wrapper.vm.filters.transactions.category = '工资'
      wrapper.vm.filters.transactions.tags = '月度'

      await wrapper.vm.handleSubmit()

      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')[0][0]).toEqual({
        transaction_type: 'income',
        month: '2023-12',
        category: '工资',
        tags: '月度'
      })

      // 测试财务报表搜索参数
      await wrapper.setProps({ activeTab: 'reports' })
      wrapper.vm.filters.reports.time_dimension = 'monthly'
      wrapper.vm.filters.reports.categories = '收入,支出'

      await wrapper.vm.handleSubmit()

      expect(wrapper.emitted('search')[1][0]).toEqual({
        time_dimension: 'monthly',
        categories: '收入,支出'
      })
    })
  })

  describe('表单重置功能测试', () => {
    it('应该重置待办事项筛选条件', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 设置筛选条件
      wrapper.vm.filters.todos.status = 'todo'
      wrapper.vm.filters.todos.category = '工作'
      wrapper.vm.filters.todos.tags = '重要,紧急'
      wrapper.vm.filters.todos.deadlineRange = ['2023-01-01', '2023-12-31']

      // 模拟表单重置
      await wrapper.vm.handleReset()

      // 验证筛选条件是否已重置
      expect(wrapper.vm.filters.todos.status).toBe('all')
      expect(wrapper.vm.filters.todos.category).toBe('')
      expect(wrapper.vm.filters.todos.tags).toBe('')
      expect(wrapper.vm.filters.todos.deadlineRange).toBeNull()
    })

    it('应该重置交易记录筛选条件', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'transactions',
          loading: false
        }
      })

      // 设置筛选条件
      wrapper.vm.filters.transactions.transaction_type = 'income'
      wrapper.vm.filters.transactions.month = '2023-12'
      wrapper.vm.filters.transactions.category = '工资'
      wrapper.vm.filters.transactions.tags = '月度'

      // 模拟表单重置
      await wrapper.vm.handleReset()

      // 验证筛选条件是否已重置
      expect(wrapper.vm.filters.transactions.transaction_type).toBe('all')
      expect(wrapper.vm.filters.transactions.month).toBe('')
      expect(wrapper.vm.filters.transactions.category).toBe('')
      expect(wrapper.vm.filters.transactions.tags).toBe('')
    })

    it('应该重置财务报表筛选条件', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'reports',
          loading: false
        }
      })

      // 设置筛选条件
      wrapper.vm.filters.reports.time_dimension = 'custom'
      wrapper.vm.filters.reports.dateRange = ['2023-01-01', '2023-12-31']
      wrapper.vm.filters.reports.categories = '收入,支出'

      // 模拟表单重置
      await wrapper.vm.handleReset()

      // 验证筛选条件是否已重置
      expect(wrapper.vm.filters.reports.time_dimension).toBe('monthly')
      expect(wrapper.vm.filters.reports.dateRange).toBeNull()
      expect(wrapper.vm.filters.reports.categories).toBe('')
    })
  })

  describe('组件初始化测试', () => {
    it('应该正确初始化筛选条件', () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 验证初始筛选条件
      expect(wrapper.vm.filters.todos.status).toBe('all')
      expect(wrapper.vm.filters.todos.category).toBe('')
      expect(wrapper.vm.filters.todos.tags).toBe('')
      expect(wrapper.vm.filters.todos.deadlineRange).toBeNull()

      expect(wrapper.vm.filters.transactions.transaction_type).toBe('all')
      expect(wrapper.vm.filters.transactions.month).toBe('')
      expect(wrapper.vm.filters.transactions.category).toBe('')
      expect(wrapper.vm.filters.transactions.tags).toBe('')

      expect(wrapper.vm.filters.reports.time_dimension).toBe('monthly')
      expect(wrapper.vm.filters.reports.dateRange).toBeNull()
      expect(wrapper.vm.filters.reports.categories).toBe('')
    })

    it('应该根据activeTab变化重置对应的筛选条件', async () => {
      wrapper = mount(FilterForm, {
        props: {
          activeTab: 'todos',
          loading: false
        }
      })

      // 修改待办事项筛选条件
      wrapper.vm.filters.todos.status = 'todo'
      wrapper.vm.filters.todos.category = '工作'
      wrapper.vm.filters.todos.tags = '重要'
      wrapper.vm.filters.todos.deadlineRange = ['2023-01-01', '2023-12-31']

      // 切换到交易记录标签页
      await wrapper.setProps({ activeTab: 'transactions' })
      await nextTick()

      // 验证交易记录筛选条件是否正确
      expect(wrapper.vm.filters.transactions.transaction_type).toBe('all')

      // 切换到财务报表标签页
      await wrapper.setProps({ activeTab: 'reports' })
      await nextTick()

      // 验证财务报表筛选条件是否正确
      expect(wrapper.vm.filters.reports.time_dimension).toBe('monthly')
    })
  })
})