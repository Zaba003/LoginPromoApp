import { createServer } from 'node:http'
import type { Context } from 'cordis'

/** Minimal Node HTTP example. Replace with a Fastify adapter after the Cordis spike. */
export function httpHealth(ctx: Context) {
  const port = Number(process.env.PORT ?? '3100')
  const host = process.env.HOST ?? '127.0.0.1'
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535')
  }

  ctx.effect(() => {
    const server = createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify({ status: 'ok', product: 'reporting-platform', stage: 'spike' }))
        return
      }
      res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: 'Not found' }))
    })
    server.on('error', (error) => console.error('HTTP server error:', error))
    server.listen(port, host, () => console.info(`Listening on http://${host}:${port}`))
    return () => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
    })
  })
}
