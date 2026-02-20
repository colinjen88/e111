# 502 Bad Gateway 與 站點內容覆蓋衝突修復紀錄 (2026-02-21)

## 📌 問題一：502 Bad Gateway (Prisma 引擎崩潰)

### 現象
網站 `book.gowork.run` 無法訪問，Docker 容器日誌顯示 `stream did not contain valid UTF-8`。

### 根因
- **CRLF 換行字元衝突**：在 Windows 開發環境下產生的 `.prisma` 檔案帶有 `\r\n`。當部署到 Linux 容器後，Prisma 引擎解析 `.prisma` 格式時無法處理 `\r`，導致容器啟動即崩潰 (Crash Loop)。

### 修復
- 在 `Dockerfile` 中加入 `sed` 指令，強制在 Build-time 將 `prisma/` 目錄下的所有檔案轉換為 Linux 格式 (`\n`)。
- 更新部暑腳本，在遠端執行時自動對全專案進行格式轉換。

---

## 📌 問題二：站點內容互相覆蓋 (Isolation Conflict)

### 現象
部署新站點 `royal.gowork.run` (大內御指) 後，舊站點 `book.gowork.run` 的內容被蓋掉，或兩站顯示相同的資料與排版。

### 根因
雖然兩個專案位於不同目錄 (`/var/www/booking` 與 `/var/www/royal-booking`)，但在 `docker-compose.prod.yml` 中定義了相同的**虛擬識別符**：
1. **相同的 Docker Volume 名稱**：都使用了 `e111_data`。Docker 會把兩個不同的資料庫容器掛載到同一個實體路徑，導致資料互相覆蓋。
2. **相同的 Docker Network 名稱**：都使用了 `e111-net`。
3. **Nginx 配置殘留**：`/etc/nginx/sites-enabled/` 中存在重複的 `server_name` 指向舊的 Port (3001)，與 `/etc/nginx/conf.d/` 中的新設定產生衝突。

### 修復方案 (徹底隔離)
為了確保多站點並存，我們實施了「全隔離」部署方案：

1. **資源名稱唯一化**：
   - **Booking 站點**：使用 Volume `e111_data` / Network `booking_e111-net` / Port `3001`。
   - **Royal 站點**：使用 Volume `royal_data` / Network `royal-net` / Port `3002`。
2. **Nginx 配置清理**：
   - 刪除 `/etc/nginx/sites-enabled/` 下所有與 `royal.gowork.run` 相關的連結。
   - 統一使用 `/etc/nginx/conf.d/royal.gowork.run.conf`，並精確指向 `localhost:3002`。
3. **部署路徑規範**：
   - 舊站點保留在 `/var/www/booking`。
   - 新站點獨立存放在 `/var/www/royal-booking/royal-booking`。

---

## 🛠️ 維護指南：如何安全部署新站點？

1. **Port 分配**：每增加一個 Nginx 站點，必須分配一個唯一的外部 Port (如 3003, 3004)。
2. **Compose 隔離**：每個新專案的 `docker-compose.prod.yml` 必須改名其 `volumes` 與 `networks`（例如加前綴），避免 Docker 誤認。
3. **格式清理**：若從 Windows 上傳，請務必執行 `sed -i 's/\r$//'` 處理 `.env` 與 `.prisma` 檔案。

目前狀態：**兩站已完全分離，運作穩定。**
- `book.gowork.run` -> Port 3001 (國醫版)
- `royal.gowork.run` -> Port 3002 (大內御指)
