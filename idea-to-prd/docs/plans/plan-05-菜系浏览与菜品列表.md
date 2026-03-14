# Plan 05：菜系浏览与菜品列表

> **阶段**：Phase 1 — 核心浏览
> **前置依赖**：Plan 02（请求层）、Plan 03（Skeleton / EmptyState）、Plan 04（useReachBottom）
> **产出目标**：菜系列表页 + 菜品列表页可用，浏览流程闭环

---

## 1. 任务清单

### 1.1 类型定义

- [ ] 创建 `src/types/dish.ts`，定义：
  - `Cuisine` — 菜系 `{ id, name, iconUrl, dishCount }`
  - `DishListItem` — 菜品列表项 `{ id, name, imageUrl, cuisineName, cookingTime, difficulty, calories }`
  - `Ingredient` — 食材 `{ name, amount }`
  - `CookingStep` — 步骤 `{ order, text, imageUrl? }`
  - `Dish` — 菜品完整信息（详情页用，Plan 06 使用）

### 1.2 API 接口

- [ ] 创建 `src/api/cuisine.ts`：
  - `getList()` → `GET /v1/cuisines`
- [ ] 创建 `src/api/dish.ts`：
  - `getListByCuisine(cuisineId, page, pageSize)` → `GET /v1/cuisines/:id/dishes`
  - `getDetail(dishId)` → `GET /v1/dishes/:id`（供后续 Plan 06 使用）
  - `search(keyword, page, pageSize)` → `GET /v1/dishes/search`（供后续 Plan 08 使用）

### 1.3 菜系列表页（TabBar 页）

- [ ] 页面路径：`src/pages/cuisine/list/`
- [ ] 页面配置：`navigationBarTitleText: '菜系分类'`
- [ ] 功能实现：
  - 调用 `cuisineApi.getList()` 获取菜系列表
  - 宫格布局展示（2 列），每项显示图标 + 菜系名称
  - 点击菜系项 → `Taro.navigateTo` 跳转到菜品列表页，传递 `cuisineId` 和 `cuisineName`
- [ ] 状态处理：
  - 加载中 → Skeleton（宫格占位）
  - 加载失败 → ErrorRetry
  - 数据缓存 → 菜系列表 24 小时缓存（参照缓存策略）

### 1.4 菜品列表页

- [ ] 页面路径：`src/pages/cuisine/dishes/`
- [ ] 页面配置：`navigationBarTitleText` 动态设置为菜系名称
- [ ] 功能实现：
  - 使用 `useReachBottom` Hook 实现分页加载（每页 20 条）
  - 列表项：左图右文布局（缩略图 + 菜品名称 + 烹饪时间 + 难度 + 热量）
  - 点击列表项 → 跳转菜品详情页 `?id=xxx`
  - 下拉刷新重置列表
- [ ] 状态处理：
  - 首屏加载 → Skeleton（list 类型）
  - 空数据 → EmptyState（"暂无菜品，敬请期待"）
  - 触底加载 → 底部 loading 指示器
  - 加载完成 → "没有更多了"

---

## 2. 关联文档

- `02-菜品库.md`：第 3.1-3.2 节（菜系分类 / 菜品列表）、第 4.1-4.2 节（页面描述）、第 5.1-5.2 节（API）
- `08-前端架构设计.md`：第 6 节（组件清单）、第 8.1 节（路由映射）、第 9 节（缓存策略）

## 3. 验收标准

1. 菜系列表页宫格展示所有菜系，点击跳转到对应菜品列表
2. 菜品列表分页加载正常，触底自动加载下一页
3. 下拉刷新重置列表
4. Skeleton / EmptyState / ErrorRetry 各状态展示正确
5. 导航栏标题动态显示菜系名称
