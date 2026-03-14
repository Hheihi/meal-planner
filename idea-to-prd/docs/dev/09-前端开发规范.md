# 今日吃什么 — 前端开发规范

> 本规范基于 Taro + React + TypeScript 技术栈，结合业界主流实践制定。所有参与前端开发的成员须遵守本规范。

---

## 1. 命名规范

### 1.1 文件与目录命名

| 类型 | 命名风格 | 示例 |
|------|---------|------|
| 页面目录 | kebab-case | `pages/member-menu/` |
| 组件目录 | PascalCase | `components/DishCard/` |
| 组件文件 | `index.tsx` + `index.module.less` | `DishCard/index.tsx` |
| Hook 文件 | camelCase，`use` 前缀 | `hooks/useRequest.ts` |
| Store 文件 | camelCase，`use` 前缀 + `Store` 后缀 | `stores/useMenuStore.ts` |
| 工具函数文件 | camelCase | `utils/format.ts` |
| 类型定义文件 | camelCase | `types/dish.ts` |
| API 模块文件 | camelCase | `api/menu.ts` |
| 常量文件 | camelCase | `utils/constants.ts` |
| 静态资源 | kebab-case | `assets/icons/tab-home.png` |

### 1.2 代码命名

| 类型 | 命名风格 | 示例 |
|------|---------|------|
| 组件名 | PascalCase | `DishCard`, `MealSelector` |
| 函数/方法 | camelCase，动词开头 | `fetchDishes()`, `handleSubmit()` |
| 自定义 Hook | camelCase，`use` 前缀 | `useRequest()`, `useAuth()` |
| 变量 | camelCase | `dishList`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`, `API_BASE_URL` |
| 枚举 | PascalCase（枚举名 + 成员） | `MealType.Breakfast` |
| 类型/接口 | PascalCase | `DishListItem`, `ApiResponse<T>` |
| 布尔变量 | `is` / `has` / `should` / `can` 前缀 | `isLoggedIn`, `hasMore`, `canEdit` |
| 事件处理函数 | `handle` 前缀 | `handleTap`, `handleAddDish` |
| 回调 Props | `on` 前缀 | `onTap`, `onSelect`, `onClose` |
| CSS class（Module） | camelCase | `styles.cardWrapper`, `styles.dishName` |

### 1.3 禁止的命名

- 不使用拼音命名（`caipin` → `dish`）
- 不使用单字母变量（循环索引 `i` 除外）
- 不使用含义模糊的命名（`data1`, `temp`, `info`, `handleClick`）
- 布尔值不用否定形式（`isNotEmpty` → `isEmpty` 后取反）

---

## 2. TypeScript 规范

### 2.1 基本原则

- **全量 TypeScript**：所有 `.tsx` / `.ts` 文件，禁止使用 `.jsx` / `.js`
- **禁止 `any`**：不允许使用 `any` 类型。确实无法推断时使用 `unknown` 并进行类型收窄
- **禁止 `@ts-ignore`**：若类型报错，修复根因而非跳过检查
- **开启 strict 模式**：`tsconfig.json` 中 `strict: true`

### 2.2 类型定义规则

```typescript
// [推荐] 使用 interface 定义对象结构
interface Dish {
  id: number
  name: string
  nutrition: Nutrition
}

// [推荐] 使用 type 定义联合类型、交叉类型、工具类型
type MealType = 1 | 2 | 3
type DishWithCuisine = Dish & { cuisineName: string }

// [禁止] 不要为简单的原始类型创建 type alias
// Bad: type DishId = number
// Good: 直接用 number
```

### 2.3 泛型使用

```typescript
// [推荐] API 响应使用泛型包装
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// [推荐] 泛型参数命名要有意义（超过一个泛型时）
interface PaginatedData<TItem> {
  list: TItem[]
  total: number
}
```

### 2.4 枚举使用

```typescript
// [推荐] 有明确有限值集合时使用枚举
enum MealType {
  Breakfast = 1,
  Lunch = 2,
  Dinner = 3,
  Other = 4,
}

