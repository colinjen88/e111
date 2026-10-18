const TIME_ZONE = 'Asia/Taipei'

/**
 * Format a booking into a human-readable notification message.
 *
 * Booking times are created from local (Asia/Taipei) wall-clock input, so they
 * are rendered in that zone instead of UTC (toISOString would be 8h off).
 */
export const formatBookingMessage = (booking: any): string => {
  const date = booking.bookingDate instanceof Date
    ? booking.bookingDate.toISOString().split('T')[0]
    : String(booking.bookingDate)

  const time = booking.startTime instanceof Date
    ? new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(booking.startTime)
    : String(booking.startTime)

  return [
    '📋 [新預約通知]',
    `客戶: ${booking.customer?.name || '—'} (${booking.customer?.phone || '—'})`,
    `時間: ${date} ${time}`,
    `項目: ${booking.items?.[0]?.service?.name || '未指定'}`,
    `技師: ${booking.staff?.name || '不指定'}`,
  ].join('\n')
}
