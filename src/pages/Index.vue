<script setup lang="ts">
// Tunta Expo — App Entry
// Phase machine: loading → play (physics playground) → leaving (mascot
// flies to the title) → entered (page content, scroll unlocked).
import { animate } from 'animejs'
import { nextTick, ref, watch } from 'vue'
import { introPose } from '../config/mascot'
import LoadingScreen from '../components/LoadingScreen.vue'
import { useI18n } from '../composables/useI18n'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import FeaturesSection from '../sections/FeaturesSection.vue'
import HeroPlayground from '../sections/HeroPlayground.vue'
import IntroSection from '../sections/IntroSection.vue'
import MascotStatesSection from '../sections/MascotStatesSection.vue'
import ProblemSection from '../sections/ProblemSection.vue'
import ProgressSection from '../sections/ProgressSection.vue'
import RefusalsSection from '../sections/RefusalsSection.vue'
import RetrievalSection from '../sections/RetrievalSection.vue'

type Phase = 'loading' | 'play' | 'leaving' | 'entered'

const { t, lang, toggleLang } = useI18n()
const { prefersReducedMotion } = usePrefersReducedMotion()

// `?skip-intro` lands straight on the page content, skipping the loading
// screen and the playground. For demo rehearsal and visual QA, mirroring the
// existing `?debug-loading` flag in LoadingScreen.
const SKIP_INTRO =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('skip-intro')

const phase = ref<Phase>(SKIP_INTRO ? 'entered' : 'loading')
const flying = ref(false)
const flyStyle = ref<Record<string, string>>({})

const heroRef = ref<InstanceType<typeof HeroPlayground>>()
const introRef = ref<InstanceType<typeof IntroSection>>()

// Scroll stays locked until the visitor has entered the page.
watch(
  phase,
  (value) => {
    const locked = value !== 'entered'
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    document.body.style.overflow = locked ? 'hidden' : ''
  },
  { immediate: true },
)

function onLoadingDone(): void {
  // Reduced-motion visitors skip the playground entirely.
  phase.value = prefersReducedMotion.value ? 'entered' : 'play'
}

async function onAbsorbed(): Promise<void> {
  const from = heroRef.value?.getMascotRect()
  phase.value = 'leaving'
  await nextTick()
  const to = introRef.value?.getMascotSlotRect()

  if (!from || !to) {
    phase.value = 'entered'
    return
  }

  // A fixed-position clone flies from the hero center to the title slot.
  const flight = { left: from.left, top: from.top, width: from.width }
  const applyFlight = (): void => {
    flyStyle.value = {
      left: `${flight.left}px`,
      top: `${flight.top}px`,
      width: `${flight.width}px`,
    }
  }
  applyFlight()
  flying.value = true

  animate(flight, {
    left: to.left,
    top: to.top,
    width: to.width,
    duration: 760,
    ease: 'inOutQuint',
    onUpdate: applyFlight,
    onComplete: () => {
      flying.value = false
      phase.value = 'entered'
    },
  })
}
</script>

<template>
  <LoadingScreen v-if="phase === 'loading'" @done="onLoadingDone" />

  <HeroPlayground
    v-if="phase === 'play' || phase === 'leaving'"
    ref="heroRef"
    :active="phase === 'play'"
    :mascot-hidden="phase !== 'play'"
    @absorbed="onAbsorbed"
  />

  <img
    v-if="flying"
    class="fly-mascot"
    :style="flyStyle"
    :src="introPose.flying"
    :alt="t.hero.mascotAlt"
    aria-hidden="true"
    draggable="false"
  />

  <button
    v-if="phase !== 'loading'"
    type="button"
    class="lang-toggle"
    :aria-label="lang === 'zh' ? 'Switch to English' : '切换到中文'"
    @click="toggleLang"
  >
    {{ lang === 'zh' ? 'EN' : '中' }}
  </button>

  <main v-if="phase === 'leaving' || phase === 'entered'" id="app" class="site-main">
    <!-- Screens 1–6 of the deck. Each section renders only if the current
         language has copy for it, so zh and en can differ in length. -->
    <IntroSection ref="introRef" :landed="phase === 'entered'" />
    <ProblemSection />
    <RetrievalSection />
    <MascotStatesSection />
    <RefusalsSection />
    <ProgressSection />
    <FeaturesSection />
    <footer class="site-footer container">
      <p class="footer-text">{{ t.footer.text }}</p>
      <p class="footer-note">{{ t.footer.note }}</p>
    </footer>
  </main>
</template>

<style scoped>
.site-main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.site-footer {
  margin-top: auto;
  padding-block: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.footer-text {
  font-weight: 600;
  color: var(--color-text);
}

.footer-note {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.fly-mascot {
  position: fixed;
  z-index: 40;
  pointer-events: none;
  filter: drop-shadow(0 12px 20px rgb(74 50 38 / 0.25));
}

.lang-toggle {
  position: fixed;
  top: max(14px, env(safe-area-inset-top));
  right: 16px;
  z-index: 60;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgb(15 23 42 / 0.1);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.lang-toggle:hover {
  color: var(--color-text);
  transform: translateY(-1px);
}
</style>
