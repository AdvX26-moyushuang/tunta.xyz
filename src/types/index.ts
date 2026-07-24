// Tunta Expo — Type Definitions

export interface NavItem {
  label: string
  href: string
}

export interface WorkflowStep {
  title: string
  description: string
  icon?: string
}

export interface TimelineItem {
  version: string
  date?: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned'
}

export type Lang = 'zh' | 'en'

export type FeatureIcon = 'capture' | 'review' | 'recall'

export interface FeatureCard {
  icon: FeatureIcon
  title: string
  description: string
}

/** The five pipeline states the mascot makes visible (deck screen 4). */
export type MascotStateKey = 'idle' | 'fetching' | 'parsing' | 'done' | 'failed'

export interface MascotState {
  key: MascotStateKey
  label: string
  description: string
}

/** One storyboard panel of a single retrieval (deck screen 3). */
export interface RetrievalPanel {
  step: string
  label: string
  note: string
}

export interface RefusalItem {
  title: string
  detail: string
}

/**
 * Screens 2–6 of the pitch deck. Optional on SiteContent so a language can
 * be translated one screen at a time — sections render only what exists,
 * instead of falling back to another language's copy.
 */
export interface DeckContent {
  problem: {
    heading: string
    paragraphs: string[]
    closing: string
  }
  retrieval: {
    heading: string
    ask: RetrievalPanel & { question: string }
    answer: RetrievalPanel & {
      badge: string
      cardTitle: string
      cardBody: string
      source: string
      cardCta: string
    }
    verify: RetrievalPanel & { body: string }
    closing: string
  }
  mascot: {
    heading: string
    paragraphs: string[]
    states: MascotState[]
    closing: string
  }
  refusals: {
    heading: string
    lead: string
    items: RefusalItem[]
    closing: string
  }
  progress: {
    heading: string
    paragraphs: string[]
    statusLine: string
    cta: string
  }
}

export interface SiteContent extends Partial<DeckContent> {
  loading: {
    title: string
    hint: string
  }
  hero: {
    mascotAlt: string
    dragHint: string
    clickHint: string
    summonHint: string
    scrollHint: string
    gyroHint: string
    captions: string[]
  }
  intro: {
    title: string
    tagline: string
    description: string
    /** Third line under the sub-headline (deck screen 1). Optional. */
    note?: string
    primaryCta: string
    secondaryCta: string
  }
  /** The old three-card workflow screen. Superseded by `retrieval` in zh. */
  features?: {
    heading: string
    items: FeatureCard[]
    statusLabel: string
    status: string
  }
  footer: {
    text: string
    note: string
  }
}
