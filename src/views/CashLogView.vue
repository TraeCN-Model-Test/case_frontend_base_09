<template>
  <div class="cash-log-view">
    <div class="page-header">
      <h1 class="title">CashLog 财务管理系统</h1>
      <p class="description">统一管理您的财务数据、交易记录和报表信息</p>
    </div>

    <!-- 筛选表单 -->
    <FilterForm
      :loading="loading"
      :active-tab="activeTab"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据统计卡片 -->
    <div class="stats-cards">
      <el-card 
        class="stat-card" 
        :class="{ active: activeTab === 'todos' }"
        @click="switchTab('todos')"
      >
        <div class="stat-content">
          <div class="stat-icon stat-icon-todo">
            <el-icon><List /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ todosCount }}</div>
            <div class="stat-label">待办事项</div>
          </div>
        </div>
      </el-card>

      <el-card 
        class="stat-card" 
        :class="{ active: activeTab === 'transactions' }"
        @click="switchTab('transactions')"
      >
        <div class="stat-content">
          <div class="stat-icon stat-icon-transaction">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ transactionsCount }}</div>
            <div class="stat-label">交易记录</div>
          </div>
        </div>
      </el-card>

      <el-card 
        class="stat-card" 
        :class="{ active: activeTab === 'reports' }"
        @click="switchTab('reports')"
      >
        <div class="stat-content">
          <div class="stat-icon stat-icon-report">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ reportsCount }}</div>
            <div class="stat-label">财务报表</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 标签页内容 -->
    <el-tabs v-model="activeTab" class="data-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="待办事项" name="todos">
        <DataList
          title="待办事项"
          :data="todos"
          :columns="todoColumns"
          :loading="loading"
          :pagination="todosPagination"
          @page-change="handleTodosPageChange"
        />
      </el-tab-pane>
      
      <el-tab-pane label="交易记录" name="transactions">
        <DataList
          title="交易记录"
          :data="transactions"
          :columns="transactionColumns"
          :loading="loading"
          :pagination="transactionsPagination"
          @page-change="handleTransactionsPageChange"
        />
      </el-tab-pane>
      
      <el-tab-pane label="财务报表" name="reports">
        <DataList
          title="财务报表"
          :data="reports"
          :columns="reportColumns"
          :loading="loading"
          :pagination="reportsPagination"
          @page-change="handleReportsPageChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import FilterForm from '../components/FilterForm.vue'
import DataList from '../components/DataList.vue'
import { List, Wallet, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTodos, getTransactions, getReports } from '../api/index.js'

const loading = ref(false)
const currentParams = reactive({})
const activeTab = ref('todos') // 默认显示待办事项

// 数据存储
const todos = ref([])
const transactions = ref([])
const reports = ref([])
const todosCount = ref(0)
const transactionsCount = ref(0)
const reportsCount = ref(0)

// 分页配置
const todosPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const transactionsPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const reportsPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列定义
const todoColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'content', label: '内容', minWidth: 200 },
  { prop: 'category', label: '分类', width: 120, align: 'center' },
  { prop: 'tags', label: '标签', width: 150, align: 'center' },
  { prop: 'deadline', label: '截止时间', width: 180, align: 'center', format: 'date' },
  { prop: 'status_text', label: '状态', width: 100, align: 'center', format: 'status' },
  { prop: 'created_at', label: '创建时间', width: 180, align: 'center', format: 'date' },
  { prop: 'updated_at', label: '更新时间', width: 180, align: 'center', format: 'date' }
])

const transactionColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'transaction_type', label: '类型', width: 100, align: 'center', format: 'type' },
  { prop: 'amount', label: '金额', width: 120, align: 'right', format: 'amount' },
  { prop: 'category', label: '分类', width: 120, align: 'center' },
  { prop: 'tags', label: '标签', width: 150, align: 'center' },
  { prop: 'notes', label: '备注', minWidth: 200 },
  { prop: 'created_at', label: '交易时间', width: 180, align: 'center', format: 'date' },
  { prop: 'month', label: '月份', width: 100, align: 'center' }
])

const reportColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'time_dimension', label: '时间维度', width: 120, align: 'center' },
  { prop: 'period', label: '周期', width: 100, align: 'center' },
  { prop: 'total_income', label: '总收入', width: 120, align: 'right', format: 'amount' },
  { prop: 'total_expense', label: '总支出', width: 120, align: 'right', format: 'amount' },
  { prop: 'net_amount', label: '净额', width: 120, align: 'right', format: 'amount' },
  { prop: 'transaction_count', label: '交易笔数', width: 100, align: 'center' }
])

// 获取当前tab页的数据
const fetchTabData = async (params = {}) => {
  console.log(`fetchTabData called for ${activeTab.value} with params:`, params)
  loading.value = true
  try {
    let result
    
    if (activeTab.value === 'todos') {
      result = await getTodos(params)
      todos.value = result?.data || []
      // 修复：从pagination对象中获取total字段
      todosPagination.total = result?.pagination?.total || result?.total || result?.count || todos.value.length
      todosCount.value = result?.pagination?.total || result?.total || result?.count || todos.value.length
    } 
    else if (activeTab.value === 'transactions') {
      result = await getTransactions(params)
      transactions.value = result?.data || []
      // 修复：从pagination对象中获取total字段
      transactionsPagination.total = result?.pagination?.total || result?.total || result?.count || transactions.value.length
      transactionsCount.value = result?.pagination?.total || result?.total || result?.count || transactions.value.length
    } 
    else if (activeTab.value === 'reports') {
      result = await getReports(params)
      // 报表数据可能是单个对象或数组
      if (result?.data) {
        reports.value = result.data
        // 修复：从pagination对象中获取total字段
        reportsPagination.total = result?.pagination?.total || result?.total || result?.count || result.data.length
        reportsCount.value = result?.pagination?.total || result?.total || result?.count || result.data.length
      } else if (Array.isArray(result)) {
        reports.value = result
        reportsPagination.total = result.length
        reportsCount.value = result.length
      } else {
        reports.value = [result].filter(Boolean)
        reportsPagination.total = 1
        reportsCount.value = 1
      }
    }
    
    console.log(`${activeTab.value} data fetch completed:`, result)
    // 移除成功提示toast，避免刷新时频繁显示
    // ElMessage.success('数据加载成功')
  } catch (error) {
    console.error(`获取${activeTab.value}数据失败:`, error)
    ElMessage.error(`数据加载失败: ${error.message || '请稍后重试'}`)
  } finally {
    loading.value = false
  }
}

// 获取所有数据
const fetchAllData = async (params = {}) => {
  console.log('fetchAllData called with params:', params)
  loading.value = true
  try {
    // 并行请求所有数据
    const [todosRes, transactionsRes, reportsRes] = await Promise.all([
      getTodos(params),
      getTransactions(params),
      getReports(params)
    ])
    
    // 更新数据
    todos.value = todosRes?.data || []
    transactions.value = transactionsRes?.data || []
    reports.value = reportsRes?.data || Array.isArray(reportsRes) ? reportsRes : [reportsRes].filter(Boolean)
    
    // 修复：从pagination对象中获取total字段
    todosCount.value = todosRes?.pagination?.total || todos.value.length
    transactionsCount.value = transactionsRes?.pagination?.total || transactions.value.length
    reportsCount.value = reportsRes?.pagination?.total || reports.value.length
    
    // 更新分页总数
    todosPagination.total = todosCount.value
    transactionsPagination.total = transactionsCount.value
    reportsPagination.total = reportsCount.value
    
    console.log('Data fetch completed:')
    console.log('Todos:', todos.value)
    console.log('Transactions:', transactions.value)
    console.log('Reports:', reports.value)
    
    // 移除成功提示toast，避免刷新时频繁显示
    // ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('数据加载失败:', error)
    ElMessage.error(`数据加载失败: ${error.message || '请稍后重试'}`)
  } finally {
    loading.value = false
  }
}

