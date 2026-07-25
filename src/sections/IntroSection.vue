<script setup lang="ts">
// Tunta Expo — Intro section: product title with the mascot landing slot.
import { animate, stagger } from 'animejs'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logoUrl from '../assets/logo-3.png'
import CtaGroup from '../components/CtaGroup.vue'
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
    <!-- Two text styles on this screen, no more: `.tagline` is the hook and
         `.body` carries everything else. Rhythm comes from spacing, not from
         another size/colour/alignment variant. -->
    <p class="body reveal">{{ t.intro.audience }}</p>
    <p class="body reveal">{{ t.intro.description }}</p>
    <p v-if="t.intro.note" class="body reveal">{{ t.intro.note }}</p>
    <CtaGroup class="ctas reveal" :items="t.intro.ctas" :aria-label="t.intro.tagline" />
    <p class="body reveal">{{ t.intro.statusNote }}</p>
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
  /* vw-driven so the hero keeps scaling on a large desktop; vmin capped out
     early and left the otter looking like a thumbnail at 1728px. */
  width: clamp(132px, 16vw, 300px);
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
  width: clamp(9rem, 26vw, 27rem);
  aspect-ratio: 1763 / 1098;
  overflow: hidden;
}

/* logo-3.png is a 2048 × 2048 source file with a transparent presentation
   canvas. These values map its alpha bounds (x 198, y 493, 1763 × 1098) onto
   this viewport without modifying or stretching the brand artwork. */
.brand-title img {
  position: absolute;
  left: -11.23%;
  top: -44.9%;
  width: 116.17%;
  height: 186.52%;
  max-width: none;
}

.tagline {
  font-size: clamp(1.05rem, 2.4vw, 1.5rem);
  font-weight: 600;
  color: var(--color-primary);
  text-align: center;
}

/* The only other text style on this screen. Audience, description, the
   local-first line and the status note all share it. */
.body {
  font-size: var(--font-body);
  color: var(--color-text-secondary);
  width: min(100%, 58ch);
  margin-inline: auto;
  text-align: left;
  text-wrap: pretty;
}

.ctas {
  justify-content: center;
}

</style>
