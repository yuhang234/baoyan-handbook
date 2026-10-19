<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const chapterDisplay = computed(() => {
  if (!frontmatter.value.chapter) return ''
  // e.g. "第四章 择校与导师" -> "第四章"
  const parts = String(frontmatter.value.chapter).split(/\s+/)
  return parts[0] || frontmatter.value.chapter
})

function tagClass(type: string) {
  if (type === '综合') return 'bh-tag-synthesis'
  if (type === '经历') return 'bh-tag-experience'
  return 'bh-tag-mixed'
}
</script>

<template>
  <div v-if="frontmatter.order && frontmatter.order >= 101" class="bh-article-meta">
    <span class="bh-meta-chapter">
      {{ chapterDisplay }} · {{ frontmatter.order }}
    </span>
    <span v-if="frontmatter.type" class="bh-tag" :class="tagClass(frontmatter.type)">
      {{ frontmatter.type }}
    </span>
  </div>
</template>
