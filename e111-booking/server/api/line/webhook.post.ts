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
        const text = webhookEvent.message.text.trim()
        
        // Echo or Reply Menu
        if (webhookEvent.replyToken && webhookEvent.replyToken !== '00000000000000000000000000000000') {
           const client = getLineClient()
           
           if (['menu', '選單', '預約', '開始', 'hello', 'hi'].includes(text.toLowerCase())) {
             await client.replyMessage(webhookEvent.replyToken, getMainMenu())
           } else {
             // Default Echo (can be removed later)
             await client.replyMessage(webhookEvent.replyToken, {
               type: 'text',
               text: `收到: ${text}。輸入「選單」或「預約」可開啟主選單。`
             })
           }
        }
      } else if (webhookEvent.type === 'follow') {
        const userId = webhookEvent.source.userId
        if (webhookEvent.replyToken) {
          const client = getLineClient()
          await client.replyMessage(webhookEvent.replyToken, [
            {
              type: 'text',
              text: '歡迎加入 e111 預約小幫手！請點擊下方選單開始預約。'
            },
            getMainMenu()
          ])
        }
        logger.info(`User followed bot: ${userId}`)
      }
    } catch (err: any) {
      logger.error('Error handling webhook event', err)
    }
  }

  return 'OK'
})
