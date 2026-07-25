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

/** One call to action. `primary` is the single emphasised action per block. */
export interface CtaLink {
  label: string
  href: string
  variant: 'primary' | 'secondary' | 'ghost'
  /** Opens in a new tab. Set for anything leaving the site. */
  external?: boolean
}

/**
 * Where a source type stands today. Honest states only:
 * `supported` works in the shipped extension, `partial` works with a known
 * gap the UI surfaces, `planned` is committed but not built, `out` is
 * deliberately outside the first version.
 */
export type ScopeState = 'supported' | 'partial' | 'planned' | 'out'

export interface ScopeItem {
  state: ScopeState
  title: string
  detail: string
}

export interface FaqItem {
  question: string
  answer: string
}

/** Screens 2–6 of the pitch deck. */
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
  }
}

export interface SiteContent extends DeckContent {
  nav: {
    ariaLabel: string
    brand: string
    walkthrough: string
    status: string
    repository: string
  }
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
    /** Who this is for — stated before what it does. */
    audience: string
    description: string
    /** Third line under the sub-headline (deck screen 1). Optional. */
    note?: string
    ctas: CtaLink[]
    /** Stage disclaimer that keeps the hero CTAs honest. */
    statusNote: string
  }
  /** The three commitments that hold across versions. */
  principles: {
    heading: string
    lead: string
    items: RefusalItem[]
    closing: string
  }
  /** What Tunta handles today, where it runs, and what failure looks like. */
  scope: {
    heading: string
    lead: string
    items: ScopeItem[]
    runtime: { label: string; body: string }
    failure: { label: string; body: string }
  }
  faq: {
    heading: string
    lead: string
    items: FaqItem[]
  }
  finalCta: {
    heading: string
    body: string
    ctas: CtaLink[]
    note: string
  }
  footer: {
    text: string
    note: string
  }
}
