<script setup lang="ts">
// Tunta Expo — Features section: three workflow cards + project status.
import { animate, stagger } from 'animejs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import type { FeatureIcon } from '../types'

const { t } = useI18n()
const { prefersReducedMotion } = usePrefersReducedMotion()

// Only rendered for languages that still use the three-card screen (en).
const copy = computed(() => t.value.features)

const rootRef = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

function iconOf(name: FeatureIcon): string {
  return name
}

onMounted(() => {
  const root = rootRef.value
  if (!root) return
  const targets = root.querySelectorAll('.reveal')
  if (prefersReducedMotion.value || typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => el.classList.add('shown'))
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer?.disconnect()
      observer = null
      animate(targets, {
        y: [32, 0],
        opacity: [0, 1],
        delay: stagger(110),
        duration: 640,
        ease: 'outQuart',
      })
    },
    { threshold: 0.25 },
  )
  observer.observe(root)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section v-if="copy" id="features" ref="rootRef" class="features container" aria-label="Tunta workflows">
    <h2 class="reveal">{{ copy.heading }}</h2>
    <div class="cards">
      <article v-for="item in copy.items" :key="item.icon" class="card reveal">
        <span class="icon" aria-hidden="true">
          <svg v-if="iconOf(item.icon) === 'capture'" width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else-if="iconOf(item.icon) === 'review'" width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 8a8 8 0 0 1 14.5-2M20 16a8 8 0 0 1-14.5 2"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path d="M18.5 2v4h-4M5.5 22v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </article>
    </div>
    <p class="status reveal">
      <span class="dot" aria-hidden="true"></span>
      <strong>{{ copy.statusLabel }}</strong>
      <span>{{ copy.status }}</span>
    </p>
  </section>
</template>

<style scoped>
.features {
  padding-block: clamp(3rem, 9vh, 5.5rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: var(--space-lg);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-bg-secondary);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgb(15 23 42 / 0.1);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--brand-butter) 70%, transparent);
}

.card p {
  font-size: 0.95rem;
}

.status {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  flex-wrap: wrap;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--brand-nebula) 42%, transparent);
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.status strong {
  color: var(--color-text);
}

.status .dot {
  align-self: center;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-nebula) 55%, transparent);
}
</style>
