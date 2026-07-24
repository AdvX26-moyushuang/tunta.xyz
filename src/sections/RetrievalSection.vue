<script setup lang="ts">
// Tunta Expo — Screen 3 (the core one): one retrieval, broken into three
// storyboard panels — what you asked, what it answered, how you verify it.
// The middle panel is an illustrative card and stays marked as such.
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.retrieval)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 130 })
</script>

<template>
  <section
    v-if="copy"
    id="retrieval"
    ref="rootRef"
    class="retrieval container"
    aria-label="Tunta retrieval walkthrough"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>

    <ol class="panels">
      <!-- 分镜一 · 你问的 -->
      <li class="panel reveal">
        <p class="step">{{ copy.ask.step }}</p>
        <h3>{{ copy.ask.label }}</h3>
        <blockquote class="question">{{ copy.ask.question }}</blockquote>
        <p class="note">{{ copy.ask.note }}</p>
      </li>

      <!-- 分镜二 · 它给的 -->
      <li class="panel reveal">
        <p class="step">{{ copy.answer.step }}</p>
        <h3>{{ copy.answer.label }}</h3>
        <article class="card">
          <span class="badge">{{ copy.answer.badge }}</span>
          <h4>{{ copy.answer.cardTitle }}</h4>
          <p class="card-body">{{ copy.answer.cardBody }}</p>
          <p class="source">{{ copy.answer.source }}</p>
          <span class="card-cta" aria-hidden="true">{{ copy.answer.cardCta }}</span>
        </article>
        <p class="note">{{ copy.answer.note }}</p>
      </li>

      <!-- 分镜三 · 你验的 -->
      <li class="panel reveal">
        <p class="step">{{ copy.verify.step }}</p>
        <h3>{{ copy.verify.label }}</h3>
        <p class="verify-body">{{ copy.verify.body }}</p>
        <p class="note">{{ copy.verify.note }}</p>
      </li>
    </ol>

    <p class="closing reveal">{{ copy.closing }}</p>
  </section>
</template>

<style scoped>
.retrieval {
  padding-block: clamp(3.5rem, 10vh, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

h2 {
  max-width: 24ch;
  text-align: center;
}

.panels {
  list-style: none;
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  align-items: start;
  width: 100%;
}

/* Arrows between panels on wide screens; they collapse on narrow ones. */
.panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  text-align: left;
}

.panel + .panel::before {
  content: '';
  position: absolute;
  left: calc(var(--space-lg) / -2);
  top: 2.1rem;
  width: 9px;
  height: 9px;
  translate: -50% 0;
  rotate: 45deg;
  border-top: 2px solid var(--color-text-muted);
  border-right: 2px solid var(--color-text-muted);
}

@media (max-width: 720px) {
  .panel + .panel::before {
    left: 1rem;
    top: calc(var(--space-lg) / -2);
    rotate: 135deg;
  }
}

.step {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.panel h3 {
  font-size: 2.3rem;
}

.question {
  padding: var(--space-md);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--color-accent);
  background: color-mix(in srgb, var(--brand-nebula) 26%, transparent);
  font-size: 0.98rem;
  color: var(--color-text);
}

.note {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  max-width: 34ch;
}

/* The example card — deliberately flagged, never dressed up as real output. */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background: var(--color-bg-secondary);
  box-shadow: 0 12px 26px color-mix(in srgb, var(--brand-copper) 10%, transparent);
}

.badge {
  align-self: flex-start;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-butter) 90%, transparent);
  color: var(--color-primary-dark);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.card h4 {
  font-size: 2rem;
  line-height: 1.45;
  color: var(--color-text);
}

.card-body {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  max-width: none;
}

.source {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--color-border);
  max-width: none;
}

.card-cta {
  align-self: flex-start;
  padding: 0.42em 1.1em;
  border-radius: 999px;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 600;
}

.verify-body {
  font-size: 0.98rem;
  color: var(--color-text-secondary);
  max-width: 34ch;
}

.closing {
  width: min(100%, 46ch);
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 700;
  line-height: 1.5;
  color: var(--color-text);
  margin-inline: auto;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid color-mix(in srgb, var(--brand-copper) 16%, var(--brand-seashell));
  border-radius: var(--border-radius-lg);
  background: color-mix(in srgb, var(--brand-butter) 24%, transparent);
  text-align: left;
}
</style>
