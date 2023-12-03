Tealina 通过少量约定和Typesript基本特性, 实现端到端类型. 这里使用最少代码助你快速理解其原理:
## 类型提取流程图
![type-flow](type-flow.png)
## 批量导出API
以key value结构批量导出API定义, 这带来两个好处:
1. 每个api目录只需定义一次路由
2. 方便后续映射类型
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
## 类型别名
基于框架的 Handler 函数, 封装一个类型别名 HandlerType<输入, 输出, 请求头, ...其他>
```ts
// api-v1/post/category/create.ts
import type { HandlerType } from '../../../types/handler.js' //部分源码在下面

type ApiType = HandlerType<{ body: Pure.CategoryCreateInput }, Pure.Category>

const handler:ApiType = (req, res) => {
    ///....
}

export default handler
```

### 类型提取和重映射
使用 infer 语法, 提取API信息
::: code-group
```ts [types/api-v1.d.ts]
import apis from "../src/api-v1/index.ts";
import type { ExtractApiType } from "./handler.js"; // infer 在文件内用到 

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

## 类型共享给前端
把类型暴露给前端, 而且只是类型, 运用node的包管理特性,
在 server/package.json 定义 `exports` 类型声明, 导出API类型

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
在前端执行 build 的时候, Typescript 会使用 web/tsconfig.json 中的约束规则检查后端的ts代码, 原因是 tsc 检查只是跳过.d.ts文件, 不跳过.ts文件. 所以请确保前后端约束规则保持一致.
:::

## 封装请求函数
用后端导出的API类型, 封装一个request对象,
实现写代码的时候用的是实时类型, 利用 proxy 特性, 将所有请求交给axios.request处理.
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

:::tip 类型延迟
如果遇到后端类型有更新, 前端没反应过来,
这种情况是因为 Typescript 语言服务有缓存, 
两种解决方法:
1. 定位到变量, f12 跳转到定义, 触发类型刷新.
2. 手动重启 TS 服务, 以 VS code 为例, Ctrl + Shift + P,  找到: Restart TS Server 并执行
:::