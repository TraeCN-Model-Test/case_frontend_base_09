/**
 * API响应数据格式转换工具
 * 用于处理后端返回的数据格式，转换为前端组件需要的格式
 */

/**
 * 转换待办事项数据格式
 * @param {Object} backendData - 后端返回的待办事项数据
 * @returns {Object} 转换后的数据格式
 */
export const transformTodoData = (backendData) => {
  if (!backendData) return null
  
  // 如果是列表数据
  if (backendData.items) {
    return {
      data: backendData.items.map(item => ({
        id: item.id,
        content: item.content, // 保持content字段不变，与表格列定义一致
        description: `${item.category || ''} - ${item.tags || ''}`, // 组合category和tags作为description
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        tags: item.tags,
        deadline: item.deadline,
        status_text: item.status_text
      })),
      // 保留原始分页信息在根级别，同时提供pagination对象以保持兼容性
      total: backendData.total,
      page: backendData.page,
      size: backendData.size,
      pages: backendData.pages,
      pagination: { // 提供pagination对象以保持兼容性
        total: backendData.total,
        page: backendData.page,
        size: backendData.size,
        pages: backendData.pages
      }
    }
  }
  
  // 单个数据项
  return {
    id: backendData.id,
    content: backendData.content, // 保持content字段不变，与表格列定义一致
    description: `${backendData.category || ''} - ${backendData.tags || ''}`, // 组合category和tags作为description
    status: backendData.status,
    created_at: backendData.created_at,
    updated_at: backendData.updated_at,
    category: backendData.category,
    tags: backendData.tags,
    deadline: backendData.deadline,
    status_text: backendData.status_text
  }
}

/**
 * 转换交易记录数据格式
 * @param {Object} backendData - 后端返回的交易记录数据
 * @returns {Object} 转换后的数据格式
 */
export const transformTransactionData = (backendData) => {
  if (!backendData) return null
  
  // 如果是列表数据
  if (backendData.items) {
    return {
      data: backendData.items.map(item => ({
        id: item.id,
        type: item.amount >= 0 ? 'income' : 'expense', // 根据金额正负判断类型
        amount: Math.abs(item.amount), // 使用绝对值
        description: item.notes || item.category, // 优先使用notes，否则使用category
        transaction_date: item.created_at, // 使用created_at作为transaction_date
        status: 'success', // 默认状态为success
        category: item.category,
        tags: item.tags,
        notes: item.notes,
        transaction_type: item.transaction_type,
        month: item.month
      })),
      // 保留原始分页信息在根级别，同时提供pagination对象以保持兼容性
      total: backendData.total,
      page: backendData.page,
      size: backendData.size,
      pages: backendData.pages,
      pagination: { // 提供pagination对象以保持兼容性
        total: backendData.total,
        page: backendData.page,
        size: backendData.size,
        pages: backendData.pages
      }
    }
  }
  
  // 单个数据项
  return {
    id: backendData.id,
    type: backendData.amount >= 0 ? 'income' : 'expense', // 根据金额正负判断类型
    amount: Math.abs(backendData.amount), // 使用绝对值
    description: backendData.notes || backendData.category, // 优先使用notes，否则使用category
    transaction_date: backendData.created_at, // 使用created_at作为transaction_date
    status: 'success', // 默认状态为success
    category: backendData.category,
    tags: backendData.tags,
    notes: backendData.notes,
    transaction_type: backendData.transaction_type,
    month: backendData.month
  }
}

/**
 * 转换报表数据格式
 * @param {Object} backendData - 后端返回的报表数据
 * @returns {Object} 转换后的数据格式
 */
export const transformReportData = (backendData) => {
  if (!backendData) return null
  
  // 报表API返回的是单个报表对象，不是列表，所以不需要处理items数组
  // 直接返回转换后的单个报表对象
  const report = {
    id: Date.now(), // 生成临时ID
    report_type: backendData.time_dimension || 'monthly', // 使用report_type替代time_dimension，并提供默认值
    period: backendData.period,
    total_income: backendData.total_income || 0,
    total_expense: Math.abs(backendData.total_expense || 0), // 确保total_expense是绝对值
    balance: backendData.balance || 0,
    transaction_count: backendData.transaction_count || 0,
    generated_at: new Date().toISOString(), // 添加生成时间
    categories: backendData.category_stats || {},
    has_data: backendData.has_data || false,
    comparison: backendData.comparison || {}
  }
  
  // 为了保持与其他API的一致性，将报表对象包装在data数组中
  // 并添加分页信息，total设为1（因为只有一个报表）
  return {
    data: [report],
    // 报表API不返回分页信息，但为了保持一致性，我们提供默认值
    total: 1,
    page: 1,
    size: 1,
    pages: 1,
    pagination: {
      total: 1,
      page: 1,
      size: 1,
      pages: 1
    }
  }
}