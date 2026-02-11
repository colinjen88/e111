import { Client, MiddlewareConfig } from '@line/bot-sdk'

const config = useRuntimeConfig()

export const lineConfig: MiddlewareConfig = {
  channelAccessToken: config.lineChannelAccessToken,
  channelSecret: config.lineChannelSecret,
}

export const lineClient = new Client({
  channelAccessToken: config.lineChannelAccessToken,
  channelSecret: config.lineChannelSecret,
})

export const isLineConfigured = () => {
  return !!config.lineChannelAccessToken && !!config.lineChannelSecret
}

// Helper to push message to a user
export const pushLineMessage = async (userId: string, messages: any[]) => {
  if (!isLineConfigured()) {
    console.warn('LINE is not configured, skipping push message')
    return
  }
  try {
    await lineClient.pushMessage(userId, messages)
    return true
  } catch (error) {
    console.error('Failed to push LINE message:', error)
    return false
  }
}