// [推荐] 纯展示映射使用 const object + as const
const DIFFICULTY_TEXT = {
  1: '简单',
  2: '中等',
  3: '困难',
} as const

// [禁止] 不使用字符串枚举做 API 参数（与后端 int 保持一致）
```

### 2.5 类型导入

```typescript
// [推荐] 使用 import type 导入仅作类型使用的内容
import type { Dish, DishListItem } from '@/types/dish'
import { MealType } from '@/types/common'  // 枚举既是类型也是值，正常导入
```

---

## 3. React 组件规范

### 3.1 基本原则

- **只使用函数组件**：禁止 class 组件
- **只使用 Hooks 管理状态和副作用**
- **单一职责**：一个组件只做一件事，超过 300 行考虑拆分
- **Props 显式定义类型**：每个组件必须定义 Props interface

### 3.2 组件文件结构

```typescript
// 1. 导入：第三方库 → 组件 → Hook → 工具 → 类型 → 样式
import { View, Text, Image } from '@tarojs/components'
import { useCallback, useMemo } from 'react'
import { NutritionBar } from '@/components/NutritionBar'
import { useRequest } from '@/hooks/useRequest'
import { formatCalories } from '@/utils/format'
import type { DishListItem } from '@/types/dish'
import styles from './index.module.less'

// 2. 类型定义
interface DishCardProps {
  dish: DishListItem
  size?: 'large' | 'small'
  showAddButton?: boolean
  onTap?: (dishId: number) => void
  onAddToMenu?: (dishId: number) => void
}

// 3. 组件实现
const DishCard: React.FC<DishCardProps> = ({
  dish,
  size = 'large',
  showAddButton = true,
  onTap,
  onAddToMenu,
}) => {
  // 3a. Hooks 调用（顺序：state → store → custom hooks → memo → callback → effect）
  const [loading, setLoading] = useState(false)
  const { addDish } = useMenuStore()

  const caloriesText = useMemo(() => formatCalories(dish.calories), [dish.calories])

  const handleTap = useCallback(() => {
    onTap?.(dish.id)
  }, [dish.id, onTap])

  // 3b. 渲染
  return (
    <View className={styles.card} onClick={handleTap}>
      <Image className={styles.image} src={dish.imageUrl} mode="aspectFill" lazyLoad />
      <Text className={styles.name}>{dish.name}</Text>
    </View>
  )
}

// 4. 导出
export { DishCard }
```

### 3.3 Hooks 使用规则

```typescript
// [强制] Hooks 只在组件顶层调用，不在条件/循环中调用
// Bad
if (isLoggedIn) {
  const data = useRequest(fetchProfile)  // ❌
}

// Good
const data = useRequest(isLoggedIn ? fetchProfile : null)  // ✅


// [推荐] useEffect 依赖数组必须完整，配合 ESLint exhaustive-deps 规则
useEffect(() => {
  fetchDishes(cuisineId)
}, [cuisineId])  // ✅ 依赖完整


// [推荐] 复杂逻辑抽取为自定义 Hook
// Bad: 在组件内写大段数据请求 + 分页逻辑
// Good: 抽取为 useReachBottom(fetcher, pageSize)
```

### 3.4 条件渲染规范

```typescript
// [推荐] 简单条件用 &&
{isLoading && <Skeleton type="card" />}

// [推荐] 二选一用三元
{isEmpty ? <EmptyState text="暂无菜品" /> : <DishList list={dishes} />}

// [推荐] 多条件用提前 return 或映射对象
if (loading) return <Skeleton />
if (error) return <ErrorRetry onRetry={refresh} />
return <DishList list={dishes} />
```

### 3.5 列表渲染规范

```typescript
// [强制] key 使用唯一业务 ID，禁止使用 index
// Bad
{dishes.map((dish, index) => <DishCard key={index} dish={dish} />)}

