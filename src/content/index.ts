// Tunta Expo — Chinese site content
import type { SiteContent } from '../types'

/** Public project links. */
export const links = {
  repo: 'https://github.com/AdvX26-moyushuang/Tunta',
} as const

export const content: SiteContent = {
    nav: {
      ariaLabel: '主要导航',
      brand: 'Tunta 屯獭',
      walkthrough: '怎么工作',
      status: 'MVP',
      repository: 'GitHub',
    },
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
    // 屏 1 · Hero — 给谁、解决什么、结果是什么，外加一个符合阶段的 CTA
    intro: {
      title: 'Tunta 屯獭',
      tagline: '收藏不难，找回来才难。',
      audience: '写给收藏夹里躺着几百条网页和视频、记得内容讲了什么、却想不起标题和作者的人。',
      description:
        'Tunta 把你主动存下的网页、B 站视频和小红书笔记，转成可以用一句话问回来的卡片。你描述那件事，它把你带回原文的那一段、那一秒。',
      note: '本地优先。AI 不替你判断，它只负责把路铺回原文。',
      ctas: [
        { label: '看一次真实取回', href: '#retrieval', variant: 'primary' },
        { label: '看 MVP 进度', href: '#status', variant: 'secondary' },
        { label: 'GitHub', href: links.repo, variant: 'ghost', external: true },
      ],
      statusNote:
        '浏览器插件已经能跑通完整闭环，但还没上架商店——现在需要自己 build 后加载。下面是它实际怎么工作的。',
    },
    // 屏 2 · 问题
    problem: {
      heading: '你一存再存    \n却再也没找到',
      paragraphs: [
        '那条把某件事讲透了的视频，你当时点了收藏。半年后你需要它，只记得「大概是个讲这个的 up 主」。搜索框帮不了你——你搜的是意思，收藏夹存的是标题。',
        '于是收藏夹变成了一个只进不出的地方。存的时候有安全感，用的时候找不到，最后连自己存过什么都不知道。',
      ],
      closing: '问题不在存得不够多，在于你需要这个灵感的时候，那些内容能否主动地站出来。',
    },
    // 屏 3 · 一次取回（核心屏）
    retrieval: {
      heading: '从一个模糊的问题   \n回到原文',
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
        source: ' ',
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
    // 屏 4 · 三个坚持（差异点：不是「AI 帮你整理」，是「任何回答都能追回原文」）
    principles: {
      heading: 'Tunta 的\n三个坚持',
      lead: '功能可以慢慢加。这三条从第一版开始就不打算让步。',
      items: [
        {
          title: '任何一句话都能追回原文',
          detail:
            '卡片不是模型凭印象写的，是从原始材料里长出来的。每张卡都留着原文片段、定位和原始 URL——追不回去的内容，不会成为卡片。',
        },
        {
          title: '默认留在你自己的机器上',
          detail:
            '收藏记录、原文快照、卡片和问答历史都存在浏览器本地。不需要注册账号，我们也没有服务器收你的数据——只有生成卡片和问答这两步，会走你自己配置的模型服务。',
        },
        {
          title: '只处理你主动存的那一条',
          detail:
            '不扫描浏览历史，不碰登录态和私有收藏夹，也不替你把三千条旧收藏一次性倒进来。',
        },
      ],
      closing: '别人做的是「AI 帮你整理」。Tunta 做的是「任何一个回答，你都能自己去验」。',
    },
    // 屏 5 · 那只獭
    mascot: {
      heading: '獭獭不是装饰 ',
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
      closing: '屯獭不只是我们对icon的具象化，也是我们对囤积Agent的美好IP设想，我们相信它会长大。',
    },
    // 屏 6 · 支持范围（现在能吃什么、跑在哪、失败长什么样）
    scope: {
      heading: '现在支持到哪一步',
      lead: '不写路线图，只写现在按下收藏会发生什么。做不到的部分，插件里也会明着标出来。',
      items: [
        {
          state: 'supported',
          title: '普通网页',
          detail: '在你当前打开的这个标签页做一次快照，抓正文并按段落拆成可检索的单元。',
        },
        {
          state: 'supported',
          title: 'B 站视频',
          detail:
            '字幕优先，含 AI 字幕。字幕里的时间戳就是你之后跳回那一秒的坐标；实在没有字幕，会降级只收标题、简介和 UP 主，并标注「完整转写需要 helper」。',
        },
        {
          state: 'supported',
          title: 'B 站收藏夹 / 稍后再看',
          detail:
            '在列表页收藏，会把子项目逐条拆开独立入库，各走各的流水线。单次上限 20 条，已经在库里的自动跳过。',
        },
        {
          state: 'partial',
          title: '小红书公开笔记',
          detail:
            '只处理你当前打开的那一条公开笔记，读可见的正文、作者和发布时间。图片、视频和 OCR 还没做，抓不到时会给你一个明确的 warning，而不是拿页面杂项文本凑一段。',
        },
        {
          state: 'planned',
          title: '无字幕视频的本地 Whisper 转写',
          detail:
            '需要额外装一个本地 helper，目前还没实现。做出来之后，下载媒体前会先问你，并告诉你大概要多久、占多少空间。',
        },
        {
          state: 'out',
          title: '需要登录才能看的内容',
          detail:
            '不做。不读 Cookie、不碰账号信息和私有收藏夹——小红书那条也只走公开 DOM，不调登录态接口。',
        },
        {
          state: 'out',
          title: 'PDF、播客、电商页面',
          detail: '暂不支持。与其做五种半成品，不如先把手上这几类做到能验证。',
        },
      ],
      runtime: {
        label: '跑在哪',
        body: '默认是「插件独立模式」：不装任何 helper，收藏、快照、卡片生成、检索和问答都在浏览器里跑完，数据存本地 IndexedDB。卡片生成和问答需要你在设置页填一个模型服务的 API key，key 只存本机。安装时不申请全站授权——收藏新站点时才在你的点击动作里按域名单独申请，随时可以在扩展页撤销。',
      },
      failure: {
        label: '出错的时候你会看到什么',
        body: '卡在哪一步、什么错误、来源是哪条，idle / fetching / parsing / done / failed 五个状态全程可见。provider 没配好或调用失败就直接报错——不会给你一段伪造的摘要，也不会写入伪造的向量。',
      },
    },
    // 屏 7 · 我们拒绝了什么
    refusals: {
      heading: '比做了什么更能说明我们是谁的是没做什么',
      lead: '在这个方向上，能加的功能是无限的。第一版我们只留下了「存下来—能找回—能验证」这一条闭环，其余全部砍掉：',
      items: [
        { title: '不扫描你的浏览历史', detail: '只有你主动收藏的那一条会被读取' },
        { title: '不保存平台 Cookie、账号或私有收藏夹', detail: '我们不需要，也不想要' },
        { title: '不自动导入你全部的历史收藏', detail: '一次性倒进来的三千条，只是换个地方积灰' },
        { title: '不做宠物养成', detail: '獭负责让状态可见，不负责占用你的时间' },
        {
          title: '不在你不知情时下载媒体',
          detail: '需要本地转写时会先问你，并告诉你要多久、占多少空间',
        },
      ],
      closing: '开源，简单，克制且坚持对用户的宜人性。',
    },
    // 屏 8 · 现在做到哪
    progress: {
      heading: '我们的 MVP 也相当克制',
      paragraphs: [
        'Tunta 的第一版只保留两个核心：浏览器插件，以及一个在本地处理内容的 helper。插件负责收下你主动收藏的内容，也承载卡片的整理、回看与检索；helper 负责抓取、解析和索引这些浏览器不适合承担的工作。',
        '我们暂时不做一个包办一切的桌面应用。MVP 只验证一条最短路径：一条链接能不能被整理成可回看的卡片，并在你需要时带着原始出处重新出现。',
      ],
      statusLine:
        '当前状态：插件独立模式已经跑通——收藏、快照、卡片生成、混合检索、问答和五态可见，全都不需要装 helper 就能在浏览器里跑完。helper 那条完整链路（Whisper 转写、SQLite）还在后面。还没上架，现在要自己 build 加载。',
    },
    // 屏 9 · FAQ（把「能不能用、数据放哪、和书签有什么区别」一次说完）
    faq: {
      heading: '你可能想先问清楚的',
      lead: '与其让你在正文里猜，不如直接摆出来。',
      items: [
        {
          question: '现在能装来用吗？',
          answer:
            '能，但要自己动手：clone 仓库、pnpm build，然后在浏览器扩展页开开发者模式，把 dist/ 作为未打包扩展加载。还没上架任何商店。默认的插件独立模式不需要另外装 helper。',
        },
        {
          question: '跑起来还需要配什么？',
          answer:
            '一个 Anthropic 兼容的模型服务 API key，在工作台的设置页填，只存在本机。不填也能收藏和存快照，但卡片生成和问答会明确报错——我们不会用一段伪摘要把这个洞填上。',
        },
        {
          question: '我的数据存在哪？',
          answer:
            '浏览器本地的 IndexedDB：收藏记录、原文快照、卡片和问答历史。设置页的「本机数据」可以一键清空知识库，provider 配置保留。',
        },
        {
          question: '会把我的收藏上传到你们的服务器吗？',
          answer:
            '我们没有服务器，也不收你的数据。但有一步要说清楚：生成卡片和问答时，相关内容会发给你自己配置的那家模型服务。这一步由你选择，也可以完全不配。除此之外，插件只在你主动点收藏的那一刻读当前页面，不扫描浏览历史。',
        },
        {
          question: '支持哪些来源？',
          answer:
            '普通网页、B 站视频（字幕优先）、B 站收藏夹和稍后再看的批量收藏，以及小红书的单条公开笔记（正文可以，图片和 OCR 还没做）。无字幕视频的本地 Whisper 转写需要额外的 helper，目前还没实现。需要登录才能看的内容不做。',
        },
        {
          question: '会不会一装上就要一堆权限？',
          answer:
            '不会。安装时不申请全站授权；只有你第一次收藏某个站点时，才在那次点击里按域名单独申请，之后可以在浏览器扩展页随时撤销。',
        },
        {
          question: 'AI 会不会编一段看起来对的话？',
          answer:
            '每张卡片的证据必须指向解析器实际拆出来的原文片段，追不回去的内容不会成为卡片。所以你不需要相信这张卡——你可以直接去看它从哪来。',
        },
        {
          question: '和书签、Notion、稍后读有什么不一样？',
          answer:
            '书签存的是标题，Tunta 存的是内容本身，所以你可以用「意思」去找。Notion 要你先建好结构再往里放，Tunta 不要求你整理。稍后读解决的是「读完」，Tunta 解决的是「半年后还能被翻出来用」。',
        },
        {
          question: '什么时候能像正常软件那样一键安装？',
          answer:
            '没有承诺日期。现在还在小规模验证阶段，上架前想先确认这条闭环真的经得起用。与其给一个会跳票的时间，不如把进度公开在仓库里，你随时能看到它走到哪一步。',
        },
      ],
    },
    // 屏 10 · 最终 CTA
    finalCta: {
      heading: '存过的东西，值得在你需要的时候还在',
      body: 'Tunta 还没上架，但那条闭环已经能自己跑一遍了——收藏、生成卡片、用一句话问回来、点开验原文。愿意折腾的话，现在就能装上试。',
      ctas: [
        { label: '看一次真实取回', href: '#retrieval', variant: 'primary' },
        { label: '去 GitHub 自己 build', href: links.repo, variant: 'secondary', external: true },
      ],
      note: '开源。没有等待名单，不收邮箱，不需要注册账号。',
    },
  footer: {
    text: 'Tunta · 让你存过的东西，在你需要的时候还在。',
    note: 'Local-first · 不扫描浏览历史 · 始终可回到原文',
  },
}
