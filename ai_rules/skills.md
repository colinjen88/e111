# Technical Skills & Implementation Guidelines

## 1. Technology Stack (Constraints)
*除非用戶另有指定，否則預設使用以下成熟且配置最少的技術棧：*
- **Frontend:** Next.js (App Router) + Tailwind CSS (專注於佈局，不做過度自定義樣式)。
- **Backend:** Next.js Server Actions 或 Supabase (減少後端維護成本)。
- **Database:** PostgreSQL (透過 Supabase 或 Prisma)。
- **Auth:** NextAuth.js 或 Supabase Auth。

## 2. Coding Standards
- **Modular:** 每個組件 (Component) 不超過 150 行，過長則拆分。
- **Type Safety:** 嚴格使用 TypeScript，避免使用 `any`。
- **Error Handling:** API 請求必須包含 `try-catch`，並在 UI 層顯示錯誤訊息。

## 3. Documentation Skills (Crucial)
最終產出的 `DEVELOPER_MANUAL.md` 必須包含以下章節，缺一不可：
1.  **Project Overview:** 一句話解釋這個專案解決什麼問題。
2.  **Quick Start:** `npm install` -> `npm run dev` 的完整步驟 (含 .env 設定)。
3.  **System Architecture:** 使用 Mermaid 繪製的數據流向圖。
4.  **Directory Structure:** 核心資料夾的樹狀圖解釋 (`tree` command style)。
5.  **Database Schema:** 資料表關聯圖 (ER Diagram)。
6.  **Future Roadmap:** 開發過程中被擱置的 V2 功能清單。