import { createContentLoader } from 'vitepress'

export interface ArticleItem {
  url: string
  order: number
  title: string
  description: string
  chapter: string
  type: string
}

declare const data: ArticleItem[]
export { data }

export default createContentLoader('ch*/*.md', {
  includeSrc: false,
  render: false,
  transform(rawData): ArticleItem[] {
    return rawData
      .filter((page) => page.frontmatter && page.frontmatter.order != null && Number(page.frontmatter.order) >= 101)
      .map((page) => ({
        url: page.url,
        order: Number(page.frontmatter.order),
        title: page.frontmatter.title || '',
        description: page.frontmatter.description || '',
        chapter: page.frontmatter.chapter || '',
        type: page.frontmatter.type || '综合',
      }))
      .sort((a, b) => a.order - b.order)
  },
})
