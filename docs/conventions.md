# 约定
1. 所有API文件存储在 `[api-dir]/[method]`,
```md {1,3}
api-dir
├─ index.ts
└─ post
   ├─ index.ts
   ├─ login.ts
   ├─ category
   └─── create.ts
   
```
1. 一个 API 一个 文件
```md {5,7}
api-dir
├─ index.ts
└─ post
   ├─ index.ts
   ├─ login.ts
   ├─ category
   └─── create.ts
   
```

2. 每个 API 文件有 export default 处理函数
::: code-group
```ts [create.ts] {12}
import type { AuthedHandler } from '../../../../types/handler.js'
import type { Pure } from '../../../../types/pure.js'
import { convention } from '../../../convention.js'

type ApiType = AuthedHandler<{ body: Pure.CategoryCreateInput }, Pure.Category>

/** 这里的注释会被提取到API文档 */
const handler: ApiType = async (req, res) => {
  ...
}

export default convention(handler)
```

```ts [types/handler.ts]
import type { NextFunction, Request, Response } from 'express'

interface RawPayload {
  body?: unknown
  params?: unknown
  query?: unknown
}

export interface AuthedHandler< 
  T extends RawPayload = {}, 
  Tresponse = null,
  Theaders extends Request['headers'] = AuthHeaders,
  Tlocals extends Record<string, any> = AuthedLocals,
> {
  (
    req: Request<T['params'], Tresponse, T['body'], T['query']>,
    res: Response<Tresponse, Tlocals>,
    next: NextFunction,
  ): any
}
...
```

```ts [pure.d.ts]
export namespace Pure {
  interface Category{
    /** @default {autoincrement()} */
    id: number
    categoryName: string
    description: string
  }
  
  interface CategoryCreateInput{
    /** @default {autoincrement()} */
    id?: number
    categoryName: string
    description: string
  }
}
```

```ts [conventions.ts]

import type { RequestHandler } from 'express'
import type { CustomHandlerType } from '../types/handler.js'

type ConstrainedHandlerType = readonly [...RequestHandler[], CustomHandlerType]

type EnsureHandlerType = <const T extends ConstrainedHandlerType>(
  ...handlers: T
) => T
// 只是做类型检查
export const convention: EnsureHandlerType = (...handlers) => handlers

```
:::
4. `[api-dir]/[method]/index.ts` 定义路由和处理函数的映射关系
  ```ts
    export default {
      'category/create': import('./category/create.js'),
      ...
    }
  ```
5. `[api-dir]/index.ts` 定义 HTTP Method 和路由的映射关系
```ts
    export default {
      'post': import('./post/index.js'),
      ...
    }
  ```
6. `[api-dir].d.ts` API 类型入口文件
```ts
import apis from '../src/api-v1/index.ts'
import type { ResolveApiType } from './handler.js'

type RawApis = typeof apis
export type ApiTypesRecord = {
  [Method in keyof RawApis]: ResolveApiType<Awaited<RawApis[Method]>['default']>
}
```
::: tip
Tealina 命令会帮你遵守这些约定
:::


