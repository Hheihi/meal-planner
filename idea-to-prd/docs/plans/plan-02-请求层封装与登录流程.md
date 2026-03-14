# Plan 02：请求层封装与登录流程

> **阶段**：Phase 1 — 基础框架
> **前置依赖**：Plan 01（项目初始化）
> **产出目标**：统一请求封装可用，微信静默登录闭环，Token 自动续签

---

## 1. 任务清单

### 1.1 通用类型定义

- [ ] 创建 `src/types/common.ts`，定义：
  - `ApiResponse<T>` — 统一响应结构 `{ code, message, data }`
  - `PaginatedData<T>` — 分页响应 `{ list, total, page, page_size }`
  - `Nutrition` — 营养信息 `{ calories, protein, carbs, fat }`
  - `MealType` 枚举 — `Breakfast=1, Lunch=2, Dinner=3, Other=4`
- [ ] 创建 `src/utils/constants.ts`，定义：
  - `API_BASE_URL`（通过 Taro 环境变量注入）
  - 业务错误码常量 `ERROR_CODE`

### 1.2 本地存储封装

- [ ] 创建 `src/utils/storage.ts`，封装：
  - `getToken()` / `setToken()` / `removeToken()`
  - `getUserInfo()` / `setUserInfo()` / `removeUserInfo()`
  - 统一使用 `Taro.getStorageSync` / `Taro.setStorageSync`

### 1.3 请求封装（request.ts）

- [ ] 创建 `src/api/request.ts`，实现：
  - 基础 `request<T>(options)` 方法，包装 `Taro.request`
  - 导出便捷方法：`get<T>()`, `post<T>()`, `put<T>()`, `del<T>()`
- [ ] **请求拦截器**：
  - 自动注入 `Authorization: Bearer <token>` 请求头
  - 统一 `Content-Type: application/json`
  - 拼接 `API_BASE_URL` + 接口路径
- [ ] **响应拦截器**：
  - `code === 0` → 返回 `data`
  - `code === 1002` → 触发 Token 续签流程
  - 其他业务错误 → `Taro.showToast` 提示 `message`，reject `BusinessError`
  - HTTP 异常（非 200）→ `Taro.showToast('网络异常')`，reject `NetworkError`

### 1.4 Token 自动续签

- [ ] 在 `request.ts` 中实现续签逻辑：
  - 用锁变量 `isRefreshing` 防止并发续签
  - 续签期间其他请求排队（Promise 队列），续签完成后重放
  - 流程：`Taro.login()` → 获取 `code` → 调用 `/v1/auth/login` → 更新 Token → 重放请求

### 1.5 认证 API

- [ ] 创建 `src/api/auth.ts`，定义：
  - `login(code: string)` → `POST /v1/auth/login`
- [ ] 创建 `src/types/user.ts`，定义：
  - `UserInfo` 接口
  - `LoginResponse` 接口（token, is_new_user, user）

### 1.6 认证状态管理（useAuthStore）

- [ ] 安装 Zustand：`pnpm add zustand`
- [ ] 创建 `src/stores/useAuthStore.ts`：
  - 状态：`token`, `isLoggedIn`
  - Action：`login()` — 调用 `Taro.login()` + auth API + 存储 Token
  - Action：`logout()` — 清除 Token 和用户信息
  - 初始化时从 Storage 恢复 Token

### 1.7 登录态 Hook

- [ ] 创建 `src/hooks/useAuth.ts`：
  - `ensureLogin()` — 检查 Token 是否存在，不存在则自动静默登录
- [ ] 在 `app.ts` 的 `onLaunch` 中调用静默登录

---

## 2. 关联文档

- `08-前端架构设计.md`：第 4 节（网络层）、第 5 节（状态管理）
- `09-前端开发规范.md`：第 6 节（API 调用规范）
- `01-用户系统.md`：第 3.1 节（微信登录流程）、第 5.1 节（登录接口）

## 3. 验收标准

1. `get/post/put/del` 方法可正常发起请求
2. 请求自动携带 Token 请求头
3. 响应 `code !== 0` 时自动 Toast 提示
4. 小程序启动后自动静默登录，Token 写入 Storage
5. Token 失效时自动续签，不中断用户操作
