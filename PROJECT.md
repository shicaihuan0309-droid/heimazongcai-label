# 黑马总裁 Label - 项目文档

## 项目概述

**黑马总裁 Label** 是一款基于 Chrome/Edge 扩展（Manifest V3）的浏览器新标签页插件，同时也支持独立网页部署。它将浏览器默认的空白新标签页替换为一个功能丰富的个性化工作台，集成了搜索、书签管理、壁纸、备忘录、云端同步等多种功能，帮助用户高效管理日常浏览需求。

> 项目地址：https://github.com/shicaihuan0309-droid/heimazongcai-label
> 线上版本：https://heimazongcai.cn（域名配置中）
> 扩展版本：2.1.0

---

## 功能清单

### 核心功能

| 功能模块 | 说明 | 状态 |
|---------|------|------|
| **新标签页替换** | 将浏览器默认新标签页替换为自定义工作台 | ✅ 稳定 |
| **搜索引擎** | 支持百度、Google、Bing、搜狗等多搜索引擎切换，快速搜索或翻译 | ✅ 稳定 |
| **面板（标签分组）** | 自定义分类面板，将常用网站按主题分组管理 | ✅ 稳定 |
| **拖拽排序** | 支持面板、链接的拖拽排序和重新组织 | ✅ 稳定 |
| **临时收集箱** | 侧边栏临时收集箱，拖拽存放暂未分类的链接 | ✅ 稳定 |
| **最近访问** | 自动记录最近访问的网站，快速回访 | ✅ 稳定 |
| **壁纸系统** | 支持自定义壁纸、壁纸遮罩/模糊调节、自动切换 | ✅ 已修复 |
| **备忘录** | 完整备忘录系统，支持标题、内容、完成状态、搜索 | ✅ 稳定 |
| **备忘录 Dock** | 顶栏快捷备忘录入口，快速查看和编辑 | ✅ 稳定 |
| **桌面图标模式** | 支持卡片模式和桌面图标模式切换 | ✅ 稳定 |
| **数据导入导出** | 支持 JSON 格式的备份与恢复 | ✅ 稳定 |
| **浏览器收藏夹导入** | 支持导入 Chrome/Edge 收藏夹数据 | ✅ 稳定 |

### 账号与同步功能

| 功能 | 说明 | 状态 |
|------|------|------|
| **邮箱注册/登录** | 使用邮箱 + 密码注册账号，支持登录、退出 | ✅ 已实现 |
| **GitHub OAuth 登录** | 通过 GitHub 账号一键登录 | ✅ 已实现 |
| **密码重置** | 支持通过邮箱发送重置密码链接 | ✅ 已实现 |
| **云端数据同步** | 登录后自动将数据同步到云端，换设备后可恢复 | ✅ 已实现 |
| **个人头像/昵称** | 顶栏显示用户头像和昵称，支持下拉菜单操作 | ✅ 已实现 |
| **个人设置** | 支持修改昵称、头像、查看绑定账号 | ✅ 已实现 |

### 菜单功能（侧栏菜单）

| 功能 | 说明 | 状态 |
|------|------|------|
| 偏好设置 | 搜索、链接、显示、双击行为等个性化设置 | ✅ |
| 面板管理 | 添加、删除、排序面板 | ✅ |
| 搜索引擎 | 切换默认搜索引擎 | ✅ |
| 主题/壁纸 | 更换壁纸、调节遮罩/模糊 | ✅ |
| 图标 | 桌面图标样式设置 | ✅ |
| 侧边栏 | 侧边栏位置、自动隐藏等 | ✅ |
| 备份与恢复 | 导入/导出 JSON 数据，导入浏览器收藏夹 | ✅ |

---

## 技术栈

### 前端
- **HTML5** + **CSS3**（原生，无框架）
- **原生 JavaScript**（ES6+，无框架/库）
- **SVG 图标**（内联，无图标库依赖）

