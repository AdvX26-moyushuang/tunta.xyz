<script setup lang="ts">
// Tunta Expo — Screen 10: the last ask, with the site footer folded in so the
// page ends on one beat instead of a CTA followed by a separate footer strip.
import { computed, ref } from 'vue'
import CtaGroup from '../components/CtaGroup.vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.finalCta)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 100 })
</script>

<template>
  <section
    v-if="copy"
    id="start"
    ref="rootRef"
    class="final-cta container"
    aria-label="Tunta call to action"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p class="body reveal">{{ copy.body }}</p>
    <CtaGroup class="ctas reveal" :items="copy.ctas" :aria-label="copy.heading" />
    <p class="note reveal">{{ copy.note }}</p>

    <footer class="site-footer reveal">
      <p class="footer-text">{{ t.footer.text }}</p>
      <p class="footer-note">{{ t.footer.note }}</p>
    </footer>
  </section>
</template>

<style scoped>
.final-cta {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  text-align: center;
}

h2 {
  max-width: 18ch;
  margin-inline: auto;
}

.body {
  font-size: var(--font-body);
  width: min(100%, 54ch);
}

.note {
  font-size: var(--font-body-sm);
  color: var(--color-text-muted);
}

/* Sits below the ask, separated by a rule rather than by its own screen. */
.site-footer {
  width: min(100%, 54ch);
  margin-top: clamp(2rem, 6vh, 4rem);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.footer-text {
  font-weight: 600;
  font-size: var(--font-body-sm);
  color: var(--color-text);
}

.footer-note {
  font-size: var(--font-body-sm);
  color: var(--color-text-muted);
}
</style>
