// Tunta Expo — Mascot pose pool and the maps that assign poses to states.
//
// `poses` holds the artwork (all 320×320, bottom-aligned on a square canvas,
// so swapping one for another never shifts layout mid-animation).
// The maps below are the only place a state picks its pose — retheme the
// whole intro by editing a single line here.
// Three more poses are drawn and sized but not assigned to any state yet:
// chilling.png (sunglasses on a pillow), lounging.png (sitting back with a
// drink) and turned-away.png (seen from behind). They are deliberately not
// imported — an unused import still ships the file. Add the import and a
// `poses` entry when you want one.
import cheering from '../assets/mascot-poses/cheering.png'
import sipping from '../assets/mascot-poses/sipping.png'
import sleeping from '../assets/mascot-poses/sleeping.png'
import standing from '../assets/mascot-poses/standing.png'
import startled from '../assets/mascot-poses/startled.png'
import type { MascotStateKey } from '../types'

export const poses = {
  /** Upright, paws folded — calm, working. */
  standing,
  /** Both paws around a boba cup, drinking through the straw. */
  sipping,
  /** Paws up, mouth wide open — startled, or mid-swallow. */
  startled,
  /** Arms up with little hearts — pleased. */
  cheering,
  /** Lying down, eyes shut. */
  sleeping,
} as const

export type PoseName = keyof typeof poses

/**
 * The entry sequence: loading → playground → absorb → flight → landed.
 *
 * `flying` must match the first frame IntroSection lands on — the clone hands
 * off to the title slot mid-air, and a silhouette change there reads as a
 * glitch. That first frame is `FRAMES[0]` in IntroSection.vue, currently
 * 'done', which `pipelineStatePose` maps to the same `cheering` pose.
 */
export const introPose = {
  /** Loading screen, counting bookmarks. */
  loading: poses.standing,
  /**
   * Playground idle. Same pose as the loading screen on purpose: the loading
   * screen slides up to reveal the playground, so a different drawing here
   * would flash as a third otter between two beats that are already one shot.
   */
  idle: poses.standing,
  /** The instant it opens wide to swallow the pile. */
  absorbing: poses.startled,
  /** After the gulp, everything bursts back out. */
  fed: poses.cheering,
  /** The fixed-position clone flying to the title slot. */
  flying: poses.cheering,
} as const

/** Screen 4: one pose per pipeline state. */
export const pipelineStatePose: Record<MascotStateKey, string> = {
  idle: poses.sleeping,
  fetching: poses.standing,
  parsing: poses.sipping,
  done: poses.cheering,
  failed: poses.startled,
}
