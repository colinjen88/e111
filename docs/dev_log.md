
# 開發歷程記錄 (Development Log Tree)

本文件以樹狀結構記錄 `e111-booking` 預約系統的完整開發流程。

```mermaid
graph TD
    Start[開始 Start] --> Analysis[現狀分析]
    Analysis --> Plan[升級計劃 booking.md]
    Plan --> Stack{技術選型}
    Stack -->|Nuxt3 + Prisma + PG| Init[專案初始化]
    Init --> Config[環境與套件配置]
    Config --> Backend[後端開發]
    Config --> Frontend[前端開發]
   

    subgraph Phase1_Infrastructure
    Config --> Docker[Docker PostgreSQL]
    Config --> Prisma[Prisma Schema]
    Config --> Tailwind[Tailwind CSS]
    end

    subgraph Phase2_Implementation
    Backend --> API_Branch[API: 分館資訊]
    Backend --> API_Staff[API: 技師列表]
    Backend --> API_Avail[API: 時段查詢]
    Backend --> API_Booking[API: 建立預約]
    Frontend --> Page_Home[首頁 index.vue]
    Frontend --> Page_Booking[預約頁 booking.vue]
    Page_Booking -->|Step 5| Form_Customer[客戶資料表單]
    Page_Booking -->|Step 6| Page_Success[預約成功頁]
    end

    subgraph Phase3_Admin
    Backend --> API_Admin_Auth[API: 後台登入]
    Backend --> API_Admin_List[API: 訂單列表]
    Frontend --> Layout_Admin[Layout: 後台版型]
    Frontend --> Page_Login[Page: 管理登入]
    Frontend --> Page_Dashboard[Page: 訂單總覽]
    end

    subgraph Phase4_Integration
    API_Booking -->|Trigger| Notify[Notification Service]
    Notify -->|Log| Console[模擬 LINE/Email 發送]
    Frontend --> Page_Settings[Page: 系統設定]
    end

    subgraph Phase5_UI_Renewal
    Page_Home -- Redesign --> Page_Home_v2[新版首頁 (Oriental Style)]
    Tailwind -- Update --> Brand_Colors[品牌色系與字體]
    end

    subgraph Phase6_Member_Services
    API_Booking -->|Lookup| API_OrderLookup[訂單查詢 API]
    API_Booking -->|Cancel| API_OrderCancel[訂單取消 API]
    Frontend --> Page_Order[查詢/管理頁]
    Frontend --> Page_Privacy[隱私權/服務條款]
    end
```

## 詳細執行日誌 (Detailed Execution Log)

### 2026-02-10: 專案啟動與基礎建設
*   [x] **需求分析**
    *   檢視 `contact.html`，確認 ASP 舊架構痛點（前後端耦合、缺乏 SQL）。
*   [x] **架構規劃**
    *   建立 `booking.md`，定義資料庫 Schema (Branches, Services, Staff, etc.)。
    *   確立技術棧：**Nuxt 3 + Prisma + PostgreSQL + Tailwind**。
*   [x] **專案初始化 (Initialization)**
    *   建立 Nuxt 專案 `e111-booking`。
    *   安裝核心套件：`tailwindcss`, `prisma`, `@prisma/client`。
*   [x] **環境配置 (Configuration)**
    *   **Docker**: 建立 `docker-compose.yml` (Port 調整為 5433 以避開衝突/Docker問題)。
    *   **Prisma**: 編寫 `schema.prisma`，實作 8 張核心資料表 (符合 3NF)。
    *   **Tailwind**: 設定 `tailwind.config.ts` 導入品牌色 (`#d73324`)。
    *   **Port Config**: 設定開發伺服器 Port 為 2390 (package.json)。
*   [x] **資料庫建置 (Database Setup)**
    *   **Fallback**: 切換至 SQLite (file:./dev.db) 以解決 Docker 網路連線問題。
    *   **Migration**: 成功執行 `prisma migrate dev --name init_reset` (Full Reset)。
    *   **Seeding**: 成功寫入種子資料 (包含服務、分館、技師)。
    *   **Access**: 使用 `http://localhost:2390` (Port 2390 恢復正常)。
