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
