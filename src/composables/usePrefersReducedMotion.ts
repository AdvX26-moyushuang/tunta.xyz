// Tunta Expo — prefers-reduced-motion media query hook
import { onBeforeUnmount, ref } from 'vue'

export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false)

  let mql: MediaQueryList | null = null
  const update = (): void => {
    prefersReducedMotion.value = Boolean(mql?.matches)
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mql.addEventListener('change', update)
  }

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', update)
    mql = null
  })

  return { prefersReducedMotion }
}
