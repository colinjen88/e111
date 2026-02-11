
# 鏈接整合指南：通知服務

## 1. LINE Messaging API (替代 LINE Notify)

> ⚠️ **更新**: LINE Notify 服務已於 2025 年 3 月 31 日終止。我們現在使用 **LINE Messaging API** 進行通知。

要發送通知，您需要設置一個 **LINE 官方帳號 (Official Account)** 並使用 **Push Message API**。

### 步驟 1: 創建 Provider 和 Channel
1.  登錄 **[LINE Developers Console](https://developers.line.biz/)**。
2.  創建一個新的 **Provider** (如果還沒有)。
3.  創建一個新的 **Messaging API** channel。
4.  填寫所需信息 (Channel 名稱、描述等)。

### 步驟 2: 獲取 Channel Access Token
1.  在 Channel 設置中，轉到 **Messaging API** 標籤頁。
2.  向下滾動到 **Channel access token (long-lived)**。
3.  點擊 **Issue** 生成您的 token。
4.  複製此 token。

### 步驟 3: 獲取您的 User ID (目標 ID)
要發送消息給自己 (管理員)，您需要您的 **User ID**。
1.  轉到 Channel 的 **Basic Settings** 標籤頁。
2.  向下滾動到 **Your User ID** (通常以 `U...` 開頭)。
3.  複製此 ID。
    *   *注意: 要發送給群組，您需要將機器人添加到群組並通過 webhook 獲取 `groupId`，這比較高級。對於簡單的管理員通知，您的 User ID 就足夠了。*

### 步驟 4: 配置環境變量
將這些變量添加到您的 `.env` 文件中：
```bash
LINE_CHANNEL_ACCESS_TOKEN=您的_Long_Token_在此
LINE_ADMIN_USER_ID=您的_User_ID_在此
```

### 步驟 5: 實現真實發送邏輯 (`server/utils/notify.ts`)

更新 `server/utils/notify.ts` 以使用 Push API：

```typescript
export const sendLinePushMessage = async (message: string) => {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_ADMIN_USER_ID
  
  if (!token || !userId) return

  try {
    const response = await $fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        to: userId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      }
    })
    console.log('LINE Push Sent:', response)
  } catch (error) {
    console.error('LINE Push Failed:', error)
  }
}
```

## 2. 電郵通知 (SendGrid)

### 步驟 1: 獲取 API Key
1.  註冊 **[SendGrid](https://sendgrid.com/)**。
2.  轉到 **Settings** > **API Keys**。
3.  創建具有 **Full Access** (或僅限 Mail Send) 的 API Key。
4.  複製 API Key。

### 步驟 2: 配置環境變量
添加到 `.env`：
```bash
SENDGRID_API_KEY=您的_SendGrid_API_Key
```

### 步驟 3: 實現發送邏輯 (`server/utils/notify.ts`)

首先安裝 `@sendgrid/mail` 包：
```bash
npm install @sendgrid/mail
```

更新 `server/utils/notify.ts`：

```typescript
import sgMail from '@sendgrid/mail'

export const sendEmail = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) return

  sgMail.setApiKey(apiKey)

  const msg = {
    to,
    from: 'no-reply@yourdomain.com', // 必須是已驗證的發件人
    subject,
    text,
    html: text.replace(/\n/g, '<br>')
  }

  try {
    await sgMail.send(msg)
    console.log('Email Sent to:', to)
  } catch (error) {
    console.error('Email Failed:', error)
  }
}
```
