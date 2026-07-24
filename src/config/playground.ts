// Tunta Expo — Playground catalog
// 所有下落块（箱子 / 照片）的配置都集中在这里：尺寸、配色、数量、
// 物理材质、召唤批次。想调整手感或扩展新种类，改这个文件即可。
import photoArticle from '../assets/photo-article.png'
import photoLink from '../assets/photo-link.png'
import photoStar from '../assets/photo-star.png'
import photoVideo from '../assets/photo-video.png'
import type {
  PhysicsMaterial,
  PlaygroundItemSpec,
} from '../composables/usePhysicsPlayground'

// ---- 类型 ------------------------------------------------------------

export interface BoxTheme {
  /** 箱体填充色 */
  color: string
  /** 描边 / 胶带色（建议比填充色深一些） */
  edge: string
}

export interface PhotoEntry {
  image: string
  /** 指向 i18n hero.captions 数组的下标 */
  captionIndex: number
}

export interface PlaygroundTune {
  /** 尺寸基准：base = clamp(短边 / baseDivisor, baseMin, baseMax)，单位 px */
  baseDivisor: number
  baseMin: number
  baseMax: number
  /** 初始箱子数量：count = clamp(round(宽 × 高 / countDivisor), countMin, countMax) */
  countDivisor: number
  countMin: number
  countMax: number
  /** 箱子边长 = base × [min, max] 随机 */
  boxSize: [number, number]
  /** 箱子宽 = 边长 × [min, max] 随机 */
  boxWidth: [number, number]
  /** 箱子高 = 边长 × [min, max] 随机 */
  boxHeight: [number, number]
  /** 箱子长出卡通脸的概率（0-1） */
  faceChance: number
  /** 照片边长 = base × [min, max] 随机 */
  photoScale: [number, number]
  /** 拍立得高宽比（高 = 宽 × photoRatio） */
  photoRatio: number
  /** 点击空白召唤的每批数量：闭区间 [min, max] 随机整数 */
  summonBatch: [number, number]
  /** 每批中箱子被替换成照片的概率（0-1） */
  summonPhotoChance: number
  /** 召唤物围绕点击点的水平散布半径 px */
  summonSpread: number
  /** 同屏物件总数上限（性能保护） */
  maxItems: number
}

// ---- 可调参数 ----------------------------------------------------------

export const playgroundTune: PlaygroundTune = {
  baseDivisor: 13,
  baseMin: 30,
  baseMax: 56,
  countDivisor: 46000,
  countMin: 8,
  countMax: 13,
  boxSize: [0.8, 1.8],
  boxWidth: [0.9, 1.3],
  boxHeight: [0.7, 1.02],
  faceChance: 0.5,
  photoScale: [1.75, 2.0],
  photoRatio: 1.16,
  summonBatch: [2, 4],
  summonPhotoChance: 0.22,
  summonSpread: 90,
  maxItems: 127,
}

/** 箱子配色板，想换主题改这里（可随意增删） */
export const boxPalette: BoxTheme[] = [
  { color: '#f6c177', edge: '#cf8f3a' },
  { color: '#93c5fd', edge: '#5588dd' },
  { color: '#a7f3d0', edge: '#4fb98a' },
  { color: '#fda4af', edge: '#de6375' },
  { color: '#c4b5fd', edge: '#8a6fe0' },
  { color: '#fcd34d', edge: '#d9a011' },
  { color: '#fdba74', edge: '#d98236' },
  { color: '#99e9f2', edge: '#45b3c3' },
]

/** 混入堆里的照片；扩展新照片：导入图片后加一条记录即可 */
export const photoCatalog: PhotoEntry[] = [
  { image: photoVideo, captionIndex: 0 },
  { image: photoArticle, captionIndex: 1 },
  { image: photoLink, captionIndex: 2 },
  { image: photoStar, captionIndex: 3 },
]

/** 物理材质（弹性 / 摩擦 / 空气阻力 / 密度 / 圆角） */
export const itemMaterial: PhysicsMaterial = {
  restitution: 0.34,
  friction: 0.42,
  frictionAir: 0.012,
  density: 0.0012,
  chamferRadius: 10,
}

// ---- 生成逻辑 ------------------------------------------------------------

export interface SpecBuildContext {
  /** 容器尺寸 px */
  width: number
  height: number
  /** i18n 照片说明文字数组 */
  captions: string[]
  /** 分配全局唯一 id */
  nextId: () => number
}

function roll(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function rollInt(min: number, max: number): number {
  return Math.floor(roll(min, max + 1))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function baseUnit(width: number, height: number): number {
  const t = playgroundTune
  return clamp(Math.min(width, height) / t.baseDivisor, t.baseMin, t.baseMax)
}

function rollBox(id: number, base: number): PlaygroundItemSpec {
  const t = playgroundTune
  const swatch = boxPalette[Math.floor(Math.random() * boxPalette.length)]
  const size = base * roll(t.boxSize[0], t.boxSize[1])
  return {
    id,
    kind: 'box',
    w: size * roll(t.boxWidth[0], t.boxWidth[1]),
    h: size * roll(t.boxHeight[0], t.boxHeight[1]),
    color: swatch?.color ?? '#f6c177',
    edge: swatch?.edge ?? '#cf8f3a',
    face: Math.random() < t.faceChance,
  }
}

function rollPhoto(id: number, base: number, captions: string[], entry?: PhotoEntry): PlaygroundItemSpec {
  const t = playgroundTune
  const picked = entry ?? photoCatalog[Math.floor(Math.random() * photoCatalog.length)]
  const size = base * roll(t.photoScale[0], t.photoScale[1])
  return {
    id,
    kind: 'photo',
    w: size,
    h: size * t.photoRatio,
    image: picked?.image,
    caption: captions[picked?.captionIndex ?? -1] ?? '',
  }
}

/** 初始那一大堆：全部照片 + 按视口面积计算的箱子数量 */
export function buildInitialSpecs(ctx: SpecBuildContext): PlaygroundItemSpec[] {
  const t = playgroundTune
  const base = baseUnit(ctx.width, ctx.height)
  const specs = photoCatalog.map((entry) => rollPhoto(ctx.nextId(), base, ctx.captions, entry))
  const boxCount = clamp(
    Math.round((ctx.width * ctx.height) / t.countDivisor),
    t.countMin,
    t.countMax,
  )
  for (let i = 0; i < boxCount; i += 1) {
    specs.push(rollBox(ctx.nextId(), base))
  }
  return specs
}

/** 点击空白时召唤的一小批：以箱子为主，偶尔混一张照片 */
export function buildSummonSpecs(ctx: SpecBuildContext): PlaygroundItemSpec[] {
  const t = playgroundTune
  const base = baseUnit(ctx.width, ctx.height)
  const count = rollInt(t.summonBatch[0], t.summonBatch[1])
  const specs: PlaygroundItemSpec[] = []
  for (let i = 0; i < count; i += 1) {
    specs.push(
      Math.random() < t.summonPhotoChance
        ? rollPhoto(ctx.nextId(), base, ctx.captions)
        : rollBox(ctx.nextId(), base),
    )
  }
  return specs
}
