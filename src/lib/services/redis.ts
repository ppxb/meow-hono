import env from '@/env'
import { Redis, type RedisOptions } from 'ioredis'
import { parseURL } from 'ioredis/built/utils'
import { createSingleton } from '../core/singleton'

function createRedisClient() {
  const connectionOptions: RedisOptions = parseURL(env.REDIS_URL)
  return new Redis(connectionOptions)
}

const redisClient = createSingleton<Redis>('redis', createRedisClient, {
  destroy: async client => void (await client.quit())
})

export default redisClient
