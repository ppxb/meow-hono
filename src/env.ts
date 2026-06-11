import { config } from '@dotenvx/dotenvx'
import path from 'node:path'
import { z } from 'zod'

import { parseEnvOrExit } from '@/utils'

config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
})

const EnvSchema = z.object({
  /** 环境变量 */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /** 端口号 */
  PORT: z.coerce.number().default(9999),
  /** 日志等级 */
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  /** 数据库连接 URL */
  DATABASE_URL: z.string().refine(val => process.env.NODE_ENV !== 'production' || val !== '', {
    message: '生产环境下数据库连接字符串不能为空'
  }),
  /** 数据库连接池大小 */
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),
  /** Redis 连接 URL */
  REDIS_URL: z.string().refine(val => process.env.NODE_ENV !== 'production' || val !== '', {
    message: '生产环境下 Redis 连接字符串不能为空'
  }),
  /** 客户端 JWT 密钥 */
  CLIENT_JWT_SECRET: z.string().min(32, 'JWT 密钥长度至少 32 字符，建议使用强随机字符串'),
  /** 管理端 JWT 密钥 */
  ADMIN_JWT_SECRET: z.string().min(32, 'JWT 密钥长度至少 32 字符，建议使用强随机字符串'),
  /** OSS 访问密钥 ID */
  ACCESS_KEY_ID: z.string(),
  /** OSS 访问密钥 */
  SECRET_ACCESS_KEY: z.string(),
  /** OSS 终端节点 */
  ENDPOINT: z.url(),
  /** OSS 存储桶名称 */
  BUCKET_NAME: z.string().default('default-bucket'),
  /** Sentry 错误追踪 */
  SENTRY_DSN: z.string().optional(),
  /** 受信代理 IP */
  TRUSTED_PROXY_IPS: z.string().default('private')
})

export type Env = z.infer<typeof EnvSchema>
export default parseEnvOrExit(EnvSchema)
