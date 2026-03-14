# Plan 01：项目初始化与工程配置

> **阶段**：Phase 1 — 基础框架
> **前置依赖**：无
> **产出目标**：可运行的空 Taro 项目，所有工程配置就绪，`pnpm dev:weapp` 能在模拟器中看到空白首页

---

## 1. 任务清单

### 1.1 Taro 项目脚手架

- [ ] 使用 `taro init` 创建项目，选择 React + TypeScript + Less 模板
- [ ] 确认 Taro 版本 4.x，React 18.x
- [ ] 验证 `pnpm dev:weapp` 编译成功，微信开发者工具能预览

```bash
# 使用 Taro CLI 创建项目（指定镜像源加速）
pnpm --registry https://registry.npmmirror.com dlx @tarojs/cli@4.1.11 init meal-planner-app
# 交互选项：React / TypeScript / Less / pnpm / 默认模板

# 进入项目目录
cd meal-planner-app

# 安装依赖
pnpm install --registry https://registry.npmmirror.com

# 安装 Zustand 状态管理
pnpm add zustand@4 --registry https://registry.npmmirror.com

# 验证编译
pnpm dev:weapp
```

### 1.2 目录结构搭建

按照 `08-前端架构设计.md` 第 2 节，创建完整目录骨架：

```
src/
├── api/           # 空目录，放 .gitkeep
├── stores/        # 空目录
├── pages/         # 脚手架已生成 index
├── components/    # 空目录
├── hooks/         # 空目录
├── utils/         # 空目录
├── types/         # 空目录
└── assets/
    ├── icons/     # 空目录
    └── images/    # 空目录
```

```bash
# 创建目录骨架并添加 .gitkeep
mkdir -p src/{api,stores,components,hooks,utils,types,assets/icons,assets/images}
touch src/{api,stores,components,hooks,utils,types,assets/icons,assets/images}/.gitkeep
```

### 1.3 TypeScript 配置

- [ ] `tsconfig.json` 开启 `strict: true`
- [ ] 配置路径别名 `@/*` → `./src/*`
- [ ] 确认 `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters` 均开启

### 1.4 ESLint + Prettier 配置

- [ ] 安装依赖：`eslint`, `@typescript-eslint/eslint-plugin`, `eslint-config-taro`, `eslint-config-prettier`, `prettier`
- [ ] 配置 `.eslintrc.js`，核心规则参照 `09-前端开发规范.md` 第 11.1 节
- [ ] 配置 `.prettierrc`，参照 `09-前端开发规范.md` 第 11.2 节
- [ ] 添加 `.eslintignore`：`node_modules/`, `dist/`, `config/`
- [ ] 验证：运行 `pnpm lint` 无报错

```bash
# 安装 ESLint 相关依赖（Taro 脚手架已内置部分，按需补装缺失项）
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-config-taro eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks \
  --registry https://registry.npmmirror.com

# 安装 Prettier
pnpm add -D prettier --registry https://registry.npmmirror.com

# 验证 lint
pnpm lint
```

### 1.5 Less 全局变量配置

- [ ] 创建 `src/app.less`，写入全局样式变量（参照 `08-前端架构设计.md` 第 10.2 节）
- [ ] 在 `config/index.ts` 中配置 `designWidth: 750`
- [ ] 配置 Less 全局变量注入（`lessLoaderOption`），使所有 `.module.less` 文件可直接使用 `@color-primary` 等变量
- [ ] 验证：在首页 `index.module.less` 中使用 `@color-primary`，编译无报错

### 1.6 全局配置（app.config.ts）

- [ ] 配置 `pages` 数组，注册所有 13 个页面路由
- [ ] 配置 `tabBar`：首页 / 菜系 / 菜单 / 我的（图标暂用占位图）
- [ ] 配置 `window`：导航栏标题、背景色、文字颜色
- [ ] 为每个页面创建最小文件（`index.tsx` + `index.config.ts` + `index.module.less`），内容为空白占位

### 1.7 Git 初始化

- [ ] `.gitignore` 添加：`node_modules/`, `dist/`, `.swc/`, `.DS_Store`
- [ ] 初始提交：`chore: 项目初始化，Taro + React + TypeScript + Less`

---

## 2. 关联文档

- `08-前端架构设计.md`：第 2、3、10 节
- `09-前端开发规范.md`：第 11 节（ESLint / Prettier / tsconfig）

## 3. 验收标准

1. `pnpm dev:weapp` 编译成功，微信开发者工具中可看到 4 个 TabBar 页面
2. 点击各 TabBar 可切换，页面显示占位文字
3. `pnpm lint` 无报错
4. TypeScript 编译无报错
5. Less 全局变量可在任意 `.module.less` 中使用
