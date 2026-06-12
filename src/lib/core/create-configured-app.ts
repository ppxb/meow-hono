import type { OpenAPIHono } from '@hono/zod-openapi'

import type { BaseBindings } from '@/types/lib'

import createApp from './create-app'

export async function createConfiguredApp(): Promise<OpenAPIHono<BaseBindings>> {
  const app = createApp()

  app.get('/', c => {
    return c.text('Hello Hono!')
  })

  return app
}
