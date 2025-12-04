<template>
  <div class="cash-log-view">
    <div class="page-header">
      <h1 class="title">CashLog 财务管理系统</h1>
      <p class="description">统一管理您的财务数据、交易记录和报表信息</p>
    </div>

    <!-- 筛选表单 -->
    <FilterForm
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
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

      <el-card class="stat-card">
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

      <el-card class="stat-card">
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

    <!-- 数据列表 -->
    <DataList
      title="待办事项"
      :data="todos"
      :columns="todoColumns"
      :loading="loading"
    />

    <DataList
      title="交易记录"
      :data="transactions"
      :columns="transactionColumns"
      :loading="loading"
    />

    <DataList
      title="财务报表"
      :data="reports"
      :columns="reportColumns"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import FilterForm from '../components/FilterForm.vue'
import DataList from '../components/DataList.vue'
import { List, Wallet, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模拟数据
const mockTodos = [
  { id: 1, title: '缴纳房租', description: '2024年3月房租', status: '待办', created_at: '2024-03-01 10:00:00', updated_at: '2024-03-01 10:00:00' },
  { id: 2, title: '购买办公用品', description: '打印机、纸张等', status: '进行中', created_at: '2024-03-02 14:30:00', updated_at: '2024-03-03 09:15:00' },
  { id: 3, title: '提交报销申请', description: '差旅费报销', status: '已完成', created_at: '2024-03-05 16:45:00', updated_at: '2024-03-06 11:20:00' }
]

const mockTransactions = [
  { id: 1, type: '收入', amount: '5000.00', description: '工资', transaction_date: '2024-03-01', status: '已完成' },
  { id: 2, type: '支出', amount: '1500.00', description: '房租', transaction_date: '2024-03-02', status: '已完成' },
  { id: 3, type: '支出', amount: '200.00', description: '办公用品', transaction_date: '2024-03-03', status: '已完成' }
]

const mockReports = [
  { id: 1, report_type: '月度报表', period: '2024-02', total_income: '15000.00', total_expense: '8000.00', balance: '7000.00', generated_at: '2024-03-01 00:00:00' },
  { id: 2, report_type: '月度报表', period: '2024-01', total_income: '14500.00', total_expense: '7500.00', balance: '7000.00', generated_at: '2024-02-01 00:00:00' }
]

const loading = ref(false)
const currentParams = reactive({})

// 表格列定义
const todoColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'description', label: '描述', minWidth: 300 },
  { prop: 'status', label: '状态', width: 100, align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 180, align: 'center' },
  { prop: 'updated_at', label: '更新时间', width: 180, align: 'center' }
])

const transactionColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'type', label: '类型', width: 100, align: 'center' },
  { prop: 'amount', label: '金额', width: 120, align: 'right' },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'transaction_date', label: '交易日期', width: 150, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center' }
])

const reportColumns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'report_type', label: '报表类型', width: 120, align: 'center' },
  { prop: 'period', label: '周期', width: 100, align: 'center' },
  { prop: 'total_income', label: '总收入', width: 120, align: 'right' },
  { prop: 'total_expense', label: '总支出', width: 120, align: 'right' },
  { prop: 'balance', label: '结余', width: 120, align: 'right' },
  { prop: 'generated_at', label: '生成时间', width: 180, align: 'center' }
])

// 直接使用模拟数据
const todos = mockTodos
const transactions = mockTransactions
const reports = mockReports
const todosCount = mockTodos.length
const transactionsCount = mockTransactions.length
const reportsCount = mockReports.length

// 页面加载时获取所有数据
onMounted(() => {
  console.log('CashLogView mounted')
  fetchAllData()
})

// 获取所有数据（模拟）
const fetchAllData = async (params = {}) => {
  console.log('fetchAllData called with params:', params)
  loading.value = true
  try {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Data fetch completed (mock):')
    console.log('Todos:', todos)
    console.log('Transactions:', transactions)
    console.log('Reports:', reports)
    
    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('数据加载失败:', error)
    ElMessage.error('数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params) => {
  Object.assign(currentParams, params)
  fetchAllData(currentParams)
}

// 处理重置
const handleReset = () => {
  Object.keys(currentParams).forEach(key => delete currentParams[key])
  fetchAllData({})
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

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
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
</style>