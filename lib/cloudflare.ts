import { getRequestContext } from '@cloudflare/next-on-pages'

export interface Env {
  MEDIA: R2Bucket
  DB: D1Database
  ADMIN_TOKEN?: string
}

export function env(): Env {
  return getRequestContext().env as unknown as Env
}

export function waitUntil(promise: Promise<unknown>) {
  getRequestContext().ctx.waitUntil(promise)
}

// --- Minimal Cloudflare types (avoid pulling in @cloudflare/workers-types,
// which conflicts with wrangler's bundled v5 types) ---
export interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | Blob, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>
  get(key: string, options?: { range?: { offset: number; length?: number } }): Promise<R2ObjectBody | null>
  head(key: string): Promise<{ size: number; httpMetadata?: { contentType?: string } } | null>
  delete(key: string): Promise<void>
}
export interface R2ObjectBody {
  body: ReadableStream
  size: number
  httpMetadata?: { contentType?: string }
}
export interface D1Database {
  prepare(sql: string): D1Statement
}
export interface D1Statement {
  bind(...args: unknown[]): D1Statement
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  first<T = Record<string, unknown>>(): Promise<T | null>
  run(): Promise<unknown>
}
