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

export interface SiteContent {
  loading: {
    title: string
    hint: string
  }
  hero: {
    mascotAlt: string
    dragHint: string
    clickHint: string
    scrollHint: string
    gyroHint: string
    captions: string[]
  }
  intro: {
    title: string
    tagline: string
    description: string
    primaryCta: string
    secondaryCta: string
  }
  features: {
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
