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
  min-height: 100svh;
  padding-block: clamp(6rem, 12vh, 9rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 3.5vh, 3rem);
}

h2 {
  max-width: 22ch;
  margin-inline: auto;
  text-align: center;
}

.body {
  font-size: 1.02rem;
  width: min(100%, 58ch);
  margin-inline: auto;
  text-align: left;
}

/* The takeaway sits on a butter-yellow underline instead of a bold run.
   The gradient goes on an inline span — as a flex child the <p> itself is
   blockified, so it would stretch the highlight past the end of the text. */
.closing {
  margin-top: var(--space-sm);
  width: min(100%, 52ch);
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 700;
  line-height: 1.7;
  color: var(--color-text);
  margin-inline: auto;
  text-align: left;
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
