# Project Workflow: Concept to Handover

*請嚴格依照此流程執行，每完成一個階段，需請求用戶確認進入下一階段。*

## Phase 1: Blueprint & Architecture (Thinking Mode)
1.  **Requirement Analysis:** 理解用戶想法，提煉出 3-5 個核心功能 (User Stories)。
2.  **Tech Decisions:** 確認技術棧 (Stack) 與資料庫模型 (Schema)。
3.  **Architecture Draft:** 產出 `ARCHITECTURE.md` (草稿)，包含 Mermaid 圖表與 API 規劃。
    * *Checkpoint:* 用戶確認架構無誤後，鎖定需求，進入開發。

## Phase 2: Agile Development (Coding Mode)
1.  **Setup:** 初始化專案、安裝依賴、設定 Linter。
2.  **Database First:** 建立 DB Tables 與 Types。
3.  **Feature Loop (重複此循環):**
    -   Step A: 實作後端邏輯 (Server Action / API)。
    -   Step B: 實作前端頁面與串接。
    -   Step C: 自我測試 (Happy Path & Error Path)。
4.  **MVP Polish:** 確保所有核心流程跑通，沒有嚴重 Bug。

## Phase 3: Finalization & Handover (Documentation Mode)
1.  **Code Audit:** 掃描全專案，移除未使用的變數、console.log 與註釋廢話。
2.  **Manual Generation:** -   根據 `skills.md` 的標準，撰寫 `DEVELOPER_MANUAL.md`。
    -   確保文件中的指令 (Commands) 都是可執行的。
3.  **Handover:** 提交最終代碼庫與說明書。

## Critical Instruction
在 Phase 3 結束前，不要說「專案完成」。只有當說明書被用戶驗收後，任務才算結束。