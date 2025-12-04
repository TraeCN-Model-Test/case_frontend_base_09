import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterForm from '../../src/components/FilterForm.vue'
import ElementPlus from 'element-plus'

// Mock Element Plus
const mockElMessage = {
  error: vi.fn()
}

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    ElMessage: mockElMessage
  }
})

describe('FilterForm.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(FilterForm, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('.filter-form').exists()).toBe(true)
    expect(wrapper.find('.subtitle').text()).toBe('筛选条件')
    
    // 使用组件名称查找按钮
    const buttons = wrapper.findAllComponents({ name: 'ElButton' })
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('查询')
    expect(buttons[1].text()).toBe('重置')
  })

  it('has all filter fields', () => {
    // 使用组件名称查找
    expect(wrapper.findComponent({ name: 'ElSelect' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElDatePicker' }).exists()).toBe(true)
    // 应该有两个ElSelect组件（类型和状态）
    expect(wrapper.findAllComponents({ name: 'ElSelect' }).length).toBe(2)
  })

  it('emits search event with correct params when form is submitted', async () => {
    // 设置筛选条件 - 直接设置filters数据
    const filtersData = {
      type: 'income',
      status: 'completed',
      dateRange: ['2024-01-01', '2024-01-31']
    }
    
    // 直接设置组件的filters数据
    Object.assign(wrapper.vm.filters, filtersData)

    // 点击查询按钮
    const submitButton = wrapper.findComponent({ name: 'ElButton', props: { type: 'primary' } })
    await submitButton.trigger('click')

    // 验证是否触发了search事件
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0][0]).toEqual({
      type: 'income',
      status: 'completed',
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    })
  })

  it('validates date range correctly', async () => {
    // 设置无效的日期范围（开始日期晚于结束日期）
    wrapper.vm.filters.dateRange = ['2024-01-31', '2024-01-01']

    // 点击查询按钮
    const submitButton = wrapper.findComponent({ name: 'ElButton', props: { type: 'primary' } })
    await submitButton.trigger('click')

    // 验证是否触发了ElMessage.error
    expect(mockElMessage.error).toHaveBeenCalledWith('开始日期不能晚于结束日期')
    // 验证没有触发search事件
    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('emits reset event when reset button is clicked', async () => {
    // 先设置一些筛选条件
    wrapper.vm.filters.type = 'expense'

    // 点击重置按钮（非primary按钮）
    const buttons = wrapper.findAllComponents({ name: 'ElButton' })
    const resetButton = buttons.find(btn => !btn.props('type'))
    await resetButton.trigger('click')

    // 验证是否触发了reset事件
    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('resets all filters when reset button is clicked', async () => {
    // 先设置一些筛选条件
    Object.assign(wrapper.vm.filters, {
      type: 'expense',
      status: 'pending',
      dateRange: ['2024-01-01', '2024-01-31']
    })

    // 点击重置按钮（非primary按钮）
    const buttons = wrapper.findAllComponents({ name: 'ElButton' })
    const resetButton = buttons.find(btn => !btn.props('type'))
    await resetButton.trigger('click')

    // 验证所有筛选器是否被重置
    expect(wrapper.vm.filters.type).toBe('')
    expect(wrapper.vm.filters.status).toBe('')
    expect(wrapper.vm.filters.dateRange).toBeNull()
  })

  it('disables submit button when loading prop is true', () => {
    // 设置loading prop为true
    wrapper.setProps({ loading: true })

    // 验证按钮是否被禁用
    const submitButton = wrapper.findComponent({ name: 'ElButton', props: { type: 'primary' } })
    expect(submitButton.props('disabled')).toBe(true)
  })
})