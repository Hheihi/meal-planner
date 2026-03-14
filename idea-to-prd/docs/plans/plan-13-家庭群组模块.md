# Plan 13：家庭群组模块

> **阶段**：Phase 3 — 社交 + 个人
> **前置依赖**：Plan 09（今日菜单数据 / API）、Plan 12（个人中心入口）
> **产出目标**：家庭群组的创建 / 加入 / 成员菜单查看 / 成员管理 / 微信分享全流程闭环

---

## 1. 任务清单

### 1.1 类型定义

- [ ] 创建 `src/types/family.ts`，定义：
  - `FamilyGroup` — 群组信息 `{ id, name, inviteCode, owner, members, memberCount }`
  - `FamilyMember` — 成员 `{ id, nickname, avatarUrl, role }`
  - `GroupPreview` — 群组预览（加入前）`{ id, name, memberCount, inviterNickname }`

### 1.2 家庭群组 API

- [ ] 创建 `src/api/family.ts`：
  - `createGroup(name)` → `POST /v1/family-groups`
  - `getMyGroup()` → `GET /v1/family-groups/mine`
  - `getPreview(inviteCode)` → `GET /v1/family-groups/preview?invite_code=`
  - `joinGroup(inviteCode)` → `POST /v1/family-groups/join`
  - `leaveGroup()` → `POST /v1/family-groups/leave`
  - `removeMember(userId)` → `DELETE /v1/family-groups/members/:userId`
  - `dissolveGroup()` → `DELETE /v1/family-groups/mine`
  - `getMemberMenu(userId)` → `GET /v1/family-groups/members/:userId/menu/today`

### 1.3 家庭群组首页

- [ ] 页面路径：`src/pages/family/index/`
- [ ] **两种状态**：
  - **未加入群组**（`getMyGroup()` 返回 `null`）：
    - 显示"创建家庭"按钮
    - 点击 → 弹出输入框输入群组名称 → 调用 `createGroup()`
  - **已加入群组**：
    - 群组名称
    - 成员菜单列表：每个成员卡片（头像 + 昵称 + 三餐概览 + "查看详情"）
    - "邀请家人"按钮（触发微信分享）
    - 成员管理入口
- [ ] 成员菜单概览：显示每人的三餐状态（菜品名 / 暂未安排 / ✅ 已完成）

### 1.4 加入群组页

- [ ] 页面路径：`src/pages/family/join/`
- [ ] 页面参数：`?invite_code=ABC123XY`
- [ ] 流程：
  1. 解析 `invite_code` → 调用 `getPreview()` 获取群组信息
  2. 展示群组名称 + 邀请人昵称 + 当前成员数
  3. "加入家庭"按钮 → 调用 `joinGroup()` → 跳转群组首页
  4. "暂不加入"按钮 → 返回上一页
- [ ] 异常处理：
  - 已在其他群组 → 提示"需先退出当前家庭"
  - 邀请码无效 → 提示"邀请已失效"
  - 已是该群组成员 → 提示"你已是该家庭成员"
  - 群组满员 → 提示"家庭成员已达上限"

### 1.5 成员菜单查看页（只读）

- [ ] 页面路径：`src/pages/family/member-menu/`
- [ ] 页面参数：`?userId=10001&nickname=小明`
- [ ] 调用 `getMemberMenu(userId)` 获取成员今日菜单
- [ ] 展示格式与今日菜单页类似，但为只读模式（无编辑按钮）
- [ ] 点击菜品可跳转菜品详情页

### 1.6 成员管理

- [ ] 在群组首页中实现：
  - **创建者**：可移除普通成员，可解散群组
  - **普通成员**：可退出群组
  - 移除 / 退出 / 解散均弹出二次确认
- [ ] 解散群组后所有成员下次打开提示"家庭已解散"

### 1.7 微信分享（邀请）

- [ ] 在群组首页"邀请家人"按钮触发 `Taro.showShareMenu` + 配置 `onShareAppMessage`：
  ```typescript
  useShareAppMessage(() => ({
    title: `${nickname}邀请你加入「${groupName}」`,
    path: `/pages/family/join/index?invite_code=${inviteCode}`,
    imageUrl: '/assets/images/share-family.png',
  }))
  ```
- [ ] 分享卡片包含群组名称和邀请描述

---

## 2. 关联文档

- `06-家庭群组.md`：全文（创建 / 邀请 / 加入 / 成员菜单 / 管理 / 解散、API 接口）
- `08-前端架构设计.md`：第 8.1 节（路由映射）、第 8.2 节（家庭邀请分享卡片通信）

## 3. 验收标准

1. 未加入群组时可创建，创建成功后显示群组信息
2. 分享邀请卡片正确生成，被邀请人点击可打开加入页
3. 加入 / 退出 / 移除 / 解散流程正常，异常提示完整
4. 成员菜单只读查看正确，点击菜品可跳转详情
5. 所有危险操作有二次确认
