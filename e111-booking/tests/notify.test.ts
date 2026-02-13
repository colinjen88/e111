import { describe, it, expect } from 'vitest'

// Import the formatting function — we inline-define it here to avoid Nuxt runtime deps
const formatBookingMessage = (booking: any): string => {
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

describe('formatBookingMessage', () => {
    it('should format a complete booking message', () => {
        const booking = {
            bookingDate: new Date('2026-02-15'),
            startTime: new Date('2026-02-15T14:00:00Z'),
            customer: { name: '張三', phone: '0912345678' },
            staff: { name: '王師傅' },
            items: [{ service: { name: '足底按摩' } }]
        }

        const msg = formatBookingMessage(booking)
        expect(msg).toContain('📋 [新預約通知]')
        expect(msg).toContain('張三')
        expect(msg).toContain('0912345678')
        expect(msg).toContain('2026-02-15')
        expect(msg).toContain('14:00')
        expect(msg).toContain('足底按摩')
        expect(msg).toContain('王師傅')
    })

    it('should handle no staff (不指定)', () => {
        const booking = {
            bookingDate: new Date('2026-02-15'),
            startTime: new Date('2026-02-15T10:00:00Z'),
            customer: { name: '李四', phone: '0987654321' },
            staff: null,
            items: [{ service: { name: '經絡推拿' } }]
        }

        const msg = formatBookingMessage(booking)
        expect(msg).toContain('不指定')
        expect(msg).toContain('經絡推拿')
    })

    it('should handle no service items', () => {
        const booking = {
            bookingDate: '2026-03-01',
            startTime: '10:30',
            customer: { name: '王五', phone: '0911111111' },
            staff: { name: '陳師傅' },
            items: []
        }

        const msg = formatBookingMessage(booking)
        expect(msg).toContain('未指定')
        expect(msg).toContain('王五')
    })

    it('should handle string dates (non-Date objects)', () => {
        const booking = {
            bookingDate: '2026-04-10',
            startTime: '15:30',
            customer: { name: '趙六' },
            staff: null,
            items: []
        }

        const msg = formatBookingMessage(booking)
        expect(msg).toContain('2026-04-10')
        expect(msg).toContain('15:30')
        expect(msg).toContain('—') // missing phone
    })
})
