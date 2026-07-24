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
      summonHint: '点击空白处，继续投喂小獭',
      scrollHint: '向下滑动',
      gyroHint: '重力感应已开启，晃晃手机试试',
      captions: ['稍后再看', 'Mark一下', '灵感链接', '心动瞬间'],
    },
    intro: {
      title: 'Tunta 屯獭',
      tagline: '让积灰的收藏重新可用。',
      description:
        'Tunta 面向收藏了大量视频、文章和链接，却很少能再次找到并使用它们的人。它把散落在不同平台的收藏，转成可回看、可检索、可复用，而且始终能回到原始证据的材料。',
      primaryCta: '立即下载',
      secondaryCta: '了解一下',
    },
    features: {
      heading: '核心功能',
      items: [
        {
          icon: 'capture',
          title: '收藏 Capture',
          description: '保存、收藏、记录。在你收藏之时就拦截下你的囤积行为。',
        },
        {
          icon: 'review',
          title: '回看 Review',
          description: '把收藏内容重新呈现为简短卡片。一百年太长，只看一眼。',
        },
        {
          icon: 'recall',
          title: '调用 Recall',
          description: '用关键词或自然语言检索本地收藏库。你确实没看，但知识还是你的。',
        },
      ],
      statusLabel: '项目状态',
      status: 'Tunta 当前处于Demo阶段，欢迎PR！',
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
      scrollHint: 'scroll down',
      gyroHint: 'Tilt control on — shake your phone a little',
      captions: ['Watch later', 'Bookmarked', 'Inspiration', 'Favorite'],
    },
    intro: {
      title: 'Tunta',
      tagline: 'Make dusty bookmarks useful again.',
      description:
        'Tunta is for people who save loads of videos, articles, and links but rarely find and reuse them again. It turns bookmarks scattered across platforms into material you can review, search, and reuse — always traceable back to the original source.',
      primaryCta: 'Download now',
      secondaryCta: 'Learn more',
    },
    features: {
      heading: 'Core features',
      items: [
        {
          icon: 'capture',
          title: 'Capture',
          description: 'Save, bookmark, jot it down. Catch your hoarding habit the very moment you save.',
        },
        {
          icon: 'review',
          title: 'Review',
          description: 'Resurface saved content as short cards. A hundred years is too long — just take a glance.',
        },
        {
          icon: 'recall',
          title: 'Recall',
          description: 'Search your local library with keywords or natural language. You never did read it, but the knowledge is still yours.',
        },
      ],
      statusLabel: 'Status',
      status: 'Tunta is currently in the demo stage — PRs welcome!',
    },
    footer: {
      text: 'Tunta — Make dusty bookmarks useful again.',
      note: 'Local-first · No history scanning · Always back to the source',
    },
  },
}