*   [x] **環境問題排除 (Environment Troubleshooting)**
    *   **Tailwind 衝突**: 發現 `@nuxtjs/tailwindcss` 與 Tailwind v4 衝突，降版至 v3 解決伺服器崩潰問題。
    *   **API 404**: 修正 Nuxt 4 目錄結構，將 `server/` 移回根目錄解決 API 路由問題。
    *   **App Mount**: 修正 `app/app.vue` 缺少 `<NuxtPage />` 導致的無限載入問題。
*   [x] **後端開發 (Backend API - Phase 1)**
    *   建立 Prisma Client Utility (`server/utils/prisma.ts`)。
    *   實作分館查詢 API (`api/branches/index.get.ts`)。
    *   實作服務查詢 API (`api/services/index.get.ts`) **[NEW]**。
*   [x] **前端開發 (Frontend - Phase 1)**
    *   **Landing Page**: 首頁與 Hero Section (`pages/index.vue`)。
    *   **Booking Step 1**: 分館選擇 UI (`pages/booking.vue`)。
    *   **Booking Step 2**: 服務項目選擇 UI (Tabs 切換 + 服務列表) **[NEW]**。
    *   **Booking Step 3**: 技師選擇 UI (含不指定選項) **[NEW]**。
    *   **Booking Step 4**: 日曆與時段選擇 UI (連動後端 Availability API) **[NEW]**。
    *   **Booking Step 5**: 預約確認 UI (總結所有資訊) **[NEW]**。
    *   **Visual Logs**: 持續更新 `tree.html` 與 `dev_log.md`。
*   [x] **專案知識庫建立 (Agent Brain Setup)**
    *   建立 `.agent/PROJECT_AGENT.md`: 專案架構與關鍵指令。
    *   建立 `.agent/skills/database.md`: 資料庫管理 SOP。
    *   建立 `.agent/skills/debugging.md`: 環境問題排查手冊。
*   [x] **後端可用性邏輯 (Availability Logic - Phase 1.3)**
    *   `api/availability`: 實作基於營業時間 (10:00-22:00) 與現有訂單的時段計算。
    *   支援指定技師與不指定技師 (Any Staff) 的邏輯判斷。

## 🎯 Milestone 1: Booking Flow Alpha Completed (2026-02-11)
- 核心五步預約流程已串接完畢。
- 環境與資料庫穩定。

### 2026-02-11: Phase 2 - Booking Submission (完成)
*   [x] **Backend API (POST /api/bookings)**
    *   實作交易處理 (Transaction): 同時寫入 `Customer`, `Booking`, `BookingItem`。
    *   實作重複預約檢查 (Double Booking Check)。
    *   支援「自動分配技師」邏輯 (當使用者選擇不指定時)。
*   [x] **Frontend UI (Step 5 & 6)**
    *   **Step 5**: 新增客戶資料表單 (姓名/電話/Email/備註)。
    *   **Step 6**: 新增預約成功頁面 (顯示訂單編號與詳細資訊)。
    *   **Validation**: 前端簡易驗證 + 後端 Zod/Logic 驗證。
*   [x] **Documentation Updated**
    *   更新 `task.md` 狀態為 Phase 2 完成。
    *   更新 `tree.html` 視覺化進度。

### 2026-02-11: Phase 3 - Admin Dashboard (完成)
*   [x] **Admin Layout (Bootstrap)**
    *   建立 `layouts/admin.vue`: 響應式側邊欄 + 頂部導航。
*   [x] **Authentication (Middleware)**
    *   建立 `api/admin/auth.post.ts`: 簡易密碼驗證 (Default: `admin123`)。
    *   建立 `middleware/auth.ts`: 路由守衛，未登入自動導向登入頁。
    *   建立 `pages/admin/login.vue`: 登入介面。
*   [x] **Dashboard UI (Bookings List)**
    *   建立 `api/admin/bookings.get.ts`: 獲取全部預約單 (包含關聯欄位)。
    *   建立 `pages/admin/index.vue`: 預約單列表、狀態標籤、篩選器 UI。

### 2026-02-11: Phase 4 - Integrations (完成)
*   [x] **Notification Service (Mock)**
    *   建立 `server/utils/notify.ts`: 封裝 LINE(Push Message)/Email 發送邏輯。
    *   實作: 將預約資訊格式化並 Log 到後端 Console (模擬真實發送)。
