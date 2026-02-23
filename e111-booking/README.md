# e111-booking

Nuxt 3 預約系統，整合 Prisma、PostgreSQL 與 Tailwind CSS。

## 專案功能 (Features)

*   **前台預約**: 分館/服務/技師/時段選擇、即時可用性檢查。
*   **會員服務**: 訂單查詢與取消。
*   **管理後台**:
    *   預約單總覽與狀態管理 (Pending/Confirmed/Cancelled/Completed)。
    *   營收統計 (圖表與卡片)。
    *   行事曆視圖。
    *   通知設定 (LINE/Email)。
*   **系統架構**: 完整的 Docker 容器化支援。

## 開發環境設置 (Development Setup)

### 1. 安裝依賴
```bash
npm install
```

### 2. 環境變數 (.env)
複製 `.env.example` (若無則參考以下):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/e111_booking?schema=public"
# 若使用 SQLite (本地開發預設):
# DATABASE_URL="file:./dev.db"
```

### 3. 資料庫遷移與種子資料
```bash
# 執行 Migration
npx prisma migrate dev

# 寫入測試資料
npx prisma db seed
```

### 4. 啟動開發伺服器
```bash
npm run dev
# 訪問: http://localhost:2390
```

---

## 部署指引 (Deploy with Docker)

本專案支援使用 Docker Manager 直接部署。

### 步驟 1: 準備 Git Repo
將本專案推送到您的 Git Repository (如 GitHub/GitLab)。

### 步驟 2: Docker Manager 設定
在您的 Docker 管理介面新增專案：

1.  **Repository**: 輸入您的 Git Repo URL。
2.  **Project Name**: `booking-system` (或自訂)。
3.  **Compose Path**: `docker-compose.prod.yml` (⚠️ 重要: 請勿使用預設值)。
4.  **Environment Variables**:
    *   `DATABASE_URL`: `postgresql://postgres:postgres@db:5432/e111_booking` (容器內部連線字串)。
    *   `POSTGRES_PASSWORD`: 設定您的 DB 密碼 (與 compose 內的 `POSTGRES_PASSWORD` 一致)。
    *   `NUXT_HOST`: `0.0.0.0`
    *   `NUXT_PORT`: `3000`

### 步驟 3: 啟動
點擊部署/啟動按鈕。系統將自動：
1.  建立 Node.js 應用映像檔 (Builder Stage -> Production Stage)。
2.  啟動 PostgreSQL 資料庫。
3.  執行 Prisma Client 生成。
4.  啟動 Nuxt 伺服器 (Port 9088 -> 3000)。

### 部署後檢查
訪問 `https://book.gowork.run/` 或您設定的網域。
預設後台帳號: `admin` / `admin123`
