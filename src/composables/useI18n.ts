// Tunta Expo — Tiny i18n composable (zh / en)
import { computed, ref } from 'vue'
import { content } from '../content'
import type { Lang, SiteContent } from '../types'

const lang = ref<Lang>('zh')

export function useI18n() {
  const t = computed<SiteContent>(() => content[lang.value])

  function toggleLang(): void {
    lang.value = lang.value === 'zh' ? 'en' : 'zh'
  }

  return { lang, t, toggleLang }
}
