import { describe, it, expect } from 'vitest'
import { transformTodoData, transformTransactionData, transformReportData } from '../../../src/utils/dataTransform'

describe('transformTodoData', () => {
  it('应该返回null当输入为空时', () => {
    expect(transformTodoData(null)).toBe(null)
    expect(transformTodoData(undefined)).toBe(null)
    expect(transformTodoData('')).toBe(null)
  })

  it('应该正确转换单项待办事项数据', () => {
    const mockTodo = {
      id: 1,
      content: "完成项目报告",
      category: "工作",
      tags: "重要,紧急",
      deadline: "2024-12-10T18:00:00",
      transaction_id: null,
      status: "todo",
      created_at: "2024-12-01T09:00:00",
      updated_at: "2024-12-01T09:00:00",
      status_text: "待办"
    }

    const result = transformTodoData(mockTodo)

    expect(result).toEqual({
      id: 1,
      title: "完成项目报告",
      description: "工作 - 重要,紧急",
      status: "todo",
      created_at: "2024-12-01T09:00:00",
      updated_at: "2024-12-01T09:00:00",
      category: "工作",
      tags: "重要,紧急",
      deadline: "2024-12-10T18:00:00",
      status_text: "待办"
    })
  })

  it('应该正确转换待办事项列表数据', () => {
    const mockTodosList = {
      items: [
        {
          id: 1,
          content: "完成项目报告",
          category: "工作",
          tags: "重要,紧急",
          deadline: "2024-12-10T18:00:00",
          transaction_id: null,
          status: "todo",
          created_at: "2024-12-01T09:00:00",
          updated_at: "2024-12-01T09:00:00",
          status_text: "待办"
        },
        {
          id: 2,
          content: "购买生活用品",
          category: "生活",
          tags: "日常",
          deadline: "2024-12-05T20:00:00",
          transaction_id: null,
          status: "done",
          created_at: "2024-12-01T10:00:00",
          updated_at: "2024-12-03T15:30:00",
          status_text: "已完成"
        }
      ],
      total: 2,
      page: 1,
      size: 10,
      pages: 1
    }

    const result = transformTodoData(mockTodosList)

    expect(result).toEqual({
      data: [
        {
          id: 1,
          title: "完成项目报告",
          description: "工作 - 重要,紧急",
          status: "todo",
          created_at: "2024-12-01T09:00:00",
          updated_at: "2024-12-01T09:00:00",
          category: "工作",
          tags: "重要,紧急",
          deadline: "2024-12-10T18:00:00",
          status_text: "待办"
        },
        {
          id: 2,
          title: "购买生活用品",
          description: "生活 - 日常",
          status: "done",
          created_at: "2024-12-01T10:00:00",
          updated_at: "2024-12-03T15:30:00",
          category: "生活",
          tags: "日常",
          deadline: "2024-12-05T20:00:00",
          status_text: "已完成"
        }
      ],
      pagination: {
        total: 2,
        page: 1,
        size: 10,
        pages: 1
      }
    })
  })

  it('应该处理缺少tags字段的情况', () => {
    const mockTodo = {
      id: 3,
      content: "学习新技术",
      category: "学习",
      deadline: "2024-12-15T23:59:59",
      transaction_id: null,
      status: "todo",
      created_at: "2024-12-01T11:00:00",
      updated_at: "2024-12-01T11:00:00",
      status_text: "待办"
    }

    const result = transformTodoData(mockTodo)

    expect(result.description).toBe("学习 - ")
    expect(result.tags).toBe(undefined)
  })

  it('应该处理空items数组的情况', () => {
    const mockEmptyList = {
      items: [],
      total: 0,
      page: 1,
      size: 10,
      pages: 0
    }

    const result = transformTodoData(mockEmptyList)

    expect(result.data).toEqual([])
    expect(result.pagination).toEqual({
      total: 0,
      page: 1,
      size: 10,
      pages: 0
    })
  })
})

