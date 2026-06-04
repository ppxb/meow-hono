import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import nodeAdapter from '@hono/vite-dev-server/node'

export default defineConfig(() => {
  return {
    resolve: {
      tsconfigPaths: true
    },
    plugins: [
      devServer({
        entry: 'src/index.ts',
        adapter: nodeAdapter()
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 3000
    }
  }
})
