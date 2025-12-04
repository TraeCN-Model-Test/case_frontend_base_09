const { test, expect } = require('@playwright/test');

test('页面加载并显示标题', async ({ page }) => {
  // 导航到应用
  await page.goto('http://localhost:5173');

  // 检查页面标题
  await expect(page).toHaveTitle('CashLog - 资金日志查询');

  // 检查主标题
  await expect(page.locator('h1')).toHaveText('资金日志查询');
});

test('筛选表单和数据列表正常显示', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 检查筛选表单存在
  await expect(page.locator('.filter-form')).toBeVisible();
  await expect(page.locator('.el-form-item')).toHaveCount(3); // 3个筛选字段
  await expect(page.locator('button:has-text("查询")')).toBeVisible();
  await expect(page.locator('button:has-text("重置")')).toBeVisible();

  // 检查数据列表存在
  await expect(page.locator('.data-section')).toHaveCount(3); // 3个数据列表
  await expect(page.locator('.data-card')).toHaveCount(3); // 3个统计卡片
});

test('查询功能正常工作', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 点击查询按钮
  await page.click('button:has-text("查询")');

  // 等待加载完成
  await page.waitForSelector('.el-table', { state: 'visible' });

  // 检查数据列表是否显示
  await expect(page.locator('.el-table')).toHaveCount(3);
});

test('重置功能正常工作', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 选择一些筛选条件
  await page.selectOption('select[name="type"]', 'income');
  await page.selectOption('select[name="status"]', 'completed');

  // 点击重置按钮
  await page.click('button:has-text("重置")');

  // 检查筛选条件是否被重置
  await expect(page.locator('select[name="type"]')).toHaveValue('');
  await expect(page.locator('select[name="status"]')).toHaveValue('');
});

test('数据列表加载状态显示', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 点击查询按钮
  await page.click('button:has-text("查询")');

  // 检查加载状态显示
  await expect(page.locator('.el-loading-mask')).toBeVisible({ timeout: 1000 });
});

test('统计卡片显示正确', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 等待统计卡片加载
  await page.waitForSelector('.data-card', { state: 'visible' });

  // 检查统计卡片内容
  const cards = page.locator('.data-card');
  await expect(cards.nth(0)).toContainText('待办事项');
  await expect(cards.nth(1)).toContainText('交易记录');
  await expect(cards.nth(2)).toContainText('报表数据');
});

test('表格列显示正确', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 等待表格加载
  await page.waitForSelector('.el-table', { state: 'visible' });

  // 检查第一个表格的列
  const firstTable = page.locator('.el-table').nth(0);
  await expect(firstTable.locator('.el-table__header th')).toHaveCount(4); // ID、标题、状态、创建时间
});

test('响应式设计测试', async ({ page }) => {
  // 测试移动端视图
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5173');

  // 检查筛选表单在移动端是否垂直排列
  await expect(page.locator('.filter-form')).toHaveCSS('flex-direction', 'column');

  // 测试平板视图
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator('.filter-form')).toHaveCSS('flex-direction', 'row');

  // 测试桌面视图
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.locator('.filter-form')).toHaveCSS('flex-direction', 'row');
});