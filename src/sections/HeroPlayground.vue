<script setup lang="ts">
// Tunta Expo — Hero playground: physics pile + mascot absorb sequence.
// Boxes/photos are plain DOM elements synced with matter-js bodies; the
// absorb → burst sequence animates the same visual-state objects with anime.js.
import { animate } from 'animejs'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import heroUrl from '../assets/hero.png'
import photoArticle from '../assets/photo-article.png'
import photoLink from '../assets/photo-link.png'
import photoStar from '../assets/photo-star.png'
import photoVideo from '../assets/photo-video.png'
import { useI18n } from '../composables/useI18n'
import {
  createPhysicsPlayground,
  type PhysicsController,
  type PlaygroundItemSpec,
  type TrackedItem,
} from '../composables/usePhysicsPlayground'

const props = defineProps<{
  active: boolean
  mascotHidden: boolean
}>()

const emit = defineEmits<{
  absorbed: []
}>()

const { t } = useI18n()

const containerRef = ref<HTMLElement>()
const mascotRef = ref<HTMLElement>()
const mascotInnerRef = ref<HTMLElement>()
const mascotImgRef = ref<HTMLElement>()

const specs = shallowRef<PlaygroundItemSpec[]>([])
const tiltOn = ref(false)

const itemEls = new Map<number, HTMLElement>()
let controller: PhysicsController | null = null
let started = false
let absorbing = false
let floatAnimation: { pause: () => void } | null = null

// ---- Item specs ----------------------------------------------------

const PALETTE: Array<{ color: string; edge: string }> = [
  { color: '#f6c177', edge: '#cf8f3a' },
  { color: '#93c5fd', edge: '#5588dd' },
  { color: '#a7f3d0', edge: '#4fb98a' },
  { color: '#fda4af', edge: '#de6375' },
  { color: '#c4b5fd', edge: '#8a6fe0' },
  { color: '#fcd34d', edge: '#d9a011' },
  { color: '#fdba74', edge: '#d98236' },
  { color: '#99e9f2', edge: '#45b3c3' },
]
const PHOTO_URLS = [photoVideo, photoArticle, photoLink, photoStar]

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function buildSpecs(width: number, height: number): PlaygroundItemSpec[] {
  const result: PlaygroundItemSpec[] = []
  const base = clamp(Math.min(width, height) / 13, 30, 56)
  const captions = t.value.hero.captions

  PHOTO_URLS.forEach((image, i) => {
    const size = base * (1.75 + Math.random() * 0.25)
    result.push({
      id: i,
      kind: 'photo',
      w: size,
      h: size * 1.16,
      image,
      caption: captions[i] ?? '',
    })
  })

  const boxCount = clamp(Math.round((width * height) / 46000), 8, 13)
  for (let i = 0; i < boxCount; i += 1) {
    const size = base * (0.8 + Math.random() * 1.0)
    const swatch = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    result.push({
      id: PHOTO_URLS.length + i,
      kind: 'box',
      w: size * (0.9 + Math.random() * 0.4),
      h: size * (0.7 + Math.random() * 0.32),
      color: swatch?.color,
      edge: swatch?.edge,
      face: Math.random() < 0.5,
    })
  }
  return result
}

// ---- DOM sync ------------------------------------------------------

function setItemRef(id: number) {
  return (el: Element | null): void => {
    if (el instanceof HTMLElement) {
      itemEls.set(id, el)
    } else {
      itemEls.delete(id)
    }
  }
}

function renderItem(item: TrackedItem): void {
  const el = itemEls.get(item.spec.id)
  if (!el) return
  const { state, spec } = item
  el.style.transform = `translate3d(${state.x - spec.w / 2}px, ${state.y - spec.h / 2}px, 0) rotate(${state.angle}rad) scale(${state.scale})`
  el.style.opacity = String(state.opacity)
}

function itemStyle(spec: PlaygroundItemSpec): Record<string, string> {
  const style: Record<string, string> = {
    width: `${spec.w}px`,
    height: `${spec.h}px`,
    transform: 'translate3d(-9999px, -9999px, 0)',
  }
  if (spec.kind === 'box') {
    style.background = spec.color ?? PALETTE[0]?.color ?? '#f6c177'
    style.borderColor = spec.edge ?? PALETTE[0]?.edge ?? '#cf8f3a'
  }
  return style
}

// ---- Mascot idle animation -----------------------------------------

function mascotEnter(): void {
  const inner = mascotInnerRef.value
  const img = mascotImgRef.value
  if (!inner) return
  animate(inner, {
    scale: [0, 1],
    duration: 560,
    ease: 'outBack(1.7)',
    onComplete: () => {
      if (!img || absorbing) return
      animate(img, { y: [0, -9], duration: 1150, ease: 'inOutSine', loop: true, alternate: true })
      floatAnimation = animate(img, {
        rotate: [-2.5, 2.5],
        duration: 1750,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
      })
    },
  })
}

// ---- Scroll / swipe triggers ----------------------------------------

function onWheel(event: WheelEvent): void {
  if (event.deltaY > 24) void triggerAbsorb()
}

