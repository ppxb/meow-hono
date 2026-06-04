import { Hono } from 'hono'

export default function createApp() {
  const app = new Hono()

  app.get('/', c => {
    return c.text('Hello Hono!')
  })

  return app
}
