# 单元测试计划

## 概述
本文档描述了CashLog前端项目的单元测试计划，基于对项目代码结构和业务逻辑的分析，确定了需要测试的核心功能和优先级。

## 测试优先级

### 高优先级 (立即实现)
1. **工具函数测试** - 纯函数，易于测试，业务逻辑核心
   - `src/utils/dataTransform.js` - 数据转换函数
   - `src/utils/request.js` - HTTP请求拦截器

2. **状态管理测试** - 应用状态核心
   - `src/stores/dataStore.js` - Pinia store的状态和操作

### 中优先级 (后续实现)
1. **API层测试** - 数据获取逻辑
   - `src/api/index.js` - API调用函数

2. **组件逻辑测试** - UI交互逻辑
   - `src/components/FilterForm.vue` - 表单验证和事件处理
   - `src/components/DataList.vue` - 数据格式化和展示
   - `src/views/CashLogView.vue` - 页面级逻辑

### 低优先级 (可选实现)
1. **E2E测试** - 完整用户流程测试
   - 使用Playwright进行端到端测试

## 具体测试计划

### 1. 工具函数测试

#### dataTransform.js测试
- `transformTodoData`函数测试
  - 测试空输入返回null
  - 测试列表数据格式转换
  - 测试单项数据格式转换
  - 测试边界情况处理

- `transformTransactionData`函数测试
  - 测试金额正负值转换为收入/支出类型
  - 测试列表数据格式转换
  - 测试单项数据格式转换
  - 测试边界情况处理

- `transformReportData`函数测试
  - 测试报表数据格式转换
  - 测试空数据情况
  - 测试嵌套数据处理

#### request.js测试
- 请求拦截器测试
  - 测试是否正确添加认证信息
  - 测试请求配置修改

- 响应拦截器测试
  - 测试成功响应处理
  - 测试各种错误状态码处理(400, 401, 403, 404, 500)
  - 测试网络错误处理
  - 测试请求配置错误处理

### 2. 状态管理测试

#### dataStore.js测试
- 初始状态测试
  - 验证store初始状态值

- Actions测试
  - `fetchTodos`测试
    - 测试成功获取数据
    - 测试参数传递
    - 测试错误处理
  - `fetchTransactions`测试
    - 测试成功获取数据
    - 测试参数传递
    - 测试错误处理
  - `fetchReports`测试
    - 测试成功获取数据
    - 测试参数传递
    - 测试错误处理
  - `resetState`测试
    - 测试状态重置功能

- Getters测试
  - `todosCount`测试
  - `transactionsCount`测试
  - `reportsCount`测试

### 3. API层测试

#### api/index.js测试
- `getTodos`函数测试
  - 测试参数传递
  - 测试数据转换调用
  - 测试错误处理

- `getTransactions`函数测试
  - 测试参数传递
  - 测试数据转换调用
  - 测试错误处理

- `getReports`函数测试
  - 测试参数传递
  - 测试数据转换调用
  - 测试错误处理

### 4. 组件测试

#### FilterForm.vue测试
- 表单渲染测试
- 表单验证测试
  - 测试日期范围验证
- 事件触发测试
  - 测试搜索事件触发
  - 测试重置事件触发
- 表单重置功能测试

#### DataList.vue测试
- 组件渲染测试
- 数据格式化函数测试
  - 测试日期格式化
  - 测试金额格式化
  - 测试状态格式化
  - 测试类型格式化
- 空状态处理测试

#### CashLogView.vue测试
- 组件渲染测试
- 数据获取流程测试
- 搜索功能测试
- 重置功能测试
- 错误处理测试

## 测试工具和框架

- **单元测试框架**: Vitest
- **组件测试**: @vue/test-utils
- **模拟库**: vi (Vitest内置)
- **E2E测试**: Playwright

## 测试文件结构

```
tests/
├── unit/
│   ├── utils/
│   │   ├── dataTransform.test.js
│   │   └── request.test.js
│   ├── stores/
│   │   └── dataStore.test.js
│   ├── api/
│   │   └── index.test.js
│   └── components/
│       ├── FilterForm.test.js
│       ├── DataList.test.js
│       └── views/
│           └── CashLogView.test.js
└── e2e/
    └── cash-log.spec.js
```

## 测试覆盖率目标

- 工具函数: 100%
- 状态管理: 95%
- API层: 90%
- 组件逻辑: 80%
- 整体覆盖率: 85%

## 实施计划

1. 第一阶段: 实现高优先级测试
   - 工具函数测试
   - 状态管理测试

2. 第二阶段: 实现中优先级测试
   - API层测试
   - 组件测试

3. 第三阶段: 实现低优先级测试
   - E2E测试

## 注意事项

1. 测试应该独立运行，不依赖外部服务
2. 使用模拟(mock)替代真实API调用
3. 测试应该覆盖正常情况、边界情况和异常情况
4. 保持测试代码简洁、可读性强
5. 定期运行测试，确保代码质量