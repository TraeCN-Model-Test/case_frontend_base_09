<template>
  <div class="data-list card">
    <div class="list-header">
      <h3 class="subtitle">{{ title }}</h3>
      <span class="count">{{ data.length }} 条记录</span>
    </div>
    
    <el-table
      :data="data"
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
            {{ formatValue(((scope || {}).row || {})[column.prop], column.format) }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="data.length === 0 && !loading" class="empty-state">
      <el-empty description="暂无数据，请调整筛选条件后重试" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

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
  }
})

const formatValue = (value, prop) => {
  if (value === null || value === undefined) {
    return '-' 
  }
  
  // 日期格式化
  if (prop.includes('date') || prop.includes('time') || prop.includes('created') || prop.includes('updated')) {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
  
  // 金额格式化
  if (prop.includes('amount') || prop.includes('money') || prop.includes('price')) {
    return `¥${Number(value).toFixed(2)}`
  }
  
  // 状态格式化
  if (prop === 'status') {
    const statusMap = {
      completed: '已完成',
      pending: '进行中',
      cancelled: '已取消',
      success: '成功',
      failed: '失败'
    }
    return statusMap[value] || value
  }
  
  // 类型格式化
  if (prop === 'type') {
    const typeMap = {
      income: '收入',
      expense: '支出',
      transfer: '转账',
      todo: '待办'
    }
    return typeMap[value] || value
  }
  
  return value
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
</style>