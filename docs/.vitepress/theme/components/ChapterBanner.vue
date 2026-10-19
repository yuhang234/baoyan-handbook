<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const CHAPTERS_MAP: Record<string, { num: string; title: string; sub: string }> = {
  'ch01-renshi-baoyan': { num: '第一章', title: '认识保研', sub: '全景时间线、硬门槛与信息渠道，先回答「我够不够格」' },
  'ch02-keyan-yu-xiangmu': { num: '第二章', title: '科研与项目', sub: '一篇一作论文的完整周期与两个真实项目复盘' },
  'ch03-cailiao-yu-wenshu': { num: '第三章', title: '材料与文书', sub: '从个人陈述到面试 PPT，每份材料给可改用的结构' },
  'ch04-zexiao-yu-daoshi': { num: '第四章', title: '择校与导师', sub: '梯度定位、导师选择与套磁工作流，全书工具性最强' },
  'ch05-xialingying-yutuimian': { num: '第五章', title: '夏令营与预推免实战', sub: '上场之后的事：申请实战、翻车复盘、多场取舍' },
  'ch06-mianshi-tiku': { num: '第六章', title: '面试题库与技巧', sub: '按科目拆的题库，每题给骨架、追问与失分点' },
  'ch07-xintai-yu-fupan': { num: '第七章', title: '心态与复盘', sub: '长周期备考的自我管理：环境、优先级与行动' },
  'ch08-ai-yu-gongju': { num: '第八章', title: 'AI 与工具效率', sub: 'AI 辅助科研全场景与个人工具系统的极简选型' },
}

const route = useRoute()
const chapterData = computed(() => {
  for (const [key, val] of Object.entries(CHAPTERS_MAP)) {
    if (route.path.includes(`/${key}/`)) {
      return val
    }
  }
  return null
})
</script>

<template>
  <div v-if="chapterData" class="bh-chapter-banner">
    <div class="bh-banner-num">{{ chapterData.num }}</div>
    <div class="bh-banner-title">{{ chapterData.title }}</div>
    <div class="bh-banner-sub">{{ chapterData.sub }}</div>
  </div>
</template>
