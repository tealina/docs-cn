Tealina 所有特性都是作用在一个 `[api-dir]`目录,
当有其他API目录, 比如: api-v2, 需要手动处理:

## 1. 更新 server/packages.json
```json {4}
{
  "scripts": {
    "v1": "tealina src/api-v1",
    "v2": "tealina src/api-v2" //[!code ++]
  },
  "exports": {
    "./api/v1": "./types/api-v1.d.ts",
    "./api/v2": "./types/api-v2.d.ts" //[!code ++]
  }
}
```
## 2. 创建一个 API 
会自动生成关联文件
```bash
yarn v2 get/status
```
::: details output
<span style="color:#3dd68c"> + </span> api-v2/index.ts\
<span style="color:#3dd68c"> + </span> api-v2/get/index.ts\
<span style="color:#3dd68c"> + </span> api-v2/get/status.ts\
<span style="color:#3dd68c"> + </span> types/api-v2.d.ts
:::

## 3. 构建 `v2` API 路由

复制一份 src/app/buildV1Router.ts, 更名为 buildV2Router.ts, 并按需修改文件内容
```ts {3,11}
import { Router } from 'express'
import { map, pipe, omitFn } from 'fp-lite'
import apisV2 from '../api-v2/index.js' 
// ...

const registeSeparetely = (record: ResolvedAPIs) => {
  // ...
}

export const buildV1Router = async () => {
  const record = await loadAPIs(apisV2)
  validateMethod(record)
  const [openRouter, authRouter] = registeSeparetely(record)
  const router = Router().use(openRouter).use(authRouter)
  return router
}

```
## 4. 注册路由
```ts 
// server/src/app/buildApiRouter.ts
import { Router } from 'express'
import { setupApiHeaders } from '../middlewares/setupApiHeaders.js'
import { buildV1Router } from './buildV1Router.js'
import { buildV2Router } from './buildV2Router.js' //[!code ++]
import { apiNotFoundHandler } from '../middlewares/notFoundHandler.js'

export const buildApiRoute = async () => {
  const v1ApiRouter = await buildV1Router()
  return (
    Router({ caseSensitive: true })
      .use(setupApiHeaders)
      .use('/v1', v1ApiRouter)
      .use('/v2', v2ApiRouter) //[!code ++]
      .use(apiNotFoundHandler)
  )
}

//...
```
## 5. 注册 `v2` 文档路由
::: details
```ts {9-13,25-27}
// server/src/app/docRouter.ts
const vDocCofig: TealinaVdocWebConfig = {
  sources: [
    {
      baseURL: '/api/v1',
      jsonURL: `${VDOC_BASENAME}/v1.json`,
      name: 'v1',
    },
    {//[!code ++]
      baseURL: '/api/v2',
      jsonURL: `${VDOC_BASENAME}/v2.json`,
      name: 'v2',
    },
  ],
  ///....
}

const docRouter = Router({ caseSensitive: true })
  .get('/index.html', (_req, res) => {
    assembleHTML(vDocCofig).then(html => res.send(html))
  })
  .get('/v1.json', (_req, res) => {
    res.sendFile(path.resolve('docs/api-v1.json'))
  })
  .get('/v2.json', (_req, res) => { //[!code ++]
    res.sendFile(path.resolve('docs/api-v2.json'))
  })
  .use(express.static(getAssetsPath()))

export { docRouter, VDOC_BASENAME }
```
:::
## 6. 前端创建一个新的 req.ts
复制一份 web/src/api/req.ts, 更名为 reqV2.ts, 并按需修改文件内容
```ts [reqV2.ts] {3}
// web/src/api/reqV2.ts
import axios from "axios";
import { ApiTypesRecord } from "server/api/v2";
import { MakeReqType, createReq } from "./createReq";

const instance = axios.create({
  baseURL: "/api/v2",
});

instance.interceptors.response.use((v) => v.data);

export const req = createReq<MakeReqType<ApiTypesRecord>>(instance);
```
