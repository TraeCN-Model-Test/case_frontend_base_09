<template>
  <el-tag
    :type="statusType"
    :size="size"
    :effect="effect"
    :class="['status-tag', `status-${statusType}`]"
  >
    {{ statusText }}
  </el-tag>
</template>

<script>
export default {
  name: 'StatusTag',
  props: {
    // 状态值
    status: {
      type: [String, Number],
      required: true
    },
    // 自定义状态文本（可选）
    statusText: {
      type: String,
      default: ''
    },
    // 标签大小
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['large', 'default', 'small'].includes(value)
    },
    // 标签效果
    effect: {
      type: String,
      default: 'light',
      validator: (value) => ['dark', 'light', 'plain'].includes(value)
    }
  },
  computed: {
    // 根据状态值确定标签类型
    statusType() {
      const status = String(this.status).toLowerCase();
      
      // 已完成状态
      if (status === 'completed' || status === 'done' || status === '已完成' || status === '1') {
        return 'success';
      }
      
      // 进行中状态
      if (status === 'in_progress' || status === 'processing' || status === '进行中' || status === '2') {
        return 'primary';
      }
      
      // 待处理状态
      if (status === 'pending' || status === 'todo' || status === '待处理' || status === '待办' || status === '0') {
        return 'warning';
      }
      
      // 已取消状态
      if (status === 'cancelled' || status === 'canceled' || status === '已取消' || status === '3') {
        return 'info';
      }
      
      // 默认状态
      return 'info';
    },
    // 获取状态显示文本
    displayText() {
      if (this.statusText) {
        return this.statusText;
      }
      
      const status = String(this.status).toLowerCase();
      
      // 根据状态值返回对应的中文文本
      if (status === 'completed' || status === 'done' || status === '已完成' || status === '1') {
        return '已完成';
      }
      
      if (status === 'in_progress' || status === 'processing' || status === '进行中' || status === '2') {
        return '进行中';
      }
      
      if (status === 'pending' || status === 'todo' || status === '待处理' || status === '待办' || status === '0') {
        return '待处理';
      }
      
      if (status === 'cancelled' || status === 'canceled' || status === '已取消' || status === '3') {
        return '已取消';
      }
      
      // 如果没有匹配的预设状态，返回原始值
      return String(this.status);
    }
  }
}
</script>

<style scoped>
.status-tag {
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.status-tag:hover {
  transform: translateY(-1px);
}

/* 不同状态标签的特定样式 */
.status-success {
  border-color: #67c23a;
}

.status-primary {
  border-color: #409eff;
}

.status-warning {
  border-color: #e6a23c;
}

.status-info {
  border-color: #909399;
}
</style>