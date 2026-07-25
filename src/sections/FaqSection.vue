<script setup lang="ts">
// Tunta Expo — Screen 9: the questions people ask before trusting a tool that
// reads their pages. Accordion so eight answers still fit one screen.
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.faq)

/** Index of the open row, or null when every row is collapsed. */
const openIndex = ref<number | null>(0)

function toggle(index: number): void {
  openIndex.value = openIndex.value === index ? null : index
}

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 60 })
</script>

<template>
  <section v-if="copy" id="faq" ref="rootRef" class="faq container" aria-label="Tunta FAQ">
    <h2 class="reveal">{{ copy.heading }}</h2>
    <p class="lead reveal">{{ copy.lead }}</p>

    <ul class="list">
      <li v-for="(item, i) in copy.items" :key="item.question" class="item reveal">
        <h3 class="question-heading">
          <button
            type="button"
            class="question"
            :aria-expanded="openIndex === i"
            :aria-controls="`faq-answer-${i}`"
            @click="toggle(i)"
          >
            <span>{{ item.question }}</span>
            <span class="sign" :class="{ open: openIndex === i }" aria-hidden="true"></span>
          </button>
        </h3>
        <!-- 0fr → 1fr animates the row height without measuring it in JS. -->
        <div :id="`faq-answer-${i}`" class="answer-wrap" :class="{ open: openIndex === i }">
          <div class="answer-clip">
            <p class="answer">{{ item.answer }}</p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.faq {
  /* See ScopeSection: top padding has to clear the fixed nav because an
     opened accordion can push this screen past the viewport height. */
  padding-top: clamp(5.25rem, 10vh, 6.5rem);
  padding-bottom: clamp(1.25rem, 2.5vh, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

h2 {
  max-width: 14ch;
  margin-inline: auto;
  text-align: center;
}

.lead {
  font-size: var(--font-body);
  color: var(--color-text-muted);
  text-align: center;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  /* Rows share their borders — nine gaps is height this screen cannot spare. */
  width: min(100%, 72ch);
  margin-top: var(--space-sm);
  text-align: left;
}

.item {
  border-bottom: 1px solid var(--color-border);
}

.question-heading {
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
}

.question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 0.72rem var(--space-sm);
  border: 0;
  background: none;
  font-family: inherit;
  font-size: var(--font-body);
  font-weight: 700;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.question:hover {
  color: var(--color-primary);
}

/* Plus that rotates into a minus — one element, no icon swap. */
.sign {
  position: relative;
  flex: none;
  width: 0.85rem;
  height: 0.85rem;
}

.sign::before,
.sign::after {
  content: '';
  position: absolute;
  inset: 50% 0 auto;
  height: 1.5px;
  border-radius: 1px;
  background: var(--color-primary);
  transition: transform var(--transition-base);
}

.sign::after {
  transform: rotate(90deg);
}

.sign.open::after {
  transform: rotate(0deg);
}

.answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-base);
}

.answer-wrap.open {
  grid-template-rows: 1fr;
}

.answer-clip {
  overflow: hidden;
}

.answer {
  padding: 0 var(--space-sm) var(--space-md);
  font-size: var(--font-body-sm);
  line-height: 1.7;
  color: var(--color-text-muted);
  max-width: none;
}

@media (prefers-reduced-motion: reduce) {
  .answer-wrap,
  .sign::before,
  .sign::after {
    transition: none;
  }
}
</style>
