import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DataList from '@/components/DataList.vue'

// 模拟Element Plus组件
vi.mock('element-plus', () => ({
  default: { install: vi.fn() },
  ElMessage: { error: vi.fn(), success: vi.fn() }
}))

// Mock dayjs
vi.mock('dayjs', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => '2024-01-01')
  }))
}))

describe('DataList.vue', () => {
  it('renders correctly with props', () => {
    const mockData = [{ id: 1, name: 'Test' }]
    const wrapper = mount(DataList, {
      props: {
        data: mockData,
        loading: false,
        title: 'Test List'
      },
      global: {
        stubs: {
          'el-table': true,
          'el-table-column': true,
          'el-pagination': true,
          'el-empty': true,
          'el-button': true,
          'el-icon': true,
          'el-tag': true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('accepts loading prop', () => {
    const wrapper = mount(DataList, {
      props: {
        data: [],
        loading: true,
        title: 'Test List'
      },
      global: {
        stubs: {
          'el-table': true,
          'el-table-column': true,
          'el-pagination': true,
          'el-empty': true,
          'el-button': true,
          'el-icon': true,
          'el-tag': true
        }
      }
    })
    expect(wrapper.props('loading')).toBe(true)
  })
})