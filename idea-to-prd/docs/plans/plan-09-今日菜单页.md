# Plan 09：今日菜单页

> **阶段**：Phase 2 — 菜单 + 记录
> **前置依赖**：Plan 08（MealSelector / NutritionSummary 组件）、Plan 02（请求层）
> **产出目标**：今日菜单页功能闭环（查看 / 添加 / 移除 / 营养汇总 / 确认完成）

---

## 1. 任务清单

### 1.1 类型定义

- [ ] 创建 `src/types/menu.ts`，定义：
  - `MealDish` — 菜单中的菜品 `{ id, dishId, name, imageUrl, nutrition }`
  - `MealData` — 单餐数据 `{ dishes, isConfirmed, nutritionSubtotal }`
  - `TodayMenu` — 今日菜单 `{ date, meals: { breakfast, lunch, dinner }, nutritionTotal }`

### 1.2 菜单 API

- [ ] 创建 `src/api/menu.ts`（参照 `08-前端架构设计.md` 第 4.3 节）：
  - `getToday()` → `GET /v1/menus/today`
  - `addDish(params)` → `POST /v1/menus/dishes`
  - `removeDish(menuItemId)` → `DELETE /v1/menus/dishes/:id`
  - `confirm(date, mealType)` → `POST /v1/menus/confirm`
  - `unconfirm(date, mealType)` → `POST /v1/menus/unconfirm`

### 1.3 菜单状态管理（useMenuStore）

- [ ] 创建 `src/stores/useMenuStore.ts`：
  - 状态：`todayMenu`, `loading`
  - Action：`fetchToday()` — 获取今日菜单
  - Action：`addDish(dishId, mealType)` — 添加菜品 + 刷新
  - Action：`removeDish(menuItemId)` — 移除菜品 + 刷新
  - Action：`confirmMeal(mealType)` — 确认完成 + 刷新
  - Action：`unconfirmMeal(mealType)` — 取消确认 + 刷新

### 1.4 今日菜单页（TabBar 页）

- [ ] 页面路径：`src/pages/menu/today/`
- [ ] 页面配置：`navigationBarTitleText: '今日菜单'`, `enablePullDownRefresh: true`
- [ ] **页面结构**：
  1. 标题区：日期显示
  2. 全天营养汇总（`NutritionSummary` 组件）
  3. 三个餐次区块（早餐 / 午餐 / 晚餐），每个区块包含：
     - 餐次标题 + 图标
     - 菜品列表（缩略图 + 名称 + 热量 + 删除按钮 ✕）
     - 营养小计
     - 底部操作："+ 添加菜品" + "确认完成"
- [ ] **交互实现**：
  - 删除菜品：点击 ✕ → 弹出确认对话框 → 确认后调用 `removeDish`
  - 添加菜品：点击"+ 添加菜品" → 跳转菜系浏览页或搜索页
  - 确认完成：点击 → 弹出确认对话框 → 确认后调用 `confirmMeal`
  - 取消确认：已完成的餐次显示"取消完成"入口
  - 已确认的餐次：菜品不可删除，不可添加
- [ ] **数据加载**：
  - `useDidShow` 每次切回刷新数据
  - 下拉刷新
- [ ] 状态处理：
  - 加载中 → Skeleton
  - 某餐无菜品 → 显示"暂无菜品" + "添加菜品"按钮
  - 空菜单点击确认 → 按钮置灰

### 1.5 菜品详情页底部按钮对接

- [ ] 回到 Plan 06 的菜品详情页，对接底部三按钮的实际逻辑：
  - 点击"加入早餐/午餐/晚餐" → 调用 `useMenuStore.addDish()`
  - 成功 → Toast "已加入午餐菜单"，对应按钮变灰
  - 重复 → Toast "该菜品已在午餐菜单中"
  - 失败 → Toast "添加失败，请重试"

---

## 2. 关联文档

- `04-今日菜单.md`：全文（功能清单、详细需求、API 接口、边界处理）
- `08-前端架构设计.md`：第 4.3 节（API 示例）、第 5.2 节（useMenuStore）
- `07-首页与菜品详情.md`：第 4.3 节（底部操作栏）

## 3. 验收标准

1. 今日菜单页三餐区块正确展示菜品列表和营养汇总
2. 添加菜品 → 跳转浏览/搜索 → 选菜 → 返回菜单页数据已更新
3. 删除菜品有确认弹窗，删除后营养汇总实时更新
4. 确认完成后餐次变为已完成状态，菜品不可编辑
5. 取消确认后恢复可编辑状态
6. 菜品详情页底部按钮可正常加入菜单
