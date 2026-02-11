# Docker 部署指南

## 方式一：使用 Docker Manager（推薦）

### 步驟 1: 在 Docker Manager 中新增專案

1. 登入您的 Docker 管理介面
2. 點擊右上角的「**構建**」或「**新增專案**」按鈕
3. 填寫以下資訊：

**基本設定：**
- **專案名稱**: `booking-system`
- **Repository URL**: `https://github.com/colinjen88/e111.git`
- **Branch**: `master`
- **Compose 檔案路徑**: `e111-booking/docker-compose.prod.yml`

**環境變數（可選，已在 compose 中設定）：**
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/e111_booking
NUXT_HOST=0.0.0.0
NUXT_PORT=3000
```

### 步驟 2: 啟動部署

點擊「啟動」或「部署」按鈕。系統會自動：
1. 從 GitHub 拉取程式碼
2. 建立 Docker 映像檔（約 3-5 分鐘）
3. 啟動 PostgreSQL 資料庫
4. 執行資料庫遷移
5. 啟動 Nuxt 應用程式

### 步驟 3: 驗證部署

訪問 `http://book.gowork.run/` 確認網站正常運作。

**預設管理員帳號：**
- 帳號：`admin`
- 密碼：`admin123`

---

## 方式二：手動 SSH 部署（備用）

如果 Docker Manager 無法使用，可以手動部署：

```bash
# 1. SSH 登入伺服器
ssh root@72.62.66.151 -p 4740

# 2. 安裝 Git（如果尚未安裝）
apt-get update && apt-get install -y git

# 3. 克隆專案
cd /var/www
git clone https://github.com/colinjen88/e111.git
cd e111/e111-booking

# 4. 啟動服務
docker-compose -f docker-compose.prod.yml up -d --build

# 5. 查看日誌
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 常見問題

### Q: 網站顯示 502 Bad Gateway
A: 等待 1-2 分鐘讓應用程式完全啟動，或檢查容器日誌。

### Q: 如何查看日誌？
A: 在 Docker Manager 中點擊專案 → 查看日誌，或使用：
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

### Q: 如何重新部署？
A: 在 Docker Manager 中點擊「重建」，或執行：
```bash
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

### Q: 資料庫資料會遺失嗎？
A: 不會，資料儲存在 Docker Volume `e111_data` 中，即使重建容器也會保留。

---

## 技術架構

- **前端**: Nuxt 3 (SSR)
- **後端**: Nuxt Server API
- **資料庫**: PostgreSQL 15
- **ORM**: Prisma
- **容器化**: Docker + Docker Compose
- **Port**: 80 (HTTP)

---

## 聯絡資訊

如有問題，請聯絡：colinjen88@gmail.com