// 获取所有数据的计数（用于显示在统计卡片上）
const fetchAllCounts = async () => {
  try {
    // 并行请求所有数据，只获取计数
    const [todosRes, transactionsRes, reportsRes] = await Promise.all([
      getTodos({ page: 1, size: 1 }),
      getTransactions({ page: 1, size: 1 }),
      getReports({})
    ])
    
    // 更新计数 - 修复：从pagination对象中获取total字段
    todosCount.value = todosRes?.pagination?.total || 0
    transactionsCount.value = transactionsRes?.pagination?.total || 0
    reportsCount.value = reportsRes?.pagination?.total || (Array.isArray(reportsRes) ? reportsRes.length : 0)
    
    console.log('Counts updated:', {
      todos: todosCount.value,
      transactions: transactionsCount.value,
      reports: reportsCount.value
    })
  } catch (error) {
    console.error('获取数据计数失败:', error)
    // 如果获取计数失败，设置默认值
    todosCount.value = 0
    transactionsCount.value = 0
    reportsCount.value = 0
  }
}

// 页面加载时获取计数和当前tab页的数据
onMounted(() => {
  console.log('CashLogView mounted, current tab:', activeTab.value)
  fetchAllCounts()
  fetchTabData()
})

// 处理搜索
const handleSearch = (params) => {
  Object.assign(currentParams, params)
  fetchTabData(currentParams)
}

// 处理重置
const handleReset = () => {
  Object.keys(currentParams).forEach(key => delete currentParams[key])
  fetchTabData({})
}

// 切换标签页
const switchTab = (tabName) => {
  activeTab.value = tabName
  // 切换tab时重新加载数据
  fetchTabData(currentParams)
}

// 处理标签页点击
const handleTabClick = (tab) => {
  console.log('Tab clicked:', tab.props.name)
  // 切换tab时重新加载数据
  activeTab.value = tab.props.name
  fetchTabData(currentParams)
}

// 处理分页变化
const handleTodosPageChange = (page) => {
  todosPagination.currentPage = page
  fetchTabData(currentParams)
}

const handleTransactionsPageChange = (page) => {
  transactionsPagination.currentPage = page
  fetchTabData(currentParams)
}

const handleReportsPageChange = (page) => {
  reportsPagination.currentPage = page
  fetchTabData(currentParams)
}
</script>

<style scoped>
.cash-log-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.description {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &.active {
    border: 2px solid #409eff;
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon-todo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon-transaction {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon-report {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.data-tabs {
  margin-top: 20px;
}

/* 深度选择器修改Element Plus标签页样式 */
:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  background-color: #409eff;
}

:deep(.el-tabs__content) {
  padding: 0;
}

/* 优化卡片在桌面端的显示 */
@media (min-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .stat-card {
    padding: 8px;
  }
  
  .stat-icon {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }
  
  .stat-number {
    font-size: 32px;
  }
  
  .stat-label {
    font-size: 16px;
  }
}

/* 优化表格在桌面端的显示 */
@media (min-width: 1200px) {
  .data-list {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  :deep(.el-table) {
    font-size: 14px;
  }
  
  :deep(.el-table th) {
    background-color: #f5f7fa;
    color: #333;
    font-weight: 600;
  }
  
  :deep(.el-table--border) {
    border-radius: 8px;
  }
}

/* 优化分页在桌面端的显示 */
@media (min-width: 1200px) {
  .pagination-container {
    padding: 15px 0;
  }
  
  :deep(.el-pagination) {
    font-size: 14px;
  }
  
  :deep(.el-pagination .el-select .el-input) {
    width: 110px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }

  .description {
    font-size: 14px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .cash-log-view {
    padding: 16px;
  }
}

/* 简化的待办事项样式 */
.todo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.no-tags {
  color: #c0c4cc;
  font-style: italic;
  font-size: 12px;
}
</style>