# e111 — 御手國醫專案

御手國醫養生會館的數位化專案，包含品牌官網、線上預約系統，以及完整的開發歷程紀錄。

## 📁 資料夾結構

```
e111/
├── main-site/          ← 品牌主官網 (御手寶典)
│   ├── index.html
│   ├── style.css
│   └── assets/
│
├── e111-booking/       ← 預約系統 (Nuxt 3 全端)
│   ├── app/            ← 前端 (Vue 3 + Tailwind)
│   ├── server/         ← 後端 (Nitro + Prisma)
│   └── prisma/         ← 資料庫 Schema
│
├── showcase/           ← 專案導覽頁 (一頁式)
│   └── index.html
│
├── tree.html           ← 開發歷程樹
│
├── docs/               ← 技術文件
│   ├── booking.md
│   ├── dev_log.md
│   ├── DEPLOYMENT.md
│   ├── FUTURE_FEATURES.md
│   ├── INTEGRATION_GUIDE.md
│   └── jen_fix_know.md
│
├── scripts/            ← 部署腳本
│   ├── deploy.sh
│   ├── deploy_vps.ps1
│   └── auto_deploy.ps1
│
└── archive/            ← 歸檔 (舊版檔案)
    ├── contact.html
    └── e111/
```

## 🚀 Quick Start

### 主官網
直接用瀏覽器開啟 `main-site/index.html`。

### 預約系統
```bash
cd e111-booking
npm install
npm run dev
```

### 專案導覽
用瀏覽器開啟 `showcase/index.html`，可快速跳轉到各個子專案。

## 🛠 Tech Stack

| 模組 | 技術 |
|------|------|
| 主官網 | HTML, CSS, Canvas Particles |
| 預約前台 | Nuxt 3, Vue 3, Tailwind CSS |
| 預約後端 | Nitro, Prisma, PostgreSQL |
| DevOps | Docker, Vitest, GitHub Actions |
| 通知 | LINE Messaging API, Email |

## 📄 License

Design by WANG. &copy; 2026 御手國醫養生會館.
