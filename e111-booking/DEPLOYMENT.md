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

**環境變數（可選，已在 compose 中設定，建議在 Docker Manager 或 .env 中設定）：**
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/e111_booking
NUXT_HOST=0.0.0.0
NUXT_PORT=3000
# v2.0 新增安全性變數
ADMIN_PASSWORD=your_secure_password
ADMIN_SECRET_TOKEN=your_random_secret_string
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
ssh root@***REDACTED_IP*** -p 4740

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

### Q: 網站顯示 403 Forbidden
A: 這通常表示 Port 衝突或容器未正常啟動。請執行以下步驟：

**步驟 1: 檢查容器狀態**
```bash
cd /var/www/e111/e111-booking  # 或您的專案目錄
docker-compose -f docker-compose.prod.yml ps
```

**步驟 2: 查看容器日誌**
```bash
docker-compose -f docker-compose.prod.yml logs app
```

**步驟 3: 檢查 Port 80 是否被佔用**
```bash
netstat -tulpn | grep :80
# 或
ss -tulpn | grep :80
```

**步驟 4: 如果 Port 80 被其他服務佔用，修改 docker-compose.prod.yml**
將 `ports: - "80:3000"` 改為 `ports: - "8080:3000"`，然後訪問 `http://YOUR_IP:8080`

**步驟 5: 重新啟動容器**
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

**快速診斷腳本：**
```bash
# 下載並執行診斷腳本
curl -o diagnose.sh https://raw.githubusercontent.com/colinjen88/e111/master/e111-booking/diagnose.sh
chmod +x diagnose.sh
./diagnose.sh
```


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

## 4. VPS 部署疑難排解 (Troubleshooting)

### SSH 連線失敗 (`Could not resolve hostname \026`)
如果在 PowerShell 中看見亂碼錯誤，請直接手動輸入 IP：
```powershell
# 請確保在 e111-booking 目錄下執行
.\deploy_vps.ps1
# 當詢問 IP 時，輸入: 72.62.66.151
```

### 502 Bad Gateway / Database Connection Error
如果部署後網站顯示 502 錯誤，且 logs 顯示 `credentials for 'postgres' are not valid`：
這表示 VPS 上舊的 Database Volume 密碼與新設定不符。

**解決方案：執行資料庫重置腳本**
此腳本會刪除舊的資料庫 Volume 並重新建立，使用當前 `.env` 中的密碼。
```powershell
cd e111-booking
.\reset_vps.ps1
# 輸入 VPS IP: 72.62.66.151
```

### 手動檢查 VPS 狀態
```bash
# SSH 登入
ssh root@72.62.66.151

# 檢查容器狀態
cd /var/www/booking
docker-compose -f docker-compose.prod.yml ps

# 查看應用程式日誌
docker-compose -f docker-compose.prod.yml logs --tail 100 app
```

---

## 聯絡資訊

如有問題，請聯絡：colinjen88@gmail.com

