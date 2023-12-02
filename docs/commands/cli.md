端到端类型依赖于[约定](/conventions)的文件结构, 通过命令行创建, 删除 API 文件, 会自动帮你遵守约定.
## 创建一个
如果没指定 HTTP Method, 默认为 post

```bash
yarn v1 get/user
```
::: details output
<span style="color:#3dd68c"> + </span> api-v1/index.ts\
<span style="color:#3dd68c"> + </span> api-v1/get/index.ts\
<span style="color:#3dd68c"> + </span> api-v1/get/user.ts
:::

::: tip `v1` 是 `tealina api-v1` 脚本的别名.
:::

## 创建多个
为一个 model 创建 crud 四个API, 也可以只传 cr, 创建两个API
> `crud` 是在 [ tealina.config.mjs ](/configuration/templates)定义的模版缩写

```bash
yarn v1 user -t crud
```

## 批量创建 
根据 schema.prisma 文件中的 model name, 批量创建API.\
如果你用的 ORM 不是 Prisma, 有一个 .prisma 文件也是可以的.

```bash
yarn v1 -t crud -m
```

:::info 如果 API 文件已存在, 不会重写.
:::

## 删除 API 
只需要加个 -d
```bash
yarn v1 get/user -d
```

## 重新对齐
如果手动变更了文件结构, 这个命令可以帮你重新对齐
```bash
yarn v1 -a
```

## 生成文档

```bash
yarn v1 gdoc
```

:::tip 运行前,确保你的 Handler 已经定好类型
:::

## 生成类型

```bash
yarn v1 gtype
```
:::info 特点
1. 不包含外表字段
2. 全部使用 `interface` 关键字 (为了在文档中保留类型名称)
:::

### 全部选项

| 选项                 | 描述                                      | 默认值                             |
| -------------------- | ----------------------------------------- | ---------------------------------- |
| --align, -a          | 对齐, 根据现有的 API 文件, 更新索引文件   | false                              |
| --delete-api, -d     | 是否为删除 API                            | false                              |
| --template-alias, -t | 模版别名(缩写)                            |                                    |
| --model, -m          | 是否从 schema.prisma 获取 model name      | false                              |
| --input, -i          | 执行 gtype 时, schmea.prisma 的文件路径   | prisma/schema.prisma               |
| --output, -o         | 输出路径, gdoc 为文件夹, gtype 为文件路径 | docs(gdoc), types/pure.d.ts(gtype) |
| --namespace, -n      | gtype 生成的类型, 在这个命名空间内        | Pure                               |
| --with-test          | 是否生成测试文件(目前是空文件)            | false                              |
| --config-path        | tealina 配置文件的路径                    | tealina.config.mjs                 |
| --verbose            | 是否打印错误细节                          | false                              |
