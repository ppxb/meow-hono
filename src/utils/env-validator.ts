import type { z } from 'zod'

import { env as processEnv } from 'node:process'

export type ValidationResult<T> = {
  success: boolean
  data?: T
  fieldErrors?: Record<string, string[]>
}

export function safeParseEnv<T extends z.ZodType>(
  schema: T,
  env: Record<string, unknown> = processEnv
): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(env)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const fieldErrors: Record<string, string[]> = {}

  result.error.issues.forEach(issue => {
    const field = issue.path.filter((p): p is string => typeof p === 'string').join('.')

    if (field) {
      if (!fieldErrors[field]) {
        fieldErrors[field] = []
      }
      fieldErrors[field].push(issue.message)
    } else {
      const rootKey = '_'
      if (!fieldErrors[rootKey]) {
        fieldErrors[rootKey] = []
      }
      fieldErrors[rootKey].push(issue.message)
    }
  })

  return { success: false, fieldErrors }
}

export function parseEnvOrExit<T extends z.ZodType>(
  schema: T,
  env: Record<string, unknown> = processEnv
): z.infer<T> {
  const result = safeParseEnv(schema, env)

  if (!result.success) {
    console.error('❌ Invalid env:')
    console.error(JSON.stringify(result.fieldErrors, null, 2))
    process.exit(1)
  }

  return result.data!
}
