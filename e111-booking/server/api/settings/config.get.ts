
interface SystemConfig {
  emailEnabled: boolean;
  maintenanceMode: boolean;
  bookingWindowDays: number;
  minBookingLeadTime: string;
}

// In-memory store for demo. In production, use Redis or DB.
let runtimeConfig: SystemConfig = {
  emailEnabled: false,
  maintenanceMode: false,
  bookingWindowDays: 14,
  minBookingLeadTime: '1 小時前'
}

export default defineEventHandler(async (event) => {
  return {
    success: true,
    data: runtimeConfig
  }
})
