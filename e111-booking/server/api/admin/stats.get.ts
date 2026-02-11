

import { prisma } from '../../utils/prisma'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'

export default defineEventHandler(async (event) => {


  try {
    // Admin Auth Check
    requireAdmin(event)
    
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)

    // 1. Fetch bookings for last 30 days
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: thirtyDaysAgo
        },
        status: {
          not: 'Cancelled' // Only count valid bookings
        }
      },
      select: {
        bookingDate: true,
        totalPrice: true,
        status: true
      }
    })

    // 2. Aggregate Daily Revenue
    const dailyRevenue: Record<string, number> = {}
    const dailyCount: Record<string, number> = {}
    
    // Initialize last 30 days with 0
    for (let i = 0; i <= 30; i++) {
        const dateStr = format(subDays(now, i), 'yyyy-MM-dd')
        dailyRevenue[dateStr] = 0
        dailyCount[dateStr] = 0
    }

    bookings.forEach(b => {
        const dateStr = format(new Date(b.bookingDate), 'yyyy-MM-dd')
        if (dailyRevenue[dateStr] !== undefined) {
             // SQLite Decimal is returned as string/number depending on driver. Prisma handles Decimal.
             // We cast to number for simple charts
             const price = Number(b.totalPrice)
             dailyRevenue[dateStr] += price
             dailyCount[dateStr] += 1
        }
    })

    // Convert to Array for Frontend Chart
    // Sort logic handled by format loop order? No, object keys are unordered.
    // Let's rebuild array sorted by date.
    
    const chartData = []
    for (let i = 29; i >= 0; i--) {
        const d = subDays(now, i)
        const dateStr = format(d, 'yyyy-MM-dd')
        chartData.push({
            date: format(d, 'MM/dd'),
            fullDate: dateStr,
            revenue: dailyRevenue[dateStr] || 0,
            count: dailyCount[dateStr] || 0
        })
    }

    // 3. Summary Stats (Today/Week/Month)
    // Re-query database for specific periods might be cleaner but aggregation in JS is fine for small scale.
    
    // Today
    const todayStr = format(now, 'yyyy-MM-dd')
    const todayRevenue = dailyRevenue[todayStr] || 0
    const todayCount = dailyCount[todayStr] || 0

    // Total Month (Last 30 days sum)
    const totalRevenue = Object.values(dailyRevenue).reduce((a, b) => a + b, 0)
    const totalCount = Object.values(dailyCount).reduce((a, b) => a + b, 0)
    
    return {
      success: true,
      stats: {
        today: { revenue: todayRevenue, count: todayCount },
        month: { revenue: totalRevenue, count: totalCount },
      },
      chartData
    }

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
