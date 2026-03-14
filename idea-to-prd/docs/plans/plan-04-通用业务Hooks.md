# Plan 04：通用业务 Hooks

> **阶段**：Phase 1 — 基础框架
> **前置依赖**：Plan 02（请求层封装）
> **产出目标**：4 个自定义 Hook 就绪，后续页面开发可直接使用

---

## 1. 任务清单

### 1.1 useRequest — 通用请求 Hook

- [ ] 创建 `src/hooks/useRequest.ts`
- [ ] 接口：
  ```typescript
  function useRequest<T>(
    fetcher: (() => Promise<T>) | null,
    options?: {
      manual?: boolean
      onSuccess?: (data: T) => void
      onError?: (err: Error) => void
    }
  ): {
    data: T | undefined
    loading: boolean
    error: Error | undefined
    run: () => Promise<void>
    refresh: () => Promise<void>
  }
  ```
- [ ] 实现要点：
  - `manual: false`（默认）时组件挂载自动发起请求
  - `manual: true` 时需手动调用 `run()`
  - `refresh()` 重新执行上一次请求
  - 组件卸载后丢弃未完成请求的回调（防止内存泄漏）

### 1.2 useReachBottom — 分页加载 Hook

- [ ] 创建 `src/hooks/useReachBottom.ts`
- [ ] 接口：
  ```typescript
  function useReachBottom<T>(
    fetcher: (page: number) => Promise<{ list: T[]; total: number }>,
    pageSize?: number
  ): {
    list: T[]
    loading: boolean
    hasMore: boolean
    loadMore: () => Promise<void>
    refresh: () => Promise<void>
  }
  ```
- [ ] 实现要点：
  - 内部维护 `page` 计数器
  - `loadMore()` 追加数据到 `list`，根据 `total` 判断 `hasMore`
  - `refresh()` 重置页码，清空列表，重新加载第一页
  - 结合 Taro `useReachBottom` 生命周期触发

### 1.3 usePullDownRefresh — 下拉刷新 Hook

- [ ] 创建 `src/hooks/usePullDownRefresh.ts`
- [ ] 接口：
  ```typescript
  function usePullDownRefresh(onRefresh: () => Promise<void>): void
  ```
- [ ] 实现要点：
  - 封装 Taro `usePullDownRefresh`
  - 刷新完成后自动调用 `Taro.stopPullDownRefresh()`
  - 防止重复触发

### 1.4 useDebounce — 防抖 Hook

- [ ] 创建 `src/hooks/useDebounce.ts`
- [ ] 接口：
  ```typescript
  function useDebounce<T>(value: T, delay: number): T
  ```
- [ ] 实现要点：
  - `value` 变化后延迟 `delay` 毫秒才更新返回值
  - 用于搜索输入场景（300ms 防抖）

---

## 2. 关联文档

- `08-前端架构设计.md`：第 7 节（自定义 Hooks 设计）
- `09-前端开发规范.md`：第 3.3 节（Hooks 使用规则）

## 3. 验收标准

1. 4 个 Hook 均可在页面中正常使用，TypeScript 类型推断正确
2. `useRequest` 支持手动/自动模式，loading/error 状态正确
3. `useReachBottom` 分页加载、追加数据、hasMore 判断正确
4. `useDebounce` 防抖延迟生效
