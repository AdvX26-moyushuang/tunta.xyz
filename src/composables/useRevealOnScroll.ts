// Tunta Expo — Reveal-on-scroll composable.
// Fades `.reveal` children in once the section first enters the viewport.
// Reduced-motion visitors (and environments without IntersectionObserver)
// get the content immediately, no animation.
import { animate, stagger } from 'animejs'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface RevealOptions {
  /** Delay between siblings, in ms. */
  stagger?: number
  /** Visible fraction of the section that triggers the reveal. */
  threshold?: number
}

export function useRevealOnScroll(rootRef: Ref<HTMLElement | undefined>, options: RevealOptions = {}) {
  const { prefersReducedMotion } = usePrefersReducedMotion()
  const step = options.stagger ?? 110
  const threshold = options.threshold ?? 0.2

  let observer: IntersectionObserver | null = null

  function stop(): void {
    observer?.disconnect()
    observer = null
  }

  onMounted(() => {
    const root = rootRef.value
    if (!root) return
    const targets = root.querySelectorAll('.reveal')
    if (!targets.length) return

    if (prefersReducedMotion.value || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('shown'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        stop()
        animate(targets, {
          y: [32, 0],
          opacity: [0, 1],
          delay: stagger(step),
          duration: 640,
          ease: 'outQuart',
        })
      },
      { threshold },
    )
    observer.observe(root)
  })

  onBeforeUnmount(stop)
}
