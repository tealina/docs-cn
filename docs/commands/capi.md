使用 `capi` 命令新建API文件, 会自动更新索引文件.
> 以下文件会被更新\
    1. `[api-dir]/index.ts`\
    2. `[api-dir]/[method]/index.ts`


## 传入路径创建一个API
> 如果没指定 http method, 默认为post
```bash
yarn v1 capi get/user
```
::: tip `v1` 是 `tealina --api-dir api-v1` 脚本的别名.
:::

## 批量创建API (传入name和模版缩写)
> `crud` 是在 [ tealina.config.mjs ](/configuration/templates)定义的模版缩写
```bash
yarn v1 capi user crud
```

## 根据 schema.prisma 文件中的 model name, 批量创建
> 如果你用的 ORM 不是 Prisma, 光有一个 .prisma 文件也是可以的.
```bash
yarn v1 capi --by-model -t crud
```
:::tip 使用 `--by-model` 的时候, 模版缩写要显示的传递给 `-t`
:::

:::info 如果API文件已存在,不会重写.
:::