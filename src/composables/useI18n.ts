// Tunta Expo — Reactive access to the site content
import { computed } from 'vue'
import { content } from '../content'
import type { SiteContent } from '../types'

const t = computed<SiteContent>(() => content)

export function useI18n() {
  return { t }
}
