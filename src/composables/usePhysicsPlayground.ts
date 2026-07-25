// Tunta Expo — Physics playground powered by matter-js
// The world runs in CSS-pixel coordinates; rendering is delegated to the
// component through `onRender` so boxes stay ordinary styled DOM elements.
import Matter from 'matter-js'

export type PlaygroundItemKind = 'box' | 'photo'

export interface PlaygroundItemSpec {
  id: number
  kind: PlaygroundItemKind
  w: number
  h: number
  color?: string
  edge?: string
  face?: boolean
  image?: string
  caption?: string
}

export interface ItemVisualState {
  x: number
  y: number
  angle: number
  scale: number
  opacity: number
}

export interface TrackedItem {
  spec: PlaygroundItemSpec
  state: ItemVisualState
  body: Matter.Body
}

export interface PhysicsMaterial {
  restitution: number
  friction: number
  frictionAir: number
  density: number
  /** Rounded-corner radius (px), capped per item by its size. */
  chamferRadius: number
}

const DEFAULT_MATERIAL: PhysicsMaterial = {
  restitution: 0.34,
  friction: 0.42,
  frictionAir: 0.012,
  density: 0.0012,
  chamferRadius: 10,
}

export interface AddItemsOrigin {
  /** Horizontal center (container coords) for the new batch. */
  x: number
  /** Horizontal scatter radius around `x` in px. */
  spread?: number
}

export interface PhysicsController {
  /** Items with live visual states (mutated by physics / anime.js). */
  readonly items: TrackedItem[]
  /** Spawn bodies, start the loop, enable mouse drag + tilt. Idempotent. */
  start: () => void
  /** Drop extra items from above while the world is running. */
  add: (specs: PlaygroundItemSpec[], origin?: AddItemsOrigin) => void
  /** Freeze physics and detach all bodies; visual states stay put. */
  detach: () => TrackedItem[]
  /** Rebuild boundary walls after a container resize. */
  resize: () => void
  /** Tear everything down (listeners, loop, world). */
  destroy: () => void
}

export interface PhysicsPlaygroundOptions {
  container: HTMLElement
  specs: PlaygroundItemSpec[]
  onRender: (item: TrackedItem) => void
  onTiltActive?: () => void
  /** Partial material overrides for every spawned body. */
  material?: Partial<PhysicsMaterial>
}

