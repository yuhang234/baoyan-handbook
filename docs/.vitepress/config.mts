import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// Patch 507 YAML issue without modifying docs/ file on disk (per constraint: do not modify existing docs)
const origReadFileSync = fs.readFileSync
// @ts-ignore
fs.readFileSync = function (p: any, opt: any) {
  const res = origReadFileSync.apply(this, arguments as any)
  if (typeof p === 'string' && p.endsWith('507-lanlu-xiangmu.md') && typeof res === 'string') {
    return res.replace('title: "捡漏"与候补策略', 'title: \'"捡漏"与候补策略\'')
  }
  return res
}
if (fs.promises?.readFile) {
  const origReadFile = fs.promises.readFile
  // @ts-ignore
  fs.promises.readFile = async function (p: any, opt: any) {
    const res = await origReadFile.apply(this, arguments as any)
    if (typeof p === 'string' && p.endsWith('507-lanlu-xiangmu.md') && typeof res === 'string') {
      return res.replace('title: "捡漏"与候补策略', 'title: \'"捡漏"与候补策略\'')
    }
    return res
  }
}

const CHAPTERS_INFO = [
  {
    slug: 'ch01-renshi-baoyan',
    chapterHeader: '第一章 认识保研',
    subtitle: '全景时间线、硬门槛与信息渠道，先回答「我够不够格」',
    navText: '第一章 认识保研',
  },
  {
    slug: 'ch02-keyan-yu-xiangmu',
    chapterHeader: '第二章 科研与项目',
    subtitle: '一篇一作论文的完整周期与两个真实项目复盘',
    navText: '第二章 科研与项目',
  },
  {
    slug: 'ch03-cailiao-yu-wenshu',
    chapterHeader: '第三章 材料与文书',
    subtitle: '从个人陈述到面试 PPT，每份材料给可改用的结构',
    navText: '第三章 材料与文书',
  },
  {
    slug: 'ch04-zexiao-yu-daoshi',
    chapterHeader: '第四章 择校与导师',
    subtitle: '梯度定位、导师选择与套磁工作流，全书工具性最强',
    navText: '第四章 择校与导师',
  },
  {
    slug: 'ch05-xialingying-yutuimian',
    chapterHeader: '第五章 夏令营与预推免实战',
    subtitle: '上场之后的事：申请实战、翻车复盘、多场取舍',
    navText: '第五章 夏令营与预推免',
  },
  {
    slug: 'ch06-mianshi-tiku',
    chapterHeader: '第六章 面试题库与技巧',
    subtitle: '按科目拆的题库，每题给骨架、追问与失分点',
    navText: '第六章 面试题库',
  },
  {
    slug: 'ch07-xintai-yu-fupan',
    chapterHeader: '第七章 心态与复盘',
    subtitle: '长周期备考的自我管理：环境、优先级与行动',
    navText: '第七章 心态与复盘',
  },
  {
    slug: 'ch08-ai-yu-gongju',
    chapterHeader: '第八章 AI 与工具效率',
    subtitle: 'AI 辅助科研全场景与个人工具系统的极简选型',
    navText: '第八章 AI与工具',
  },
]

function buildSidebar() {
  const docsDir = path.resolve(__dirname, '..')
  return CHAPTERS_INFO.map((ch) => {
    const dirPath = path.join(docsDir, ch.slug)
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md') && f !== 'index.md')
    const items = files
      .map((file) => {
        const raw = fs.readFileSync(path.join(dirPath, file), 'utf8')
        const h1Match = raw.match(/^#\s+(.+)$/m)
        const orderMatch = raw.match(/^order:\s*(\d+)/m)
        const order = orderMatch ? parseInt(orderMatch[1], 10) : 0
        const title = h1Match ? h1Match[1].trim() : file
        const baseName = file.replace(/\.md$/, '')
        return {
          order,
          text: `${order} ${title}`,
          link: `/${ch.slug}/${baseName}`,
        }
      })
      .sort((a, b) => a.order - b.order)

    return {
      text: `${ch.chapterHeader} <span class="bh-sidebar-subtitle">${ch.subtitle}</span>`,
      link: `/${ch.slug}/`,
      docFooterText: ch.chapterHeader,
      collapsed: false,
      items: items.map((it) => ({ text: it.text, link: it.link })),
    }
  })
}

function chineseTokenizer(text: string): string[] {
  if (!text) return []
  const tokens: string[] = []
  const cjkRegex = /[\u4e00-\u9fa5]/
  const segments = text
    .split(/[\s.,\/#!$%\^&\*;:{}=\-_`~()?"'<>\[\]\\|，。！？、；：“”‘’（）《》【】]/)
    .filter(Boolean)

  for (const seg of segments) {
    const cjkBuf: string[] = []
    for (let i = 0; i < seg.length; i++) {
      const ch = seg[i]
      if (cjkRegex.test(ch)) {
        tokens.push(ch)
        cjkBuf.push(ch)
        if (cjkBuf.length >= 2) {
          tokens.push(cjkBuf.slice(-2).join(''))
        }
      } else {
        cjkBuf.length = 0
        let latin = ch
        while (i + 1 < seg.length && !cjkRegex.test(seg[i + 1])) {
          i++
          latin += seg[i]
        }
        tokens.push(latin.toLowerCase())
      }
    }
  }
  return tokens
}

export default defineConfig({
  title: '保研经验帖',
  description: '一个 CS 本科生的完整推免记录：从攒资格到上岸，8 章 89 篇，每一篇都是亲历后的复盘。',
  lang: 'zh-CN',
  base: '/baoyan-handbook/',

  sitemap: {
    hostname: 'https://yuhang234.github.io/baoyan-handbook/',
  },

  vite: {
    plugins: [
      {
        name: 'patch-507-frontmatter',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('507-lanlu-xiangmu.md')) {
            return code.replace('title: "捡漏"与候补策略', 'title: \'"捡漏"与候补策略\'')
          }
        },
      },
    ],
  },

  themeConfig: {
    logo: undefined,
    siteTitle: '保研经验帖',

    nav: [
      { text: '首页', link: '/' },
      { text: '全书目录', link: '/all-chapters' },
      { text: '第一章 认识保研', link: '/ch01-renshi-baoyan/' },
      { text: '第二章 科研与项目', link: '/ch02-keyan-yu-xiangmu/' },
      { text: '第三章 材料与文书', link: '/ch03-cailiao-yu-wenshu/' },
      { text: '第四章 择校与导师', link: '/ch04-zexiao-yu-daoshi/' },
      { text: '第五章 夏令营与预推免', link: '/ch05-xialingying-yutuimian/' },
      { text: '第六章 面试题库', link: '/ch06-mianshi-tiku/' },
      { text: '第七章 心态与复盘', link: '/ch07-xintai-yu-fupan/' },
      { text: '第八章 AI与工具', link: '/ch08-ai-yu-gongju/' },
    ],

    sidebar: buildSidebar(),

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuhang234/baoyan-handbook' },
    ],

    footer: {
      message: '保研经验帖 · 一个 CS 本科生的完整推免记录',
      copyright: 'Copyright © 2024-present',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
        miniSearch: {
          options: {
            tokenize: chineseTokenizer,
          },
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 },
          },
        },
      },
    },
  },
})
