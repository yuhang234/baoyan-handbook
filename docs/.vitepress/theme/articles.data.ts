import fs from 'node:fs'
import path from 'node:path'

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

export default {
  watch: ['../../ch*/*.md'],
  load(): ArticleItem[] {
    const docsDir = path.resolve(__dirname, '../../')
    const chapters = fs.readdirSync(docsDir).filter((f) => f.startsWith('ch') && fs.statSync(path.join(docsDir, f)).isDirectory())
    const results: ArticleItem[] = []

    for (const ch of chapters) {
      const chDir = path.join(docsDir, ch)
      const files = fs.readdirSync(chDir).filter((f) => f.endsWith('.md') && f !== 'index.md')
      for (const f of files) {
        const full = path.join(chDir, f)
        const content = fs.readFileSync(full, 'utf8')
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        let title = ''
        let description = ''
        let chapter = ''
        let order = 0
        let type = '综合'

        if (fmMatch) {
          const t = fmMatch[1].match(/^title:\s*(.+)$/m)
          if (t) title = t[1].trim().replace(/^["']|["']$/g, '')
          const d = fmMatch[1].match(/^description:\s*(.+)$/m)
          if (d) description = d[1].trim().replace(/^["']|["']$/g, '')
          const c = fmMatch[1].match(/^chapter:\s*(.+)$/m)
          if (c) chapter = c[1].trim().replace(/^["']|["']$/g, '')
          const o = fmMatch[1].match(/^order:\s*(\d+)/m)
          if (o) order = parseInt(o[1], 10)
          const ty = fmMatch[1].match(/^type:\s*(.+)$/m)
          if (ty) type = ty[1].trim()
        }

        const baseName = f.replace(/\.md$/, '')
        results.push({
          url: `/${ch}/${baseName}.html`,
          order,
          title,
          description,
          chapter,
          type,
        })
      }
    }

    return results.sort((a, b) => a.order - b.order)
  },
}