const WALL = 140
const STEP_MS = 1000 / 60
/** Bodies may never rise higher than this many container heights above the top. */
const MAX_RISE_HEIGHTS = 1

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function createPhysicsPlayground(options: PhysicsPlaygroundOptions): PhysicsController {
  const { container, specs, onRender, onTiltActive } = options
  const material: PhysicsMaterial = { ...DEFAULT_MATERIAL, ...options.material }

  const engine = Matter.Engine.create({ enableSleeping: false })
  const world = engine.world
  engine.gravity.y = 1

  const items: TrackedItem[] = specs.map((spec) => {
    const state: ItemVisualState = { x: 0, y: 0, angle: 0, scale: 1, opacity: 1 }
    // Placeholder body, replaced with a properly spawned one in start().
    const body = Matter.Bodies.rectangle(0, 0, spec.w, spec.h)
    return { spec, state, body }
  })

  let walls: Matter.Body[] = []
  let mouse: Matter.Mouse | null = null
  let mouseConstraint: Matter.MouseConstraint | null = null
  let rafId = 0
  let running = false
  let destroyed = false

  function buildWalls(): void {
    const w = container.clientWidth
    const h = container.clientHeight
    if (walls.length > 0) {
      Matter.Composite.remove(world, walls)
    }
    const opts: Matter.IChamferableBodyDefinition = { isStatic: true, friction: 0.5, restitution: 0.05 }
    walls = [
      // floor (top surface sits 1px above the container bottom edge)
      Matter.Bodies.rectangle(w / 2, h + WALL / 2 - 1, w + WALL * 2, WALL, opts),
      // left / right
      Matter.Bodies.rectangle(-WALL / 2 + 1, h / 2, WALL, h * 4, opts),
      Matter.Bodies.rectangle(w + WALL / 2 - 1, h / 2, WALL, h * 4, opts),
      // far ceiling so dragged items can not escape upwards
      Matter.Bodies.rectangle(w / 2, -h * 3, w + WALL * 2, WALL, opts),
    ]
    Matter.Composite.add(world, walls)
  }

  function createBody(spec: PlaygroundItemSpec, x: number, y: number): Matter.Body {
    const body = Matter.Bodies.rectangle(x, y, spec.w, spec.h, {
      chamfer: { radius: Math.min(material.chamferRadius, spec.w * 0.12, spec.h * 0.12) },
      restitution: material.restitution,
      friction: material.friction,
      frictionAir: material.frictionAir,
      density: material.density,
      angle: rand(-0.4, 0.4),
    })
    Matter.Body.setVelocity(body, { x: rand(-2.4, 2.4), y: rand(0, 2) })
    Matter.Body.setAngularVelocity(body, rand(-0.09, 0.09))
    return body
  }

  function spawnBodies(): void {
    const w = container.clientWidth
    const bodies: Matter.Body[] = []
    items.forEach((item, index) => {
      item.body = createBody(item.spec, rand(w * 0.1, w * 0.9), -80 - index * rand(56, 96))
      item.state.x = item.body.position.x
      item.state.y = item.body.position.y
      item.state.angle = item.body.angle
      onRender(item)
      bodies.push(item.body)
    })
    Matter.Composite.add(world, bodies)
  }

  function add(specsToAdd: PlaygroundItemSpec[], origin?: AddItemsOrigin): void {
    if (!running || destroyed || specsToAdd.length === 0) return
    const w = container.clientWidth
    const spread = origin?.spread ?? 60
    const bodies: Matter.Body[] = []
    specsToAdd.forEach((spec, index) => {
      const x = clamp(
        (origin?.x ?? w / 2) + rand(-spread, spread),
        spec.w / 2 + 8,
        w - spec.w / 2 - 8,
      )
      const y = -60 - index * rand(48, 88)
      const body = createBody(spec, x, y)
      const state: ItemVisualState = {
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
        scale: 1,
        opacity: 1,
      }
      const item = { spec, state, body }
      items.push(item)
      onRender(item)
      bodies.push(body)
    })
    Matter.Composite.add(world, bodies)
  }

  function setupMouseDrag(): void {
    mouse = Matter.Mouse.create(container)
    mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.12,
      },
    })
    // matter-js supports angularStiffness at runtime but @types/matter-js
    // does not declare it; extend the type locally instead of using `any`.
    ;(mouseConstraint.constraint as Matter.Constraint & { angularStiffness: number }).angularStiffness = 0
    Matter.Composite.add(world, mouseConstraint)
  }

  // ---- Gyroscope tilt (mobile) ----

  const isTouchDevice =
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  let tiltBound = false
  let tiltNotified = false

  function onOrientation(event: DeviceOrientationEvent): void {
    if (event.beta == null || event.gamma == null) return
    const rad = Math.PI / 180
    engine.gravity.x = clamp(Math.sin(event.gamma * rad), -1, 1)
    engine.gravity.y = clamp(Math.sin(event.beta * rad), -1, 1)
    if (!tiltNotified) {
      tiltNotified = true
      onTiltActive?.()
    }
  }

  function bindTilt(): void {
    if (tiltBound) return
    tiltBound = true
    window.addEventListener('deviceorientation', onOrientation)
  }

  function enableTilt(): void {
    if (!isTouchDevice || typeof DeviceOrientationEvent === 'undefined') return
    // iOS 13+ requires an explicit, gesture-triggered permission request.
    const doe = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>
    }
    if (typeof doe.requestPermission === 'function') {
      const ask = (): void => {
        doe
          .requestPermission?.()
          .then((result) => {
            if (result === 'granted') bindTilt()
          })
          .catch(() => undefined)
      }
      container.addEventListener('pointerdown', ask, { once: true })
    } else {
      bindTilt()
    }
  }

  // ---- Main loop ----

  let lastTime = 0
  let accumulator = 0

  function syncStates(): void {
    for (const item of items) {
      const { body, state } = item
      state.x = body.position.x
      state.y = body.position.y
      state.angle = body.angle
      onRender(item)
    }
  }

  // Soft ceiling at -MAX_RISE_HEIGHTS × container height. Only bodies moving
  // upward are stopped, so the initial cascade (which spawns above the limit
  // but falls downward) keeps its staggered timing, while flipped-gravity
  // devices can not fling the pile away.
  function clampRise(): void {
    const minY = -container.clientHeight * MAX_RISE_HEIGHTS
    for (const item of items) {
      const body = item.body
      if (body.position.y < minY && body.velocity.y < 0) {
        Matter.Body.setPosition(body, { x: body.position.x, y: minY })
        Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 })
      }
    }
  }

  function tick(now: number): void {
    if (!running) return
    rafId = requestAnimationFrame(tick)
    if (lastTime === 0) lastTime = now
    accumulator += Math.min(now - lastTime, 100)
    lastTime = now
    while (accumulator >= STEP_MS) {
      Matter.Engine.update(engine, STEP_MS)
      accumulator -= STEP_MS
    }
    clampRise()
    syncStates()
  }

  function start(): void {
    if (running || destroyed) return
    running = true
    buildWalls()
    spawnBodies()
    setupMouseDrag()
    enableTilt()
    rafId = requestAnimationFrame(tick)
  }

  function detach(): TrackedItem[] {
    if (!running) return items
    running = false
    cancelAnimationFrame(rafId)
    rafId = 0
    lastTime = 0
    accumulator = 0
    // Keep visual states current before freezing the world.
    syncStates()
    if (mouseConstraint) {
      Matter.Composite.remove(world, mouseConstraint)
      mouseConstraint = null
    }
    if (mouse) {
      Matter.Mouse.clearSourceEvents(mouse)
      mouse = null
    }
    Matter.Composite.remove(world, items.map((item) => item.body))
    if (walls.length > 0) {
      Matter.Composite.remove(world, walls)
      walls = []
    }
    return items
  }

  function resize(): void {
    if (running) buildWalls()
  }

  function destroy(): void {
    if (destroyed) return
    detach()
    destroyed = true
    if (tiltBound) {
      window.removeEventListener('deviceorientation', onOrientation)
      tiltBound = false
    }
    Matter.Engine.clear(engine)
  }

  return { items, start, add, detach, resize, destroy }
}
