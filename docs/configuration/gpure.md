# 配置类型生成
默认情况下, `gpure` 采用与 `prisma generate`相同的规则,
比如: `xxUpdateInput` 所有属性变为可选,
你可以在`tealina.config.mjs`修改这些规则.
```js
// @ts-check
import { defineConfig } from 'tealina'

export default defineConfig({
  gpure:{
    // ...
  }
})
```

### 案列
当类型用于创建时,移除`id`属性
::: code-group
```js [ tealina.config.mjs ]
{
    overwrite: {
      excludeProps: [
        {
          blockName: '*',// '*' 指匹配所有
          keyword: 'model',
          kind: 'CreateInput',
          predicate: p => p.name === 'id',
        },
      ],
    },
}
```
```prisma [schema.prisma]

model Category {
  id           Int    @id @default(autoincrement())
  categoryName String
  description  String

  products Product[]
}
```
```ts [ types/pure.d.ts ]

 interface Category {
    categoryName: string
    description: string
  }

```
:::

### Type remap (类型重映射)
重映射比部分重写更直接, 影响所有种类(`model`,`type`,`xxCreateInput`,`xxUpdateInput`,`xx`)
```js
{
    typeRemap: type => {
      switch (type) {
        case 'Date':
          return 'number | string'
        //  ....
        default:
          // 返回 null 使用默认规则
          return null
      }
    },
}
```

### 默认映射规则
```ts
/** https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types */
const justMap = new Map<string, string>([
  ['BigInt', 'bigint'],
  ['Int', 'number'],
  ['Float', 'number'],
  ['Decimal', 'number'],
  ['String', 'string'],
  ['DateTime', 'Date'],
  ['Boolean', 'boolean'],
  ['Json', 'JsonValue'],
  ['Bytes', 'Buffer'],
])
```