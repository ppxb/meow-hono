import type { BaseBindings } from '@/types/lib'
import { OpenAPIHono } from '@hono/zod-openapi'
import { pinoLogger } from 'hono-pino'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'

import logger from '@/lib/services/logger'
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '@/lib/constants/rate-limit'

import { createRateLimiter } from './rate-limit-factory'

// TODO: Add OpenAPIHono default hooks
export function createRouter<TBindings extends BaseBindings = BaseBindings>() {
  return new OpenAPIHono<TBindings>({
    strict: false
  })
}

export default function createApp() {
  const app = createRouter()

  // 1.请求 ID
  app.use(requestId())

  // 2.日志记录
  // 客户端的请求日志对观测无价值（高频、用户自助、含 SSE 心跳），跳过以降低 SLS 成本
  // 公共字典/参数接口同样高频且无营养，一并跳过
  const requestLogger = pinoLogger({ pino: logger })
  const SKIP_LOG_PATHS = new Set<string>(['/api/public/dicts', '/api/public/params'])
  app.use(async (c, next) => {
    const path = c.req.path
    if (path.startsWith('/api/client/') || SKIP_LOG_PATHS.has(path)) return next()
    return requestLogger(c as unknown as Parameters<typeof requestLogger>[0], next)
  })

  // 3.安全头部
  app.use(secureHeaders())

  // 4.超时控制
  app.use(timeout(30000))

  // 5.限流器
  app.use(
    createRateLimiter({
      windowMs: RATE_LIMIT_WINDOW_MS,
      limit: RATE_LIMIT_MAX_REQUESTS,
      prefix: 'rl:global:'
    })
  )

  // 6.基础功能
  app.use(trimTrailingSlash())
  app.use(cors())

  if (process.env.NODE_ENV === 'production') {
    app.use(compress())
  }

  return app
}
