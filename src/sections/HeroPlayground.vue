<script setup lang="ts">
// Tunta Expo — Hero playground: physics pile + mascot absorb sequence.
// Boxes/photos are plain DOM elements synced with matter-js bodies; the
// absorb → burst sequence animates the same visual-state objects with anime.js.
import { animate } from 'animejs'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { introPose } from '../config/mascot'
import { useI18n } from '../composables/useI18n'
import {
  createPhysicsPlayground,
  type PhysicsController,
  type PlaygroundItemSpec,
  type TrackedItem,
} from '../composables/usePhysicsPlayground'
import {
  buildInitialSpecs,
  buildSummonSpecs,
  itemMaterial,
  playgroundTune,
  type SpecBuildContext,
} from '../config/playground'

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

// Which drawing the otter is wearing right now. The absorb sequence walks it
// through idle → absorbing → fed; every pose is the same 320×320 square, so
// the swap never nudges the layout.
const pose = ref<string>(introPose.idle)

const itemEls = new Map<number, HTMLElement>()
let controller: PhysicsController | null = null
let started = false
let absorbing = false
let floatAnimation: { pause: () => void } | null = null

// ---- Item specs (catalog lives in src/config/playground.ts) ------------

let idCounter = 0

function nextId(): number {
  return idCounter++
}

function makeCtx(): SpecBuildContext {
  const container = containerRef.value
  return {
    width: container?.clientWidth ?? window.innerWidth,
    height: container?.clientHeight ?? window.innerHeight,
    captions: t.value.hero.captions,
    nextId,
  }
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
    style.background = spec.color ?? '#f6c177'
    style.borderColor = spec.edge ?? '#cf8f3a'
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

// ---- Blank-click summon --------------------------------------------

interface Ripple {
  id: number
  x: number
  y: number
}

const ripples = ref<Ripple[]>([])
let rippleCounter = 0

function spawnRipple(x: number, y: number): void {
  const id = rippleCounter++
  ripples.value.push({ id, x, y })
  window.setTimeout(() => {
    ripples.value = ripples.value.filter((ripple) => ripple.id !== id)
  }, 520)
}

async function onBlankClick(event: MouseEvent): Promise<void> {
  if (!controller || !started || absorbing) return
  const target = event.target instanceof HTMLElement ? event.target : null
  // Clicks starting on an item are drags; the mascot has its own handler.
  if (target?.closest('.playground-item') || target?.closest('.mascot-button')) return
  const container = containerRef.value
  if (!container) return
  const remaining = playgroundTune.maxItems - specs.value.length
  if (remaining <= 0) return

  const rect = container.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  spawnRipple(x, y)

  const batch = buildSummonSpecs(makeCtx()).slice(0, remaining)
  specs.value = [...specs.value, ...batch]
  // Wait for the new elements to mount, then drop bodies for them.
  await nextTick()
  controller.add(batch, { x, spread: playgroundTune.summonSpread })
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
  pose.value = introPose.absorbing
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



  // 4) Fed and pleased — everything bursts back out and fades away.
  pose.value = introPose.fed
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
  specs.value = buildInitialSpecs(makeCtx())
  await nextTick()
  controller = createPhysicsPlayground({
    container,
    specs: specs.value,
    onRender: renderItem,
    onTiltActive: () => {
      tiltOn.value = true
    },
    material: itemMaterial,
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
    @click="onBlankClick"
  >
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="summon-ripple"
      :style="{ left: ripple.x + 'px', top: ripple.y + 'px' }"
      aria-hidden="true"
    ></span>
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
          <img ref="mascotImgRef" :src="pose" :alt="t.hero.mascotAlt" draggable="false" />
        </span>
      </button>
      <span class="mascot-shadow" aria-hidden="true"></span>
    </div>

    <div class="hero-hint hint-main">
      <span>{{ t.hero.dragHint }}</span>
      <span class="summon-line">{{ t.hero.summonHint }}</span>
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
  background: transparent;
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
  text-shadow: 0 1px 10px #fdeed8, 0 0 4px #fdeed8;
}

.summon-line {
  font-size: 0.86em;
  color: #b08a63;
}

.summon-ripple {
  position: absolute;
  z-index: 8;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 3px solid #e98b4e;
  border-radius: 50%;
  pointer-events: none;
  animation: ripple 480ms ease-out forwards;
}

@keyframes ripple {
  from {
    opacity: 0.85;
    scale: 0.4;
  }
  to {
    opacity: 0;
    scale: 3.4;
  }
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
