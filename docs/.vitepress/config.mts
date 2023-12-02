//@ts-check
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tealina',
  description: 'Tealina 官方文档',
  lang:'zh',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: 'https://tealina.dev/',
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      // { text: 'Commands', link: '/api' },
      // { text: 'Configration', link: '/config' },
      // { text: 'Family', link: '/family' },
    ],
    outline: {
      label: '本页目录',
    },
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '开始使用', link: '/guide' },
          { text: '为什么', link: '/why' },
          { text: '实现原理', link: '/how-it-work' },
          { text: '约定', link: '/conventions' },
          // { text: 'Limitation', link: '/limitation' },
          {
            text: '命令行界面',
            link: '/commands/cli'
          },
        ],
      },
      

      {
        text: '配置',
        items: [
          { text: '模版', link: '/configuration/templates' },
          { text: '类型生成', link: '/configuration/gtype' },
          { text: '多个API目录', link: '/configuration/multiple-api-dir' },
        ]
      },
      {
        text: '家族',
        items: [
          { text: '@tealina/doc-ui', link: '/family/doc-ui' },
          { text: '@tealina/doc-types', link: '/family/doc-types' },
        ]
      },
      {
        text: '边界情况',
        link: '/edgecase'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tealina/tealina' },
    ],
  },
})
