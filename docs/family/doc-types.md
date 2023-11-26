# API 文档类型
这是一个专为转换工具而设计的 API 文档类型
它有这些关键特性:
1. 独立的包,方便你基于它编写转换工具
1. 类型定义偏向Typescript
1. 易于编写代码

### 案列
 文档转成UI
```tsx
// type2cell.tsx
import type { DocNode } from '@tealina/doc-types'
import { DocKind } from '@tealina/doc-types'

export function type2cell(d: DocNode): ReactElement {
    // 每个节点都有属性 DocNode,方便使用switch case 
  switch (d.kind) {
    
    case DocKind.Primitive:
      return <ColorText type={d.type}>{d.type}</ColorText>

    case DocKind.Union:
        // 递归调用
      return <>{injectDivider(d.types.map(t => type2cell(t, doc)))}</>
    
    case DocKind.Never:
      return <ColorText type="any">never</ColorText>

    case DocKind.StringLiteral:
      return <ColorText type="string">"{d.value}"</ColorText>
    // ...  
  }
}

```
### FAQ
####  返回值有多个状态码,类型如何声明?
  并没有直接的支持, 你可以通过其他方式:,
  1. 在注释中提及, (统一在拦截器中处理错误)
  ```ts
  /**
   * @return
   *  -500 descript about it
   */
  type ApiType=ApiHandler<Payload,Resonse>
  ```
  2. 状态码写进返回值内部
  ```ts
  type BaseResponse<T>={
    code: number
    data: T
  }
  interface NamedResponse extends BaseResponse<{code:200,data:{status:'ok'}}>{}
  type ApiType = ApiHandler<Payload,NamedResponse>
  ```
#### 文档中类型名称没有保留
  使用 `interface` 而不是 `type`, 名字会被保留
```ts
type UserType = TypeFromCalculationUnitily<{name:string}>

interface User extends UserType{}

type ApiType = ApiHandler<Payload, User>
//...
  ```
  ::: tip 推荐只在API文件中使用 `interface`
  :::


### More detail
::: code-group
``` ts [@tealina/doc-type/index.ts]
export const DocKind = { // more close to typescript
  /** eg: string,number */
  Primitive: 0,
  /** types that has method, eg: Date, File, Blob  */
  NonLiteralObject: 1,
  Tuple: 2,
  Union: 3,
  EntityRef: 4,
  Never: 5,
  Record: 6,
  StringLiteral: 7,
  NumberLiteral: 8,
  EnumRef: 9,
  EnumMemberRef: 10,
  Array: 11,
  RecursionTuple: 12,
  RecursionEntity: 13,
} as const

export interface Kind {
  isOptional?: true
  comment?: string
  jsDoc?: Partial<Record<string, string>>
}

export interface PrimitiveType extends Kind {
  kind: DocKind['Primitive'] // every DocNode has a kind prop
  type: string
}

// ...

export type DocNode =
  | PrimitiveType
  | ObjectType
  | TupleType
  | UnionType
  | RefType
  | EnumRefType
  | EnumMemberRefType
  | RecordType
  | NumberLiteral
  | StringLiteral
  | NeverType
  | ArrayType
  | RecursionTuple
  | RecursionEntity

export interface DocItem {
  body?: DocNode 
  response?: DocNode
  query?: DocNode
  params?: DocNode
  headers?: DocNode
  comment?: string
}

type HttpMethod = string
type Endpoint = string
type Id = number

export interface ApiDoc {
  apis: Record<HttpMethod, Record<Endpoint, DocItem>>
  entityRefs: Record<Id, Entity>
  enumRefs: Record<Id, EnumEntity>
  tupleRefs: Record<Id, TupleEntity>
  /**
   * 文档版本,遵循标准语义化版本规则,
   * 格式: [major].[minor]
   *  */
  docTypeVersion: number
}

```
:::