<template>
  <div class="filter-form card">
    <h3 class="subtitle">筛选条件</h3>
    <el-form inline @submit.prevent="handleSubmit">
      <el-form-item label="类型">
        <el-select v-model="filters.type" placeholder="选择类型" clearable>
          <el-option label="全部" value="" />
          <el-option label="收入" value="income" />
          <el-option label="支出" value="expense" />
          <el-option label="待办" value="todo" />
        </el-select>
      </el-form-item>

      <el-form-item label="日期范围">
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          clearable
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="filters.status" placeholder="选择状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="已完成" value="completed" />
          <el-option label="进行中" value="pending" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset'])

const filters = reactive({
  type: '',
  dateRange: null,
  status: ''
})

const handleSubmit = () => {
  // 验证日期范围
  if (filters.dateRange && filters.dateRange.length === 2) {
    if (filters.dateRange[0] > filters.dateRange[1]) {
      ElMessage.error('开始日期不能晚于结束日期')
      return
    }
  }

  // 转换为API参数格式
  const params = {
    type: filters.type,
    status: filters.status
  }

  if (filters.dateRange && filters.dateRange.length === 2) {
    params.start_date = filters.dateRange[0]
    params.end_date = filters.dateRange[1]
  }

  emit('search', params)
}

const handleReset = () => {
  filters.type = ''
  filters.dateRange = null
  filters.status = ''
  emit('reset')
}
</script>

<style scoped>
.filter-form {
  margin-bottom: 24px;
}

.subtitle {
  margin-bottom: 16px;
  color: #333;
}
</style>