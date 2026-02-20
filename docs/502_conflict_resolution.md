# 502 Bad Gateway 錯誤與修復紀錄 (2026-02-21)

## 📌 問題現象
網站 `book.gowork.run` 與 `royal.gowork.run` 發生 `502 Bad Gateway` 錯誤，無法訪問。

## 🔍 錯誤根因分析

這次的 502 崩潰是由**多重交互原因**引起的：

### 1. 跨平台換行字元 (CRLF) 導致 Prisma 崩潰 (最核心原因)
專案的原始碼在 Windows 環境下開發，部分檔案（特別是 `.prisma` 和 `.sh`）的換行符號為 `\r\n` (CRLF)。
當透過部署腳本打包並上傳至 Linux VPS 後，Docker 內的 PostgreSQL 啟動過程中，Prisma 引擎讀取 `schema.prisma` 時遇到了 `\r` 字元，拋出以下錯誤：
```text
Error reading datamodel file `/app/prisma/schema.prisma`: stream did not contain valid UTF-8
```
這導致 `booking-app-1` 容器啟動失敗並陷入**無限重啟迴圈 (crash loop)**，Nginx 因此找不到可用的 3001 Port 服務，回傳 502。

### 2. PowerShell 部署腳本的跨平台問題
在 `full_deploy_fix.ps1` 腳本中，定義給 Linux 執行的 `$remoteScript` 是多行字串，在 Windows 執行時自帶了 `\r` 換行，導致在 VPS 的 bash 環境下執行時出現語法錯誤 (`\r: command not found`)，使得部署流程沒有完全走完。

### 3. Nginx 設定衝突
在試圖部署第二個專案 (`royal.gowork.run`) 時，VPS 中的 `/etc/nginx/conf.d/royal.gowork.run.conf` 設定檔將流量代理到了一個錯誤的、沒有服務監聽的 Port `3970`，導致該網站也回傳 502 錯誤。

---

## 🛠️ 修復方案與實施步驟

為了確保此問題不再發生，並讓兩個站點都正常運作，實施了以下修復：

### 1. 於 CI/CD 與部署腳本層級自動濾除 `\r`
- **修改 `Dockerfile`**：
  在複製 `prisma` 資料夾後，新增指令過濾所有的 `\r`，防止 Docker 執行期間崩潰。
  ```dockerfile
  RUN find /app/prisma -type f -exec sed -i 's/\r$//' {} +
  ```
- **修改 `scripts/full_deploy_fix.ps1`**：
  1. 將 PowerShell 遠端腳本變數先過濾：`$remoteScript = $remoteScript.Replace("\r", "")`
  2. 在 VPS 解壓縮後啟動 Docker 前，加入全局過濾指令：
     ```bash
     find . -type f -name '*.prisma' -exec sed -i 's/\r$//' {} +
     find . -type f -name '*.sh' -exec sed -i 's/\r$//' {} +
     ```

### 2. 解決 Port 與目錄重疊衝突
- 將 `full_deploy_fix.ps1` 中的 `docker-compose.prod.yml` mapping 強制修正回預定正確的 `3001:3000`。
- 新的專案若要部署，已更新 `deploy_remote.sh` 將目標變更為獨立的 `/var/www/royal-booking` 目錄以及 Port `3002`。

### 3. Nginx 組態修正
- 清理掉無效的 `/etc/nginx/sites-available` 配置，並修正 `conf.d` 中的衝突檔，將 `royal.gowork.run` 正確代理回 Port `3001`。

## 💡 未來預防

若後續再發生 502 錯誤，首要檢查步驟應為：
1. 進入 VPS 觀察伺服器運作狀態：`docker ps -a` (檢查是否容器一直 Restarting)。
2. 查看 Crash 容器的 Log：`docker logs [container_name] --tail=50`。
3. 若錯誤與 UTF-8、腳本失效或無法解析的字元有關，九成以上是因為 Windows `CRLF` 被上傳到 Linux 所致。
