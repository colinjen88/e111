
# 🔗 Integration Guide: Notification Services

## 1. LINE Notify (Mock Implementation -> Real API)

To switch from the console-logging mock to real LINE notifications:

### Step 1: Get Access Token
1.  Go to **[LINE Notify](https://notify-bot.line.me/en/)**.
2.  Login with your LINE account.
3.  Click **My Page** > **Generate Token**.
4.  Enter Token Name (e.g. `Booking Bot`).
5.  Select the **Group** or **1-on-1 Chat** where notifications will be sent.
6.  Click **Generate** and **Copy the Access Token**.
    (⚠️ Token is shown only once!)

### Step 2: Configure Environment
Add the token to your `.env` file:
```bash
LINE_NOTIFY_TOKEN=Your_Access_Token_Here
```

### Step 3: Implement Real Sending Logic (`server/utils/notify.ts`)

Replace the mock `console.log` with this snippet:

```typescript
export const sendLineNotify = async (message: string) => {
  const token = process.env.LINE_NOTIFY_TOKEN
  if (!token) return

  try {
    const response = await $fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ message })
    })
    console.log('LINE Notify Sent:', response)
  } catch (error) {
    console.error('LINE Notify Failed:', error)
  }
}
```

## 2. Email Notifications (SendGrid)

### Step 1: Get API Key
1.  Sign up at **[SendGrid](https://sendgrid.com/)**.
2.  Go to **Settings** > **API Keys**.
3.  Create API Key with **Full Access** (or restricted to Mail Send).
4.  Copy the API Key.

### Step 2: Configure Environment
Add to `.env`:
```bash
SENDGRID_API_KEY=Your_SendGrid_API_Key
```

### Step 3: Implement Sending Logic (`server/utils/notify.ts`)

Install `@sendgrid/mail` package first:
```bash
npm install @sendgrid/mail
```

Update `server/utils/notify.ts`:

```typescript
import sgMail from '@sendgrid/mail'

export const sendEmail = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) return

  sgMail.setApiKey(apiKey)

  const msg = {
    to,
    from: 'no-reply@yourdomain.com', // Must be verified sender
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

## 3. Testing Integration
Use the **Admin Panel > Settings** page (`/admin/settings`) to input tokens temporarily and click "Test Notification" once implemented.
