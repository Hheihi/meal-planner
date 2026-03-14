# Plan 03：基础公共组件

> **阶段**：Phase 1 — 基础框架
> **前置依赖**：Plan 01（Less 全局变量可用）
> **产出目标**：4 个基础 UI 组件就绪，后续页面开发可直接使用

---

## 1. 任务清单

### 1.1 Skeleton 骨架屏组件

- [ ] 创建 `src/components/Skeleton/`
- [ ] Props 接口：
  ```typescript
  interface SkeletonProps {
    type: 'card' | 'list' | 'detail'   // 不同页面的骨架屏形态
    rows?: number                       // list 类型的行数，默认 3
  }
  ```
- [ ] 实现：
  - `card`：模拟推荐卡片（大图 + 标题 + 描述），带闪光动画
  - `list`：模拟左图右文列表项，支持多行
  - `detail`：模拟详情页（大图 + 段落文字）
- [ ] 样式：圆角灰色块 + CSS 动画（`@keyframes shimmer`）

### 1.2 EmptyState 空状态组件

- [ ] 创建 `src/components/EmptyState/`
- [ ] Props 接口：
  ```typescript
  interface EmptyStateProps {
    icon?: string                       // 自定义图标路径，默认内置
    text: string                        // 提示文字，如 "暂无菜品"
    actionText?: string                 // 按钮文字，如 "去添加"
    onAction?: () => void               // 按钮点击回调
  }
  ```
- [ ] 实现：
  - 居中布局：图标 + 文字 + 可选操作按钮
  - 默认图标使用简单的 SVG/图片占位

### 1.3 ErrorRetry 错误重试组件

- [ ] 创建 `src/components/ErrorRetry/`
- [ ] Props 接口：
  ```typescript
  interface ErrorRetryProps {
    text?: string                       // 错误提示，默认 "加载失败"
    onRetry: () => void                 // 重试回调
  }
  ```
- [ ] 实现：
  - 居中布局：错误图标 + 提示文字 + 重试按钮
  - 重试按钮使用主题色 `@color-primary`

### 1.4 SafeAreaBottom 底部安全区域组件

- [ ] 创建 `src/components/SafeAreaBottom/`
- [ ] 实现：
  - 使用 `env(safe-area-inset-bottom)` 适配 iPhone 底部安全区域
  - 用于有底部固定操作栏的页面（菜品详情、今日菜单等）

---

## 2. 组件开发规范

每个组件的文件结构统一为：

```
ComponentName/
├── index.tsx            # 组件实现
└── index.module.less    # 组件样式
```

遵循 `09-前端开发规范.md` 第 3.2 节的组件文件结构模板。

## 3. 关联文档

- `08-前端架构设计.md`：第 6.1 节（组件清单）
- `09-前端开发规范.md`：第 3 节（React 组件规范）、第 5 节（样式规范）

## 4. 验收标准

1. 4 个组件均可在页面中正常引入和渲染
2. 组件 Props 类型完整，TypeScript 无报错
3. 样式使用 Less 全局变量，无硬编码色值
4. Less Module 隔离，无全局样式污染
