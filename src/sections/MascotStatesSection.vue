<script setup lang="ts">
// Tunta Expo — Screen 4: the otter is the progress bar, not decoration.
// Five pipeline states, each with its own portrait.
import { computed, ref } from 'vue'
import { pipelineStatePose } from '../config/mascot'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.mascot)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 90 })
</script>

<template>
  <section
    v-if="copy"
    id="mascot"
    ref="rootRef"
    class="mascot container"
    aria-label="Tunta pipeline states"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p v-for="(paragraph, i) in copy.paragraphs" :key="i" class="body reveal">
      {{ paragraph }}
    </p>

    <ul class="states">
      <li v-for="state in copy.states" :key="state.key" class="state reveal">
        <img
          :src="pipelineStatePose[state.key]"
          :alt="`${copy.heading} — ${state.label}`"
          draggable="false"
        />
        <p class="label">{{ state.label }}</p>
        <p class="desc">{{ state.description }}</p>
      </li>
    </ul>

    <p class="closing reveal">{{ copy.closing }}</p>
  </section>
</template>

<style scoped>
.mascot {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Without this the content stacked at the top of a 100svh screen and left a
     dead half below it — the reason this screen read as small and flat. */
  justify-content: center;
  gap: var(--space-lg);
}

h2 {
  max-width: 20ch;
  margin-inline: auto;
  text-align: center;
}

.body {
  font-size: var(--font-body);
  width: min(100%, 58ch);
  margin-inline: auto;
  text-align: left;
}

.states {
  list-style: none;
  margin-top: var(--space-md);
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  width: 100%;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md) var(--space-md);
  border-radius: var(--border-radius-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  text-align: left;
}

/* The mascot is the brand asset on this screen, so it gets real size rather
   than a thumbnail. vw-driven so it keeps growing on a large desktop. */
.state img {
  align-self: center;
  width: clamp(88px, 9vw, 172px);
  height: auto;
  filter: drop-shadow(0 10px 18px color-mix(in srgb, var(--brand-copper) 20%, transparent));
}

.label {
  font-weight: 700;
  font-size: var(--font-body);
  color: var(--color-text);
  max-width: none;
  width: 100%;
}

.desc {
  font-size: var(--font-body-sm);
  color: var(--color-text-muted);
  max-width: none;
  width: 100%;
  line-height: 1.55;
}

/* The failure state is the point of the screen, so it gets the accent ring. */
.state:last-child {
  border-color: color-mix(in srgb, var(--brand-copper) 32%, var(--brand-seashell));
  background: color-mix(in srgb, var(--brand-butter) 22%, var(--color-bg-secondary));
}

.closing {
  margin-top: var(--space-sm);
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 700;
  color: var(--color-text);
  width: min(100%, 40ch);
  margin-inline: auto;
  text-align: left;
}
</style>
