<script setup lang="ts">
// Tunta Expo — Shared call-to-action row (hero + final CTA).
// Anchors scroll within the deck; external links open in a new tab.
import type { CtaLink } from '../types'

defineProps<{
  items: CtaLink[]
  /** Accessible name for the group. */
  ariaLabel: string
}>()
</script>

<template>
  <div class="cta-group" role="group" :aria-label="ariaLabel">
    <a
      v-for="cta in items"
      :key="cta.href + cta.label"
      class="cta"
      :class="cta.variant"
      :href="cta.href"
      :target="cta.external ? '_blank' : undefined"
      :rel="cta.external ? 'noopener noreferrer' : undefined"
    >
      <span>{{ cta.label }}</span>
      <span v-if="cta.external" class="external-arrow" aria-hidden="true">↗</span>
    </a>
  </div>
</template>

<style scoped>
.cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
}

.cta {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding-inline: 1.15rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
}

/* One emphasised action per group; the rest stay quiet. */
.cta.primary {
  background: var(--color-primary);
  color: var(--brand-seashell);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--brand-copper) 22%, transparent);
}

.cta.primary:hover {
  background: var(--color-primary-dark);
  color: #fff;
}

.cta.secondary {
  border-color: var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.cta.secondary:hover {
  border-color: color-mix(in srgb, var(--brand-copper) 38%, transparent);
  background: color-mix(in srgb, var(--brand-nebula) 30%, transparent);
}

.cta.ghost {
  padding-inline: 0.85rem;
  color: var(--color-text-secondary);
}

.cta.ghost:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--brand-nebula) 34%, transparent);
}

.cta:hover {
  transform: translateY(-1px);
}

.external-arrow {
  font-size: 0.74rem;
  opacity: 0.72;
}

@media (prefers-reduced-motion: reduce) {
  .cta:hover {
    transform: none;
  }
}
</style>
