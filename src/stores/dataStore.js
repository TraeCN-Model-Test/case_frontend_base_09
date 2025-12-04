import { defineStore } from 'pinia'
import { getTodos, getTransactions, getReports } from '../api/index'

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    todos: [],
    transactions: [],
    reports: [],
    loading: false,
    error: null
  }),

  actions: {
    // 获取todos数据
    async fetchTodos(params = {}) {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching todos with params:', params)
        // 模拟数据
        const mockTodos = [
          { id: 1, title: '完成Pinia学习', completed: false },
          { id: 2, title: '编写模拟数据逻辑', completed: true },
          { id: 3, title: '测试数据获取功能', completed: false }
        ];
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Todos response:', mockTodos)
        
        // 确保数据是数组格式
        this.todos = Array.isArray(mockTodos) ? mockTodos : []
        
        console.log('Todos stored:', this.todos)
      } catch (err) {
        this.error = err.message || '获取todos数据失败'
        console.error('Fetch todos error:', err)
        this.todos = []
      } finally {
        this.loading = false
      }
    },

    // 获取transactions数据
    async fetchTransactions(params = {}) {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching transactions with params:', params)
        // 模拟数据
        const mockTransactions = [
          { id: 1, type: 'income', amount: 1000, description: '工资收入', date: '2025-12-01' },
          { id: 2, type: 'expense', amount: 200, description: '餐饮费用', date: '2025-12-02' },
          { id: 3, type: 'expense', amount: 500, description: '购物支出', date: '2025-12-03' }
        ];
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Transactions response:', mockTransactions)
        
        // 确保数据是数组格式
        this.transactions = Array.isArray(mockTransactions) ? mockTransactions : []
        
        console.log('Transactions stored:', this.transactions)
      } catch (err) {
        this.error = err.message || '获取transactions数据失败'
        console.error('Fetch transactions error:', err)
        this.transactions = []
      } finally {
        this.loading = false
      }
    },

    // 获取reports数据
    async fetchReports(params = {}) {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching reports with params:', params)
        // 模拟数据
        const mockReports = [
          { id: 1, title: '月度报告', period: '2025-12', totalIncome: 5000, totalExpense: 2000 },
          { id: 2, title: '季度报告', period: '2025-Q4', totalIncome: 15000, totalExpense: 6000 }
        ];
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Reports response:', mockReports)
        
        // 确保数据是数组格式
        this.reports = Array.isArray(mockReports) ? mockReports : []
        
        console.log('Reports stored:', this.reports)
      } catch (err) {
        this.error = err.message || '获取reports数据失败'
        console.error('Fetch reports error:', err)
        this.reports = []
      } finally {
        this.loading = false
      }
    },

    // 重置状态
    resetState() {
      this.todos = []
      this.transactions = []
      this.reports = []
      this.loading = false
      this.error = null
    }
  },

  getters: {
    // 获取todos总数
    todosCount: (state) => state.todos.length,
    // 获取transactions总数
    transactionsCount: (state) => state.transactions.length,
    // 获取reports总数
    reportsCount: (state) => state.reports.length
  }
})