// Tunta Expo — Site Content (bilingual, per AGENTS.md §7)
import type { Lang, SiteContent } from '../types'

export const content: Record<Lang, SiteContent> = {
  zh: {
    loading: {
      title: 'Tunta 屯獭',
      hint: '小獭正在清点收藏',
    },
    hero: {
      mascotAlt: 'Tunta 吉祥物小獭',
      dragHint: '拖一拖箱子和照片，陪小獭玩一会儿',
      clickHint: '点击小獭，让它一口吞掉这堆收藏',
      summonHint: '点一下空白处，还会掉新的下来',
      scrollHint: '向下滚动也可以',
      gyroHint: '重力感应已开启，晃晃手机试试',
      captions: ['稍后再看', '马克一下', '灵感链接', '心动瞬间'],
    },
    intro: {
      title: 'Tunta 屯獭',
      tagline: '让积灰的收藏重新可用。',
      description:
        'Tunta 面向收藏了大量视频、文章和链接，却很少能再次找到并使用它们的人。它把散落在不同平台的收藏，转成可回看、可检索、可复用，而且始终能回到原始证据的材料。',
      primaryCta: '看看工作流',
      secondaryCta: '项目状态',
    },
    features: {
      heading: '三条相连的工作流',
      items: [
        {
          icon: 'capture',
          title: '收藏 Capture',
          description: '从桌面或浏览器保存 URL，并随手记录为什么要收藏，入口始终可见。',
        },
        {
          icon: 'review',
          title: '回看 Review',
          description: '把收藏内容重新呈现为简短卡片，每张卡都能返回原始证据与上下文。',
        },
        {
          icon: 'recall',
          title: '调用 Recall',
          description: '用关键词或自然语言检索本地收藏库，获得带来源引用的回答。',
        },
      ],
      statusLabel: '项目状态',
      status: 'Tunta 当前处于产品定义与接口合同阶段，App 尚不可安装。',
    },
    footer: {
      text: 'Tunta 屯獭 — Make dusty bookmarks useful again.',
      note: 'Local-first · 不扫描浏览历史 · 始终可回到原文',
    },
  },
  en: {
    loading: {
      title: 'Tunta',
      hint: 'The otter is counting your bookmarks',
    },
    hero: {
      mascotAlt: 'Tunta mascot, the little otter',
      dragHint: 'Drag the boxes and photos around with the otter',
      clickHint: 'Click the otter to swallow the whole pile',
      summonHint: 'Click the empty space to drop a few more',
      scrollHint: 'or keep scrolling down',
      gyroHint: 'Tilt control on — shake your phone a little',
      captions: ['Watch later', 'Bookmarked', 'Inspiration', 'Favorite'],
    },
    intro: {
      title: 'Tunta',
      tagline: 'Make dusty bookmarks useful again.',
      description:
        'Tunta is for people who save useful videos, articles, and links but rarely find them again. It turns scattered bookmarks into source-grounded material that can be reviewed, searched, and reused.',
      primaryCta: 'See the workflows',
      secondaryCta: 'Project status',
    },
    features: {
      heading: 'Three connected workflows',
      items: [
        {
          icon: 'capture',
          title: 'Capture',
          description: 'Save a URL from the desktop or browser and record why it matters.',
        },
        {
          icon: 'review',
          title: 'Review',
          description: 'Resurface saved content as concise cards that always link back to evidence.',
        },
        {
          icon: 'recall',
          title: 'Recall',
          description: 'Search the local library with keywords or natural language and get source-cited answers.',
        },
      ],
      statusLabel: 'Status',
      status: 'Tunta is currently in the product-definition and interface-contract stage. The app is not installable yet.',
    },
    footer: {
      text: 'Tunta — Make dusty bookmarks useful again.',
      note: 'Local-first · No history scanning · Always back to the source',
    },
  },
}
