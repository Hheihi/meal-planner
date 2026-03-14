# Plan 14：分包优化与体验打磨

> **阶段**：Phase 4 — 打磨 + 上线
> **前置依赖**：Plan 01-13 全部完成
> **产出目标**：首包 < 2MB，所有异常状态覆盖，交互体验打磨到位

---

## 1. 任务清单

### 1.1 分包配置

- [ ] 在 `app.config.ts` 中配置 `subPackages`：
  ```
  主包（TabBar 页面 + 高频页面）：
    - pages/index/index          ← 首页
    - pages/cuisine/list/index   ← 菜系（TabBar）
    - pages/cuisine/dishes/index ← 菜品列表（从 TabBar 直接进入）
    - pages/dish/detail/index    ← 菜品详情（高频访问）
    - pages/menu/today/index     ← 菜单（TabBar）
    - pages/profile/index/index  ← 我的（TabBar）

  子包 - record：
    - pages/record/index/index
    - pages/record/detail/index

  子包 - family：
    - pages/family/index/index
    - pages/family/join/index
    - pages/family/member-menu/index

  子包 - search：
    - pages/search/index/index

  子包 - settings：
    - pages/profile/preferences/index
  ```
- [ ] 验证主包体积 < 2MB
- [ ] 配置分包预下载（`preloadRule`）：首页预下载 record 和 search 子包

### 1.2 异常状态全覆盖

- [ ] 逐页检查以下状态是否都有对应 UI：
  - 首屏加载中 → Skeleton
  - 数据为空 → EmptyState
  - 加载失败 → ErrorRetry
  - 图片加载失败 → 占位图
  - 网络异常 → Toast 提示
- [ ] 重点检查页面：
  - [ ] 首页（菜单概览加载失败 + 推荐加载失败）
  - [ ] 菜品列表（空列表 + 加载更多失败）
  - [ ] 今日菜单（空菜单）
  - [ ] 饮食记录（无记录的日期）
  - [ ] 家庭群组（未加入 / 邀请码失效 / 成员无菜单）

### 1.3 交互体验优化

- [ ] **操作反馈**：
  - 所有按钮操作增加 loading 态（防重复点击）
  - 加入菜单 / 确认完成 / 保存偏好等操作增加 `Taro.showLoading`
  - 操作成功 Toast 增加 `icon: 'success'`
- [ ] **过渡动画**：
  - 骨架屏到真实内容的淡入过渡
  - MealSelector 弹出/收起动画
  - 推荐列表"换一批"切换动画
- [ ] **防抖 / 节流**：
  - 确认删除、确认完成等按钮防重复点击
  - 搜索输入防抖（已在 Plan 07 实现，此处复查）
- [ ] **页面滚动**：
  - 长页面返回顶部按钮（可选）
  - 菜品详情页步骤较多时滚动性能

### 1.4 其他优化

- [ ] 检查所有图片是否使用正确尺寸（列表用缩略图，详情用大图）
- [ ] 删除所有 `console.log` 调试代码
- [ ] 运行 `pnpm lint` 确认无报错
- [ ] TypeScript 编译无错误和警告

---

## 2. 关联文档

- `08-前端架构设计.md`：第 12 节（性能优化策略）、第 12.1 节（分包配置）
- `09-前端开发规范.md`：第 8 节（性能规范）、第 10 节（代码审查清单）

## 3. 验收标准

1. 主包体积 < 2MB，子包按模块正确拆分
2. 所有页面的加载中 / 空数据 / 错误状态均有对应 UI
3. 操作按钮均有 loading 态，无重复点击问题
4. 关键交互有动画过渡，不生硬
5. `pnpm lint` 无报错，无 `console.log`，TypeScript 编译通过
