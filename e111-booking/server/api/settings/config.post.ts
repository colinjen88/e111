
interface SystemConfigUpdate {
  emailEnabled?: boolean;
  maintenanceMode?: boolean;
  bookingWindowDays?: number;
  minBookingLeadTime?: string;
}

// Share the same in-memory object (this works because module scope is shared in Nuxt dev server usually, but might reset on restart)
// For a robust solution, we'd use a file or DB. Let's use a JSON file for persistence across restarts.
import fs from 'node:fs'
import path from 'node:path'

const configPath = path.resolve(process.cwd(), 'system_config.json')

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    }
  } catch (e) {}
  return {
      emailEnabled: false,
      maintenanceMode: false,
      bookingWindowDays: 14,
      minBookingLeadTime: '1 小時前'
  }
}

function saveConfig(cfg: any) {
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2))
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const currentConfig = loadConfig()
  
  const newConfig = { ...currentConfig, ...body }
  saveConfig(newConfig)

  return {
    success: true,
    data: newConfig
  }
})
