# CashLog - 轻量化本地记账系统

## 项目简介

CashLog是一个基于Vue 3 + Vite + Element Plus构建的轻量化本地记账/待办管理系统。本项目采用渐进式开发方式，当前版本专注于实现简单但美观的交易记录查询功能，并提供完整的单元测试覆盖。

## 技术栈

- **前端框架**: Vue 3.5.24
- **构建工具**: Vite 7.2.4
- **UI组件库**: Element Plus 2.11.9
- **路由管理**: Vue Router 4.6.3
- **状态管理**: Pinia 3.0.4
- **HTTP请求**: Axios 1.13.2
- **日期处理**: Day.js 1.11.19
- **数据处理**: Lodash-es 4.17.21
- **图表库**: ECharts 6.0.0 + Vue-ECharts 8.0.1
- **CSS预处理器**: Sass 1.94.2
- **测试框架**: Vitest + @vue/test-utils + Playwright

## 功能特性

### 第一阶段功能

1. **简洁美观的主页面**
   - 顶部导航栏：显示"CashLog"标题
   - 主内容区：显示查询功能

2. **交易记录查询功能**
   - 从后端API获取交易记录列表
   - 使用Element Plus的Table组件展示数据
   - 基础筛选功能：按月份筛选交易记录
   - 简单的统计信息：显示总收入、总支出、净额

3. **页面设计**
   - 使用Element Plus组件库，确保界面美观
   - 响应式设计，适配不同屏幕尺寸
   - 柔和的配色方案，简洁现代的UI风格
   - 适当的过渡效果和微交互

## 项目结构

```
cash_frontend_base_09/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── DataList.vue   # 数据列表组件
│   │   ├── FilterForm.vue # 筛选表单组件
│   │   ├── StatusTag.vue  # 状态标签组件
│   │   └── TagDisplay.vue # 标签显示组件
│   ├── stores/            # Pinia状态管理
│   │   └── dataStore.js   # 数据状态管理
│   ├── styles/            # 全局样式
│   │   ├── global.scss    # 全局样式
│   │   └── variables.scss # SCSS变量
│   ├── utils/             # 工具函数
│   │   ├── dataTransform.js # 数据转换工具
│   │   └── request.js     # 请求封装
│   ├── views/             # 页面视图
│   │   └── CashLogView.vue # 现金日志视图
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── style.css          # 基础样式
├── tests/                 # 测试文件
│   ├── unit/              # 单元测试
│   │   ├── api/           # API测试
│   │   ├── components/    # 组件测试
│   │   ├── stores/        # Store测试
│   │   └── utils/         # 工具函数测试
│   └── e2e/               # 端到端测试
├── coverage/              # 测试覆盖率报告
├── docs/                  # 文档
│   └── 后端接口文档.md     # 后端API文档
├── vite.config.js         # Vite配置
└── vitest.config.js       # Vitest配置
```

## 后端API接口

- `GET /api/transactions/` - 获取交易记录列表（支持query参数：month，格式 YYYY-MM）
- `GET /api/reports/summary/` - 获取收支汇总信息（支持query参数：month，格式 YYYY-MM）
- `GET /api/todos/` - 获取待办事项列表
- `GET /api/reports/` - 生成多维度收支报表
- `POST /api/data/backup` - 创建数据库备份
- `POST /api/data/restore` - 从备份文件恢复数据库

详细的API文档请参考 [后端接口文档.md](docs/后端接口文档.md)

## 开发指南

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 测试

### 运行单元测试

```bash
npm run test:unit
```

### 运行端到端测试

```bash
npm run test:e2e
```

### 运行所有测试

```bash
npm run test
```

### 测试覆盖率

```bash
npm run test:coverage
```

## 测试要求

### 测试范围

1. **单元测试**
   - 覆盖Pinia Store（收支状态、筛选逻辑）
   - Axios请求封装（拦截器、接口调用）
   - 组件核心方法（月份筛选、统计计算）
   - 数据转换工具函数

2. **组件测试**
   - 验证页面渲染（导航栏、表格、筛选器、统计卡片）
   - 交互逻辑（月份筛选触发表格刷新、空数据展示）
   - 响应式适配（不同屏幕尺寸布局）

3. **E2E测试**
   - 模拟真实浏览器操作
   - 验证「页面加载 → 筛选月份 → 表格数据更新 → 统计信息同步」全流程
   - 捕获浏览器控制台所有error/warning级别报错

### 测试标准

1. 所有测试用例通过率100%，不允许跳过任何用例
2. 捕获控制台报错：一旦出现console.error/console.warn，对应测试用例直接失败
3. 覆盖核心场景：空数据、接口请求失败、有效筛选、无效筛选（如不存在的月份）

## 开发计划

- [x] 第一阶段：实现交易记录查询功能
- [x] 第二阶段：添加待办事项管理功能
- [ ] 第三阶段：完善报表功能
- [ ] 第四阶段：添加数据导入导出功能

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。