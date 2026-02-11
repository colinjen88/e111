# e111 Booking System 部署故障排除記錄 (jen_fix_know.md)

本文件詳盡記錄了在 Hostinger VPS 部署預約系統時遇到的技術問題及其解決方案，供日後參考。

---

## 1. Prisma 7.x 驗證錯誤 (P1012)
### **問題描述**
在 Docker 啟動過程中，Prisma CLI 報錯 `Error code: P1012`。錯誤訊息指出 `The datasource property url is no longer supported in schema files`。
### **原因分析**
Prisma 7.0 以上版本對 `schema.prisma` 的 `url` 屬性有更嚴格的限制，且容器環境預設下載了最新版 Prisma，與專案原本使用的 v5 版本不相容。
### **解決方案**
1.  **鎖定版本**：在 `package.json` 中將 `prisma` 和 `@prisma/client` 強制鎖定為 `5.22.0`。
2.  **修正 Schema**：將 `url` 改為 `env("DATABASE_URL")`。
3.  **明確啟動路徑**：在 Dockerfile 的啟動命令中，使用 `./node_modules/.bin/prisma` 確保執行的是專案內的舊版本，而非全域最新版。

---

## 2. Docker Compose 'ContainerConfig' 錯誤
### **問題描述**
執行 `docker-compose up` 時出現 `KeyError: 'ContainerConfig'` 並伴隨 Python Traceback。
### **原因分析**
伺服器安裝的是舊版 `docker-compose` (v1.29.2)，它是用 Python 寫的，在處理現代 Docker 映像檔的元數據時會發生崩潰。
### **解決方案**
**切換指令**：放棄使用 `docker-compose`（有橫線），改用 Docker 內建的新版 `docker compose`（無橫線，Go 語言實現）。

---

## 3. npm ci 版本同步錯誤 (EUSAGE)
### **問題描述**
Dockerfile 建置時報錯 `npm ci can only install packages when your package.json and package-lock.json are in sync`。
### **原因分析**
手動修改了 `package.json` 中的 Prisma 版本，但沒有更新 `package-lock.json`，導致 `npm ci` 因為安全性檢查而拒絕安裝。
### **解決方案**
**更改指令**：在 Dockerfile 中將 `npm ci` 改為 `npm install`。這會讓 npm 在建置階段自動解決版本差異並重新生成依賴樹。

---

## 4. 瀏覽器不安全連接埠 (ERR_UNSAFE_PORT)
### **問題描述**
使用 `http://IP:4045` 訪問時，Chrome 顯示 `ERR_UNSAFE_PORT`。
### **原因分析**
瀏覽器為了安全考量，會封鎖某些特定連接埠（如 4045, 6666 等），防止跨站點攻擊。
### **解決方案**
1.  **內部轉向**：將容器內部的 External Port 改為 **3001**。
2.  **反向代理**：透過 Nginx 監聽 **Port 80**，再轉發流量到 3001。

---

## 5. Nginx 502 Bad Gateway
### **問題描述**
訪問網域時出現 Cloudflare 的 502 錯誤。
### **原因分析**
Nginx 設定檔找不到執行中的應用程式容器，或是 Nginx 指向了錯誤的 Port。
### **解決方案**
建立 `/etc/nginx/conf.d/booking.conf` 並設定：
```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```
然後執行 `nginx -s reload`。

---

## 6. Dockerfile 啟動腳本異常 (Exit Code 128)
### **問題描述**
容器啟動後立即退出，錯誤碼為 128。
### **原因分析**
在 Dockerfile 中使用 `echo` 建立啟動腳本時，語法不夠嚴密導致腳本檔案損壞。
### **解決方案**
簡化 Dockerfile 的 `CMD`，直接使用 `sh -c` 串接命令，並在執行 `migrate` 之後加入 `|| true` 確保即使遷移有警告也能正常啟動主程式。

---

## 💡 總結：最佳佈署流程
1. `git pull` 更新程式。
2. `docker compose -f docker-compose.prod.yml up -d --build` 更新映像檔。
3. 檢查日誌：`docker logs -f e111-booking-app-1`。
4. 訪問：`http://book.gowork.run/admin`。
