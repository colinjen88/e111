import { validateSignature, WebhookEvent } from '@line/bot-sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  if (!config.lineChannelSecret || !config.lineChannelAccessToken) {
    logger.error('LINE configuration missing')
    throw createError({
      statusCode: 500,
      statusMessage: 'LINE configuration missing'
    })
  }

  const signature = getHeader(event, 'x-line-signature')
  if (!signature) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Signature missing'
    })
  }

  // Get raw body for signature validation
  const body = await readRawBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body missing'
    })
  }

  // Validate signature
  if (!validateSignature(body, config.lineChannelSecret, signature)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid signature'
    })
  }

  const bodyString = body.toString('utf-8')
  const bodyJson = JSON.parse(bodyString)
  const events: WebhookEvent[] = bodyJson.events

  // Process events
  for (const webhookEvent of events) {
    try {
      if (webhookEvent.type === 'message' && webhookEvent.message.type === 'text') {
        // Echo the text message (optional: remove for production)
        if (webhookEvent.replyToken && webhookEvent.replyToken !== '00000000000000000000000000000000') {
           // Only reply if we have a valid token
           await lineClient.replyMessage(webhookEvent.replyToken, {
             type: 'text',
             text: `收到您的訊息: ${webhookEvent.message.text}`
           })
        }
      } else if (webhookEvent.type === 'follow') {
        const userId = webhookEvent.source.userId
        logger.info(`User followed bot: ${userId}`)
        // Optional: Save userId to database or welcome message
      }
    } catch (err: any) {
      logger.error('Error handling webhook event', err)
    }
  }

  return 'OK'
})