describe('transformTransactionData', () => {
  it('应该返回null当输入为空时', () => {
    expect(transformTransactionData(null)).toBe(null)
    expect(transformTransactionData(undefined)).toBe(null)
    expect(transformTransactionData('')).toBe(null)
  })

  it('应该正确转换单项交易数据', () => {
    const mockTransaction = {
      id: 1,
      amount: 5000.0,
      category: "工资",
      tags: "收入,月度",
      notes: "12月份工资",
      created_at: "2024-12-01T09:00:00",
      updated_at: "2024-12-01T09:00:00",
      transaction_type: "收入",
      month: "2024-12"
    }

    const result = transformTransactionData(mockTransaction)

    expect(result).toEqual({
      id: 1,
      type: 'income',
      amount: 5000.0,
      description: "12月份工资",
      transaction_date: "2024-12-01T09:00:00",
      status: 'success',
      category: "工资",
      tags: "收入,月度",
      notes: "12月份工资",
      transaction_type: "收入",
      month: "2024-12"
    })
  })

  it('应该正确转换支出类型交易数据', () => {
    const mockTransaction = {
      id: 2,
      amount: -150.0,
      category: "餐饮",
      tags: "日常,午餐",
      notes: "工作日午餐",
      created_at: "2024-12-01T12:30:00",
      updated_at: "2024-12-01T12:30:00",
      transaction_type: "支出",
      month: "2024-12"
    }

    const result = transformTransactionData(mockTransaction)

    expect(result).toEqual({
      id: 2,
      type: 'expense',
      amount: 150.0,
      description: "工作日午餐",
      transaction_date: "2024-12-01T12:30:00",
      status: 'success',
      category: "餐饮",
      tags: "日常,午餐",
      notes: "工作日午餐",
      transaction_type: "支出",
      month: "2024-12"
    })
  })

  it('应该正确转换交易列表数据', () => {
    const mockTransactionsList = {
      items: [
        {
          id: 1,
          amount: 5000.0,
          category: "工资",
          tags: "收入,月度",
          notes: "12月份工资",
          created_at: "2024-12-01T09:00:00",
          updated_at: "2024-12-01T09:00:00",
          transaction_type: "收入",
          month: "2024-12"
        },
        {
          id: 2,
          amount: -150.0,
          category: "餐饮",
          tags: "日常,午餐",
          notes: "工作日午餐",
          created_at: "2024-12-01T12:30:00",
          updated_at: "2024-12-01T12:30:00",
          transaction_type: "支出",
          month: "2024-12"
        }
      ],
      total: 2,
      page: 1,
      size: 10,
      pages: 1
    }

    const result = transformTransactionData(mockTransactionsList)

    expect(result).toEqual({
      data: [
        {
          id: 1,
          type: 'income',
          amount: 5000.0,
          description: "12月份工资",
          transaction_date: "2024-12-01T09:00:00",
          status: 'success',
          category: "工资",
          tags: "收入,月度",
          notes: "12月份工资",
          transaction_type: "收入",
          month: "2024-12"
        },
        {
          id: 2,
          type: 'expense',
          amount: 150.0,
          description: "工作日午餐",
          transaction_date: "2024-12-01T12:30:00",
          status: 'success',
          category: "餐饮",
          tags: "日常,午餐",
          notes: "工作日午餐",
          transaction_type: "支出",
          month: "2024-12"
        }
      ],
      pagination: {
        total: 2,
        page: 1,
        size: 10,
        pages: 1
      }
    })
  })

  it('应该处理空items数组的情况', () => {
    const mockEmptyList = {
      items: [],
      total: 0,
      page: 1,
      size: 10,
      pages: 0
    }

    const result = transformTransactionData(mockEmptyList)

    expect(result.data).toEqual([])
    expect(result.pagination).toEqual({
      total: 0,
      page: 1,
      size: 10,
      pages: 0
    })
  })

  it('应该使用category作为description当notes不存在时', () => {
    const mockTransaction = {
      id: 3,
      amount: -500.00,
      category: "交通",
      created_at: "2024-12-01T15:00:00",
      updated_at: "2024-12-01T15:00:00",
      transaction_type: "支出",
      month: "2024-12"
    }

    const result = transformTransactionData(mockTransaction)

    expect(result).toEqual({
      id: 3,
      type: 'expense',
      amount: 500.00,
      description: "交通",
      transaction_date: "2024-12-01T15:00:00",
      status: 'success',
      category: "交通",
      tags: undefined,
      notes: undefined,
      transaction_type: "支出",
      month: "2024-12"
    })
  })
})

