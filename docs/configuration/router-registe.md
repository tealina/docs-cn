Tealina 并没有接管路由和中间件的注册, 好在, `create-tealina` 已经有样板可参考.

### 注册路由和中间件
> 假设你有个新的登录API:`post/user/login`, 你需要让它不验证token

```ts {10-12}
// server/src/app/index.ts
const buildV1Router = async () => {
  const record = await loadAPIs(apisV1);
  validateMethod(record);
  const openRouter = Router();
  const authRouter = Router().use(verifyToken);
  const { get, post, ...rest } = record;
  // 在这里编写控制接口是否需要登录
  const [authGetApis, openGetApis] = separateObject(get, "status");
  const [authPostApis, openPostApis] = separateObject(post, "user/login"); // [!code ++]
  registeApiRoutes(openRouter, { get: openGetApis, post: openPostApis }); 
  registeApiRoutes(authRouter, { get: authGetApis, post: authPostApi, ...rest });
  const router = Router().use(openRouter).use(authRouter);
  return router;
};
```



<!-- #### Tealina only effect files blow:
1. `[api-dir]/index.ts`
2. `[api-dir]/[method]/index.ts`
2. `[api-dir]/[method]/**/[hanlder].ts`
3. `types/[api-dir].d.ts`
4. `docs/[api-dir].json`

####  No watch mode
The reason is:  APIs file structure is not change frequently, most of time you coding inside the file. -->