### 后端/服务
- **Supabase**（PostgreSQL + Auth + 实时数据库）
  - 用户认证（邮箱 + GitHub OAuth）
  - 云端数据存储（`user_data` 表）
  - 行级安全策略（RLS）保护用户数据

### 部署
- **GitHub Pages**（静态网站托管）
- **腾讯云域名**（`heimazongcai.cn`）

### 浏览器扩展
- **Chrome Extension Manifest V3**
- `chrome.storage.local` 本地存储
- `chrome_url_overrides.newtab` 替换新标签页

---

## 项目结构

```
heimazongcai-label/
├── CNAME                          # 自定义域名配置（heimazongcai.cn）
├── manifest.json                  # Chrome 扩展配置（Manifest V3）
├── index.html                     # 网页版入口（含账号系统）
├── newtab.html                    # 扩展版入口（新标签页，无账号系统）
├── README.txt                     # 简易安装说明
├── css/
│   └── style.css                  # 全部样式（单文件）
├── js/
│   ├── sync.js                    # 云端同步模块（Supabase）
│   ├── storage.js                 # 本地存储管理（Chrome storage / localStorage）
│   ├── search.js                  # 搜索引擎切换与搜索逻辑
│   ├── panel.js                   # 面板/卡片管理
│   ├── drag.js                    # 拖拽排序逻辑
│   ├── sidebar.js                 # 侧边栏/临时收集箱
│   └── main.js                    # 主逻辑（UI、事件、壁纸、备忘录、菜单等）
├── icons/                         # 图标资源
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── horse-logo.png
│   ├── brand-logo-white.png
│   └── brand-logo-black.png
└── wallpapers/                    # 预置壁纸资源
```

---

## 数据存储架构

### 本地存储（Chrome Extension）
```javascript
// Chrome Storage API（扩展环境）
chrome.storage.local.set({ key: value })
chrome.storage.local.get([key], callback)

// 降级：localStorage（网页环境）
localStorage.setItem(key, JSON.stringify(value))
```

### 本地数据结构
```
startab_data_v3_edge
├── version: 3
├── panels: [Panel]
│   ├── id, name
│   └── cards: [Card]
│       ├── id, name, bookmarks, style...
│       └── bookmarks: [Bookmark]
│           ├── name, url, remark, icon
├── activePanelIndex: 0
├── collectionBox: [Bookmark]
├── recentLinks: [Link]
├── memos: [Memo]
├── localBackup: { data, updated_at }
├── settings: { theme, wallpaper, searchEngine, ... }
└── auth: { apiBase, token, user, lastLoginAt }
```

### 云端存储（Supabase）
```sql
-- user_data 表（需要手动创建）
CREATE TABLE user_data (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 启用 RLS + 用户只能访问自己的数据
```

---

## 账号系统架构

### 登录方式

| 方式 | 实现 | 备注 |
|------|------|------|
| **邮箱注册** | Supabase Auth `signUp` | 注册后需邮箱验证（可配置） |
| **邮箱登录** | Supabase Auth `signInWithPassword` | 邮箱 + 密码 |
| **GitHub OAuth** | Supabase Auth `signInWithOAuth` | 一键登录，自动获取昵称和头像 |
| **密码重置** | Supabase Auth `resetPasswordForEmail` | 发送重置链接到邮箱 |

### 用户数据流

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  用户操作     │────▶│  Supabase    │────▶│  user_data   │
│  登录/注册    │     │  Auth        │     │  表          │
└──────────────┘     └──────────────┘     └──────────────┘
                              │
                              ▼
┌──────────────┐     ┌──────────────┐
│  Chrome/Edge │◀───│  云端同步     │
│  Storage     │     │  upload/     │
│  (本地缓存)   │     │  download    │
└──────────────┘     └──────────────┘
```

---

## 部署方式

### 1. Chrome/Edge 扩展安装（本地）

1. 打开 Chrome/Edge 扩展管理页面：`chrome://extensions/` 或 `edge://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目文件夹（`D:\浏览器扩展插件\黑马总裁2.1\黑马总裁Label-2.1`）
5. 新标签页自动替换为黑马总裁 Label

