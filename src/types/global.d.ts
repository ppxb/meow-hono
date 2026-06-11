/// <reference types="vite/client" />

declare global {
  interface ParamsType<T = any> {
    [key: string]: T
  }
}

export {}
