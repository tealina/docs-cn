使用 `gpure` 命令 从schema.prisma文件生成简化后的类型

```bash
yarn v1 gpure
```

::: tip `v1` 是 `tealina --api-dir api-v1` 脚本的别名.
:::

### Options

| options         | description                 | default value          |
| --------------- | --------------------------- | ---------------------- |
| --input, -i     | input path                  | ./prisma/schema.prisma |
| --output, -o    | output path                 | ./types/pure.d.ts      |
| --namespace, -n | 命名空间 | Pure                   |
| --config-path   | tealina 配置文件路径        | ./tealina.config.mjs   |

#### 为什么用它?

[Prisma](https://www.prisma.io) 生成的类型过于复杂, 对前端不友好, 也不利于文档生成. 

#### 有什么不同?

`gpure` 会为每个 `model` and `type` 生成带CreateInput 和 UpdateInput 后缀的类型, 跟 `prisma generate` 相同, 但也有些不同之处:

1. 不包含外表字段
1. 全部使用 `interface` 关键字 (为了在文档中保留类型名称)

#### 什么时候用?

在你修改了 `schema.prisma` 之后

#### 如果我用的不是 Primsa ORM?

`gpure` 只依赖[ Prisma DSL 语法 ](https://www.prisma.io/docs/concepts/components/prisma-schema#syntax), 有个.prisma文件也是可以的
