import { Client, MiddlewareConfig } from '@line/bot-sdk'


let _client: Client | null = null

export const getLineClient = () => {
  if (_client) return _client
  
  const config = useRuntimeConfig()
  if (!config.lineChannelAccessToken || !config.lineChannelSecret) {
    throw new Error('LINE configuration missing')
  }
  
  _client = new Client({
    channelAccessToken: config.lineChannelAccessToken,
    channelSecret: config.lineChannelSecret,
  })
  
  return _client
}

export const isLineConfigured = () => {
  const config = useRuntimeConfig()
  return !!config.lineChannelAccessToken && !!config.lineChannelSecret
}

// Helper to push message to a user
export const pushLineMessage = async (userId: string, messages: any[]) => {
  if (!isLineConfigured()) {
    console.warn('LINE is not configured, skipping push message')
    return false
  }
  try {
    const client = getLineClient()
    await client.pushMessage(userId, messages)
    return true
  } catch (error) {
    console.error('Failed to push LINE message:', error)
    return false
  }
}
