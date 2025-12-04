// 模拟数据
const mockTodos = [
  { id: 1, title: '完成财务报表', description: '制作月度财务报表', status: 'completed', created_at: '2025-12-01 10:00:00', updated_at: '2025-12-01 14:30:00' },
  { id: 2, title: '检查交易记录', description: '核对本月所有交易记录', status: 'pending', created_at: '2025-12-02 09:30:00', updated_at: '2025-12-02 09:30:00' },
  { id: 3, title: '生成报告', description: '生成年度财务报告', status: 'pending', created_at: '2025-12-03 11:00:00', updated_at: '2025-12-03 11:00:00' }
]

const mockTransactions = [
  { id: 1, type: 'income', amount: 5000.00, description: '工资收入', transaction_date: '2025-12-01', status: 'success' },
  { id: 2, type: 'expense', amount: 1200.00, description: '房租', transaction_date: '2025-12-02', status: 'success' },
  { id: 3, type: 'expense', amount: 350.00, description: '餐饮费用', transaction_date: '2025-12-03', status: 'success' },
  { id: 4, type: 'income', amount: 2000.00, description: '兼职收入', transaction_date: '2025-12-04', status: 'success' }
]

const mockReports = [
  { id: 1, report_type: 'monthly', period: '2025-12', total_income: 7000.00, total_expense: 1550.00, balance: 5450.00, generated_at: '2025-12-05 10:00:00' },
  { id: 2, report_type: 'weekly', period: '2025-12-01至2025-12-07', total_income: 7000.00, total_expense: 1550.00, balance: 5450.00, generated_at: '2025-12-07 14:00:00' }
]

// 模拟API请求
const mockApi = {
  getTodos: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...mockTodos]
        
        // 模拟筛选
        if (params.type) {
          data = data.filter(item => item.type === params.type)
        }
        if (params.status) {
          data = data.filter(item => item.status === params.status)
        }
        if (params.start_date && params.end_date) {
          data = data.filter(item => 
            item.created_at >= params.start_date && 
            item.created_at <= params.end_date
          )
        }
        
        resolve({ data })
      }, 500)
    })
  },
  
  getTransactions: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...mockTransactions]
        
        // 模拟筛选
        if (params.type) {
          data = data.filter(item => item.type === params.type)
        }
        if (params.status) {
          data = data.filter(item => item.status === params.status)
        }
        if (params.start_date && params.end_date) {
          data = data.filter(item => 
            item.transaction_date >= params.start_date && 
            item.transaction_date <= params.end_date
          )
        }
        
        resolve({ data })
      }, 500)
    })
  },
  
  getReports: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data = [...mockReports]
        
        // 模拟筛选
        if (params.report_type) {
          data = data.filter(item => item.report_type === params.report_type)
        }
        if (params.start_date && params.end_date) {
          data = data.filter(item => 
            item.generated_at >= params.start_date && 
            item.generated_at <= params.end_date
          )
        }
        
        resolve({ data })
      }, 500)
    })
  }
}

export default mockApi