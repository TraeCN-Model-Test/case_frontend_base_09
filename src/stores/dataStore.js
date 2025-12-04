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
        const response = await getTodos(params)
        console.log('Todos response:', response)
        
        // 确保数据是数组格式
        this.todos = Array.isArray(response) ? response : []
        
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
        const response = await getTransactions(params)
        console.log('Transactions response:', response)
        
        // 确保数据是数组格式
        this.transactions = Array.isArray(response) ? response : []
        
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
        const response = await getReports(params)
        console.log('Reports response:', response)
        
        // 确保数据是数组格式
        this.reports = Array.isArray(response) ? response : []
        
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