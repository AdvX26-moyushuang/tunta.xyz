<script setup lang="ts">
// Tunta Expo — Intro section: product title with the mascot landing slot.
import { animate, stagger } from 'animejs'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logoUrl from '../assets/logo3.png'
import { pipelineStatePose } from '../config/mascot'
import { useI18n } from '../composables/useI18n'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import type { MascotStateKey } from '../types'

const props = defineProps<{
  /** Whether the flying mascot has landed in the title slot. */
  landed: boolean
}>()

/**
 * The otter cycles through the pipeline states right here in the header, so
 * screen 4 ("it is the progress bar") has already been shown before it is
 * explained. Drop a key from this list to take it out of the loop.
 */
const FRAMES: MascotStateKey[] = ['done', 'failed', 'idle', 'fetching', 'parsing']
const FRAME_MS = 2000

const { t } = useI18n()
const { prefersReducedMotion } = usePrefersReducedMotion()

const rootRef = ref<HTMLElement>()
const slotRef = ref<HTMLElement>()

// Lands on 'done' — the otter has just swallowed the pile — then cycles.
const frameIndex = ref(0)
const frame = computed(() => {
  const key = FRAMES[frameIndex.value]
  return { key, src: pipelineStatePose[key] }
})
let timer: ReturnType<typeof setInterval> | null = null

function stopCycling(): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function startCycling(): void {
  // Reduced-motion visitors keep the single landing pose.
  if (timer !== null || prefersReducedMotion.value) return
  timer = setInterval(() => {
    frameIndex.value = (frameIndex.value + 1) % FRAMES.length
  }, FRAME_MS)
}

/** Click to step through the states by hand. */
function nextFrame(): void {
  stopCycling()
  frameIndex.value = (frameIndex.value + 1) % FRAMES.length
  startCycling()
}

function getMascotSlotRect(): DOMRect | undefined {
  return slotRef.value?.getBoundingClientRect()
}

defineExpose({ getMascotSlotRect })

watch(
  () => props.landed,
  (landed) => {
    if (!landed) return
    startCycling()
    if (prefersReducedMotion.value) return
    const el = slotRef.value
    if (el) {
      animate(el, { scale: [1.25, 1], duration: 380, ease: 'outBack(2)' })
    }
  },
  { immediate: true },
)

onBeforeUnmount(stopCycling)

onMounted(() => {
  if (prefersReducedMotion.value) return
  const root = rootRef.value
  if (!root) return
  animate(root.querySelectorAll('.reveal'), {
    y: [26, 0],
    opacity: [0, 1],
    delay: stagger(90, { start: 120 }),
    duration: 620,
    ease: 'outQuart',
  })
})
</script>

<template>
  <section ref="rootRef" class="intro container" aria-label="Tunta intro">
    <div class="title-row">
      <button
        ref="slotRef"
        type="button"
        class="mascot-slot"
        :style="{ visibility: landed ? 'visible' : 'hidden' }"
        :aria-label="t.hero.mascotAlt"
        @click="nextFrame"
      >
        <Transition name="swap">
          <img :key="frame.key" :src="frame.src" :alt="t.hero.mascotAlt" draggable="false" />
        </Transition>
      </button>
      <div class="title-text">
        <h1 class="brand-title reveal" :aria-label="t.intro.title">
          <img :src="logoUrl" alt="" aria-hidden="true" draggable="false" />
        </h1>
        <p class="tagline reveal">{{ t.intro.tagline }}</p>
      </div>
    </div>
    <p class="description reveal">{{ t.intro.description }}</p>
    <p v-if="t.intro.note" class="note reveal">{{ t.intro.note }}</p>
  </section>
</template>

<style scoped>
.intro {
  min-height: 100svh;
  padding-block: clamp(7rem, 15vh, 9rem) clamp(4.5rem, 10vh, 7rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.25rem, 2.8vh, 2.25rem);
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2.5vw, 2rem);
}

.mascot-slot {
  flex: none;
  position: relative;
  width: clamp(128px, 20vmin, 184px);
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

/* Frames are stacked so the crossfade has no layout gap. Poses ship on a
   uniform square canvas, so contain keeps every frame the same size. */
.mascot-slot img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 14px color-mix(in srgb, var(--brand-copper) 22%, transparent));
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 420ms ease, transform 420ms ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.94);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.94);
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-active,
  .swap-leave-active {
    transition: none;
  }
}

.title-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.25rem, 1vh, 0.75rem);
}

.brand-title {
  position: relative;
  flex: none;
  width: clamp(10.5rem, 29vw, 20rem);
  aspect-ratio: 3414 / 2410;
  overflow: hidden;
}

/* logo3.png is a square source file with a transparent presentation canvas.
   These values map its alpha bounds (x 632, y 940, 3414 × 2410) onto this
   viewport without modifying or stretching the brand artwork. */
.brand-title img {
  position: absolute;
  left: -18.51%;
  top: -39%;
  width: 127.47%;
  height: 180.58%;
  max-width: none;
}

.tagline {
  font-size: clamp(1.05rem, 2.4vw, 1.5rem);
  font-weight: 600;
  color: var(--color-primary);
  text-align: center;
}

.description {
  font-size: 1.05rem;
  width: min(100%, 60ch);
  margin-inline: auto;
  text-align: left;
}

.note {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  width: min(100%, 48ch);
  margin-inline: auto;
  text-align: left;
}

</style>
