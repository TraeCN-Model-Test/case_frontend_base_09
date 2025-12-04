<template>
  <div class="filter-form card">
    <h3 class="subtitle">筛选条件</h3>
    <el-form inline @submit.prevent="handleSubmit">
      <!-- 待办事项筛选条件 -->
      <template v-if="activeTab === 'todos'">
        <el-form-item label="状态">
          <el-select v-model="filters.todos.status" placeholder="选择状态">
            <el-option label="全部" value="all" />
            <el-option label="待办" value="todo" />
            <el-option label="进行中" value="doing" />
            <el-option label="已完成" value="done" />
          </el-select>
        </el-form-item>

        <el-form-item label="分类">
          <el-input v-model="filters.todos.category" placeholder="输入分类" clearable />
        </el-form-item>

        <el-form-item label="截止日期">
          <el-date-picker
            v-model="filters.todos.deadlineRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-input v-model="filters.todos.tags" placeholder="输入标签，多个用逗号分隔" clearable />
        </el-form-item>
      </template>

      <!-- 交易记录筛选条件 -->
      <template v-if="activeTab === 'transactions'">
        <el-form-item label="交易类型">
          <el-select v-model="filters.transactions.transaction_type" placeholder="选择类型">
            <el-option label="全部" value="all" />
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
        </el-form-item>

        <el-form-item label="月份">
          <el-date-picker
            v-model="filters.transactions.month"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            clearable
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-input v-model="filters.transactions.category" placeholder="输入分类" clearable />
        </el-form-item>

        <el-form-item label="标签">
          <el-input v-model="filters.transactions.tags" placeholder="输入标签，多个用逗号分隔" clearable />
        </el-form-item>
      </template>

      <!-- 财务报表筛选条件 -->
      <template v-if="activeTab === 'reports'">
        <el-form-item label="时间维度">
          <el-select v-model="filters.reports.time_dimension" placeholder="选择时间维度">
            <el-option label="日报" value="daily" />
            <el-option label="周报" value="weekly" />
            <el-option label="月报" value="monthly" selected />
            <el-option label="季报" value="quarterly" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="filters.reports.time_dimension === 'custom'" label="日期范围">
          <el-date-picker
            v-model="filters.reports.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-input v-model="filters.reports.categories" placeholder="输入分类，多个用逗号分隔" clearable />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    default: 'todos'
  }
})

const emit = defineEmits(['search', 'reset'])

const filters = reactive({
  todos: {
    status: 'all',
    category: '',
    deadlineRange: null,
    tags: ''
  },
  transactions: {
    transaction_type: 'all',
    month: '',
    category: '',
    tags: ''
  },
  reports: {
    time_dimension: 'monthly',
    dateRange: null,
    categories: ''
  }
})

