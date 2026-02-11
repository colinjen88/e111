# Code Review Report  e111-booking (Nuxt 3 + Prisma)

> **版本**: v2.0 (優化版)  
> **範圍**: e111-booking/（前台預約、訂單查詢/取消、管理後台、Server API、Prisma、Docker/部署）  
> **審查方式**: 靜態走讀 + 組態分析  
> **重點**: 架構可維護性、資料一致性、安全性、效能、可觀測性、部署配置

---

## 1. 執行摘要 (Executive Summary)

###  立即處理（上線前必須修復）
1. **後台 API 無驗證保護** - 任何人可讀取客戶電話與營收資料
2. **nginx.conf 配置錯誤** - 循環代理導致服務無法正常運作
3. **預約競態條件** - 可能產生 double-booking
4. **cookie 安全性設定錯誤** - httpOnly: false + 固定 token

###  短期處理（1-2週內）
- PrismaClient 單例化 / N+1 查詢優化
- Rate limiting 實作
- 時區處理統一

###  中期規劃（1-2月內）
- 完整測試覆蓋
- CI/CD 流程建立
- 技術文件補全

---

## 2. 專案總覽

### 2.1 技術棧

| 層級 | 技術 | 版本 | 備註 |
|------|------|------|------|
| **前端框架** | Nuxt | ^4.3.1 | 實際為 Nuxt 3 相容模式 |
| **UI 框架** | Vue | ^3.5.28 | Composition API |
| **樣式** | Tailwind CSS | 3.4.17 | 自定義 brand colors |
| **後端** | Nitro (Nuxt Server) | - | Server API Routes |
| **ORM** | Prisma | 5.22.0 | PostgreSQL 為主 |
| **資料庫** | PostgreSQL | 15-alpine | Docker 部署 |
| **部署** | Docker + Docker Compose | - | 多階段建置 |

### 2.2 已發現的組態不一致

| 項目 | 文件說明 | 實際配置 | 風險 |
|------|----------|----------|------|
| **資料庫** | DEVELOPMENT_PLAN.md 說明使用 SQLite | docker-compose.prod.yml 使用 PostgreSQL | 文件過期誤導開發 |
| **Port** | DEPLOYMENT.md 說明使用 Port 80 | docker-compose.prod.yml 使用 3001:3000 | 文件與實際不符 |
| **Admin 密碼** | README.md 說明預設 dmin/admin123 | 硬編碼在 server/api/admin/auth.post.ts | 安全風險 |

---

## 3. 重大風險詳細分析

###  3.1 後台驗證/授權機制極度薄弱

**嚴重性**: CRITICAL  
**影響範圍**: 客戶個資外洩、營收資料外洩  
**檔案位置**: server/api/admin/auth.post.ts, server/api/admin/bookings.get.ts, server/api/admin/stats.get.ts

#### 問題描述

1. **固定 Token**: uth_token=admin-session-token（任何知道這字串的人都能登入）
2. **Cookie 不安全**: httpOnly: false 允許 JavaScript 讀取
3. **API 無驗證**: dmin/stats.get.ts 幾乎無 server-side auth check

#### 攻擊示範

`ash
# 無需登入，直接取得所有客戶電話與預約資料
curl http://your-domain/api/admin/bookings
# 無需登入，直接取得營收統計
curl http://your-domain/api/admin/stats
`

#### 修正建議

**建立統一驗證工具** server/utils/auth.ts:

`	ypescript
import { getCookie, createError } from 'h3'
const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN

export function requireAdmin(event: any) {
  const token = getCookie(event, 'admin_session')
  if (!token || token !== ADMIN_TOKEN) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
`

**修改登入 API** - 使用隨機 token + 安全 cookie:

`	ypescript
const token = crypto.randomUUID()
setCookie(event, 'admin_session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 8  // 8 小時
})
`

---

###  3.2 nginx.conf 配置錯誤（循環代理）

**嚴重性**: CRITICAL  
**檔案位置**: 
ginx.conf:6  
**問題**: proxy_pass http://localhost:80 指向自己，造成無限循環

`
ginx
# 錯誤配置
proxy_pass http://localhost:80;  #  循環！
`

#### 修正建議

`
ginx
proxy_pass http://localhost:3000;  #  指向 Nuxt app port
`

---

###  3.3 預約建立存在競態條件（Race Condition）

**嚴重性**: HIGH  
**檔案位置**: server/api/bookings/index.post.ts:38-93  
**問題**: 先查詢再建立，無 DB 層鎖保護

**攻擊情境**: 兩個使用者同時預約同一位技師的最後一個時段，可能都成功。

#### 修正建議

**PostgreSQL Exclusion Constraint（推薦）**:

`sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE Booking ADD CONSTRAINT no_double_booking 
EXCLUDE USING gist (
  staffId WITH =, 
  tstzrange(startTime, endTime) WITH &&
)
WHERE (status NOT IN ('Cancelled', 'NoShow'));
`

---

## 4. 修正路線圖

###  第 1 階段：上線前必須（1-3 天）

- [x] **nginx.conf** 修正 proxy_pass port
- [x] **Admin API** 全面加上 requireAdmin() 驗證
- [x] **Cookie** 改為 httpOnly: true, secure: true
- [x] **環境變數** 移出硬編碼密碼，建立 .env.example

###  第 2 階段：結構改善（1-2 週）

- [x] PrismaClient 單例化
- [x] Rate limit 實作
- [x] 時區處理統一
- [x] N+1 查詢優化
- [x] Input validation（Zod）

###  第 3 階段：可靠性（1-2 月）

- [x] Race condition 解決（DB constraint or Transaction Isolation）
- [x] 完整測試覆蓋 (Vitest Unit Tests: Schemas)
- [x] CI/CD 流程 (GitHub Actions Build Check)
- [x] 日誌與監控 (Structured JSON Logging)

---

## 5. 附錄：快速修復 Checklist

| 檢查項目 | 狀態 | 備註 |
|----------|------|------|
| Admin API 需登入才能存取 | V | curl /api/admin/bookings 應回 401 |
| Cookie 為 HttpOnly | V | DevTools Application > Cookies |
| nginx proxy_pass 正確 | V | curl localhost 應正常回應 |
| .env.example 存在 | V | 無敏感資訊 |

---

> **備註**: 本報告基於 2026-02-11 原始碼靜態分析。實際部署前建議進行滲透測試與負載測試。

