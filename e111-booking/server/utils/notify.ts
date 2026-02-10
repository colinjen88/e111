
/**
 * Notification Service (Mock Implementation)
 * In production, replace console.log with actual API calls (e.g., axios to LINE API, SendGrid SDK)
 */

export const sendLineNotify = async (message: string) => {
  // TODO: Get token from config/env
  const token = process.env.LINE_NOTIFY_TOKEN
  
  console.log('--- [MOCK] LINE Notify ---')
  console.log(`To: Admin Group`)
  console.log(`Message: ${message}`)
  console.log('--------------------------')

  // Real implementation example:
  /*
  if (token) {
    await $fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: new URLSearchParams({ message })
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
