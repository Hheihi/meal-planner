# Plan 08：核心业务组件（DishCard + MealSelector + NutritionSummary）

> **阶段**：Phase 2 — 菜单 + 记录
> **前置依赖**：Plan 06（NutritionBar 已完成）、Plan 05（类型定义已完成）
> **产出目标**：3 个核心业务组件就绪，供首页推荐、今日菜单、饮食记录等页面使用

---

## 1. 任务清单

### 1.1 DishCard 菜品卡片组件

- [ ] 创建 `src/components/DishCard/`
- [ ] Props 接口（参照 `08-前端架构设计.md` 第 6.2 节）：
  ```typescript
  interface DishCardProps {
    dish: DishListItem
    size?: 'large' | 'small'
    showAddButton?: boolean
    onTap?: (dishId: number) => void
    onAddToMenu?: (dishId: number) => void
  }
  ```
- [ ] 实现两种形态：
  - `large`：推荐卡片样式，大图在上 + 标题/菜系/时间/难度/热量 + 加入菜单按钮
  - `small`：列表样式，左缩略图 + 右侧文字信息
- [ ] 图片懒加载 + 加载失败占位图

### 1.2 MealSelector 餐次选择组件

- [ ] 创建 `src/components/MealSelector/`
- [ ] Props 接口（参照 `08-前端架构设计.md` 第 6.3 节）：
  ```typescript
  interface MealSelectorProps {
    visible: boolean
    dishId: number
    addedMeals?: MealType[]
    onSelect: (mealType: MealType) => void
    onClose: () => void
  }
  ```
- [ ] 实现：
  - 底部弹出 ActionSheet 样式
  - 三个选项：早餐 / 午餐 / 晚餐
  - `addedMeals` 中已存在的餐次按钮置灰不可点击
  - 点击遮罩层关闭

### 1.3 NutritionSummary 营养汇总卡片组件

- [ ] 创建 `src/components/NutritionSummary/`
- [ ] Props 接口：
  ```typescript
  interface NutritionSummaryProps {
    total: Nutrition
    reference?: Nutrition         // 参考值，传入时显示对比
    showComparison?: boolean      // 是否显示达标对比颜色
  }
  ```
- [ ] 实现：
  - 四列展示（热量 / 蛋白质 / 碳水 / 脂肪）
  - `showComparison: true` 时根据参考值着色：
    - 80%-120% → 绿色 `@color-success`
    - 其他 → 橙色 `@color-warning`

---

## 2. 关联文档

- `08-前端架构设计.md`：第 6 节（组件清单与接口设计）
- `07-首页与菜品详情.md`：第 5 节（组件拆分建议）
- `09-前端开发规范.md`：第 3 节（React 组件规范）

## 3. 验收标准

1. `DishCard` 两种尺寸正确渲染，点击事件正常触发
2. `MealSelector` 弹出/关闭交互流畅，已添加的餐次按钮置灰
3. `NutritionSummary` 数值展示正确，对比颜色逻辑正确
4. 三个组件均使用 Less Module + 全局变量，TypeScript 类型完整
