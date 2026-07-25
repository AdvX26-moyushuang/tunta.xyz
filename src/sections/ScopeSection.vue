<script setup lang="ts">
// Tunta Expo — Screen 6: what actually happens when you hit save today.
// Seven source types is too tall for the side-by-side layout the earlier
// screens use, so this one takes ProgressSection's centred axis and lays the
// items out in a grid.
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'
import type { ScopeState } from '../types'

const { t } = useI18n()
const copy = computed(() => t.value.scope)

/** Chip label per state. Deliberately blunt — "不做" is not "coming soon". */
const STATE_LABEL: Record<ScopeState, string> = {
  supported: '已支持',
  partial: '部分支持',
  planned: '计划中',
  out: '不做',
}

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 70 })
</script>

<template>
  <section
    v-if="copy"
    id="scope"
    ref="rootRef"
    class="scope container"
    aria-label="Tunta supported scope"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p class="lead reveal">{{ copy.lead }}</p>

    <ul class="list">
      <li
        v-for="item in copy.items"
        :key="item.title"
        class="item reveal"
        :class="item.state"
      >
        <span class="chip">
          <span class="dot" aria-hidden="true"></span>
          {{ STATE_LABEL[item.state] }}
        </span>
        <strong class="title">{{ item.title }}</strong>
        <span class="detail">{{ item.detail }}</span>
      </li>
    </ul>

    <div class="notes">
      <div class="note reveal">
        <span class="note-label">{{ copy.runtime.label }}</span>
        <p class="note-body">{{ copy.runtime.body }}</p>
      </div>
      <div class="note reveal">
        <span class="note-label">{{ copy.failure.label }}</span>
        <p class="note-body">{{ copy.failure.body }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Seven items plus two notes is the densest screen in the deck, so the
   rhythm here is tighter than the surrounding sections — it still has to
   land inside one scroll-snap viewport. */
.scope {
  /* Asymmetric on purpose: this screen can grow taller than the viewport, so
     scroll-snap parks its top edge at y=0 and the heading would sit under the
     fixed nav. Top padding clears the nav; the bottom gives the budget back. */
  padding-top: clamp(5.25rem, 10vh, 6.5rem);
  padding-bottom: clamp(1.25rem, 2.5vh, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

h2 {
  max-width: 16ch;
  margin-inline: auto;
  text-align: center;
}

.lead {
  font-size: var(--font-body);
  width: min(100%, 60ch);
  text-align: left;
}

.list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
  text-align: left;
}

.item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 0.3rem var(--space-md);
  padding: 0.75rem var(--space-md);
  border-radius: var(--border-radius);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.chip {
  grid-column: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-nebula) 26%, transparent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
}

.title {
  grid-column: 2;
  color: var(--color-text);
  font-size: var(--font-body);
}

.detail {
  grid-column: 1 / -1;
  font-size: var(--font-body-sm);
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* The chip carries the whole status signal, so it is the only thing that
   changes colour. Cards stay uniform — a "不做" row is not a warning. */
.item.supported .chip {
  background: color-mix(in srgb, var(--color-success) 16%, transparent);
  color: color-mix(in oklab, var(--color-success), black 32%);
}

.item.partial .chip {
  background: color-mix(in srgb, var(--color-warning) 20%, transparent);
  color: color-mix(in oklab, var(--color-warning), black 42%);
}

.item.planned .chip {
  background: color-mix(in srgb, var(--brand-butter) 55%, transparent);
  color: var(--color-text-secondary);
}

.item.out {
  background: transparent;
  border-style: dashed;
}

.item.out .chip {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.item.out .title {
  color: var(--color-text-muted);
}

.notes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: var(--space-sm);
  width: 100%;
  margin-top: var(--space-xs);
}

.note {
  padding: 0.75rem var(--space-md);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--brand-nebula) 30%, transparent);
  text-align: left;
}

.note-label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-text);
}

.note-body {
  font-size: var(--font-body-sm);
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: none;
}

@media (max-width: 720px) {
  .lead {
    margin-inline: auto;
  }
}
</style>
