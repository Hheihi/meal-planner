# Plan 11：饮食记录模块

> **阶段**：Phase 2 — 菜单 + 记录
> **前置依赖**：Plan 09（今日菜单确认完成 → 自动生成记录）、Plan 06（NutritionBar）
> **产出目标**：饮食记录日历视图 + 日详情 + 手动记录功能闭环

---

## 1. 任务清单

### 1.1 类型定义

- [ ] 创建 `src/types/record.ts`，定义：
  - `DietRecord` — 饮食记录 `{ id, recordType, dishId?, dishName?, dishImageUrl?, manualText?, nutrition? }`
  - `MealRecords` — 单餐记录 `{ records, nutritionSubtotal }`
  - `DailyDetail` — 日详情 `{ date, meals: { breakfast, lunch, dinner, other }, nutritionTotal }`
  - `CalendarMarks` — 月度标记 `{ year, month, datesWithRecords: number[] }`

### 1.2 记录 API

- [ ] 创建 `src/api/record.ts`：
  - `getCalendar(year, month)` → `GET /v1/records/calendar?year=&month=`
  - `getDaily(date)` → `GET /v1/records/daily?date=`
  - `addManual(params)` → `POST /v1/records/manual`
  - `deleteRecord(recordId)` → `DELETE /v1/records/:id`

### 1.3 日历视图页

- [ ] 页面路径：`src/pages/record/index/`
- [ ] 页面配置：`navigationBarTitleText: '饮食记录'`
- [ ] **页面结构**：
  1. 月份切换头部（← 2026年3月 →）
  2. 日历网格（7 列 × 4-6 行）
  3. 选中日期的饮食详情区域
- [ ] **日历实现**：
  - 左右箭头切换月份
  - 有饮食记录的日期底部显示小圆点标记
  - 当天高亮显示
  - 未来日期不可点击（置灰）
  - 点击某天 → 下方展示该天的饮食详情
  - 默认选中当天
- [ ] **数据加载**：
  - 页面加载时请求当月标记数据 `getCalendar()`
  - 选中日期后请求日详情 `getDaily()`
  - 切换月份时重新请求标记数据

### 1.4 日详情展示

- [ ] 在日历页下方展示（也可作为独立页面 `src/pages/record/detail/`）
- [ ] **展示结构**：
  1. 日期 + 星期
  2. 全天营养汇总（`NutritionSummary`）
  3. 各餐次记录：
     - 自动记录（`recordType=1`）：菜品名 + 热量，点击可跳转菜品详情
     - 手动记录（`recordType=2`）：纯文字展示
  4. 每餐营养小计
  5. "其他"分类下的手动记录
- [ ] 底部"添加记录"按钮

### 1.5 手动文字记录

- [ ] 点击"添加记录" → 弹出输入弹窗：
  - 餐次选择：单选（早餐 / 午餐 / 晚餐 / 其他）
  - 文字输入框（限 200 字，显示字数计数）
  - 保存按钮
- [ ] 调用 `recordApi.addManual()` 提交
- [ ] 保存成功 → 刷新当日详情，Toast 提示
- [ ] 手动记录支持删除（仅 `recordType=2`）

---

## 2. 关联文档

- `05-饮食记录.md`：全文（日历视图、日详情、手动记录、API 接口）
- `08-前端架构设计.md`：第 8.1 节（记录模块路由与数据加载时机）

## 3. 验收标准

1. 日历正确展示当月日期，有记录的日期显示圆点标记
2. 切换月份日历和标记数据正确刷新
3. 点击日期显示该天的饮食详情
4. 自动记录和手动记录分别正确展示
5. 营养汇总（全天总计 + 每餐小计）计算正确
6. 手动记录添加 / 删除功能正常
7. 点击自动记录的菜品可跳转详情页
