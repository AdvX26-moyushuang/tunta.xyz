<script setup lang="ts">
// Tunta Expo — Intro section: product title with the mascot landing slot.
import { animate, stagger } from 'animejs'
import { onMounted, ref, watch } from 'vue'
import heroUrl from '../assets/hero.png'
import { useI18n } from '../composables/useI18n'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'

const props = defineProps<{
  /** Whether the flying mascot has landed in the title slot. */
  landed: boolean
}>()

const { t } = useI18n()
const { prefersReducedMotion } = usePrefersReducedMotion()

const rootRef = ref<HTMLElement>()
const slotRef = ref<HTMLElement>()
const slotImgRef = ref<HTMLElement>()

function getMascotSlotRect(): DOMRect | undefined {
  return slotRef.value?.getBoundingClientRect()
}

defineExpose({ getMascotSlotRect })

watch(
  () => props.landed,
  (landed) => {
    if (!landed || prefersReducedMotion.value) return
    const img = slotImgRef.value
    if (img) {
      animate(img, { scale: [1.25, 1], duration: 380, ease: 'outBack(2)' })
    }
  },
)

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
      <div ref="slotRef" class="mascot-slot">
        <img
          ref="slotImgRef"
          :src="heroUrl"
          :alt="t.hero.mascotAlt"
          :style="{ visibility: landed ? 'visible' : 'hidden' }"
          draggable="false"
        />
      </div>
      <div class="title-text">
        <h1 class="reveal">{{ t.intro.title }}</h1>
        <p class="tagline reveal">{{ t.intro.tagline }}</p>
      </div>
    </div>
    <p class="description reveal">{{ t.intro.description }}</p>
    <div class="cta-row reveal">
      <a class="btn primary" href="#features">{{ t.intro.primaryCta }}</a>
      <a class="btn ghost" href="#status">{{ t.intro.secondaryCta }}</a>
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
  width: clamp(64px, 10vmin, 92px);
  aspect-ratio: 1;
}

.mascot-slot img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 8px 14px rgb(74 50 38 / 0.2));
}

.title-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.title-text h1 {
  font-weight: 800;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: clamp(1.05rem, 2.4vw, 1.5rem);
  font-weight: 600;
  color: var(--color-primary);
}

.description {
  font-size: 1.05rem;
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
  box-shadow: 0 8px 20px rgb(99 102 241 / 0.35);
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
