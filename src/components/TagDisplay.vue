<template>
  <div class="tag-wrapper">
    <span v-if="!tags || tags.length === 0" class="no-tags">{{ emptyText || '无标签' }}</span>
    <div v-else class="tag-container">
      <el-tag
        v-for="(tag, index) in parsedTags"
        :key="index"
        :type="tagType"
        :size="size"
        :effect="effect"
        :class="['tag-item', `tag-${tagType}`]"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagDisplay',
  props: {
    // 标签内容，可以是字符串或数组
    tags: {
      type: [String, Array],
      default: () => []
    },
    // 标签类型：'category' | 'tag' | 'status'
    tagType: {
      type: String,
      default: 'tag',
      validator: (value) => ['category', 'tag', 'status'].includes(value)
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
      default: 'plain',
      validator: (value) => ['dark', 'light', 'plain'].includes(value)
    },
    // 无标签时的提示文本
    emptyText: {
      type: String,
      default: '无标签'
    }
  },
  computed: {
    // 解析标签，确保返回数组
    parsedTags() {
      if (!this.tags) return [];
      
      if (Array.isArray(this.tags)) {
        return this.tags.filter(tag => tag && tag.trim());
      }
      
      if (typeof this.tags === 'string') {
        // 尝试解析JSON字符串
        try {
          const parsed = JSON.parse(this.tags);
          return Array.isArray(parsed) ? parsed.filter(tag => tag && tag.trim()) : [this.tags];
        } catch (e) {
          // 如果不是JSON，尝试按逗号分隔
          return this.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }
      
      return [];
    }
  }
}
</script>

<style scoped>
.tag-wrapper {
  width: 100%;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  margin: 0;
  transition: all 0.2s ease;
}

.tag-item:hover {
  transform: translateY(-1px);
}

.no-tags {
  color: #909399;
  font-size: 12px;
  font-style: italic;
}

/* 分类标签样式 */
.tag-category {
  background-color: rgba(64, 158, 255, 0.1);
  border-color: #409eff;
  color: #409eff;
}

/* 普通标签样式 */
.tag-tag {
  background-color: rgba(144, 147, 153, 0.1);
  border-color: #909399;
  color: #606266;
}

/* 状态标签样式 */
.tag-status {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: #67c23a;
  color: #67c23a;
}
</style>