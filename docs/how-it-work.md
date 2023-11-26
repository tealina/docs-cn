Tealina 通过少量约定和Typesript基本特性, 实现端到端类型. 这里使用最少代码助你快速理解其原理:
### 约定

以 key value 的结构批量导出API

```ts
/// [api-dir/index.ts]
export default {
  'post': import('./post/index.js'),
}

// [api-dir/post/index.ts]
export default {
  'category/create': import('./category/create.js'),
}
```
使用可推断的类型别名

```ts
// api-v1/post/category/create.ts
import type { HandlerType } from '../../../types/handler.js' //部分源码在下面

type ApiType = HandlerType<{ body: Pure.CategoryCreateInput }, Pure.Category>

const handler:ApiType = (req, res) => {
    ///....
}

export default handler
```

### Typescript

使用 Typescript 提取API信息
::: code-group
```ts [types/api-v1.d.ts]
import apis from "../src/api-v1/index.ts";
import type { ExtractApiType } from "./handler.js";

type RawApis = typeof apis;
export type ApiTypesRecord = {
  [Method in keyof RawApis]: ExtractApiType<
    Awaited<RawApis[Method]>["default"]
  >;
};
```
```ts [types/handler.js]
interface RawPayload {
  body?: unknown
  params?: unknown
  query?: unknown
}

type HandlerType<T extends RawPayload, Treponse, Theaders> = (req,res) => any

type ExtractApiType<T> = T extends HandlerType<
  infer Payload,
  infer Response,
  infer Headers
>
  ? Payload & { response: Response; headers: Headers }
  : never

```
:::
::: info ApiTypesRecord 会变成这样
```ts
type ApiTypesRecord = {
  post: {
    "category/create": {
      body: Pure.CategoryCreateInput;
      response: Pure.Category;
    };
  };
};
```
:::
### Link Package
在 server/package.json 定义 `exports` 类型声明

```json
// server/package.json
{
  "exports": {
    "./api/v1": "./types/api-v1.d.ts"
  }
}
```

在前端 web/packages.json 添加 `server` 为 devDependencies

```json
// web/package.json
{
  "devDependencies": {
    "server": "link:../server"
  }
}
```

:::warning
在前端执行build的时候, Typescript 会使用web/tsconfig.json中约束规则检查后端的ts代码, 所以请确保前后端约束规则保持一致. 原因是 tsc 检查只是跳过.d.ts文件, 不跳过.ts文件. 
:::

用 ApiTypesRecord 类型封装一个request对象, 利用 proxy 特性, 将所有请求传递至axios.request处理.
每个[api-dir]只需定义一遍, 实现类型自动同步.
::: code-group

```ts [web/src/api/req.ts]
import axios from "axios";
import { ApiTypesRecord } from "server/api/v1";
import { MakeReqType, createReq } from "./createReq";

const instance = axios.create({
  baseURL: "/api/v1/",
});
instance.interceptors.response.use((v) => v.data);

export const req = createReq<MakeReqType<ApiTypesRecord>>(instance);
```

```ts [web/src/api/createReq.ts]
/**
 * 返回一个代理对象内部指向`axiosInstance`.
 * @param axiosInstance
 */
const createReq = <T extends ApiShape>(axiosInstance: AxiosInstance) =>
  new Proxy({} as T, {
    get:
      (_target, method: string) =>
      (url: string, ...rest: DynamicParmasType) =>
        axiosInstance.request({
          method,
          url,
          ...transformPayload(url, rest),
        }),
  });
```

:::

 使用 `req` 调用API, 全程带智能提示

```ts
//web/src/some-file.ts
import { req } from 'api/req.ts'

req.post("category/create", {
  body: {
    categoryName: "Books",
    description: "Desc...",
  },
});
```