// 监听activeTab变化，重置对应tab的筛选条件
watch(
  () => props.activeTab,
  (newTab, oldTab) => {
    console.log('Active tab changed from', oldTab, 'to', newTab)
    
    // 确保切换标签页时默认值正确显示
    if (newTab === 'todos') {
      // 确保待办事项的"全部"选项被选中
      if (filters.todos.status === undefined || filters.todos.status === null) {
        filters.todos.status = 'all'
      }
    } else if (newTab === 'transactions') {
      // 确保交易记录的"全部"选项被选中
      if (filters.transactions.transaction_type === undefined || filters.transactions.transaction_type === null) {
        filters.transactions.transaction_type = 'all'
      }
    } else if (newTab === 'reports') {
      // 确保财务报表的"月报"选项被选中
      if (filters.reports.time_dimension === undefined || filters.reports.time_dimension === null) {
        filters.reports.time_dimension = 'monthly'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  let params = {}
  
  // 根据当前tab页构建不同的参数
  if (props.activeTab === 'todos') {
    params = {
      status: filters.todos.status === 'all' ? '' : filters.todos.status,
      category: filters.todos.category,
      tags: filters.todos.tags
    }
    
    // 处理截止日期范围
    if (filters.todos.deadlineRange && filters.todos.deadlineRange.length === 2) {
      if (filters.todos.deadlineRange[0] > filters.todos.deadlineRange[1]) {
        ElMessage.error('开始日期不能晚于结束日期')
        return
      }
      params.deadline_before = filters.todos.deadlineRange[1]
      params.deadline_after = filters.todos.deadlineRange[0]
    }
  } 
  else if (props.activeTab === 'transactions') {
    params = {
      transaction_type: filters.transactions.transaction_type === 'all' ? '' : filters.transactions.transaction_type,
      month: filters.transactions.month,
      category: filters.transactions.category,
      tags: filters.transactions.tags
    }
  } 
  else if (props.activeTab === 'reports') {
    params = {
      time_dimension: filters.reports.time_dimension,
      categories: filters.reports.categories
    }
    
    // 处理自定义日期范围
    if (filters.reports.time_dimension === 'custom' && 
        filters.reports.dateRange && 
        filters.reports.dateRange.length === 2) {
      if (filters.reports.dateRange[0] > filters.reports.dateRange[1]) {
        ElMessage.error('开始日期不能晚于结束日期')
        return
      }
      params.start = filters.reports.dateRange[0]
      params.end = filters.reports.dateRange[1]
    }
  }

  emit('search', params)
}

const handleReset = () => {
  if (props.activeTab === 'todos') {
    filters.todos.status = 'all'
    filters.todos.category = ''
    filters.todos.deadlineRange = null
    filters.todos.tags = ''
  } 
  else if (props.activeTab === 'transactions') {
    filters.transactions.transaction_type = 'all'
    filters.transactions.month = ''
    filters.transactions.category = ''
    filters.transactions.tags = ''
  } 
  else if (props.activeTab === 'reports') {
    filters.reports.time_dimension = 'monthly'
    filters.reports.dateRange = null
    filters.reports.categories = ''
  }
  
  emit('reset')
}

// 确保组件初始化时默认值正确
const initFilters = () => {
  // 待办事项默认显示"全部"
  filters.todos.status = 'all'
  filters.todos.category = ''
  filters.todos.deadlineRange = null
  filters.todos.tags = ''
  
  // 交易记录默认显示"全部"
  filters.transactions.transaction_type = 'all'
  filters.transactions.month = ''
  filters.transactions.category = ''
  filters.transactions.tags = ''
  
  // 财务报表默认显示"月报"
  filters.reports.time_dimension = 'monthly'
  filters.reports.dateRange = null
  filters.reports.categories = ''
}

// 组件挂载时初始化过滤器
initFilters()
</script>

<style scoped>
.filter-form {
  margin-bottom: 24px;
}

.subtitle {
  margin-bottom: 16px;
  color: #333;
}

/* 修复选择框显示问题 */
:deep(.el-select) {
  width: 180px;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-select .el-input__inner) {
  color: #606266;
}

/* 确保选项文本可见 */
:deep(.el-select-dropdown__item) {
  color: #606266;
}

/* 选中项样式 */
:deep(.el-select-dropdown__item.selected) {
  color: #409eff;
  font-weight: bold;
}

/* 修复选择框中选中文本不显示的问题 */
:deep(.el-select .el-input.is-focus .el-input__inner),
:deep(.el-select .el-input__inner) {
  color: #606266;
}

/* 确保默认值显示 */
:deep(.el-select .el-input__inner::placeholder) {
  color: #606266;
}

/* 确保选中的值正确显示 */
:deep(.el-select .el-input__inner) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* 日期选择器样式 */
:deep(.el-date-editor) {
  width: 240px;
}

/* 输入框样式 */
:deep(.el-input) {
  width: 180px;
}

/* 表单项间距调整 */
:deep(.el-form-item) {
  margin-right: 16px;
  margin-bottom: 16px;
}

/* 表单容器样式 */
:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
}

/* 筛选条件组样式 */
.filter-section {
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

/* 响应式调整 */
@media (max-width: 768px) {
  :deep(.el-form-item) {
    margin-right: 0;
    width: 100%;
  }
  
  :deep(.el-select),
  :deep(.el-input),
  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>