let swipeStartY: number | null = null

function onTouchStart(event: TouchEvent): void {
  const target = event.target instanceof HTMLElement ? event.target : null
  // Touches starting on an item are drags, not scroll intent.
  swipeStartY = target?.closest('.playground-item') ? null : (event.touches[0]?.clientY ?? null)
}

function onTouchMove(event: TouchEvent): void {
  if (swipeStartY == null) return
  const y = event.touches[0]?.clientY
  if (y != null && swipeStartY - y > 56) void triggerAbsorb()
}

function attachScrollTriggers(): void {
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
}

function detachScrollTriggers(): void {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
}

// ---- Absorb → burst sequence ----------------------------------------

async function triggerAbsorb(): Promise<void> {
  if (absorbing || !controller) return
  absorbing = true
  detachScrollTriggers()
  floatAnimation?.pause()

  const container = containerRef.value
  const mascotEl = mascotRef.value
  const inner = mascotInnerRef.value
  if (!container || !mascotEl || !inner) {
    emit('absorbed')
    return
  }

  const items = controller.detach()
  const mascotRect = mascotEl.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const cx = mascotRect.left + mascotRect.width / 2 - containerRect.left
  const cy = mascotRect.top + mascotRect.height / 2 - containerRect.top
  const diagonal = Math.hypot(containerRect.width, containerRect.height)

  // Hints quietly fade out first.
  animate(container.querySelectorAll('.hero-hint'), { opacity: [1, 0], duration: 220, ease: 'outQuad' })

  // 1) The otter opens wide…
  await animate(inner, { scale: [1, 1.16], duration: 260, ease: 'outBack' })

  // 2) …and everything gets sucked in.
  await Promise.all(
    items.map((item) =>
      animate(item.state, {
        x: cx + (Math.random() - 0.5) * 28,
        y: cy + (Math.random() - 0.5) * 20,
        scale: 0.05,
        angle: item.state.angle + (Math.random() - 0.5) * 5,
        duration: 460 + Math.random() * 140,
        ease: 'inQuart',
        delay: Math.random() * 220,
        onUpdate: () => renderItem(item),
      }),
    ),
  )

  // 3) Gulp.
  await animate(inner, { scale: [1.16, 0.84, 1.06], duration: 380, ease: 'inOutQuad' })

  // 4) Everything bursts back out and fades away.
  const bursts = items.map((item) => {
    const theta = Math.random() * Math.PI * 2
    const distance = diagonal * (0.55 + Math.random() * 0.35)
    return animate(item.state, {
      x: cx + Math.cos(theta) * distance,
      y: cy + Math.sin(theta) * distance,
      scale: 0.22 + Math.random() * 0.28,
      opacity: 0,
      angle: item.state.angle + (Math.random() - 0.5) * 9,
      duration: 780 + Math.random() * 260,
      ease: 'outQuart',
      delay: Math.random() * 90,
      onUpdate: () => renderItem(item),
    })
  })
  animate(container, { x: [0, -7, 6, -4, 2, 0], duration: 420, ease: 'outQuad' })
  animate(inner, { scale: [1.06, 1], duration: 300, ease: 'outQuad' })
  await Promise.all(bursts)

  emit('absorbed')
}

function getMascotRect(): DOMRect | undefined {
  return mascotRef.value?.getBoundingClientRect()
}

defineExpose({ triggerAbsorb, getMascotRect })

// ---- Lifecycle ------------------------------------------------------

function startPlay(): void {
  if (!controller || started) return
  started = true
  controller.start()
  mascotEnter()
  attachScrollTriggers()
}

function onResize(): void {
  controller?.resize()
}

watch(
  () => props.active,
  (value) => {
    if (value) startPlay()
  },
)

onMounted(async () => {
  const container = containerRef.value
  if (!container) return
  specs.value = buildSpecs(container.clientWidth, container.clientHeight)
  await nextTick()
  controller = createPhysicsPlayground({
    container,
    specs: specs.value,
    onRender: renderItem,
    onTiltActive: () => {
      tiltOn.value = true
    },
  })
  window.addEventListener('resize', onResize)
  if (props.active) startPlay()
})

onBeforeUnmount(() => {
  detachScrollTriggers()
  window.removeEventListener('resize', onResize)
  floatAnimation?.pause()
  controller?.destroy()
  controller = null
})
</script>