### 2. GitHub Pages 部署（网页版）

1. 代码推送到 GitHub 仓库
2. Settings → Pages → Source 选择 `main` 分支
3. 自动部署到 `https://<username>.github.io/<repo>/`
4. 可选：配置自定义域名（CNAME 文件）

### 3. 自定义域名绑定

**GitHub 仓库端：**
- 已创建 `CNAME` 文件，内容为 `heimazongcai.cn`

**腾讯云 DNS 解析端（用户需手动配置）：**
- 添加 4 条 A 记录指向 GitHub Pages IP：
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- GitHub Settings → Pages → Custom domain 填入 `heimazongcai.cn`
- 勾选 Enforce HTTPS

---

## 已知问题与优化方向

### 已修复 ✅
- 壁纸功能无法打开（DOM 节点获取问题）
- 菜单中重复显示备忘录入口

### 待优化 📋

| 优先级 | 问题/需求 | 说明 |
|--------|-----------|------|
| **高** | 手机注册登录 | 当前仅支持邮箱注册，用户希望支持手机号 + 验证码登录 |
| **高** | 邮箱绑定功能 | 手机注册后绑定邮箱，用于找回密码 |
| **高** | 个人中心页面 | 独立页面查看账号信息、修改头像、修改密码 |
| **中** | 头像上传 | 当前使用默认头像，需支持自定义头像上传（Supabase Storage） |
| **中** | 账号同步优化 | 登录后自动检测并提示同步，换设备时自动拉取云端数据 |
| **中** | 数据冲突处理 | 本地和云端数据冲突时的合并策略优化 |
| **低** | 多主题切换 | 提供更多预设主题色和壁纸组合 |
| **低** | 搜索建议增强 | 搜索框联想输入、历史搜索记录 |
| **低** | 小组件扩展 | 天气、时钟、倒计时等实用小组件 |
| **低** | 深色/浅色模式 | 跟随系统或手动切换 |

### 安全建议
- Supabase Anon Key 是公开可读的，已通过 RLS 策略限制数据访问
- 建议定期检查 Supabase RLS 策略是否生效
- 敏感操作（修改密码、删除账号）需要二次确认

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 2.1.0 | 2026-07 | 添加账号系统（邮箱+GitHub）、云端同步、个人头像、壁纸修复、域名配置 |
| 2.0 | 2026-06 | 初始版本，基础功能：搜索、面板、备忘录、壁纸、拖拽、备份恢复 |

---

## 开发计划

### 短期（1-2 周）
- [ ] 完成域名配置（`heimazongcai.cn`）
- [ ] 用户创建 Supabase `user_data` 表
- [ ] 手机号注册/登录（集成短信验证码服务）
- [ ] 个人中心独立页面（头像、昵称、密码修改）
- [ ] 头像上传至 Supabase Storage

### 中期（1 个月）
- [ ] 自动同步策略优化（登录自动检测云端数据）
- [ ] 数据冲突合并 UI（用户选择保留本地/云端/合并）
- [ ] 多主题系统（预设主题 + 自定义）
- [ ] 搜索历史与联想建议

### 长期（3 个月）
- [ ] 小组件市场（天气、时钟、待办、RSS 等）
- [ ] 团队/共享面板（多人协作书签）
- [ ] 移动端适配优化
- [ ] PWA 离线支持

---

## 关键配置信息

### Supabase 配置
- **URL**: `https://exntapkjzgmnrfdrpdsm.supabase.co`
- **Anon Key**: `sb_publishable_6gbR3BHByc9-6DazmX9KVw_srkV6LMB`
- **GitHub OAuth 回调地址**: 项目页面 URL（GitHub Pages 或自定义域名）

### 域名
- **自定义域名**: `heimazongcai.cn`（腾讯云）
- **GitHub Pages 地址**: `https://shicaihuan0309-droid.github.io/heimazongcai-label/`

---

*文档最后更新：2026-07-09*
