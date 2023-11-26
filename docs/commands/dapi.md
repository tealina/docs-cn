使用 `dapi` 命令删除API文件,会自动更新索引文件.
这个命令几乎是 [capi](/commands/capi) 的反向版.
> 以下文件会被自动更新\
    1. `[api-dir]/index.ts`\
    2. `[api-dir]/[method]/index.ts`

## 删除一个API 
```bash
yarn v1 dapi get/user
```
::: tip `v1` 是 `tealina --api-dir api-v1` 脚本的别名.
:::


## 批量删除 (name 和 模版缩写)
```bash
yarn v1 dapi user crud
```

## 批量删除 --by-model
`dapi` 不支持这种方式删除API

