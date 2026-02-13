# E111 御手國醫 — 全面優化計畫

> **建立日期**: 2026-02-13  
> **分支**: `dev` (優化完成後 merge 回 `master`)  
> **原則**: 不中斷線上服務，所有變更先在 dev 分支驗證

---

## 📊 優化總覽

| 階段 | 名稱 | 優先級 | 預估項目 |
|------|------|--------|----------|
| Phase 1 | 🔒 安全加固 | P0 - 緊急 | 6 項 |
| Phase 2 | 🧹 程式碼清理 | P1 - 重要 | 7 項 |
| Phase 3 | 🏗️ 架構重構 | P2 - 改進 | 4 項 |
| Phase 4 | ⚙️ DevOps 完善 | P2 - 改進 | 4 項 |
| Phase 5 | 🧪 測試補強 | P3 - 優化 | 3 項 |
| Phase 6 | 💎 體驗打磨 | P3 - 優化 | 3 項 |

---

## Phase 1: 🔒 安全加固 (P0)

### ✅ 1.1 清除 Git 歷史中的敏感資料
- **狀態**: ✅ 已完成
- **說明**: 使用 `git-filter-repo` 清除所有歷史 commit 中的 VPS 密碼 (`@Qqww12121212`)、IP 位址 (`72.62.66.151`, `145.79.28.71`)
- **已推送**: Force push 至 GitHub master

### ✅ 1.2 重寫部署腳本
- **狀態**: ✅ 已完成
- **說明**: `scripts/deploy_vps.ps1` 及 `e111-booking/deploy_vps.ps1` 改為從環境變數讀取認證資訊
- **使用方式**: `$env:VPS_HOST = "your-ip"; .\scripts\deploy_vps.ps1`

### ✅ 1.3 移除 nginx.conf 中的 IP
- **狀態**: ✅ 已完成

### ✅ 1.4 deploy.tar.gz 加入 .gitignore
- **狀態**: ✅ 已完成

### 1.5 修復 Admin 認證安全
- **狀態**: 🔲 待處理
- **檔案**: `server/api/admin/auth.post.ts`, `server/utils/auth.ts`
- **變更**:
  - [ ] 移除 `console.log` 中的明文密碼輸出 (L18-22)
  - [ ] Cookie 設為 `httpOnly: true` (防 XSS 讀取 cookie)
  - [ ] Production 環境設 `secure: true` (僅 HTTPS 傳輸)
  - [ ] 移除 hardcoded fallback 密碼 `admin123` 和 `admin-secret-token-default-change-me`
  - [ ] 使用 `crypto.randomBytes()` 產生隨機 session token (不用 shared secret)
  - [ ] Session token 需在 server-side 可驗證 (記錄到 memory Map 或 DB)

### 1.6 移除登入頁密碼提示
- **狀態**: 🔲 待處理
- **檔案**: `app/pages/admin/login.vue`
- **變更**:
  - [ ] 移除「測試用密碼提示：admin」區塊 (L52-60)
  - [ ] 前端移除所有 debug `console.log` (L12, L17, L26)

---

## Phase 2: 🧹 程式碼清理 (P1)

### 2.1 刪除測試/殘留檔案
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 刪除 `app/pages/index_test.vue` (會產生 `/index_test` 路由)
  - [ ] 刪除 `prisma/seed.js` (與 `seed.ts` 重複，package.json 只引用 .ts)
  - [ ] 刪除 `e111-booking/codereview.md` (舊版 code review，已過時)
  - [ ] 刪除 `e111-booking/check_conn.ps1`, `check_db.ts` (診斷用臨時檔案)
  - [ ] 刪除 `e111-booking/diagnose.sh` (診斷腳本)

### 2.2 統一部署腳本
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] `e111-booking/deploy.sh` 與 `scripts/deploy.sh` 100% 重複，保留 `scripts/` 下的，刪除 `e111-booking/` 的
  - [ ] `e111-booking/deploy_remote.sh` 保留 (VPS 端使用)   
  - [ ] 在 README 中更新部署指引

### 2.3 修正 @prisma/client 分類
- **狀態**: 🔲 待處理
- **檔案**: `e111-booking/package.json`
- **變更**:
  - [ ] 將 `@prisma/client` 從 `devDependencies` 移到 `dependencies`

### 2.4 統一 DevServer 埠號
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] `nuxt.config.ts` devServer port 與 `package.json` scripts 中的 `--port` 統一為 `3003`
  - [ ] 移除 `nuxt.config.ts` L1 的 rebuild comment

### 2.5 清理 Schema 註解
- **狀態**: 🔲 待處理
- **檔案**: `prisma/schema.prisma`
- **變更**:
  - [ ] 移除所有 `// @db.VarChar(50) -> String` 等 SQLite 遺留註解
  - [ ] 移除 `// SQLite doesn't support Enums natively` 等過時註解
  - [ ] 為模型加上有意義的中文 + 英文註解

### 2.6 修復 Calendar 頁面 Bug
- **狀態**: 🔲 待處理
- **檔案**: `app/pages/admin/calendar.vue`
- **變更**:
  - [ ] 新增 `today()` 函式 (template L58 引用但未定義)

### 2.7 docker-compose 現代化
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 移除 `docker-compose.yml` 和 `docker-compose.prod.yml` 中的 `version: '3.8'`
  - [ ] 生產環境 DB 密碼改為從 `.env` 讀取，不 hardcode `postgres:postgres`

