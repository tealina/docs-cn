//@ts-check
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tealina',
  description: 'Tealina 官方文档',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '指引', link: '/guide' },
      // { text: 'Commands', link: '/api' },
      // { text: 'Configration', link: '/config' },
      // { text: 'Family', link: '/family' },
    ],
    sidebar: [
      {
        text: '指引',
        items: [
          { text: '开始使用', link: '/guide' },
          { text: '为什么选择Tealina?', link: '/why' },
          { text: '实现原理?', link: '/how-it-work' },
          { text: '约定', link: '/conventions' },
          // { text: 'Limitation', link: '/limitation' },
      
      ],
      },
      {
        text: '命令行',
        items: [
          { text: 'capi', link: '/commands/capi' },
          { text: 'dapi', link: '/commands/dapi' },
          { text: 'sapi', link: '/commands/sapi' },
          { text: 'gpure', link: '/commands/gpure' },
          { text: 'gdoc', link: '/commands/gdoc' },
        ],
      },
      {
        text:'配置',
        items:[
          {text:'代码生成',link:'/configuration/templates'},
          {text:'类型生成',link:'/configuration/gpure'},
        ]
      },
      {
        text:'设置',
        items:[
          {text:'路由注册',link:'/configuration/router-registe'},
          {text:'多个api目录',link:'/configuration/multiple-api-dir'},
        ]
      },
      {
        text:'家族',
        items:[
          {text:'@tealina/doc-ui',link:'/family/doc-ui'},
          {text:'@tealina/doc-types',link:'/family/doc-types'},
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tealina/tealina' },
    ],
  },
})