*   [x] **API Integration**
    *   整合 `api/bookings/index.post.ts`: 預約成功且 Transaction 完成後，非同步觸發通知。
*   [x] **Admin Settings UI**
    *   建立 `pages/admin/settings.vue`: 提供 LINE Token/User ID 與 Email 設定介面。

### 2026-02-11: Phase 5 - UI/UX Renewal (完成)
*   [x] **Brand Identity**
    *   設定 Tailwind 品牌色 (`brand-red`, `brand-gold`).
    *   導入 Google Fonts (Noto Serif TC, Noto Sans TC).
*   [x] **Index Page Redesign**
    *   **Hero Section**: 全螢幕背景圖 + 漸層疊加 + 入場動畫 (VueUse Motion).
    *   **Services Grid**: 響應式卡片設計，懸停效果優化。
    *   **Ambience Section**: 環境介紹區塊，營造高級感。
*   [x] **Admin Enhancements**
    *   建立 `api/admin/stats.get.ts`: 營收統計 API (Today/Month/Chart)。
    *   更新 `pages/admin/index.vue`: 新增統計卡片與長條圖。
    *   建立 `pages/admin/calendar.vue`: 新增月曆視圖。

### 2026-02-11: Phase 7 - Deployment & Troubleshooting (完成)
*   [x] **Docker Production Setup**
    *   建立 `Dockerfile`: 多階段建置 (Node 20 Alpine)，優化生產環境體積。
    *   建立 `docker-compose.prod.yml`: 配置 PostgreSQL 15 + Nuxt 3。
*   [x] **Troubleshooting (Technical Debt Clearing)**
    *   **Prisma 7 Compatibility**: 解決 P1012 驗證錯誤，修正 `schema.prisma` 規範並鎖定版本。
    *   **Compose Bug**: 解決舊版 `docker-compose` 的 `ContainerConfig` KeyError，改用新版 `docker compose`。
    *   **Port Conflict**: 避開瀏覽器 `ERR_UNSAFE_PORT`，改用 Port 3001 配合 Nginx 反向代理。
    *   **Nginx Config**: 建立 `book.gowork.run` 虛擬主機設定，成功串接內部容器。
    *   **Alpine Engine Fix**: 安裝 OpenSSL 並設定 Prisma 二進制目標解決執行引擎崩潰。
    *   **API Logic Fix**: 修正預約單模型查詢欄位錯誤。
*   [x] **App Readiness**
    *   **Container Status**: `e111-booking-app` 成功跑在 Port 3001 並持久運行。
    *   **Database Sync**: 完成 PostgreSQL 資料庫連結。
*   [x] **Final Polish**
    *   [x] 執行 `npx prisma db seed` 初始化生產環境資料。

## 🏁 Project Summary (v1.6 Live & Stable)
系統已完全成功部署至 Hostinger VPS。核心功能（預約、登入、管理、統計）均已通過實際數據測試並穩定運行。預約系統已正式上線。

### 2026-02-12: Phase 8 - Code Review & Optimization (完成)
*   [x] **Security Hardening**
    *   **Admin Auth**: 實作 `requireAdmin` 驗證，修復 API 未授權存取漏洞。
    *   **Cookie Security**: 啟用 `httpOnly`, `secure`, `sameSite: strict`。
    *   **Environment**: 建立 `.env.example`，移除硬編碼密碼。
*   [x] **Infrastructure Fixes**
    *   **Nginx**: 修正 `proxy_pass` 循環導向問題 (Port 80 -> 3001)。
    *   **Docker**: 設定 `TZ=Asia/Taipei` 統一時區。
*   [x] **Performance Optimization**
    *   **Prisma Singleton**: 重構為單例模式 (Singleton)，解決連線數耗盡風險。
    *   **N+1 Query**: 優化 `availability` API，大幅減少資料庫查詢次數。
    *   **Rate Limiting**: 實作 `server/middleware/ratelimit.ts` 防止暴力破解/DDoS。
*   [x] **Reliability**
    *   **Race Condition**: 在預約交易中加入 `Isolation Level: Serializable` 防止重複預約。
    *   **Validation**: 引入 `Zod`Schema 驗證，強化輸入資料安全性。

