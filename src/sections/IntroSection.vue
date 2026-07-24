<script setup lang="ts">
// Tunta Expo — Intro section: product title with the mascot landing slot.
import { animate, stagger } from 'animejs'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logoUrl from '../assets/logo3.png'
import { pipelineStatePose } from '../config/mascot'
import { links } from '../content'
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

// zh scrolls to the retrieval walkthrough (screen 3); en still has the old
// three-card features screen as its first stop.
const primaryHref = computed(() => (t.value.retrieval ? '#retrieval' : '#features'))

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
    <div class="cta-row reveal">
      <a class="btn primary" :href="primaryHref">{{ t.intro.primaryCta }}</a>
      <a class="btn ghost" :href="links.contract" target="_blank" rel="noopener noreferrer">
        {{ t.intro.secondaryCta }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.intro {
  padding-top: clamp(4rem, 12vh, 7.5rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.mascot-slot {
  flex: none;
  position: relative;
  width: clamp(64px, 10vmin, 92px);
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
  gap: var(--space-xs);
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
}

.description {
  font-size: 1.05rem;
}

/* Third line — sits tight under the sub-headline, deliberately quiet. */
.note {
  margin-top: calc(var(--space-lg) * -0.55);
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 48ch;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.7em 1.5em;
  border-radius: 999px;
  font-weight: 600;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-copper) 32%, transparent);
}

.btn.primary:hover {
  background: var(--color-primary-dark);
  color: #fff;
}

.btn.ghost {
  border: 1.5px solid var(--color-border);
  color: var(--color-text-secondary);
  background: transparent;
}

.btn.ghost:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}
</style>
