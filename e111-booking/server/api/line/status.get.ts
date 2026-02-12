
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const hasSecret = !!config.lineChannelSecret
  const hasToken = !!config.lineChannelAccessToken
  
  return {
    status: hasSecret && hasToken ? 'configured' : 'missing_configuration',
    checks: {
      lineChannelSecret: hasSecret,
      lineChannelAccessToken: hasToken
    }
  }
})
