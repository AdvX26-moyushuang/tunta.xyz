<script setup lang="ts">
import avatarUrl from '../assets/tunta-ip/IMG_6456.PNG'
import { links } from '../content'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <nav class="top-nav" :aria-label="t.nav.ariaLabel">
    <a class="brand-link" href="#app">
      <span class="brand-avatar" aria-hidden="true">
        <img :src="avatarUrl" alt="" draggable="false" />
      </span>
      <span class="brand-copy">{{ t.nav.brand }}</span>
    </a>
    <span class="divider" aria-hidden="true"></span>
    <a class="nav-link" href="#retrieval">{{ t.nav.walkthrough }}</a>
    <a class="nav-link" href="#status">{{ t.nav.status }}</a>
    <a
      class="repo-link"
      :href="links.repo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.02a9.3 9.3 0 0 1 2.5.34c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"
        />
      </svg>
      <span>{{ t.nav.repository }}</span>
      <span class="external-arrow" aria-hidden="true">↗</span>
    </a>
  </nav>
</template>

<style scoped>
.top-nav {
  position: fixed;
  top: max(14px, env(safe-area-inset-top));
  left: 50%;
  z-index: 70;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  width: max-content;
  max-width: calc(100vw - 24px);
  padding: 0.42rem;
  border: 1px solid color-mix(in srgb, var(--brand-copper) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--brand-seashell) 86%, transparent);
  box-shadow:
    0 16px 40px color-mix(in srgb, var(--brand-copper) 14%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.65);
  backdrop-filter: blur(18px) saturate(1.2);
  transform: translateX(-50%);
  animation: nav-arrive 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.top-nav a {
  min-height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 0.82rem;
  font-weight: 700;
}

.brand-link {
  gap: 0.5rem;
  padding: 0.1rem 0.8rem 0.1rem 0.12rem;
  color: var(--color-text);
}

.brand-avatar {
  position: relative;
  width: 2.8rem;
  height: 2.8rem;
  margin-left: -0.25rem;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  background: var(--brand-butter);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--brand-copper) 12%, transparent),
    0 4px 10px color-mix(in srgb, var(--brand-copper) 12%, transparent);
}

.brand-avatar img {
  width: 100%;
  height: 100%;
  padding-right: 3px;
  object-fit: contain;
  transform: scale(2.15) translateY(19%);
}

.divider {
  width: 1px;
  height: 1.35rem;
  margin-inline: 0.15rem;
  background: var(--color-border);
}

.nav-link {
  padding-inline: 0.8rem;
  color: var(--color-text-secondary);
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--brand-nebula) 36%, transparent);
}

.repo-link {
  gap: 0.42rem;
  padding-inline: 0.85rem;
  background: var(--color-primary);
  color: var(--brand-seashell);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--brand-copper) 22%, transparent);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}

.repo-link:hover {
  color: #fff;
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.repo-link svg {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.external-arrow {
  font-size: 0.72rem;
  opacity: 0.72;
}

@keyframes nav-arrive {
  from {
    opacity: 0;
    transform: translate(-50%, -10px) scale(0.96);
  }
}

@media (max-width: 520px) {
  .top-nav {
    gap: 0.05rem;
  }

  .brand-link {
    padding-right: 0.25rem;
  }

  .brand-copy,
  .divider {
    display: none;
  }

  .nav-link,
  .repo-link {
    padding-inline: 0.65rem;
  }
}
</style>
