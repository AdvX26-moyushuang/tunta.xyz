<script setup lang="ts">
// Tunta Expo — Loading screen: brand intro + asset preloading + progress wave
import { animate, createTimeline } from 'animejs'
import { computed, onMounted, ref, watch } from 'vue'
import logoBigUrl from '../assets/logo-big.png'
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
const logoFrameRef = ref<HTMLElement>()

const progress = ref(0)
const percent = computed(() => Math.round(progress.value * 100))

// Every pose the entry sequence swaps to is preloaded here — the absorb
// beats change `src` instantly, and an unfetched image would flash empty.
// Duplicates are harmless: they resolve from cache and still tick progress.
const PRELOAD_URLS = [
  photoStar,
  photoVideo,
  photoArticle,
  photoLink,
  introPose.idle,
  introPose.absorbing,
  introPose.fed,
  introPose.flying,
  logoBigUrl,
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
  const logoFrame = logoFrameRef.value

  if (!prefersReducedMotion.value) {
    if (logoFrame) {
      animate(logoFrame, {
        y: [18, 0],
        opacity: [0, 1],
        scale: [0.94, 1],
        duration: 620,
        ease: 'outQuart',
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
      <div ref="logoFrameRef" class="loading-logo-frame">
        <img class="loading-logo" :src="logoBigUrl" :alt="t.loading.title" draggable="false" />
      </div>
      <p class="loading-hint">{{ t.loading.hint }}<span class="loading-dots" aria-hidden="true"></span></p>
      <div
        class="loading-wave"
        role="progressbar"
        :aria-label="t.loading.hint"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="percent"
      >
        <svg viewBox="0 0 320 48" preserveAspectRatio="none" aria-hidden="true">
          <path
            class="loading-wave-track"
            d="M0 24 C13.33 8 26.67 8 40 24 S66.67 40 80 24 S106.67 8 120 24 S146.67 40 160 24 S186.67 8 200 24 S226.67 40 240 24 S266.67 8 280 24 S306.67 40 320 24"
          />
          <path
            class="loading-wave-progress"
            pathLength="100"
            :style="{ strokeDashoffset: 100 - percent }"
            d="M0 24 C13.33 8 26.67 8 40 24 S66.67 40 80 24 S106.67 8 120 24 S146.67 40 160 24 S186.67 8 200 24 S226.67 40 240 24 S266.67 8 280 24 S306.67 40 320 24"
          />
        </svg>
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

.loading-logo-frame {
  position: relative;
  width: clamp(18rem, 52vw, 31rem);
  aspect-ratio: 1699 / 720;
  overflow: hidden;
  filter: drop-shadow(0 14px 22px rgb(74 50 38 / 0.18));
}

/* logo-big.png has a square transparent canvas. These values map its measured
   alpha bounds (x 193, y 565, 1699 × 720) exactly into the frame. */
.loading-logo {
  position: absolute;
  left: -11.36%;
  top: -78.47%;
  width: 120.54%;
  height: 284.44%;
  max-width: none;
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

.loading-wave {
  width: min(320px, 64vw);
  height: 48px;
}

.loading-wave svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.loading-wave-track,
.loading-wave-progress {
  fill: none;
  stroke-linecap: round;
  stroke-width: 14;
  vector-effect: non-scaling-stroke;
}

.loading-wave-track {
  stroke: color-mix(in srgb, var(--color-accent) 34%, transparent);
}

.loading-wave-progress {
  stroke: var(--color-accent);
  stroke-dasharray: 100;
  transition: stroke-dashoffset 180ms ease-out;
  filter: drop-shadow(0 4px 8px color-mix(in srgb, var(--color-accent) 48%, transparent));
}

.loading-percent {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #b08a63;
}
</style>
