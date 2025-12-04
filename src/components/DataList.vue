<template>
  <div class="data-list card">
    <div class="list-header">
      <h3 class="subtitle">{{ title }}</h3>
      <span class="count">{{ data.length }} 条记录</span>
    </div>
    
    <el-table
      :data="paginatedData"
      border
      stripe
      style="width: 100%"
      :loading="loading"
      empty-text="暂无数据"
    >
      <!-- 动态渲染列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'left'"
        :sortable="column.sortable"
      >
        <template #default="scope">
          <slot :name="column.prop" :row="(scope || {}).row || {}" :column="column">
            <!-- 金额列特殊处理，根据正负值显示不同颜色 -->
            <span v-if="column.prop === 'amount'" :class="getAmountClass(((scope || {}).row || {})[column.prop], ((scope || {}).row || {}).transaction_type)">
              {{ formatValue(((scope || {}).row || {})[column.prop], column.format) }}
            </span>
            <!-- 状态列特殊处理，使用StatusTag组件 -->
            <StatusTag 
              v-else-if="column.prop === 'status' || column.prop === 'status_text'" 
              :status="((scope || {}).row || {})[column.prop]"
              :status-text="formatValue(((scope || {}).row || {})[column.prop], column.format)"
              size="small"
            />
            <!-- 标签列特殊处理，使用TagDisplay组件 -->
            <TagDisplay 
              v-else-if="column.prop === 'tags' || column.prop === 'labels'" 
              :tags="((scope || {}).row || {})[column.prop]"
              tag-type="tag"
              size="small"
              effect="plain"
            />
            <!-- 优先级列特殊处理 -->
            <el-tag v-else-if="column.prop === 'priority'" :type="getPriorityType(((scope || {}).row || {})[column.prop])" size="small">
              {{ formatValue(((scope || {}).row || {})[column.prop], column.format) }}
            </el-tag>
            <!-- 其他列正常处理 -->
            <span v-else>
              {{ formatValue(((scope || {}).row || {})[column.prop], column.format) }}
            </span>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <div v-if="pagination && pagination.total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="false"
        :disabled="loading"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <div v-if="data.length === 0 && !loading" class="empty-state">
      <el-empty description="暂无数据，请调整筛选条件后重试" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import StatusTag from './StatusTag.vue'
import TagDisplay from './TagDisplay.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['page-change'])

// 计算当前页显示的数据
const paginatedData = computed(() => {
  if (!props.pagination) {
    return props.data
  }
  
  const { currentPage, pageSize } = props.pagination
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  return props.data.slice(start, end)
})

// 处理页码变化
const handleCurrentChange = (page) => {
  if (props.pagination) {
    props.pagination.currentPage = page
    emit('page-change', page)
  }
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  if (props.pagination) {
    props.pagination.pageSize = size
    // 重置到第一页
    props.pagination.currentPage = 1
    emit('page-change', 1)
  }
}

const formatValue = (value, format) => {
  if (value === null || value === undefined) {
    return '-' 
  }
  
  // 日期格式化
  if (format && (format.includes('date') || format.includes('time') || format.includes('created') || format.includes('updated'))) {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
  
  // 金额格式化
  if (format && (format.includes('amount') || format.includes('money') || format.includes('price'))) {
    // 显示金额，不添加正负号，通过颜色区分收入和支出
    const numValue = Number(value)
    const formattedValue = `¥${Math.abs(numValue).toFixed(2)}`
    return formattedValue
  }
  
  // 状态格式化
  if (format === 'status') {
    const statusMap = {
      completed: '已完成',
      pending: '进行中',
      cancelled: '已取消',
      success: '成功',
      failed: '失败',
      todo: '待办',
      doing: '进行中',
      done: '已完成'
    }
    return statusMap[value] || value
  }
  
  // 类型格式化
  if (format === 'type') {
    const typeMap = {
      income: '收入',
      expense: '支出',
      transfer: '转账',
      '收入': '收入',
      '支出': '支出'
    }
    return typeMap[value] || value
  }
  
  return value
}

// 获取金额的样式类
const getAmountClass = (value, transactionType) => {
  if (value === null || value === undefined) {
    return ''
  }
  
  // 如果有交易类型，优先根据交易类型判断
  if (transactionType) {
    if (transactionType === 'income' || transactionType === '收入') {
      return 'amount-income'
    } else if (transactionType === 'expense' || transactionType === '支出') {
      return 'amount-expense'
    }
  }
  
  // 否则根据金额正负值判断
  const numValue = Number(value)
  if (numValue > 0) {
    return 'amount-income'
  } else if (numValue < 0) {
    return 'amount-expense'
  }
  return ''
}

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    'completed': 'success',
    'done': 'success',
    '进行中': 'warning',
    'pending': 'warning',
    'doing': 'warning',
    '已取消': 'danger',
    'cancelled': 'danger',
    'failed': 'danger',
    '失败': 'danger',
    '待办': 'info',
    'todo': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取优先级标签类型
const getPriorityType = (priority) => {
  const priorityMap = {
    '高': 'danger',
    'high': 'danger',
    '中': 'warning',
    'medium': 'warning',
    '低': 'info',
    'low': 'info'
  }
  return priorityMap[priority] || 'info'
}

// 解析标签字符串为数组
const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  // 如果是字符串，按逗号分割
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
  return []
}

// 获取标签颜色
const getTagColor = (tag) => {
  // 为常见标签定义颜色
  const tagColors = {
    '工作': '#409EFF',
    '个人': '#67C23A',
    '学习': '#E6A23C',
    '紧急': '#F56C6C',
    '重要': '#F56C6C',
    '家庭': '#909399',
    '健康': '#67C23A',
    '财务': '#E6A23C',
    '购物': '#409EFF',
    '娱乐': '#909399',
    '出行': '#409EFF',
    '会议': '#F56C6C',
    '项目': '#E6A23C'
  }
  
  // 如果有预定义颜色，返回它
  if (tagColors[tag]) {
    return tagColors[tag]
  }
  
  // 否则根据标签名称生成一个颜色
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}
</script>

<style scoped>
.data-list {
  margin-bottom: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.count {
  color: #666;
  font-size: 14px;
}

.empty-state {
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 10px 0;
}

@media (max-width: 768px) {
  .pagination-container {
    justify-content: center;
  }
}

/* 金额样式 */
.amount-income {
  color: #52c41a;
  font-weight: 600;
}

.amount-expense {
  color: #ff4d4f;
  font-weight: 600;
}
</style>