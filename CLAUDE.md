# Howdz Dashboard

Vue 3 + TypeScript + Vite 构建的可自定义浏览器起始页。支持组件拖拽布局、主题切换、壁纸配置、多标签页等功能。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://localhost:5222
npm run build      # CDN 构建 (输出: dist/)
npm run build:crx  # Chrome 扩展构建 (输出: crx/)
npm run lint       # oxlint src
```

## 技术栈

- **Vue 3** + TypeScript + `<script setup>` + JSX (设置文件)
- **Vite 5**，路径别名 `@` -> `src/`
- **Pinia** + pinia-plugin-persistedstate (localStorage / sessionStorage)
- **Element Plus** (按需引入，在 `src/main.ts` 中注册)
- **vue-i18n** (zh-cn / en，语言文件在 `src/lang/locales/`)
- **vue-grid-layout** 响应式栅格布局
- **Milkdown** Markdown 编辑器 (v5.3.1)
- **SCSS** + `@emotion/css` 动态样式
- **dayjs** 日期格式化

## 项目结构

```
src/
  main.ts              # 应用入口，Element Plus 按需引入，ServiceWorker 注册
  App.vue              # 根组件
  global.ts            # API 地址 & publicPath 配置（区分环境）
  store/index.ts       # Pinia 状态管理 (config, list, affix, global, tabList)
  materials/           # 物料组件（每个组件含 index.vue + setting.tsx）
  components/          # 应用外壳：布局、配置面板、全局特效、工具组件
  lang/                # 国际化：index.ts + locales/
  utils/               # 工具函数：color, font, gzip, images, request, preview-mode
  hooks/               # 组合式函数 (useScreenMode)
  plugins/             # 位置选择器、标准表单、右键菜单、本地图片
  types/               # TypeScript 类型声明 (global.d.ts, index.d.ts)
  constanst/           # 常量：MATERIAL_LIST_MAP, BG_IMG_TYPE_MAP, DAILY_HOT_CLASSIFY
  assets/              # SCSS 样式、图片、图标
```

## 物料组件

每个组件位于 `src/materials/<Name>/` 目录下：
- `index.vue` — 运行时组件
- `setting.tsx` — 设置表单 (JSX)
- 可选子组件（如 `Bookmark/ConfigDialog.vue`）

可用组件：Empty、Clock、Day、Verse、Search、Collection、Bookmark、Iframe、TodoList、Weather、CountDown、Editor、MovieLines、DailyHot、JuejinList、WeiboList、GithubTrending、ZhihuList

## 两种布局模式

1. **响应式（文档流）** — `list` 数组，使用 vue-grid-layout
2. **Fixed（固定定位）** — `affix` 数组，绝对定位

两种模式均存储在 Pinia store 的 `list` 和 `affix` 中。

## 状态与持久化

Pinia store (`src/store/index.ts`) 持久化到 localStorage（预览模式下使用 sessionStorage）。关键数据切片：`list`、`affix`、`global`、`tabList`、`wallpaperCollectionList`。

## 构建模式

- `npm run build` — CDN 模式，资源从 `https://cdn.kongfandong.cn/howdz/dist/` 加载
- `npm run build:crx` — Chrome 扩展模式，使用相对路径，输出到 `crx/`

## 开发代理

`/api` 代理到 `http://kongfandong.cn`（详见 `vite.config.ts`）。

## 代码检查

使用 **oxlint**（运行时不再使用 eslint）。ESLint 配置仅用于 IDE 支持。运行：`npm run lint`（oxlint src）。

## 开发规范

- 提交信息遵循 **Conventional Commits**（commitlint + husky）
- 使用 `npm run commit`（commitizen）进行交互式提交
- 组件名允许 PascalCase 单词（vue/multi-word-component-names 已关闭）
- `@typescript-eslint/no-explicit-any` 已关闭 — 允许使用 `any`
- SCSS 变量通过 `vite.config.ts` 的 additionalData 全局注入（`@/assets/element-variables`）
- CSS 类名使用 kebab-case
- 组件设置使用 JSX (`.tsx`)，配合 `defineComponent` + `h()` 渲染

## 关键文件

- `vite.config.ts` — 构建配置、别名、插件、代理、SCSS 全局注入
- `src/main.ts` — 应用启动、Element Plus 注册、ServiceWorker、预览模式
- `src/store/index.ts` — 全局状态、持久化配置
- `src/constanst/index.ts` — 物料注册表、热搜来源
- `src/materials/base.tsx` — 物料组件基础包装/共享逻辑
- `src/components/Layout.vue` — 主布局控制器
- `index.html` — HTML 外壳，含加载动画、CSS/JS 注入插槽
