<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as articles } from '../articles.data'

const route = useRoute()

const currentArticles = computed(() => {
  const match = route.path.match(/\/(ch0\d-[^/]+)\//)
  if (!match) return []
  const chapterSlug = match[1]
  return articles.filter((a) => a.url.includes(`/${chapterSlug}/`))
})

function tagClass(type: string) {
  if (type === '综合') return 'bh-tag-synthesis'
  if (type === '经历') return 'bh-tag-experience'
  return 'bh-tag-mixed'
}
</script>

<template>
  <div v-if="currentArticles.length" class="bh-cards-grid">
    <a
      v-for="item in currentArticles"
      :key="item.url"
      :href="withBase(item.url)"
      class="bh-card-item"
    >
      <div class="bh-card-title">{{ item.order }} {{ item.title }}</div>
      <div class="bh-card-desc">{{ item.description }}</div>
      <div class="bh-card-footer">
        <span class="bh-tag" :class="tagClass(item.type)">{{ item.type }}</span>
      </div>
    </a>
  </div>
</template>
