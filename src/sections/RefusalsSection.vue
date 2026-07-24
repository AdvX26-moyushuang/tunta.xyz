<script setup lang="ts">
// Tunta Expo — Screen 5: what we said no to. Plain list, no disclaimer tone.
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.refusals)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 80 })
</script>

<template>
  <section
    v-if="copy"
    id="refusals"
    ref="rootRef"
    class="refusals container"
    aria-label="Tunta non-goals"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p class="lead reveal">{{ copy.lead }}</p>

    <ul class="list">
      <li v-for="item in copy.items" :key="item.title" class="item reveal">
        <span class="mark" aria-hidden="true">✕</span>
        <span class="text">
          <strong>{{ item.title }}</strong>
          <span class="detail">{{ item.detail }}</span>
        </span>
      </li>
    </ul>

    <p class="closing reveal"><span>{{ copy.closing }}</span></p>
  </section>
</template>

<style scoped>
.refusals {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

h2 {
  max-width: 26ch;
}

.lead {
  font-size: 1.02rem;
  max-width: 58ch;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.item {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--border-radius);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.mark {
  flex: none;
  font-weight: 700;
  color: var(--color-text-muted);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.text strong {
  color: var(--color-text);
  /* Struck through: these are the things that are not there. */
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, var(--brand-copper) 45%, transparent);
  text-decoration-thickness: 1.5px;
}

.detail {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.closing {
  margin-top: var(--space-sm);
  max-width: 48ch;
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
