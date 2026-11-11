// Technology spike only. Business modules will be added after ADR-0001 is accepted.
import { Context } from 'cordis'
import { httpHealth } from './plugins/http-health.js'

const ctx = new Context()
await ctx.plugin(httpHealth)
console.info('Cordis reporting API spike initialized')

let shuttingDown = false
async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.info(`Stopping on ${signal}`)
  try {
    await ctx.fiber.dispose()
    process.exitCode = 0
  } catch (error) {
    console.error('Shutdown failed:', error)
    process.exitCode = 1
  }
}
process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))
