`@tealina/doc-ui` 提供一个网页用于呈现由 [gdoc](/commands/gdoc) 生成的 `doc.json`
## VS Code 风格的语法高亮
![synatx-highlight](/synatx-highlight.png)

## 自动生成表单
![Form Feature](/doc-ui-feature.png)

## 表单如何处理复杂类型
- 遇到复杂类型, 比如 `any` and `recursion`(循环引用), 表单项会使用代码编辑器.
- 联合类型会多一个切换按钮
- 枚举类型会转换成下拉选择框
- File 类型会转换成上传按钮, 需要在 Headers 配置 'Content-Type': 'multipart/form-data'
::: details API 代码
```ts
// server/src/api-v1/post/upload.ts
const handler: AuthedHandler<
  { body: { payload: File } },
  { url: string },
  {'Content-Type': 'multipart/form-data'},// headers
> = async (req, res, next) => {
    // ...
}
```
:::