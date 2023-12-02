在创建API的时候, Tealina 只知道最终的文件路径, 文件内的具体代码, 是通过自定义模版填充的.

## 模版即函数
一个接收上下文, 返回字符串的js函数.
为了更方便的定制模版, Tealina 提供了一个`makeTeamplate`的辅助函数, 

::: details 示例代码
```js [dev-templates/genCreateCode.mjs]
// @ts-check
import { makeTemplate } from 'tealina'
export default makeTemplate(({ Dir: Model, relative2api, dir: model }) => {
  // Feel free to change it
  const imps = [
    `import type { AuthedHandler } from '${relative2api}/../types/handler.js'`,
    `import type { Pure } from '${relative2api}/../types/pure.js'`,
    `import { convention } from '${relative2api}/convention.js'`,
    `import { db } from '${relative2api}/db/prisma.js'`,
  ]
  const codes = [
    `type ApiType = AuthedHandler<{ body: Pure.${Model}CreateInput }, Pure.${Model}>`,
    '',
    `/** Create ${Model} */`,
    `const handler: ApiType = async (req, res) => {`,
    `  const result = await db.${model}.create({`,
    '    data: req.body,',
    '  })',
    '  res.send(result)',
    '}',
    '',
    `export default convention(handler)`,
  ]
  return [...imps, '', ...codes].join('\n')
})

```
:::

## 定义多个模版
可以为不同的 http-method 或按名称定义多个模版, 组成一个js数组, Tealina 也提供了 `definedApiTemplates` 辅助函数.
```js [dev-templates/index.mjs]
// @ts-check
import genCreateCode from './genCreateCode.mjs'
import genBasicCode from './genBasicCode.mjs'
import { defineApiTemplates } from 'tealina'

export default defineApiTemplates([
  {
    alias: 'c',
    name: 'create',
    method: 'post',
    generateFn: genCreateCode,
  },
  ...
  {
    alias: '*', //fallback
    name: '',
    method: 'post',
    generateFn: genBasicCode,
  },
])
```

::: tip
当执行 `v1 user -t c`, Tealina 会通过别名 c 找到对应的模版, 使用模版名称作为文件名, 调用 generateFn 获得文件内容, 写入到API文件.
:::

## 注册到配置文件
```js [tealina.config.mjs]
// @ts-check
import { defineConfig } from 'tealina'
import apiTemplates from './dev-templates/handlers/index.mjs'
import { genTestSuite } from './dev-templates/test/index.mjs'

export default defineConfig({
  template: {
    handlers: apiTemplates,
    test: {
      genSuite: genTestSuite,
    },
  },
})
```

## 类型
::: details 详细定义
```ts [template.d.ts]
interface TemplateContext {
  dir?: string
  /** captialized directory name */
  Dir?: string
  filename: string
  /** captialized filename */
  Filename: string
  relative2api: string
  /** http method */
  method: string
}

type CodeGenerateFnType = (ctx: TemplateContext) => string

interface ApiTemplateType {
  /**
   * 名称缩写.\
   * 一个字符,大小写敏感.\
   * `*` 用于 当 name 和 alias 都没有匹配到的时候
   */
  alias: string
  /**
   * 用作文件名,如果为空字符,文件名是路由中的最后一段.
   */
  name: string
  /**
   * Http Method
   * @default 'post'
   */
  method?: string
  /** Code generate function */
  generateFn: CodeGenerateFnType
}
```
:::