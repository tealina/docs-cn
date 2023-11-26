---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Tealina"
  text: "一个用于构建端到端类型安全API服务的CLI"
  tagline: 还有生成代码,类型,文档
  image:
    src: logo.svg
    alt: Tealina
  actions:
    - theme: brand
      text: 开始
      link: /guide
    - theme: alt
      text: 约定
      link: /conventions

features:
  - title: 端到端类型安全
    details: 无需在前端重复定义类型
  - title: API 文档
    details: 直接从代码中提取文档信息
  - title: 零运行时
    details: 仅需类型别名和少量约定
  - title: 文件即路由
    details: API路由与文件结构对齐
---

<script setup>
import serverMp4 from '/server.mp4?url'
import webMp4 from '/web.mp4?url'
</script>

<div style="height:1rem"></div>
<div class="vp-doc" style="padding-left:10%;padding-right:10%">

  # 通过命令行生成代码,类型,文档
  <div style="height:.4rem"></div>
  <video :src="serverMp4" muted loop controls/>

  <div style="height:2rem"></div>

  # 端到端类型
  <div style="height:.4rem"></div>
  <video :src="webMp4" muted loop controls/>
</div>