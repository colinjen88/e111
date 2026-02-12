
import { FlexMessage } from '@line/bot-sdk'

export const getMainMenu = (): FlexMessage => {
  return {
    type: 'flex',
    altText: '歡迎使用 e111 線上預約',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
        action: {
          type: 'uri',
          uri: 'https://book.gowork.run/'
        }
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'e111 按摩預約',
            weight: 'bold',
            size: 'xl',
            color: '#1f2937'
          },
          {
            type: 'text',
            text: '享受頂級放鬆體驗，立即線上預約！',
            size: 'sm',
            color: '#6b7280',
            wrap: true,
            margin: 'md'
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📅 立即預約',
              uri: 'https://book.gowork.run/'
            },
            color: '#b91c1c'
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '🔍 查詢訂單',
              uri: 'https://book.gowork.run/orders'
            }
          },
          {
            type: 'button',
            style: 'link',
            height: 'sm',
            action: {
              type: 'uri',
              label: '📞 聯絡我們',
              uri: 'tel:0212345678' // Replace with actual phone
            }
          }
        ],
        flex: 0
      }
    }
  }
}
