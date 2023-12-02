### 为什么选择 Tealina

当你直接使用Typescript开发全栈项目, 会感觉到以下问题:

1. **大量类型定义**: 你需要定义很多类型,特别是Model, 尽管 [ Prisma ](https://prisma.io) 也有类型生成的功能,但它生成的类型很复杂.
2. **文档**: 如果不使用 [GraphQL](https://graphql.org/), [Swagger](https://swagger.io/docs/open-source-tools/swagger-editor/) 几乎是唯一选项, 但它依赖于JSDoc, 意味着你需要在注释中再写一遍参数类型.
3. **API 调用**: 在前端调用API,也需要重复定义一遍API相关的类型.  [tRPC](https://trpc.io) 是一个好的选择,可惜它没有文档生成.

Tealina 无入侵的解决了以上问题:
1. 通过命令 **gtype** 生成更简单的类型,供前端和文档使用.
2. 通过命令 **gdoc** 直接从代码中提取文档信息
3. 使用类型别名和少量约定就实现了端到端类型.

另外, 用Tealina开发自带文档的API更简单, 只需一个富有类型的函数.