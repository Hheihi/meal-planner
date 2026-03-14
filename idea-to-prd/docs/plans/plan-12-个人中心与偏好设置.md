# Plan 12：个人中心与偏好设置

> **阶段**：Phase 3 — 社交 + 个人
> **前置依赖**：Plan 02（useAuthStore / 用户 API）
> **产出目标**：个人中心页 + 口味偏好设置页功能闭环

---

## 1. 任务清单

### 1.1 用户 API

- [ ] 创建 `src/api/user.ts`：
  - `getProfile()` → `GET /v1/user/profile`
  - `updateProfile(params)` → `PUT /v1/user/profile`
  - `updatePreferences(tags)` → `PUT /v1/user/preferences`
  - `getPreferenceOptions()` → `GET /v1/user/preference-options`

### 1.2 用户状态管理（useUserStore）

- [ ] 创建 `src/stores/useUserStore.ts`：
  - 状态：`userInfo`, `preferences`
  - Action：`fetchProfile()` — 获取用户信息
  - Action：`updateProfile(nickname, avatarUrl)` — 更新昵称/头像
  - Action：`updatePreferences(tags)` — 更新口味偏好
  - 初始化时从 Storage 恢复用户信息（减少首屏白屏）

### 1.3 个人中心页（TabBar 页）

- [ ] 页面路径：`src/pages/profile/index/`
- [ ] 页面配置：`navigationBarTitleText: '我的'`
- [ ] **页面结构**：
  1. 用户信息区：头像 + 昵称（未授权显示默认头像 + "微信用户"）
  2. 功能入口列表：
     - 口味偏好设置 →（跳转偏好页）
     - 家庭群组管理 →（跳转家庭群组页，Plan 13）
     - 饮食记录 →（跳转饮食记录页）
     - 关于 →
- [ ] **用户信息授权**：
  - 点击头像区域 → 使用微信 `<button open-type="chooseAvatar">` 获取头像
  - 昵称使用微信昵称输入组件
  - 授权后调用 `updateProfile()` 保存
- [ ] `useDidShow` 刷新用户信息

### 1.4 偏好设置页

- [ ] 页面路径：`src/pages/profile/preferences/`
- [ ] 页面配置：`navigationBarTitleText: '口味偏好设置'`
- [ ] **页面结构**：
  1. 调用 `getPreferenceOptions()` 获取标签分类列表
  2. 按分类展示标签（口味 / 饮食方式 / 忌口）
  3. 标签多选交互：选中高亮，取消恢复
  4. 回显用户当前偏好（`userInfo.taste_preferences`）
  5. 底部"保存"按钮
- [ ] **交互**：
  - 保存 → 调用 `updatePreferences()` → 成功 Toast → 返回个人中心
  - 保存失败 → Toast 提示，保留当前选择

---

## 2. 关联文档

- `01-用户系统.md`：全文（用户信息、口味偏好、API 接口）
- `08-前端架构设计.md`：第 5.1 节（useUserStore）、第 8.1 节（路由映射）

## 3. 验收标准

1. 个人中心正确显示用户信息，未授权时显示默认值
2. 点击头像/昵称可触发微信授权流程
3. 各功能入口跳转正确
4. 偏好设置页正确展示标签分类，回显已选偏好
5. 多选 / 保存 / 错误处理流程正常
