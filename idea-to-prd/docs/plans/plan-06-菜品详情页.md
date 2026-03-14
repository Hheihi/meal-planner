# Plan 06：菜品详情页

> **阶段**：Phase 1 — 核心浏览
> **前置依赖**：Plan 05（菜品 API + 类型定义）、Plan 03（SafeAreaBottom）
> **产出目标**：菜品详情页完整可用，展示菜谱、食材、营养、步骤

---

## 1. 任务清单

### 1.1 NutritionBar 组件

- [ ] 创建 `src/components/NutritionBar/`
- [ ] Props 接口：
  ```typescript
  interface NutritionBarProps {
    nutrition: Nutrition    // { calories, protein, carbs, fat }
  }
  ```
- [ ] 实现：四列等宽横排展示（热量 / 蛋白质 / 碳水 / 脂肪），每列显示数值 + 单位

### 1.2 菜品详情页

- [ ] 页面路径：`src/pages/dish/detail/`
- [ ] 页面参数：`?id=101`，通过 `useRouter` 获取
- [ ] 功能实现：
  - 调用 `dishApi.getDetail(id)` 获取完整菜品数据
  - **页面结构**（从上到下）：
    1. 菜品大图（全宽，`mode="aspectFill"`）
    2. 菜品名称 + 菜系 + 烹饪时间 + 难度
    3. 营养信息区域（`NutritionBar` 组件）+ "仅供参考"提示
    4. 食材清单（列表展示，食材名 + 用量）
    5. 制作步骤（编号 + 步骤图 + 描述文字）
    6. 底部固定操作栏（三按钮：加入早餐 / 午餐 / 晚餐）
  - 底部操作栏使用 `SafeAreaBottom` 适配
- [ ] 交互：
  - 菜品大图点击 → `Taro.previewImage` 全屏预览
  - 步骤图点击 → 放大查看
  - 底部按钮点击 → 调用加入菜单 API（Plan 09 实现 API 对接，此阶段按钮先做 UI）
  - 图片加载失败 → 显示默认占位图
- [ ] 状态处理：
  - 加载中 → Skeleton（detail 类型）
  - 菜品不存在 → EmptyState（"菜品不存在"）
  - 缓存：内存缓存 5 分钟，减少重复请求

---

## 2. 关联文档

- `02-菜品库.md`：第 3.3 节（菜品详情）、第 5.3 节（详情 API）
- `07-首页与菜品详情.md`：第 4 节（菜品详情页设计）、第 5 节（组件拆分）
- `08-前端架构设计.md`：第 6.1 节（NutritionBar 组件）

## 3. 验收标准

1. 从菜品列表点击进入详情页，数据正确展示
2. 大图 / 步骤图可点击预览
3. 营养信息四列展示正确
4. 食材清单和制作步骤完整渲染
5. 底部三按钮固定显示，iPhone 底部安全区域适配正确
6. 加载中 / 不存在 / 图片失败等异常状态处理正确
