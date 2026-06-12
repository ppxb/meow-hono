import type { BaseBindings } from '@/types/lib'
import { OpenAPIHono } from '@hono/zod-openapi'
import { pinoLogger } from 'hono-pino'
import { requestId } from 'hono/request-id'

import logger from '../services/logger'

// TODO: Add OpenAPIHono default hooks
export function createRouter<TBindings extends BaseBindings = BaseBindings>() {
  return new OpenAPIHono<TBindings>({
    strict: false
  })
}

export default function createApp() {
  const app = createRouter()

  // 请求ID - 最先生成，用于全链路追踪
  app.use(requestId())

  // 客户端的请求日志对观测无价值（高频、用户自助、含 SSE 心跳），跳过以降低 SLS 成本
  // 公共字典/参数接口同样高频且无营养，一并跳过
  const requestLogger = pinoLogger({ pino: logger })
  // 精确匹配跳过集合：O(1) 查找，新增路径只需往 Set 里加字符串
  const SKIP_LOG_PATHS = new Set<string>(['/api/public/dicts', '/api/public/params'])
  app.use(async (c, next) => {
    const path = c.req.path
    if (path.startsWith('/api/client/') || SKIP_LOG_PATHS.has(path)) return next()
    return requestLogger(c as unknown as Parameters<typeof requestLogger>[0], next)
  })
}
