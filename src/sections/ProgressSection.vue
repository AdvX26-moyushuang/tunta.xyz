<script setup lang="ts">
// Tunta Expo — Screen 6: where the project actually stands. Engineering
// voice, not an apology. The status line is deliberately understated.
import { computed, ref } from 'vue'
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
  </section>
</template>

<style scoped>
.progress {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

h2 {
  max-width: 22ch;
  margin-inline: auto;
  text-align: center;
}

.body {
  font-size: 1.02rem;
  width: min(100%, 60ch);
  text-align: left;
}

.status-line {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--brand-nebula) 30%, transparent);
  width: min(100%, 52ch);
  margin-inline: auto;
  text-align: left;
}
</style>