---

## Phase 3: 🏗️ 架構重構 (P2)

### 3.1 拆分 booking.vue 大元件
- **狀態**: 🔲 待處理
- **檔案**: `app/pages/booking.vue` (672行, 34KB)
- **變更**:
  - [ ] 抽出 `components/booking/StepBranch.vue`
  - [ ] 抽出 `components/booking/StepService.vue`
  - [ ] 抽出 `components/booking/StepStaff.vue`
  - [ ] 抽出 `components/booking/StepDateTime.vue`
  - [ ] 抽出 `components/booking/StepConfirm.vue`
  - [ ] 抽出 `components/booking/StepSuccess.vue`
  - [ ] 主頁面只做步驟流程控制 + 共用狀態 (composable or provide/inject)

### 3.2 統一 Error Handling
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 新增 `app/error.vue` (Nuxt 3 全域錯誤頁面)
  - [ ] API 錯誤回傳統一格式 `{ error: true, message: '...', statusCode: 500 }`
  - [ ] 禁止在回傳中暴露 `error.message` 原始錯誤
  - [ ] 建立 `server/utils/error-handler.ts` 共用 error wrapper

### 3.3 連接真實通知服務
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 統一 `server/utils/notify.ts` 和 `server/utils/line.ts`
  - [ ] `sendLinePushMessage` 改為使用 `line.ts` 的 `pushLineMessage`
  - [ ] 標記 email 功能為「Phase 4 實作」

### 3.4 實作 Admin Settings 頁面
- **狀態**: 🔲 待處理
- **檔案**: `app/pages/admin/settings.vue`
- **變更**:
  - [ ] 替換 mock `setTimeout` 為真正的 API call
  - [ ] 或者標記 UI 為 "Coming Soon" 避免使用者誤解

---

## Phase 4: ⚙️ DevOps 完善 (P2)

### 4.1 強化 CI Pipeline
- **狀態**: 🔲 待處理
- **檔案**: `.github/workflows/ci.yml`
- **變更**:
  - [ ] 加入 `npm run test` 步驟
  - [ ] 加入 ESLint / Prettier 檢查
  - [ ] PR 加上自動 build preview

### 4.2 改善 Dockerfile CMD
- **狀態**: 🔲 待處理
- **檔案**: `e111-booking/Dockerfile`
- **變更**:
  - [ ] 把 `sleep 10` 替換為 wait-for-it loop
  - [ ] `prisma db push` 失敗時不應用 `|| true` 忽略
  - [ ] 分離 entrypoint 腳本

### 4.3 改善 Rate Limiter
- **狀態**: 🔲 待處理
- **檔案**: `server/middleware/ratelimit.ts`
- **變更**:
  - [ ] 加入定期清理 (`setInterval` 每 5 分鐘清理過期記錄)
  - [ ] 降低觸發清理的閾值 (10000 -> 1000)
  - [ ] 考慮未來遷移到 Redis-based rate limiter

### 4.4 docker-compose 密碼安全化
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] `docker-compose.prod.yml` 的 DB 密碼改用 `${POSTGRES_PASSWORD}` 環境變數
  - [ ] 統一開發/生產的帳號命名 (都用 `postgres` 或都用 `admin`)

---

## Phase 5: 🧪 測試補強 (P3)

### 5.1 補寫 API 單元測試
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] `bookings/index.post.ts` — 預約建立流程
  - [ ] `orders/lookup.post.ts` — 訂單查詢
  - [ ] `orders/cancel.post.ts` — 訂單取消
  - [ ] `admin/auth.post.ts` — 登入認證

### 5.2 補寫前端元件測試
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] booking flow 各步驟元件
  - [ ] admin dashboard 數據顯示

### 5.3 E2E 測試
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 完整預約流程 (選分館 → 選服務 → 選技師 → 選時間 → 確認)
  - [ ] Admin 登入流程

---

## Phase 6: 💎 體驗打磨 (P3)

### 6.1 Tailwind 設定補強
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] `tailwind.config.ts` 加入 `content` 設定
  - [ ] 提取共用的 component class 到 `@layer components`

### 6.2 Availability API 效能微優化
- **狀態**: 🔲 待處理
- **檔案**: `server/api/availability/index.get.ts`
- **變更**:
  - [ ] `Promise.all(allSlots.map(async ...))` 改為同步 `.map()` (內部無 async 操作)

### 6.3 SEO 與 Accessibility
- **狀態**: 🔲 待處理
- **變更**:
  - [ ] 為所有互動元素加上 unique ID
  - [ ] 確保所有 `<img>` 有 `alt` 屬性
  - [ ] 加入 `robots.txt` 進階設定

---

## 開發流程

```
dev (開發分支)
 ├── 完成各 Phase 優化
 ├── 本地測試 + build 驗證
 ├── git push origin dev
 └── 確認無誤後 → merge to master → 部署到 VPS
```

## 完成標準

- [ ] 所有 P0 (安全) 項目已完成
- [ ] 所有 P1 (清理) 項目已完成
- [ ] Build (`npm run build`) 無錯誤
- [ ] 基本功能正常 (預約流程、Admin 登入、API)
- [ ] 經使用者確認後 merge & deploy