// Good
{dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
```

### 3.6 事件处理规范

```typescript
// [推荐] 需要传参时使用 useCallback 或内联箭头函数
// 列表项点击推荐 useCallback + data 属性
const handleDishTap = useCallback((dishId: number) => {
  Taro.navigateTo({ url: `/pages/dish/detail/index?id=${dishId}` })
}, [])

// [禁止] 不要在 JSX 中使用 bind
// Bad
<View onClick={handleTap.bind(this, dish.id)} />
```

---

## 4. 状态管理规范（Zustand）

### 4.1 Store 设计原则

- **按业务领域拆分**：不搞一个巨大的全局 Store
- **扁平化状态**：避免深层嵌套，方便更新和对比
- **Action 内聚**：数据获取和状态更新逻辑写在 Store 内，组件只调用 Action
- **最小化订阅**：组件使用 selector 只订阅需要的字段，避免无关渲染

### 4.2 Store 编写模板

```typescript
import { create } from 'zustand'
import { menuApi } from '@/api/menu'
import type { TodayMenu, MealType } from '@/types/menu'

interface MenuState {
  // 状态
  todayMenu: TodayMenu | null
  loading: boolean

  // Action
  fetchToday: () => Promise<void>
  addDish: (dishId: number, mealType: MealType) => Promise<void>
  reset: () => void
}

export const useMenuStore = create<MenuState>((set, get) => ({
  todayMenu: null,
  loading: false,

  fetchToday: async () => {
    set({ loading: true })
    try {
      const data = await menuApi.getToday()
      set({ todayMenu: data })
    } finally {
      set({ loading: false })
    }
  },

  addDish: async (dishId, mealType) => {
    await menuApi.addDish({ dish_id: dishId, meal_type: mealType, date: today() })
    // 添加成功后刷新菜单
    await get().fetchToday()
  },

  reset: () => set({ todayMenu: null, loading: false }),
}))
```

### 4.3 组件中的使用方式

```typescript
// [推荐] 使用 selector 精确订阅
const todayMenu = useMenuStore((s) => s.todayMenu)
const fetchToday = useMenuStore((s) => s.fetchToday)

// [禁止] 不要订阅整个 Store
// Bad
const store = useMenuStore()  // ❌ 任意字段变化都会触发重渲染
```

---

## 5. 样式规范

### 5.1 基本原则

- **Less Module 隔离**：每个组件/页面独立 `.module.less`，不使用全局 class
- **不使用内联样式**：`style={{ }}` 仅用于动态计算值（如百分比宽度）
- **不使用 `!important`**
- **不使用 ID 选择器**
- **不使用标签选择器**（`View { }` ❌）

### 5.2 class 命名

```less
// [推荐] Less Module 中使用 camelCase
.cardWrapper { }
.dishName { }
.nutritionValue { }

// [禁止] 不使用 BEM（Less Module 已提供隔离，无需 BEM）
// Bad: .dish-card__name--active
```

### 5.3 样式编写顺序

```less
.card {
  // 1. 布局属性
  display: flex;
  flex-direction: column;
  align-items: center;

  // 2. 盒模型
  width: 100%;
  padding: @spacing-md;
  margin-bottom: @spacing-sm;

  // 3. 视觉样式
  background-color: @color-bg-card;
  border-radius: @radius-md;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  // 4. 文字样式
  font-size: @font-size-md;
  color: @color-text-primary;

  // 5. 其他
  overflow: hidden;
}
```

### 5.4 响应式与单位

```less
// [强制] 使用 px 编写，Taro 自动转换为 rpx（设计稿 750px 基准）
.title {
  font-size: 32px;   // 编译后 → 32rpx
  padding: 16px;     // 编译后 → 16rpx
}

// [注意] 需要固定像素的场景（如 1px 边框），使用 PX（大写）不转换
.divider {
  border-bottom: 1PX solid #EEEEEE;  // 保持 1 物理像素
}
```

### 5.5 全局变量使用

```less
// [强制] 颜色、间距、字号、圆角必须使用全局变量，禁止硬编码
// Bad
.title {
  color: #333333;
  font-size: 32px;
  padding: 16px;
}

// Good
.title {
  color: @color-text-primary;
  font-size: @font-size-lg;
  padding: @spacing-md;
}
```

### 5.6 Flex 布局优先

```less
// [推荐] 优先使用 Flexbox，小程序兼容性好
// [禁止] 不使用 float 布局
// [谨慎] Grid 布局仅在菜系宫格等明确场景使用，注意低版本兼容
```

---

## 6. API 调用规范

### 6.1 API 文件组织

```typescript
// 每个 API 文件对应一个后端服务/资源
// api/dish.ts — 只包含菜品相关接口
import { get } from './request'
import type { Dish, DishListItem } from '@/types/dish'
import type { PaginatedData } from '@/types/common'

export const dishApi = {
  getDetail: (dishId: number) =>
    get<Dish>(`/v1/dishes/${dishId}`),

  search: (keyword: string, page: number, pageSize = 20) =>
    get<PaginatedData<DishListItem>>('/v1/dishes/search', { keyword, page, page_size: pageSize }),
}
```

### 6.2 调用规则

```typescript
// [强制] 组件中不直接调用 Taro.request，统一走 api 层
// [强制] 参数命名与后端接口保持一致（snake_case），类型层做转换
// [推荐] GET 请求的参数通过 params 传递，POST/PUT 通过 data 传递
// [推荐] 页面级数据请求放在 Store Action 或 useRequest Hook 中
// [禁止] 不在组件 render 函数体中发起请求（必须在 useEffect / 事件回调中）
```

### 6.3 错误处理

```typescript
// [推荐] 通用错误在 request.ts 拦截器中统一处理（Toast）
// [推荐] 特殊业务错误在调用处 try-catch 处理
const handleAddDish = async (dishId: number, mealType: MealType) => {
  try {
    await menuApi.addDish({ dish_id: dishId, meal_type: mealType, date: today })
    Taro.showToast({ title: '已加入菜单', icon: 'success' })
  } catch (err) {
    if (err instanceof BusinessError && err.code === 2002) {
      Taro.showToast({ title: '该菜品已在菜单中', icon: 'none' })
      return
    }
    // 其他错误已被拦截器处理，这里无需重复
  }
}
```

---

## 7. 页面开发规范

### 7.1 页面生命周期使用

```typescript
import { useDidShow, useDidHide, usePullDownRefresh, useReachBottom } from '@tarojs/taro'

const MenuPage: React.FC = () => {
  // [推荐] TabBar 页面用 useDidShow 刷新数据（每次切回都触发）
  useDidShow(() => {
    fetchToday()
  })

  // [推荐] 普通页面用 useEffect + onLoad 参数
  useEffect(() => {
    if (id) fetchDetail(Number(id))
  }, [id])

  // [推荐] 需要下拉刷新的页面
  usePullDownRefresh(async () => {
    await fetchToday()
    Taro.stopPullDownRefresh()
  })
}
```

### 7.2 页面配置

```typescript
// index.config.ts
export default definePageConfig({
  navigationBarTitleText: '今日菜单',
  enablePullDownRefresh: true,       // 需要下拉刷新的页面开启
  backgroundTextStyle: 'dark',
})
```

### 7.3 页面参数获取

```typescript
import { useRouter } from '@tarojs/taro'

const DishDetail: React.FC = () => {
  const router = useRouter()
  const dishId = Number(router.params.id)

  // [禁止] 不要使用 getCurrentInstance().router，统一用 useRouter Hook
}
```

### 7.4 导航跳转

```typescript
import Taro from '@tarojs/taro'

// [推荐] 普通页面跳转
Taro.navigateTo({ url: '/pages/dish/detail/index?id=101' })

// [推荐] TabBar 页面跳转
Taro.switchTab({ url: '/pages/menu/today/index' })

// [推荐] 重定向（替换当前页）
Taro.redirectTo({ url: '/pages/family/index/index' })

// [强制] 路径使用绝对路径，以 / 开头
// Bad:  Taro.navigateTo({ url: '../dish/detail/index?id=101' })
// Good: Taro.navigateTo({ url: '/pages/dish/detail/index?id=101' })
```

---

## 8. 性能规范

### 8.1 渲染优化

```typescript
// [推荐] 昂贵计算使用 useMemo
const nutritionTotal = useMemo(() => {
  return meals.reduce((sum, meal) => sum + meal.calories, 0)
}, [meals])

// [推荐] 传递给子组件的回调使用 useCallback
const handleTap = useCallback((id: number) => {
  Taro.navigateTo({ url: `/pages/dish/detail/index?id=${id}` })
}, [])

// [禁止] 不要滥用 useMemo/useCallback，简单值/无子组件传递时不需要
```

### 8.2 图片优化

```typescript
// [强制] 列表中的图片必须开启懒加载
<Image src={dish.imageUrl} lazyLoad mode="aspectFill" />

// [强制] 图片必须指定 mode，避免拉伸变形
// [推荐] 列表使用缩略图 URL（300×200），详情用大图（750×500）
// [推荐] 图片加载失败显示占位图
<Image
  src={dish.imageUrl}
  onError={() => setImgSrc(DEFAULT_DISH_IMAGE)}
/>
```

### 8.3 列表优化

```typescript
// [推荐] 长列表使用分页加载（每页 20 条），禁止一次性加载全部数据
// [推荐] 分页加载时底部显示 loading 指示器
// [推荐] 触底加载使用 useReachBottom Hook
// [注意] 若列表可能超过 100 条，评估是否需要虚拟列表
```

### 8.4 请求优化

```typescript
// [推荐] 独立数据并行请求
const [menuRes, recommendRes] = await Promise.all([
  menuApi.getToday(),
  recommendationApi.getList(),
])

// [推荐] 搜索输入防抖 300ms
const debouncedKeyword = useDebounce(keyword, 300)
useEffect(() => {
  if (debouncedKeyword) search(debouncedKeyword)
}, [debouncedKeyword])

// [推荐] 按钮操作防重复点击（loading 态禁用按钮）
```

---

## 9. Git 规范

### 9.1 分支管理

```
main                    # 生产分支，保护分支，不直接提交
├── develop             # 开发主分支，日常开发合入此分支
│   ├── feature/xxx     # 功能分支，从 develop 拉出
│   ├── fix/xxx         # 修复分支，从 develop 拉出
│   └── refactor/xxx    # 重构分支
└── release/x.x.x      # 发版分支，从 develop 拉出
```

### 9.2 分支命名

```
feature/user-login         # 功能：用户登录
feature/dish-detail        # 功能：菜品详情
fix/menu-nutrition-calc    # 修复：菜单营养计算
refactor/request-layer     # 重构：请求层
```

### 9.3 Commit Message 规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>      # 可选
<footer>    # 可选
```

**type 类型**：

| type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(menu): 添加确认完成功能` |
| `fix` | 修复 Bug | `fix(dish): 修复详情页图片加载失败` |
| `style` | 样式调整（不影响逻辑） | `style(home): 调整推荐卡片间距` |
| `refactor` | 重构（不增加功能/不修复 Bug） | `refactor(api): 统一请求拦截器` |
| `perf` | 性能优化 | `perf(list): 菜品列表开启图片懒加载` |
| `chore` | 构建/工具/依赖变更 | `chore: 升级 Taro 到 4.0.1` |
| `docs` | 文档 | `docs: 更新前端架构设计文档` |

**scope**：当前改动涉及的模块，如 `menu`, `dish`, `auth`, `home`, `record`, `family`, `search`, `components`。

**subject 规则**：
- 使用中文或英文均可，团队统一即可
- 不超过 50 个字符
- 不加句号结尾
- 使用祈使语气（"添加"而非"添加了"）

### 9.4 Commit 粒度

- **一个 commit 做一件事**：不要在一个 commit 里混合功能开发和 Bug 修复
- **可编译通过**：每个 commit 必须能独立编译成功
- **相关文件一起提交**：组件的 `.tsx` 和 `.module.less` 在同一个 commit

---

## 10. 代码审查清单

每次提交 MR/PR 前，对照以下清单自查：

### 10.1 功能正确性

- [ ] 功能符合需求文档描述
- [ ] 边界情况已处理（空数据、加载失败、网络异常）
- [ ] 无控制台报错和警告

### 10.2 代码质量

- [ ] 无 `any` 类型
- [ ] 无 `@ts-ignore` / `@ts-expect-error`
- [ ] 无 `console.log`（调试代码已移除）
- [ ] 无硬编码的颜色/字号/间距值
- [ ] 无冗余代码和未使用的导入
- [ ] 组件 Props 类型完整

### 10.3 性能相关

- [ ] 列表使用唯一业务 ID 作为 key
- [ ] 图片开启懒加载
- [ ] 无不必要的重渲染（检查 useEffect 依赖）
- [ ] 接口请求无遗漏的 loading/error 状态处理

### 10.4 样式相关

- [ ] 使用全局 Less 变量
- [ ] 使用 Less Module，无全局 class 污染
- [ ] 底部有操作栏的页面已添加安全区域适配

---

## 11. 工程配置规范

### 11.1 ESLint 核心规则

```javascript
// .eslintrc.js 关键规则
module.exports = {
  extends: [
    'taro/react',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',       // 禁止 any
    '@typescript-eslint/consistent-type-imports': 'warn', // type import
    '@typescript-eslint/no-unused-vars': 'error',         // 未使用变量

    // React
    'react-hooks/rules-of-hooks': 'error',                // Hooks 规则
    'react-hooks/exhaustive-deps': 'warn',                // 依赖完整性
    'react/jsx-key': 'error',                             // 列表必须有 key

    // 通用
    'no-console': 'warn',                                 // 避免遗留 console
    'prefer-const': 'error',                              // 优先 const
    'eqeqeq': 'error',                                   // 强制 ===
  },
}
```

### 11.2 Prettier 配置

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 11.3 tsconfig.json 关键配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 11.4 路径别名

```typescript
// [强制] 导入路径使用 @ 别名，禁止超过两层的相对路径
// Bad
import { DishCard } from '../../../components/DishCard'

// Good
import { DishCard } from '@/components/DishCard'
```

---

## 12. 注释规范

### 12.1 何时需要注释

- **复杂业务逻辑**：推荐算法评分、营养计算公式等
- **非显而易见的处理**：特殊的兼容性处理、绕过框架限制的 hack
- **TODO / FIXME**：待完善的功能或已知问题

### 12.2 何时不需要注释

- 命名已经能说明意图的函数和变量
- 简单的 CRUD 操作
- 组件的 Props（TypeScript 类型即文档）

### 12.3 注释格式

```typescript
// 单行注释：解释「为什么」这样做，而非「做了什么」
// Token 续签期间需要加锁，防止并发请求同时触发多次 wx.login
let isRefreshing = false

// TODO 标记：附带负责人和日期
// TODO(lyy 2026-03): 推荐列表超过 100 条时需改用虚拟列表

// FIXME 标记
// FIXME: iOS 14 以下日历组件滑动卡顿，需降级为简单选择器

/**
 * 计算推荐评分
 * score = base + nutrition_bonus + preference_bonus - recency_penalty + random
 */
function calcRecommendScore(dish: Dish, context: RecommendContext): number {
  // ...
}
```

---

## 13. 安全规范

| 规则 | 说明 |
|------|------|
| Token 存储 | 使用 `Taro.setStorageSync`，不存在全局变量或 URL 参数中 |
| 敏感信息 | `openid`、`session_key` 不在前端存储和传输，仅后端持有 |
| 用户输入 | 手动记录文字输入做长度限制和 XSS 转义（展示时用 `<Text>` 组件） |
| API 请求 | 全部走 HTTPS，不使用 HTTP |
| 环境变量 | API 地址通过 Taro 编译环境变量注入，不硬编码在代码中 |
| 图片上传 | 校验文件类型和大小，后端做二次校验 |
