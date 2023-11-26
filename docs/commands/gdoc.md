使用 `gdoc` 生成 API 文档,
它内部使用 [Typescript Compilier API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API).

```bash
yarn v1 gdoc
```

### Options

| options          | description       | default value   |
| ---------------- | ----------------- | --------------- |
| --output-dir, -o | output path          | docs            |
| --tsconfig       | tsconfig 文件路径 | ./tsconfig.json |
| --api-dir        | api 目录          |                 |

::: tip `v1` 是 `tealina --api-dir api-v1` 脚本的别名.
:::

生成的 json 文件格式并非 jsonschema, 而是 [@tealina/doc-type](/family/doc-types)
