
/**
 * Notification Service (Mock Implementation)
 * In production, replace console.log with actual API calls (e.g., axios to LINE API, SendGrid SDK)
 */

export const sendLinePushMessage = async (message: string) => {
  // TODO: Get token and user ID from config/env
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_ADMIN_USER_ID // This could be a Group ID too
  
  console.log('--- [MOCK] LINE Push Notification ---')
  console.log(`To: ${userId || 'Default_Admin'}`)
  console.log(`Message: ${message}`)
  console.log('------------------------------------')
  
  // Real implementation example (Messaging API - Push Message):
  /*
  if (token && userId) {
    await $fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: {
        to: userId,
        messages: [{ type: 'text', text: message }]
      }
    })
  }
  */
  return true
}

export const sendEmail = async (to: string, subject: string, htmlBody: string) => {
  console.log('--- [MOCK] Email Sent ---')
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body Length: ${htmlBody.length} chars`)
  console.log('-------------------------')
  
  return true
}

export const formatBookingMessage = (booking: any) => {
  return `
[新預約通知]
客戶: ${booking.customer.name} (${booking.customer.phone})
時間: ${booking.bookingDate.toISOString().split('T')[0]} ${booking.startTime.toISOString().split('T')[1].substr(0,5)}
項目: ${booking.items[0]?.service?.name || '未指定'}
技師: ${booking.staff?.name || '不指定'}
  `.trim()
}
