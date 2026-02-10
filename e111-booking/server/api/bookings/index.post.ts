
import { PrismaClient } from '@prisma/client'
import { sendLineNotify, sendEmail, formatBookingMessage } from '../../utils/notify'

export default defineEventHandler(async (event) => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const body = await readBody(event)
    
    // 1. Validate Basic Inputs
    const { branchId, serviceId, staffId, date, time, user } = body
    
    if (!branchId || !serviceId || !date || !time || !user || !user.phone || !user.name) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    // 2. Fetch Service Details (Duration & Price)
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    })
    
    if (!service) {
      throw createError({ statusCode: 404, statusMessage: 'Service not found' })
    }

    // 3. Calculate Time Range
    const startTimeStr = `${date}T${time}:00`
    const startTime = new Date(startTimeStr)
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000)
    
    // Check for valid Date
    if (isNaN(startTime.getTime())) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid date/time format' })
    }

    // 4. Check Availability & Assign Staff
    // We need to fetch existing bookings that overlap with requested time
    // Overlap Logic: (ExistingValues.Start < New.End) AND (Existing.End > New.Start)
    const potentialConflict = await prisma.booking.findMany({
      where: {
        branchId: parseInt(branchId),
        startTime: {
          lt: endTime
        },
        endTime: {
          gt: startTime
        },
        status: {
          not: 'Cancelled'
        }
      },
      select: {
        staffId: true
      }
    })

    const busyStaffIds = new Set(potentialConflict.map(b => b.staffId).filter(id => id !== null))
    
    let allocatedStaffId: number | null = staffId ? parseInt(staffId) : null

    if (allocatedStaffId) {
      // Case A: User selected specific staff
      if (busyStaffIds.has(allocatedStaffId)) {
        throw createError({ statusCode: 409, statusMessage: 'Selected staff is already booked' })
      }
      // Also verify staff belongs to branch and is active
      const staffExists = await prisma.staff.findFirst({
        where: { id: allocatedStaffId, branchId: parseInt(branchId), isActive: true }
      })
      if (!staffExists) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid staff selection' })
      }

    } else {
      // Case B: "Any Staff" (Auto-Assign)
      // Get all active staff for this branch
      const allStaff = await prisma.staff.findMany({
        where: { branchId: parseInt(branchId), isActive: true }
      })

      // Filter out busy staff
      const availableStaff = allStaff.filter(s => !busyStaffIds.has(s.id))
      
      if (availableStaff.length === 0) {
        throw createError({ statusCode: 409, statusMessage: 'No staff available for this slot' })
      }

      // Simple Allocation Strategy: Pick the first available one (or random)
      // TODO: Implement Round-robin or "Least Busy" in Phase 3
      allocatedStaffId = availableStaff[0].id
    }

    // 5. Database Operations (Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // 5.1 Upsert Customer
      const customer = await tx.customer.upsert({
        where: { phone: user.phone },
        update: {
          name: user.name,
          email: user.email,
          
        },
        create: {
          phone: user.phone,
          name: user.name,
          email: user.email,
          preferredBranchId: parseInt(branchId) // Update preferred branch on creation
        }
      })

      // 5.2 Create Booking
      const booking = await tx.booking.create({
        data: {
          branchId: parseInt(branchId),
          customerId: customer.id,
          staffId: allocatedStaffId,
          bookingDate: new Date(date), // Stores just date part usually, but Date object is fine
          startTime: startTime,
          endTime: endTime,
          totalPrice: service.basePrice, // Single service for now
          status: 'Confirmed',
          customerNotes: user.note,
          // 5.3 Create Booking Item
          items: {
            create: {
              serviceId: service.id,
              staffId: allocatedStaffId,
              price: service.basePrice
            }
          }
        },
        include: {
          staff: true,
          branch: true,
          service: false // Service info is in items
        }
      })

      return booking
    })

    // 6. Send Notifications (Fire and Forget)
    try {
      const bookingForNotify = await prisma.booking.findUnique({
        where: { id: result.id },
        include: {
          customer: true,
          staff: true,
          items: { include: { service: true } }
        }
      })
  
      if (bookingForNotify) {
         // Log to console for now
         const msg = formatBookingMessage(bookingForNotify)
         await sendLineNotify(msg)
         if (bookingForNotify.customer.email) {
           await sendEmail(bookingForNotify.customer.email, '預約確認', msg)
         }
      }
    } catch (e) {
      console.error('Notification Error:', e)
      // Do not fail the request if notification fails
    }

    return {
      success: true,
      bookingId: result.id,
      message: 'Booking confirmed successfully',
      details: {
        date: date,
        time: time,
        branch: result.branch.name,
        staff: result.staff?.name || 'Assigned Staff',
        price: result.totalPrice
      }
    }

  } catch (error: any) {
    console.error('Booking Creation Error:', error)
    // Return structured error
    if (error.statusCode) {
      throw error // Re-throw Nuxt errors
    }
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error: ' + error.message })
  } finally {
    await prisma.$disconnect()
  }
})
