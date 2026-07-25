<script setup lang="ts">
// Tunta Expo — Screen 4: the three commitments. This is the differentiation
// screen: not "AI tidies up for you", but "every answer can be traced back".
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRevealOnScroll } from '../composables/useRevealOnScroll'

const { t } = useI18n()
const copy = computed(() => t.value.principles)

const rootRef = ref<HTMLElement>()
useRevealOnScroll(rootRef, { stagger: 90 })
</script>

<template>
  <section
    v-if="copy"
    id="principles"
    ref="rootRef"
    class="principles container"
    aria-label="Tunta principles"
  >
    <h2 class="reveal">{{ copy.heading }}</h2>
    <div class="content">
      <p class="lead reveal">{{ copy.lead }}</p>

      <ol class="list">
        <li v-for="(item, i) in copy.items" :key="item.title" class="item reveal">
          <span class="index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">
            <strong>{{ item.title }}</strong>
            <span class="detail">{{ item.detail }}</span>
          </span>
        </li>
      </ol>

      <p class="closing reveal"><span>{{ copy.closing }}</span></p>
    </div>
  </section>
</template>

<style scoped>
.principles {
  padding-block: clamp(3.5rem, 10vh, 6rem);
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
  gap: var(--space-lg);
  width: 100%;
  max-width: 58ch;
}

.lead {
  font-size: var(--font-body);
  width: 100%;
  text-align: left;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  width: 100%;
  text-align: left;
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

/* Numbered rather than ticked: these are commitments in order of weight,
   not a feature checklist. */
.index {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.text strong {
  color: var(--color-text);
}

.detail {
  font-size: var(--font-body-sm);
  color: var(--color-text-muted);
  line-height: 1.55;
}

.closing {
  margin-top: var(--space-sm);
  width: min(100%, 48ch);
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
  .principles {
    grid-template-columns: 1fr;
    gap: clamp(3rem, 9vh, 5rem);
  }

  .content {
    margin-inline: auto;
  }
}
</style>