<template>
  <section
    ref="containerRef"
    class="hero-playground"
    :class="{ leaving: mascotHidden }"
    aria-label="Tunta playground"
  >
    <div
      v-for="spec in specs"
      :key="spec.id"
      :ref="setItemRef(spec.id)"
      class="playground-item"
      :class="[spec.kind, { faced: spec.face }]"
      :style="itemStyle(spec)"
      aria-hidden="true"
    >
      <template v-if="spec.kind === 'box'">
        <span class="tape" :style="{ background: spec.edge }"></span>
        <span v-if="spec.face" class="face">
          <i class="eye"></i>
          <i class="eye"></i>
          <i class="mouth"></i>
        </span>
      </template>
      <template v-else>
        <img :src="spec.image" :alt="spec.caption ?? ''" draggable="false" />
        <span class="caption">{{ spec.caption }}</span>
      </template>
    </div>

    <div v-show="!mascotHidden" ref="mascotRef" class="mascot-wrap">
      <button type="button" class="mascot-button" :aria-label="t.hero.clickHint" @click="triggerAbsorb">
        <span ref="mascotInnerRef" class="mascot-inner">
          <img ref="mascotImgRef" :src="heroUrl" :alt="t.hero.mascotAlt" draggable="false" />
        </span>
      </button>
      <span class="mascot-shadow" aria-hidden="true"></span>
    </div>

    <div class="hero-hint hint-main">
      <span>{{ t.hero.dragHint }}</span>
      <strong>{{ t.hero.clickHint }}</strong>
    </div>
    <div class="hero-hint hint-scroll" aria-hidden="true">
      <span>{{ t.hero.scrollHint }}</span>
      <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <transition name="chip">
      <div v-if="tiltOn" class="hero-hint hint-gyro">{{ t.hero.gyroHint }}</div>
    </transition>
  </section>
</template>

<style scoped>
.hero-playground {
  position: fixed;
  inset: 0;
  z-index: 30;
  overflow: hidden;
  touch-action: none;
  background:
    radial-gradient(110% 80% at 50% 0%, #fff9ee 0%, #fdeed8 55%, #f7dfc0 100%);
  transition: opacity 480ms ease 80ms;
}

.hero-playground::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(74 50 38 / 0.07) 1.6px, transparent 1.7px);
  background-size: 54px 54px;
  pointer-events: none;
}

.hero-playground.leaving {
  opacity: 0;
  pointer-events: none;
}

/* ---- Pile items ---- */

.playground-item {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
  touch-action: none;
  cursor: grab;
  will-change: transform;
  z-index: 1;
}

.playground-item:active {
  cursor: grabbing;
}

.playground-item.box {
  border: 3px solid;
  border-radius: 10px;
  box-shadow:
    inset 0 -6px 0 rgb(74 50 38 / 0.08),
    0 8px 16px rgb(74 50 38 / 0.16);
}

.playground-item.box .tape {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 24%;
  transform: translateX(-50%);
  opacity: 0.38;
  pointer-events: none;
}

.playground-item.box .face {
  position: absolute;
  top: 18%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 14%;
  pointer-events: none;
}

.playground-item.box .face .eye {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #4a3226;
}

.playground-item.box .face .mouth {
  position: absolute;
  top: 130%;
  left: 50%;
  width: 12px;
  height: 7px;
  border: 2.4px solid #4a3226;
  border-top: none;
  border-radius: 0 0 12px 12px;
  transform: translateX(-50%);
}

.playground-item.photo {
  display: flex;
  flex-direction: column;
  background: #fffdf8;
  border-radius: 6px;
  /* Percentage padding would resolve against the section width, so use vmin. */
  padding: clamp(5px, 1vmin, 9px) clamp(5px, 1vmin, 9px) 0;
  box-shadow: 0 10px 18px rgb(74 50 38 / 0.2);
}

.playground-item.photo img {
  width: 100%;
  flex: 1;
  min-height: 0;
  object-fit: cover;
  border-radius: 4px;
  pointer-events: none;
}

.playground-item.photo .caption {
  flex: none;
  padding: 2px 0 4px;
  font-size: clamp(0.6rem, 1.4vmin, 0.78rem);
  color: #96704f;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

/* ---- Mascot ---- */

.mascot-wrap {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: clamp(140px, 24vmin, 208px);
}

.mascot-button {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mascot-button:focus-visible {
  outline: 3px solid #e98b4e;
  outline-offset: 6px;
  border-radius: 24px;
}

.mascot-inner {
  display: block;
  will-change: transform;
}

.mascot-inner img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 16px 24px rgb(74 50 38 / 0.24));
  will-change: transform;
}

.mascot-shadow {
  display: block;
  width: 64%;
  height: 16px;
  margin: -4px auto 0;
  border-radius: 50%;
  background: rgb(74 50 38 / 0.18);
  filter: blur(4px);
}

/* ---- Hints ---- */

.hero-hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  color: #96704f;
  pointer-events: none;
}

.hint-main {
  bottom: clamp(72px, 11vh, 110px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: clamp(0.82rem, 1.8vmin, 0.95rem);
  width: max-content;
  max-width: 88vw;
}

.hint-main strong {
  color: #6b4a2f;
  font-weight: 700;
}

.hint-scroll {
  bottom: clamp(22px, 4vh, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 0.78rem;
  color: #b08a63;
}

.hint-scroll .chevron {
  animation: bob 1.4s ease-in-out infinite;
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.hint-gyro {
  top: max(16px, env(safe-area-inset-top));
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(255 253 248 / 0.85);
  border: 1px solid rgb(74 50 38 / 0.12);
  font-size: 0.78rem;
  box-shadow: 0 4px 12px rgb(74 50 38 / 0.1);
}

.chip-enter-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.chip-enter-from {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