### 2026-02-12: Phase 9 - DevOps & Reliability (完成)
*   [x] **DevOps Integration**
    *   **CI/CD**: 建立 `.github/workflows/ci.yml`，每次 Push 自動執行 `Type Check` 與 `Build`。
    *   **Testing**: 安裝 `Vitest`，建立 Booking Schema 單元測試 (`tests/schemas.test.ts`) 並驗證通過。
    *   **Logging**: 建立 `server/utils/logger.ts`，實作結構化 JSON 日誌，提升生產環境可觀測性。


### 2026-02-12: Phase 10 - LINE Integration (完成)
*   [x] **LINE Messaging API Integration**
    *   **SDK Setup**: 安裝 `@line/bot-sdk`。
    *   **Webhook Endpoint**: 建立 `server/api/line/webhook.post.ts` 處理 LINE 平台事件。
    *   **Client Factory**: 實作 `server/utils/line.ts` (Lazy Initialization Pattern) 解決 Runtime Config 初始化問題。
    *   **Environment**: 設定 `NUXT_LINE_CHANNEL_SECRET` 與 `NUXT_LINE_CHANNEL_ACCESS_TOKEN`。
    *   **Deployment**: 成功部署至 VPS 並通過 LINE Developers Console Webhook 驗證。

## 🏁 Project Summary (v2.2 Integrated)
系統已成功串接 LINE Messaging API，具備接收與回應訊息的基礎能力，為後續的自動化通知功能奠定基礎。

### 2026-02-12: Phase 11 - UI Refinement & Hydration Fixes (完成)
*   [x] **Brand Logo Integration**
    *   **Image Replacement**: 全面替換文字 Logo 為圖片 Logo (`index.vue`, `booking.vue`, `admin.vue`)。
    *   **Visibility Optimization**: 修正預約頁 Header 背景色 (`bg-black/80`) 以確保白色 Logo 可視性。
*   [x] **Hydration Stability**
    *   **App Structure**: 重構 `app.vue` 為標準單一根節點結構 (`id="nuxt-app"`)，解決 Fragment 引起的 Hydration Mismatch。
    *   **Layout System**: 建立 `layouts/default.vue` 統一管理全域樣式，移除 `app.vue` 冗餘 CSS。
    *   **Global Styles**: 將 `antialiased` 等通用樣式移至 `nuxt.config.ts` (`bodyAttrs`)。
    *   **Login Page**: 優化 `login.vue` 使用 `layout: false` 並修復事件綁定失效問題。
*   [x] **Backend Robustness**
    *   **Body Parsing**: 修正 `api/bookings` 與 `api/admin/auth` 的 Request Body 解析邏輯 (`readBody`)。
    *   **Auth Hardening**: 強化後台登入驗證邏輯，增加 `trim()` 處理與 Fallback 機制。

## 🏁 Project Summary (v2.3 UI Polished)
系統介面已完成品牌化調整 (Logo/Colors)，並徹底解決 Nuxt 3 Hydration Mismatch 問題，提升了前後端穩定性與開發體驗。

### 2026-02-13: Phase 12 - Deployment Automation & LINE Bot Launch (完成)
*   [x] **Deployment Automation**
    *   **Local Script**: 優化 `deploy_vps.ps1`，新增自動打包 (`tar`) 與上傳流程，移除手動操作步驟。
    *   **Remote Script**: 優化 `deploy_remote.sh`，新增 `PORT 3001` 強制清理檢測，解決 `Bind for 0.0.0.0:3001 failed` 錯誤。
    *   **Process**: 實現一鍵部署 (`Run Script` -> `Type Password` -> `Done`)。
*   [x] **LINE API Readiness**
    *   **Health Check**: 實作 `/api/line/status`，確認 Production 環境變數 (`NUXT_LINE_...`) 讀取正常。
    *   **Webhook Verification**: 於 LINE Developers Console 成功驗證 Webhook URL (`https://book.gowork.run/api/line/webhook`)。
    *   **Bot Online**: 確認 LINE Bot 已上線並可接收/回應訊息。

## 🏁 Project Summary (v2.4 Live & Bot Ready)
自動化部署流程已建立，LINE Bot 成功上線並通過 webhook 驗證，系統已準備好進行更複雜的對話邏輯開發。
