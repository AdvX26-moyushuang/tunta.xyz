<script setup lang="ts">
// Tunta Expo — Screen 2: the problem, in three sentences.
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.problem)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 120 })
</script>

<template>
  <section
    v-if="copy"
    id="problem"
    ref="rootRef"
    class="problem container"
    aria-label="Tunta problem"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p v-for="(paragraph, i) in copy.paragraphs" :key="i" class="body reveal">
      {{ paragraph }}
    </p>
    <p class="closing reveal"><span>{{ copy.closing }}</span></p>
  </section>
</template>

<style scoped>
.problem {
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
  max-width: 58ch;
}

/* The takeaway sits on a butter-yellow underline instead of a bold run.
   The gradient goes on an inline span — as a flex child the <p> itself is
   blockified, so it would stretch the highlight past the end of the text. */
.closing {
  margin-top: var(--space-sm);
  max-width: 52ch;
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 700;
  line-height: 1.7;
  color: var(--color-text);
}

.closing span {
  background-image: linear-gradient(
    transparent 62%,
    color-mix(in srgb, var(--brand-butter) 85%, transparent) 62%
  );
  background-repeat: no-repeat;
  padding-inline: 0.1em;
}
</style>
