<script setup lang="ts">
// Tunta Expo — Screen 6: where the project actually stands. Engineering
// voice, not an apology. The status line is deliberately understated.
import { computed, ref } from 'vue'
import { links } from '../content'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.progress)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 110 })
</script>

<template>
  <section
    v-if="copy"
    id="status"
    ref="rootRef"
    class="progress container"
    aria-label="Tunta project status"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p v-for="(paragraph, i) in copy.paragraphs" :key="i" class="body reveal">
      {{ paragraph }}
    </p>
    <p class="status-line reveal">{{ copy.statusLine }}</p>
    <div class="cta-row reveal">
      <a class="btn" :href="links.contract" target="_blank" rel="noopener noreferrer">
        {{ copy.cta }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.progress {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

h2 {
  max-width: 22ch;
}

.body {
  font-size: 1.02rem;
  max-width: 60ch;
}

.status-line {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--brand-nebula) 30%, transparent);
  max-width: 52ch;
}

.cta-row {
  margin-top: var(--space-xs);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.7em 1.5em;
  border-radius: 999px;
  font-weight: 600;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  transition: transform var(--transition-fast), background var(--transition-fast),
    color var(--transition-fast);
}

.btn:hover {
  transform: translateY(-2px);
  background: var(--color-primary);
  color: var(--brand-seashell);
}
</style>
