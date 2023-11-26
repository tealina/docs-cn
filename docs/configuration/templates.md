编写CRUD的时候, 大部分代码在起步阶段都是一样的, 所以, 我们可以制定一些模版.

脚手架项目自带了一些模版,你可以修改它
::: code-group
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
```js [tealina.config.mjs]
// @ts-check
import { defineConfig } from 'tealina'
import apiTemplates from './dev-templates/handlers/index.mjs'
import { genTestSuite, genTestHelper } from './dev-templates/test/index.mjs'

export default defineConfig({
  template: {
    handlers: apiTemplates,
    test: {
      genSuite: genTestSuite,
      genHelper: genTestHelper,
    },
  },
})
```
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

::: tip
当你执行 `v1 capi user c`, Tealina 会通过别名 c 找到对应的模版, 使用模版名称作为文件名, 调用 generateFn 获得文件内容, 写入到API文件.