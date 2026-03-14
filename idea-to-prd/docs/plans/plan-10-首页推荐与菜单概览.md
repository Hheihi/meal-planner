# Plan 10：首页推荐与菜单概览对接

> **阶段**：Phase 2 — 菜单 + 记录
> **前置依赖**：Plan 08（DishCard / MealSelector）、Plan 09（useMenuStore）
> **产出目标**：首页推荐区域和菜单概览区域数据对接完成，首页功能闭环

---

## 1. 任务清单

### 1.1 推荐 API

- [ ] 创建 `src/api/recommendation.ts`：
  - `getList(count?)` → `GET /v1/recommendations?count=10`
  - `refresh(excludeIds)` → `POST /v1/recommendations/refresh`

### 1.2 首页菜单概览区

- [ ] 对接 `useMenuStore.fetchToday()` 获取今日菜单数据
- [ ] 实现三个餐次卡片横排展示：
  - 餐次标签（早餐/午餐/晚餐）
  - 第一道菜品名称，超过 1 道显示"N 道菜"
  - 已确认显示 ✅
  - 未安排显示"暂未安排"
- [ ] 交互：
  - 点击单个餐次卡片 → `Taro.switchTab` 跳转今日菜单页
  - 右上角"查看全部" → 同上
- [ ] 状态：
  - 加载中 → 骨架屏（三个卡片占位）
  - 加载失败 → 简化文字"点击查看今日菜单"

### 1.3 首页推荐区域

- [ ] 调用 `recommendationApi.getList()` 获取推荐列表
- [ ] 使用 `DishCard`（size="large"）渲染推荐卡片流
- [ ] 交互：
  - 点击卡片 → 跳转菜品详情页
  - 点击"加入菜单" → 弹出 `MealSelector` → 选择餐次 → 调用 `useMenuStore.addDish()`
  - 点击"换一批" → 调用 `refresh` 接口，更新列表
- [ ] 状态：
  - 首次加载 → Skeleton（3 个 card 占位）
  - 换一批 → 卡片区域加载动画
  - 加载失败 → ErrorRetry

### 1.4 首页数据加载编排

- [ ] `useDidShow` 中并行请求：
  ```typescript
  Promise.all([fetchToday(), fetchRecommendations()])
  ```
- [ ] 两个请求独立渲染，互不阻塞
- [ ] 下拉刷新同时刷新菜单概览和推荐列表

---

## 2. 关联文档

- `07-首页与菜品详情.md`：第 3 节（首页设计）、第 6 节（数据加载策略）
- `03-智能推荐.md`：第 4 节（页面交互）、第 5 节（API 接口）
- `08-前端架构设计.md`：第 8.2 节（页面间通信）、第 9 节（缓存策略：推荐不缓存）

## 3. 验收标准

1. 首页菜单概览正确显示三餐状态，点击跳转今日菜单页
2. 推荐卡片正确渲染，点击跳转详情页
3. 推荐卡片"加入菜单"流程闭环：弹出选择 → 加入 → Toast 反馈
4. "换一批"刷新推荐列表，不与上次重复
5. 首页并行加载，两个区域独立渲染
6. 下拉刷新同时刷新两个区域