describe('transformReportData', () => {
  it('应该返回null当输入为空时', () => {
    expect(transformReportData(null)).toBe(null)
    expect(transformReportData(undefined)).toBe(null)
    expect(transformReportData('')).toBe(null)
  })

  it('应该正确转换月度报告数据', () => {
    const mockReport = {
      time_dimension: "monthly",
      period: "2024-12",
      summary: {
        total_income: 8000.0,
        total_expense: 3500.0,
        net_amount: 4500.0,
        transaction_count: 25
      },
      categories: [
        {
          name: "工资",
          total_amount: 8000.0,
          transaction_count: 1,
          percentage: 100.0
        },
        {
          name: "餐饮",
          total_amount: -1500.0,
          transaction_count: 20,
          percentage: 42.86
        }
      ],
      transactions: [
        {
          id: 1,
          amount: 5000.0,
          category: "工资",
          tags: "收入,月度",
          notes: "12月份工资",
          created_at: "2024-12-01T09:00:00",
          transaction_type: "收入"
        }
      ]
    }

    const result = transformReportData(mockReport)

    // 检查基本结构
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('report_type', 'monthly')
    expect(result).toHaveProperty('period', '2024-12')
    expect(result).toHaveProperty('total_income', 8000.0)
    expect(result).toHaveProperty('total_expense', 3500.0)
    expect(result).toHaveProperty('balance', 4500.0)
    expect(result).toHaveProperty('generated_at')
    expect(result).toHaveProperty('categories')
    expect(result).toHaveProperty('transactions')
    
    // 检查categories和transactions数组
    expect(result.categories).toEqual([
      {
        name: "工资",
        total_amount: 8000.0,
        transaction_count: 1,
        percentage: 100.0
      },
      {
        name: "餐饮",
        total_amount: -1500.0,
        transaction_count: 20,
        percentage: 42.86
      }
    ])
    
    expect(result.transactions).toEqual([
      {
        id: 1,
        amount: 5000.0,
        category: "工资",
        tags: "收入,月度",
        notes: "12月份工资",
        created_at: "2024-12-01T09:00:00",
        transaction_type: "收入"
      }
    ])
  })

  it('应该正确处理缺少summary的情况', () => {
    const mockReport = {
      time_dimension: "yearly",
      period: "2024",
      categories: [],
      transactions: []
    }

    const result = transformReportData(mockReport)

    expect(result).toHaveProperty('report_type', 'yearly')
    expect(result).toHaveProperty('period', '2024')
    expect(result).toHaveProperty('total_income', 0)
    expect(result).toHaveProperty('total_expense', 0)
    expect(result).toHaveProperty('balance', 0)
    expect(result.categories).toEqual([])
    expect(result.transactions).toEqual([])
  })

  it('应该使用默认值当time_dimension不存在时', () => {
    const mockReport = {
      period: "2024-Q4"
    }

    const result = transformReportData(mockReport)

    expect(result).toHaveProperty('report_type', 'monthly')
    expect(result).toHaveProperty('period', '2024-Q4')
    expect(result).toHaveProperty('total_income', 0)
    expect(result).toHaveProperty('total_expense', 0)
    expect(result).toHaveProperty('balance', 0)
    expect(result.categories).toEqual([])
    expect(result.transactions).toEqual([])
  })

  it('应该正确处理负的total_expense', () => {
    const mockReport = {
      time_dimension: "monthly",
      period: "2024-11",
      summary: {
        total_income: 6000.0,
        total_expense: -4200.0,
        net_amount: 1800.0,
        transaction_count: 18
      },
      categories: [
        {
          name: "餐饮",
          total_amount: -2000.0,
          transaction_count: 15,
          percentage: 47.62
        }
      ],
      transactions: []
    }

    const result = transformReportData(mockReport)

    expect(result).toHaveProperty('total_income', 6000.0)
    expect(result).toHaveProperty('total_expense', 4200.0) // 应该取绝对值
    expect(result).toHaveProperty('balance', 1800.0)
  })
})