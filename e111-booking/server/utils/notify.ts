/**
 * Unified Notification Service
 * 
 * LINE: Uses @line/bot-sdk when configured, otherwise logs mock messages.
 * Email: Mock implementation (Coming Soon — can integrate SendGrid/Resend later).
 */

import { isLineConfigured, pushLineMessage } from './line'

/**
 * Send a LINE push notification to the admin.
 * Uses the real LINE Messaging API when configured; otherwise falls back to console log.
 */
export const sendLinePushMessage = async (message: string): Promise<boolean> => {
  const adminUserId = process.env.LINE_ADMIN_USER_ID

  // Real LINE API
  if (isLineConfigured() && adminUserId) {
    return await pushLineMessage(adminUserId, [{ type: 'text', text: message }])
  }

  // Fallback: log to console (development / unconfigured)
  console.log('[Notify] LINE not configured — message logged instead:')
  console.log(`  → ${message.substring(0, 120)}...`)
  return true
}

/**
 * Send an email notification.
 * Currently a mock — logs to console. 
 * TODO: Integrate with SendGrid, Resend, or SMTP in a future phase.
 */
export const sendEmail = async (to: string, subject: string, htmlBody: string): Promise<boolean> => {
  console.log(`[Notify] Email (mock) → To: ${to}, Subject: ${subject}, Body: ${htmlBody.length} chars`)
  return true
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
