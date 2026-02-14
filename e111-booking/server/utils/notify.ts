/**
 * Unified Notification Service
 * 
 * LINE: Uses @line/bot-sdk when configured, otherwise logs mock messages.
 * Email: Mock implementation (Coming Soon — can integrate SendGrid/Resend later).
 */

import { isLineConfigured, pushLineMessage } from './line'
import { Resend } from 'resend'

let _resend: Resend | null = null

const getResend = () => {
  if (_resend) return _resend
  const config = useRuntimeConfig()
  if (!config.resendApiKey) return null
  _resend = new Resend(config.resendApiKey)
  return _resend
}

/**
 * Send a LINE Notify message (simpler alternative to Messaging API).
 * Requirements: Just a Notify Token.
 */
export const sendLineNotify = async (message: string): Promise<boolean> => {
  const config = useRuntimeConfig()
  const token = config.lineNotifyToken

  if (!token) {
    console.log('[Notify] LINE Notify token not set.')
    return false
  }

  try {
    const formData = new URLSearchParams()
    formData.append('message', message)

    await $fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    console.log('[Notify] LINE Notify sent successfully')
    return true
  } catch (error) {
    console.error('[Notify] LINE Notify failed:', error)
    return false
  }
}

/**
 * Unified notification trigger - attempts all configured channels.
 */
export const notifyBooking = async (booking: any) => {
  // Fetch System Settings (Dynamic)
  let settings = { emailEnabled: false }
  try {
      const res = await $fetch('/api/settings/config') as any
      if (res?.data) settings = res.data
  } catch (e) {
      console.warn('Failed to fetch system settings for notification', e)
  }

  const message = formatBookingMessage(booking)
  
  // 1. Try Messaging API (if configured)
  await sendLinePushMessage(message)
  
  // 2. Try LINE Notify (if configured)
  await sendLineNotify(message)

  // 3. Try Email (If Enabled in Settings & Customer has email)
  if (settings.emailEnabled && booking.customer?.email) {
    const subject = `【預約通知】您的預約已成立 - ${booking.id}`
    // Simple text for now, could use HTML template
    await sendEmail(booking.customer.email, subject, message.replace(/\n/g, '<br>'))
  }
}

/**
 * Send a LINE push notification to the admin.
 */
export const sendLinePushMessage = async (message: string): Promise<boolean> => {
  const config = useRuntimeConfig()
  const adminUserId = config.lineAdminUserId
  
  try {
    if (isLineConfigured() && adminUserId) {
      return await pushLineMessage(adminUserId, [{ type: 'text', text: message }])
    }
  } catch (e) {
    return false
  }

  return false
}

/**
 * Send an email notification using Resend.
 */
export const sendEmail = async (to: string, subject: string, htmlBody: string): Promise<boolean> => {
  const resend = getResend()
  const config = useRuntimeConfig()

  if (!resend) {
    console.log('[Notify] Email mock (No API Key) →', to, subject)
    return true
  }

  try {
    await resend.emails.send({
      from: config.emailFrom,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 10px;">預約成功通知</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            您的預約已被系統確認。以下是詳細資訊：
          </p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; line-height: 1.8;">
            ${htmlBody}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            此郵件為系統自動發出，請勿直接回覆。如有任何問題，請聯繫我們。
          </p>
        </div>
      `
    })
    console.log('[Notify] Email sent via Resend to:', to)
    return true
  } catch (error) {
    console.error('[Notify] Email sending failed:', error)
    return false
  }
}

/**
 * Format a booking into a human-readable notification message.
 */
export const formatBookingMessage = (booking: any): string => {
  const date = booking.bookingDate instanceof Date
    ? booking.bookingDate.toISOString().split('T')[0]
    : String(booking.bookingDate)

  const time = booking.startTime instanceof Date
    ? booking.startTime.toISOString().split('T')[1].substring(0, 5)
    : String(booking.startTime)

  return [
    '📋 [新預約通知]',
    `客戶: ${booking.customer?.name || '—'} (${booking.customer?.phone || '—'})`,
    `時間: ${date} ${time}`,
    `項目: ${booking.items?.[0]?.service?.name || '未指定'}`,
    `技師: ${booking.staff?.name || '不指定'}`,
  ].join('\n')
}
