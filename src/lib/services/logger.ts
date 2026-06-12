import type { TransportTargetOptions } from 'pino'
import pino from 'pino'

import env from '@/env'
import { createSingleton } from '@/lib/core/singleton'

function buildTransportTargets(): TransportTargetOptions[] {
  const targets: TransportTargetOptions[] = []
  if (env.NODE_ENV === 'development') {
    targets.push({ target: 'pino-pretty', level: env.LOG_LEVEL || 'info', options: {} })
  } else {
    targets.push({
      target: 'pino/file',
      level: env.LOG_LEVEL || 'info',
      options: { destination: 1 }
    })
  }

  return targets
}

const logger = createSingleton(
  'logger',
  () =>
    pino({ level: env.LOG_LEVEL || 'info' }, pino.transport({ targets: buildTransportTargets() })),
  { destroy: instance => new Promise<void>(resolve => instance.flush(() => resolve())) }
)

export default logger

export const operationLogger = logger.child({ type: 'OPERATION' })

export const loginLogger = logger.child({ type: 'LOGIN' })
