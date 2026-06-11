import type { OpenAPIHono, RouteHandler, RouteConfig as HonoRouteConfig } from '@hono/zod-openapi'
import type { Schema } from 'hono'
import type { PinoLogger } from 'hono-pino'
import type { JWTPayload } from 'hono/utils/jwt/types'

/** 基础变量（所有 tier 共享） */
export type BaseVaribles = {
  /** 日志记录器 */
  logger: PinoLogger
  /** 请求 ID */
  requestId: string
  /** 当前 tier 的 basePath */
  tierBasePath: string
}

/** 基础 JWT 载荷 */
export type BaseJwtPayload = JWTPayload & {
  /** 用户 ID */
  sub: string
}

/** 客户端 JWT 载荷 */
export type ClientJwtPayload = BaseJwtPayload & {}

/** 管理端 JWT 载荷（含 RBAC 角色） */
export type AdminJwtPayload = BaseJwtPayload & {
  /** 用户角色 */
  roles: string[]
}

/** 框架基础设施绑定 */
export type BaseBindings = {
  Variables: BaseVaribles
}

/** 可复用的认证型 bindings 原语 */
export type JwtBindings<TPayload extends BaseJwtPayload = BaseJwtPayload> = {
  Variables: BaseVaribles & { jwtPayload: TPayload }
}

/** 管理端绑定（带角色的 JWT + RBAC） */
export type AdminBindings = JwtBindings<AdminJwtPayload>

/** 客户端绑定（仅含 sub 的 JWT） */
export type ClientBindings = JwtBindings<ClientJwtPayload>

/** 公开端绑定（无 JWT） */
export type PublicBindings = BaseBindings

/** 任意 tier bindings 的通用 OpenAPI 类型 */
export type OpenAPIWithBindings<
  TBindings extends BaseBindings,
  S extends Schema = {}
> = OpenAPIHono<TBindings, S>

/** 任意 tier bindings 的通用路由处理器类型 */
export type RouteHandlerWithBindings<
  R extends HonoRouteConfig,
  TBindings extends BaseBindings
> = RouteHandler<R, TBindings>

export type AdminOpenAPI<S extends Schema = {}> = OpenAPIWithBindings<AdminBindings, S>
export type ClientOpenAPI<S extends Schema = {}> = OpenAPIWithBindings<ClientBindings, S>
export type PublicOpenAPI<S extends Schema = {}> = OpenAPIWithBindings<PublicBindings, S>

export type AdminRouteHandler<R extends HonoRouteConfig> = RouteHandlerWithBindings<
  R,
  AdminBindings
>
export type ClientRouteHandler<R extends HonoRouteConfig> = RouteHandlerWithBindings<
  R,
  ClientBindings
>
export type PublicRouteHandler<R extends HonoRouteConfig> = RouteHandlerWithBindings<
  R,
  PublicBindings
>
