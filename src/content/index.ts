// Tunta Expo — Site Content (bilingual, per AGENTS.md §7)
import type { Lang, SiteContent } from '../types'

/**
 * Outbound links. Not per-language.
 *
 * NOTE: the contract sources live in the private `AdvX26-moyushuang/Tunta`
 * repo, so this points at the public mirror of the docs for now. Switch it to
 * the main repo once that one is public.
 */
export const links = {
  contract: 'https://github.com/AdvX26-moyushuang/tunta.xyz/blob/main/tunta-README.md#校验合同',
  repo: 'https://github.com/AdvX26-moyushuang/tunta.xyz',
} as const

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
    // 屏 1 · Hero
    intro: {
      title: 'Tunta 屯獭',
      tagline: '收藏不难，找回来才难。',
      description:
        'Tunta 把散在 B 站、网页、各个平台的收藏，变成能被检索、能被复用、并且永远能回到原文那一秒的材料。',
      note: '本地优先。AI 不替你判断，它只负责把路铺回原文。',
      primaryCta: '看看它怎么工作',
      secondaryCta: '阅读接口合同',
    },
    // 屏 2 · 问题
    problem: {
      heading: '你不是没存过，你是再也没找到。',
      paragraphs: [
        '那条把某件事讲透了的视频，你当时点了收藏。半年后你需要它，只记得「大概是个讲这个的 up 主」。搜索框帮不了你——你搜的是意思，收藏夹存的是标题。',
        '于是收藏夹变成了一个只进不出的地方。存的时候有安全感，用的时候找不到，最后连自己存过什么都不知道。',
      ],
      closing: '问题不在存得不够多，在于存下来的东西没有被做成「可以被找回的形状」。',
    },
    // 屏 3 · 一次取回（核心屏）
    retrieval: {
      heading: '从一个模糊的问题，回到原文的那一秒。',
      ask: {
        step: '分镜一',
        label: '你问的',
        question: '之前看过一个讲「用户调研为什么问不出真需求」的东西',
        note: '用日常语言问，不用记标题，不用记 up 主。',
      },
      answer: {
        step: '分镜二',
        label: '它给的',
        badge: '示例',
        cardTitle: '用户说的需求，往往是他自己设计的解法',
        cardBody:
          '受访者会把「我想要一匹更快的马」当成需求陈述，但那已经是他给出的方案。要问的是他上一次在什么场景下卡住了。',
        source: '📺 示例来源视频 · 12:47',
        cardCta: '回到原文',
        note: '每张卡片都是从原始材料里长出来的，不是模型凭印象写的。',
      },
      verify: {
        step: '分镜三',
        label: '你验的',
        body: '点开就是那个视频的 12:47，字幕高亮在卡片对应的那句话上。',
        note: '你不需要相信这张卡，你可以直接去看它从哪来。',
      },
      closing: '这是 Tunta 唯一不肯让步的地方：任何一句话，都能被追回到它的出处。',
    },
    // 屏 4 · 那只獭
    mascot: {
      heading: '它不是装饰，它是进度条。',
      paragraphs: [
        '处理一个链接会经过几个阶段，任何一步都可能失败。大部分工具选择把这段藏起来，转圈，然后给你一个结果——你不知道它是抓到了、抓漏了，还是编了一段。',
        'Tunta 把这段摊开在桌面上。獭在做什么，就是系统在做什么。',
      ],
      states: [
        { key: 'idle', label: '闲着', description: '没有任务，它在睡觉' },
        { key: 'fetching', label: '抓取中', description: '正在取原始内容' },
        { key: 'parsing', label: '解析中', description: '正在把内容拆成可检索的单元' },
        { key: 'done', label: '完成', description: '卡片已生成，可以回看了' },
        {
          key: 'failed',
          label: '失败了',
          description: '它会告诉你卡在哪一步、为什么，而不是给你一个看起来还行的空结果',
        },
      ],
      closing: '失败要看得见，才有人敢信成功。',
    },
    // 屏 5 · 我们拒绝了什么
    refusals: {
      heading: '比做了什么更能说明我们是谁的，是没做什么。',
      lead: '在这个方向上，能加的功能是无限的。第一版我们只留下了「存下来—能找回—能验证」这一条闭环，其余全部砍掉：',
      items: [
        { title: '不扫描你的浏览历史', detail: '只有你主动收藏的那一条会被读取' },
        { title: '不保存平台 Cookie、账号或私有收藏夹', detail: '我们不需要，也不想要' },
        { title: '不自动导入你全部的历史收藏', detail: '一次性倒进来的三千条，只是换个地方积灰' },
        { title: '不做知识图谱大屏', detail: '好看，但它解决不了「我现在需要那条视频」' },
        { title: '不做宠物养成', detail: '獭负责让状态可见，不负责占用你的时间' },
        {
          title: '不在你不知情时下载媒体',
          detail: '需要本地转写时会先问你，并告诉你要多久、占多少空间',
        },
      ],
      closing: '第一版的目标不是功能最多，是每一条能用的路径都真的走得通。',
    },
    // 屏 6 · 现在做到哪
    progress: {
      heading: '我们先把边界谈定了。',
      paragraphs: [
        'Tunta 由三个可以独立演进的部分组成：抓取解析、检索与卡片生成、桌面应用。它们之间不共享内部实现，只通过带版本号的接口合同通信。',
        '我们先写完并锁定了两道合同：抓取到理解、理解到应用。合同附带校验器，任何一张生成的卡片，只要断掉了回到原始出处的链路，校验就不通过。',
      ],
      statusLine: '当前状态：产品定义与接口合同阶段，桌面应用尚未开放安装。',
      cta: '阅读接口合同与校验器',
    },
    footer: {
      text: 'Tunta · 让你存过的东西，在你需要的时候还在。',
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
