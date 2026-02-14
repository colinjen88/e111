# 📚 E111 快速開始指南

> **目標**: 5 分鐘內讓新開發者快速上手 E111 專案  
> **適用對象**: 新加入開發團隊成員、維運人員

---

## ⚡ 5 分鐘快速上手

### Step 1: 環境準備 (1 分鐘)

```bash
# 確認 Node.js 版本 (需要 18+)
node --version

# 確認 npm 版本
npm --version

# 複製專案 (如果還沒有)
git clone https://github.com/your-repo/e111.git
cd e111/e111-booking
```

### Step 2: 安裝依賴 (1 分鐘)

```bash
# 安裝所有依賴
npm install

# 如果遇到權限問題
sudo npm install
```

### Step 3: 環境設定 (1 分鐘)

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯環境變數 (重要!)
nano .env
```

**必要環境變數**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/e111_booking"
ADMIN_PASSWORD="your-secure-password"
NUXT_HOST="0.0.0.0"
NUXT_PORT="3000"
```

### Step 4: 資料庫初始化 (1 分鐘)

```bash
# 生成 Prisma Client
npx prisma generate

# 執行資料庫遷移
npx prisma migrate dev

# 填入初始資料
npx prisma db seed
```

### Step 5: 啟動開發 (1 分鐘)

```bash
# 啟動開發伺服器
npm run dev

# 開啟瀏覽器訪問
# 前端: http://localhost:3000
# 後台: http://localhost:3000/admin
# API 文檔: http://localhost:3000/api
```

---

## 🎯 常用開發指令

### 開發相關
```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置生產版本
npm run preview      # 預覽建置結果
```

### 資料庫相關
```bash
npx prisma studio   # 開啟資料庫 GUI
npx prisma generate  # 重新生成 Client
npx prisma db push   # 推送 Schema 變更
```

### 測試相關
```bash
npm run test        # 執行測試
npm run lint        # ESLint 檢查
npm run type-check  # TypeScript 檢查
```

---

## 🗂️ 重要檔案位置

### 核心配置
| 檔案 | 用途 | 重要程度 |
|------|------|----------|
| `nuxt.config.ts` | Nuxt 配置 | ⭐⭐⭐ |
| `prisma/schema.prisma` | 資料庫模型 | ⭐⭐⭐ |
| `.env` | 環境變數 | ⭐⭐⭐ |
| `tailwind.config.ts` | 樣式配置 | ⭐⭐ |

### 主要程式碼
| 資料夾 | 用途 | 重要程度 |
|------|------|----------|
| `app/pages/` | 前端頁面 | ⭐⭐⭐ |
| `server/api/` | 後端 API | ⭐⭐⭐ |
| `app/components/` | Vue 組件 | ⭐⭐ |
| `server/utils/` | 工具函數 | ⭐⭐ |

### 文檔資源
| 檔案 | 用途 | 重要程度 |
|------|------|----------|
| `docs/dev_log.md` | 完整開發歷程 | ⭐⭐⭐ |
| `docs/INDEX.md` | 文檔索引 | ⭐⭐ |
| `AI_SYSTEM_MANUAL.md` | AI 開發指南 | ⭐⭐ |
| `codereview.md` | Code Review 報告 | ⭐⭐ |

---

## 🚨 常見問題解決

### Q: 資料庫連線失敗？
```bash
# 檢查 PostgreSQL 是否運行
docker ps | grep postgres

# 檢查 .env 中的 DATABASE_URL
echo $DATABASE_URL
```

### Q: 前端頁面空白？
```bash
# 檢查 Nuxt 伺服器狀態
curl http://localhost:3000

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

### Q: API 404 錯誤？
```bash
# 檢查 server/ 資料夾結構
ls -la server/api/

# 檢查 Nuxt 路由
curl http://localhost:3000/api/branches
```

### Q: Prisma 遷移失敗？
```bash
# 重置資料庫 (注意會清空資料)
npx prisma migrate reset

# 強制推送 Schema
npx prisma db push --force-reset
```

---

## 🎨 開發工作流程

### 1. 功能開發流程
```mermaid
graph LR
    A[建立功能分支] --> B[後端 API 開發]
    B --> C[前端頁面開發]
    C --> D[本地測試]
    D --> E[提交 PR]
    E --> F[Code Review]
    F --> G[部署]
```

### 2. 推薦工具
- **IDE**: VS Code + Vue 3 擴充
- **API 測試**: Postman 或 Insomnia
- **資料庫**: Prisma Studio 或 DBeaver
- **版本控制**: Git + GitHub Desktop

### 3. 程式碼規範
- **TypeScript**: 嚴格模式，避免 `any`
- **Vue 3**: Composition API，`<script setup>`
- **Tailwind**: 使用 utility classes，避免自定義 CSS
- **Prisma**: 型別安全，使用 `select` 優化查詢

---

## 📞 需要協助？

### 📚 查看更多資源
- **完整文檔**: [docs/INDEX.md](docs/INDEX.md)
- **開發歷程**: [docs/dev_log.md](docs/dev_log.md)
- **AI 指南**: [../AI_SYSTEM_MANUAL.md](../AI_SYSTEM_MANUAL.md)

### 👥 聯繫方式
- **技術問題**: 查看 [docs/jen_fix_know.md](docs/jen_fix_know.md)
- **功能需求**: 參考 [docs/FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md)
- **部署問題**: 查看 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🏁 成功標誌

當你完成以上步驟並看到以下畫面時，代表環境設定成功：

✅ **首頁正常顯示** - http://localhost:3000  
✅ **預約頁面可用** - http://localhost:3000/booking  
✅ **後台可以登入** - http://localhost:3000/admin  
✅ **資料庫連線成功** - Prisma Studio 可正常運作  

**歡迎加入 E111 開發團隊！🎉**

---

> **最後更新**: 2026-02-14  
> **維護者**: Lead Architect & MVP Guardian AI Agent
