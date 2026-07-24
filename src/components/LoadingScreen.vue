<script setup lang="ts">
// Tunta Expo — Loading screen: mascot intro + asset preloading + progress bar
import { animate, createTimeline, stagger } from 'animejs'
import { computed, onMounted, ref, watch } from 'vue'
import { introPose } from '../config/mascot'
import photoArticle from '../assets/photo-article.png'
import photoLink from '../assets/photo-link.png'
import photoStar from '../assets/photo-star.png'
import photoVideo from '../assets/photo-video.png'
import { useI18n } from '../composables/useI18n'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'

const emit = defineEmits<{
  done: []
}>()

const { t } = useI18n()
const { prefersReducedMotion } = usePrefersReducedMotion()

const rootRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const mascotRef = ref<HTMLElement>()

const progress = ref(0)
const percent = computed(() => Math.round(progress.value * 100))
const letters = computed(() => [...t.value.loading.title])

// Every pose the entry sequence swaps to is preloaded here — the absorb
// beats change `src` instantly, and an unfetched image would flash empty.
// Duplicates are harmless: they resolve from cache and still tick progress.
const PRELOAD_URLS = [
  photoStar,
  photoVideo,
  photoArticle,
  photoLink,
  introPose.loading,
  introPose.idle,
  introPose.absorbing,
  introPose.fed,
  introPose.flying,
]
// `?debug-loading` slows the intro down, handy for demos and visual QA.
const DEBUG_SLOW =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug-loading')
const MIN_TIME_MS = DEBUG_SLOW ? 5200 : 1600

let leaving = false

function preloadAssets(onProgress: (ratio: number) => void): void {
  let loaded = 0
  for (const url of PRELOAD_URLS) {
    const img = new Image()
    img.onload = img.onerror = () => {
      loaded += 1
      onProgress(loaded / PRELOAD_URLS.length)
    }
    img.src = url
  }
}

function leave(): void {
  if (leaving) return
  leaving = true
  const root = rootRef.value
  const contentEl = contentRef.value
  if (!root) {
    emit('done')
    return
  }
  if (prefersReducedMotion.value) {
    animate(root, {
      opacity: [1, 0],
      duration: 220,
      ease: 'linear',
      onComplete: () => emit('done'),
    })
    return
  }
  const tl = createTimeline({
    defaults: { ease: 'inOutQuart' },
    onComplete: () => emit('done'),
  })
  if (contentEl) {
    tl.add(contentEl, { opacity: [1, 0], y: [0, -32], duration: 320, ease: 'inQuad' })
  }
  tl.add(root, { y: ['0%', '-100%'], duration: 640 }, contentEl ? '-=60' : 0)
}

onMounted(() => {
  const mascot = mascotRef.value
  const root = rootRef.value

  if (!prefersReducedMotion.value) {
    // Entrance: letters pop in one by one, mascot drops in with a bounce.
    if (root) {
      animate(root.querySelectorAll('.loading-letter'), {
        y: [26, 0],
        opacity: [0, 1],
        delay: stagger(55),
        duration: 560,
        ease: 'outQuart',
      })
    }
    if (mascot) {
      animate(mascot, {
        scale: [0, 1],
        duration: 620,
        ease: 'outBack(1.8)',
        onComplete: () => {
          animate(mascot, {
            y: [0, -12],
            duration: 620,
            ease: 'inOutSine',
            loop: true,
            alternate: true,
          })
        },
      })
    }
  }

  // Progress = slowest of (assets preloaded, minimum display time).
  let assetRatio = 0
  const timeProxy = { value: 0 }
  const updateProgress = (): void => {
    progress.value = Math.min(assetRatio, timeProxy.value)
  }
  preloadAssets((ratio) => {
    assetRatio = ratio
    updateProgress()
  })
  animate(timeProxy, {
    value: 1,
    duration: prefersReducedMotion.value ? 350 : MIN_TIME_MS,
    ease: 'linear',
    onUpdate: updateProgress,
    onComplete: updateProgress,
  })
})

watch(progress, (value) => {
  if (value >= 1) leave()
})
</script>

<template>
  <div ref="rootRef" class="loading-screen" role="status" aria-live="polite">
    <div ref="contentRef" class="loading-content">
      <img
        ref="mascotRef"
        class="loading-mascot"
        :src="introPose.loading"
        :alt="t.hero.mascotAlt"
        draggable="false"
      />
      <h1 class="loading-title" aria-label="Tunta">
        <span v-for="(letter, i) in letters" :key="i" class="loading-letter">{{ letter === ' ' ? ' ' : letter }}</span>
      </h1>
      <p class="loading-hint">{{ t.loading.hint }}<span class="loading-dots" aria-hidden="true"></span></p>
      <div class="loading-track">
        <div class="loading-fill" :style="{ width: percent + '%' }"></div>
      </div>
      <p class="loading-percent">{{ percent }}%</p>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(120% 90% at 50% 0%, #fff8ec 0%, #fdf1dd 52%, #f8e4c8 100%);
  color: #4a3226;
  will-change: transform;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  text-align: center;
  padding: var(--space-xl);
}

.loading-mascot {
  width: clamp(120px, 22vmin, 180px);
  height: auto;
  filter: drop-shadow(0 14px 22px rgb(74 50 38 / 0.22));
}

.loading-title {
  display: flex;
  gap: 0.08em;
  font-size: clamp(1.9rem, 5vw, 2.8rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #4a3226;
}

.loading-letter {
  display: inline-block;
}

.loading-hint {
  color: #96704f;
  font-size: 0.95rem;
}

.loading-dots::after {
  content: '…';
  display: inline-block;
  animation: dots 1.2s steps(4) infinite;
  width: 1.2em;
  text-align: left;
  overflow: hidden;
  vertical-align: bottom;
}

@keyframes dots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75%, 100% { content: '...'; }
}

.loading-track {
  width: min(320px, 64vw);
  height: 12px;
  border-radius: 999px;
  background: rgb(74 50 38 / 0.12);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgb(74 50 38 / 0.12);
}

.loading-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f2a65a, #e98b4e 45%, #7ec8c9);
  transition: width 180ms ease-out;
}

.loading-percent {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #b08a63;
}
</style>
