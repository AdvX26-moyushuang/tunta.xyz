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
    <div class="content">
      <p v-for="(paragraph, i) in copy.paragraphs" :key="i" class="body reveal">
        {{ paragraph }}
      </p>
      <p class="closing reveal"><span>{{ copy.closing }}</span></p>
    </div>
  </section>
</template>

<style scoped>
.problem {
  min-height: 100svh;
  padding-block: clamp(6rem, 12vh, 9rem);
  display: grid;
  grid-template-columns: minmax(16rem, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(3rem, 8vw, 7rem);
}

h2 {
  max-width: 9ch;
  margin-inline: auto;
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.5rem, 3.5vh, 3rem);
  width: 100%;
  max-width: 58ch;
}

.body {
  font-size: 1.02rem;
  width: 100%;
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

@media (max-width: 720px) {
  .problem {
    grid-template-columns: 1fr;
    align-content: center;
    gap: clamp(3rem, 9vh, 5rem);
  }

  .content {
    margin-inline: auto;
  }
}
</style>
