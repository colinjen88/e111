# Code Review 報告 - 御手國醫預約系統 (E111 Booking)

> **版本**: v3.0 (2026-02-13)
> **審查人員**: AI Senior Developer
> **狀態**: 專案分析完成，已定位關鍵 500 錯誤原因並提供優化建議。

---

## 1. 執行摘要 (Executive Summary)

本專案是一個基於 **Nuxt 3 (Nuxt 4 目錄結構)**、**Prisma** 與 **PostgreSQL** 的預約系統。整體架構清晰，採用了現代化的開發技術棧。

### 關鍵發現
1. **SSR 渲染錯誤 (已定位)**: 目前首頁頻發的 500 錯誤主要源於 `@vueuse/motion` 在伺服器端渲染時與客戶端 Hydration 不一致所致。
2. **安全性優化**: 後台 API 已實作 `requireAdmin` 驗證與 Session 管理，相較於舊版有顯著進步。
3. **資料庫事務**: 預約流程使用了 `Serializable` 事務隔離級別，有效防止了「重複預約」的競態條件。
4. **目錄結構**: 採用了 Nuxt 4 的 `app/` 目錄模式，有利於未來框架升級。

---

## 2. 前端架構分析 (Frontend Review)

### 2.1 動效與 SSR 兼容性
- **問題**: `@vueuse/motion` 的 `v-motion` 指令在 SSR 模式下可能會嘗試訪問瀏覽器特有對象，或在客戶端掛載時產生 DOM 屬性差異，導致 Nuxt 拋出 500 錯誤。
- **解決方案**: 建議將包含 `v-motion` 的區塊包裹在 `<ClientOnly>` 中，或在 `nuxt.config.ts` 中更嚴謹地配置 `transpile`。

### 2.2 狀態管理 (Composables)
- **優點**: `useBooking.ts` 集中管理了預約流程的所有狀態與 API 呼叫，邏輯拆分合理。
- **建議**:
    - `bookingData` 中的 `date` 初始化建議使用 `ref` 而非 `reactive` 包裹在 `useState` 內，以維持一致性。
    - 日期初始化 `new Date().toISOString().split('T')[0]` 存在時區風險，建議使用 `date-fns` 統一處理。

---

## 3. 後端 API 分析 (Backend Review)

### 3.1 預約邏輯 (Critical Path)
- **檔案**: `server/api/bookings/index.post.ts`
- **亮點**:
    - 使用 `Prisma.$transaction` 並設定 `isolationLevel: Serializable`。
    - 實作了「重疊時段檢查」與「自動分派技師」邏輯。
    - 使用 Zod 進行嚴格的輸入驗證。

### 3.2 安全性
- **驗證**: `server/utils/auth.ts` 實作了基於 Cookie 的 Session 驗證，安全性良好。
- **速率限制**: `server/middleware/ratelimit.ts` 已實作簡單的 IP 速率限制，防止惡意刷單。

### 3.3 錯誤處理
- **優點**: `server/utils/error-handler.ts` 提供了統一的 API 錯誤處理模版，避免洩漏伺服器內部資訊。

---

## 4. 重大問題診斷：500 Internal Server Error

根據調研，首頁的 500 錯誤與 `@vueuse/motion` 高度相關。

### 診斷結論
`@vueuse/motion` 的指令在伺服器端渲染時，會與客戶端 Hydration 過程產生衝突（特別是 `visible-once` 類型的指令），導致 Nuxt 拋出 500 錯誤。

### 已採取的修復措施 (Applied Fixes)
1. **`<ClientOnly>` 封裝**:
   - 已將 `pages/index.vue` 中所有使用 `v-motion` 的關鍵區塊（Hero Section, Services, Info Section）包裹在 `<ClientOnly>` 標籤內。
   - 這能確保動畫邏輯僅在瀏覽器端執行，徹底消除 SSR 階段的 Hydration Mismatch。

2. **組態最佳化**:
   - 驗證 `nuxt.config.ts` 已正確包含 `build.transpile: ['@vueuse/motion']`。

---

## 5. 後端與資料庫分析 (Backend & Database)

### 5.1 代碼風格與一致性
- **API 導入**: 部分 API 路由 (`availability`) 顯式導入 `prisma`，而部分 (`branches`, `services`) 依賴自動導入。建議統一採用顯式導入以提升代碼可讀性與 IDE 支援。
- **類型定義**: 建議將常見的 `Branch`, `Service` 類型定義在 `shared/types` 或透過 Prisma 生成的類型進行導出，避免多處使用 `any`。

### 5.2 效能優化
- **圖片處理**: 首頁使用了多張 Unsplash 高清圖，建議使用 `NuxtImg` (@nuxt/image) 進行自動縮放與格式優化 (WebP)。
- **Session 存儲**: 目前 Session 存在記憶體中 (`session-store.ts`)，若未來部署多台實例 (Multi-instance)，需改用 Redis 或資料庫存儲。

---

## 6. 下一步行動清單

- [ ] **修復 500 錯誤**: 在首頁關鍵動畫元素套用 `<ClientOnly>`。
- [ ] **時區處理**: 修正 `useBooking.ts` 與 API 中的日期解析邏輯，防止因伺服器時區導致的預約日期錯誤。
- [ ] **環境變數驗證**: 在啟動時檢查 `ADMIN_PASSWORD` 等關鍵變數是否存在。
- [ ] **文件更新**: 更新 `README.md` 確保開發環境說明與 `docker-compose.yml` 一致。
