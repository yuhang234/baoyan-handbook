<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import ChapterBanner from './components/ChapterBanner.vue'
import ChapterCardGrid from './components/ChapterCardGrid.vue'
import ArticleMeta from './components/ArticleMeta.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isChapterLanding = computed(() => {
  if (frontmatter.value.order === 100) return true
  return /\/ch0\d-[^/]+\/($|index(\.html)?$)/.test(route.path)
})

const isArticle = computed(() => {
  return frontmatter.value.order != null && Number(frontmatter.value.order) >= 101
})
</script>

<template>
  <Layout :class="{ 'is-chapter-landing': isChapterLanding, 'is-article': isArticle }">
    <template #doc-before>
      <ChapterBanner v-if="isChapterLanding" />
      <ArticleMeta v-if="isArticle" />
    </template>
    <template #doc-footer-before>
      <ChapterCardGrid v-if="isChapterLanding" />
    </template>
  </Layout>
</template>
