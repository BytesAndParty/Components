import { Component, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import type { MotionValue } from 'motion/react'
import {
  BackSide,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Path,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  type Group,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  type WebGLRenderer,
} from 'three'
import { cssColorToRgb } from '@components/lib/css-color'
import { usePrefersReducedMotion } from '@components/lib/use-prefers-reduced-motion'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface BottleStageProps {
  /**
   * Image wrapped around the bottle as its front label (URL or data URL,
   * 5:7 portrait). Without it the bottle stays unlabelled.
   */
  labelSrc?: string
  /** Glass color as CSS color; `var(…)` works (default: a green so dark it is almost black) */
  glassColor?: string
  /** Color of the screw cap as CSS color (default: `var(--accent)`) */
  capsuleColor?: string
  /**
   * Scroll or timeline progress 0..1. The bottle turns by `turns` on the way
   * and faces the viewer with its label at 1. Without it the label stays in front.
   */
  progress?: MotionValue<number>
  /** Full turns over `progress` 0 → 1 (default: 0.75) */
  turns?: number
  /** Lean the bottle toward the mouse pointer (default: true) */
  followPointer?: boolean
  className?: string
  style?: CSSProperties
}

// ─── Geometry ───────────────────────────────────────────────────────────────────

// A bottle is a solid of revolution: one profile curve, turned around the Y axis
// by <latheGeometry>.
//
// The proportions are measured from a product photo of the Buchart 58 shop
// (Merlot 0.75 l, a slim Bordeaux bottle with a screw cap): the silhouette was
// read row by row and scaled to a height of 3. Diameter to height is 0.24.
const BOTTLE_HEIGHT = 3
const BODY_RADIUS = 0.36
const NECK_RADIUS = 0.154
const CAP_RADIUS = 0.147
/** The screw cap covers the top fifth of the bottle. */
const CAP_BASE_Y = 2.4

function bottleProfile() {
  const path = new Path()
  path.moveTo(0, 0)
  path.lineTo(0.24, 0)
  path.quadraticCurveTo(BODY_RADIUS, 0, BODY_RADIUS, 0.14)
  // The body runs straight up to 62 % of the height …
  path.lineTo(BODY_RADIUS, 1.86)
  // … then the shoulder swings into the neck: convex first, concave at the end.
  path.bezierCurveTo(BODY_RADIUS, 2.08, NECK_RADIUS, 2.1, NECK_RADIUS, 2.28)
  path.lineTo(NECK_RADIUS - 0.003, CAP_BASE_Y)
  // Under the cap the glass only has to stay out of sight.
  path.lineTo(CAP_RADIUS - 0.006, CAP_BASE_Y + 0.005)
  path.lineTo(CAP_RADIUS - 0.006, BOTTLE_HEIGHT - 0.03)
  path.lineTo(0, BOTTLE_HEIGHT - 0.03)
  return path.getPoints(24)
}

/** Screw cap: a straight sleeve with the rolled-in groove below its head. */
function capsuleProfile() {
  const path = new Path()
  path.moveTo(CAP_RADIUS, CAP_BASE_Y)
  path.lineTo(CAP_RADIUS, 2.865)
  path.lineTo(CAP_RADIUS - 0.008, 2.875)
  path.lineTo(CAP_RADIUS - 0.008, 2.89)
  path.lineTo(CAP_RADIUS, 2.9)
  path.lineTo(CAP_RADIUS, 2.965)
  path.quadraticCurveTo(CAP_RADIUS, BOTTLE_HEIGHT, CAP_RADIUS - 0.012, BOTTLE_HEIGHT)
  path.lineTo(0, BOTTLE_HEIGHT)
  return path.getPoints(12)
}

const BOTTLE_PROFILE = bottleProfile()
const CAPSULE_PROFILE = capsuleProfile()

// Label: an open cylinder segment facing +Z, placed as on the real bottle
// (12 % to 52 % of the height, about 135° around). Unrolled it is 0.85 × 1.2,
// so the image should be about 5:7.
const LABEL_ARC = 2.36
const LABEL_HEIGHT = 1.2
const LABEL_CENTER_Y = 0.97

// ─── Lighting ───────────────────────────────────────────────────────────────────

/**
 * Dark glass shows almost nothing but reflections, so the look depends on what
 * there is to reflect. This builds a small photo studio (softboxes as glowing
 * panels) and bakes it into an environment map — no HDR file to load.
 *
 * It is handed to glass and capsule only, not set as `scene.environment`: the
 * panels are bright enough to wash out the paper label, and
 * `material.envMapIntensity` does not dim a scene-wide environment (checked
 * with three 0.187), only a material's own `envMap`.
 */
function createStudioEnvironment(gl: WebGLRenderer) {
  const studio = new Scene()
  const disposables: { dispose: () => void }[] = []

  const addSoftbox = (width: number, height: number, position: [number, number, number], intensity: number) => {
    const geometry = new PlaneGeometry(width, height)
    const material = new MeshBasicMaterial({ side: DoubleSide })
    material.color.setScalar(intensity)
    const panel = new Mesh(geometry, material)
    panel.position.set(...position)
    panel.lookAt(0, 0, 0)
    studio.add(panel)
    disposables.push(geometry, material)
  }

  // Glass reflects only about 4 % head-on, so the panels have to be far
  // brighter than white to leave a visible highlight.
  addSoftbox(1.6, 7, [-4, 0.5, 2.5], 60) // key: the long highlight down the left side
  addSoftbox(0.6, 7, [4.5, 0, 1.5], 30) // thin counter-highlight on the right
  addSoftbox(3, 6, [3.5, 1, -4], 22) // rim light from behind
  addSoftbox(4, 4, [0, 6, 0], 8) // top, for shoulder and capsule

  // A dim room, so the glass between the highlights is not pitch black.
  const roomGeometry = new SphereGeometry(20)
  const roomMaterial = new MeshBasicMaterial({ side: BackSide })
  roomMaterial.color.setScalar(0.04)
  studio.add(new Mesh(roomGeometry, roomMaterial))
  disposables.push(roomGeometry, roomMaterial)

  const pmrem = new PMREMGenerator(gl)
  const environment = pmrem.fromScene(studio, 0.03)
  pmrem.dispose()
  disposables.forEach(item => item.dispose())
  return environment
}

// ─── Scene ──────────────────────────────────────────────────────────────────────

function Label({ src }: { src: string }) {
  const texture = useLoader(TextureLoader, src)
  return (
    <mesh position-y={LABEL_CENTER_Y}>
      <cylinderGeometry
        args={[BODY_RADIUS + 0.004, BODY_RADIUS + 0.004, LABEL_HEIGHT, 64, 1, true, -LABEL_ARC / 2, LABEL_ARC]}
      />
      <meshStandardMaterial map={texture} map-colorSpace={SRGBColorSpace} map-anisotropy={8} roughness={0.75} />
    </mesh>
  )
}

function Bottle({
  labelSrc,
  progress,
  turns,
  followPointer,
  reducedMotion,
  containerRef,
  colorKey,
}: {
  /** Changes whenever a color prop changes, to re-read the probes. */
  colorKey: string
  labelSrc?: string
  progress?: MotionValue<number>
  turns: number
  followPointer: boolean
  reducedMotion: boolean
  containerRef: RefObject<HTMLDivElement | null>
}) {
  const tiltRef = useRef<Group>(null)
  const spinRef = useRef<Group>(null)
  const glassRef = useRef<MeshPhysicalMaterial>(null)
  const capsuleRef = useRef<MeshStandardMaterial>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const invalidate = useThree(state => state.invalidate)
  const gl = useThree(state => state.gl)

  useEffect(() => {
    const environment = createStudioEnvironment(gl)
    for (const material of [glassRef.current, capsuleRef.current]) {
      if (!material) continue
      material.envMap = environment.texture
      material.needsUpdate = true
    }
    invalidate()
    return () => environment.dispose()
  }, [gl, invalidate])

  // Colors come from hidden probe elements in the DOM wrapper, so CSS variables
  // work and the bottle follows theme and accent changes.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const probes = Array.from(container.querySelectorAll<HTMLElement>('[data-color-probe]'))
    const materials = [glassRef.current, capsuleRef.current]

    const sampleColors = () => {
      probes.forEach((probe, i) => {
        materials[i]?.color.setRGB(...cssColorToRgb(getComputedStyle(probe).color), SRGBColorSpace)
      })
      invalidate()
    }
    sampleColors()

    // Theme and accent are attributes on <html>. While the AccentSwitcher
    // interpolates, it rewrites a <style> in <head> instead, so watch that too.
    const themeObserver = new MutationObserver(sampleColors)
    themeObserver.observe(document.documentElement, { attributes: true })
    themeObserver.observe(document.head, { subtree: true, childList: true, characterData: true })
    return () => themeObserver.disconnect()
  }, [containerRef, invalidate, colorKey])

  useEffect(() => {
    if (!followPointer || reducedMotion) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      pointerRef.current = { x: 0, y: 0 }
    }
  }, [followPointer, reducedMotion])

  useFrame((_, delta) => {
    const tilt = tiltRef.current
    const spin = spinRef.current
    // Reduced motion: the bottle rests upright with the label in front.
    if (!tilt || !spin || reducedMotion) return

    timeRef.current += delta
    const time = timeRef.current

    const sway = Math.sin(time * 0.5) * 0.28
    const remaining = progress ? progress.get() - 1 : 0
    spin.rotation.y = sway + remaining * turns * Math.PI * 2

    tilt.position.y = Math.sin(time * 0.9) * 0.035
    tilt.rotation.x = MathUtils.damp(tilt.rotation.x, pointerRef.current.y * 0.1, 4, delta)
    tilt.rotation.z = MathUtils.damp(tilt.rotation.z, pointerRef.current.x * -0.09, 4, delta)
  })

  return (
    <group ref={tiltRef}>
      <group ref={spinRef} position-y={-BOTTLE_HEIGHT / 2}>
        <mesh>
          <latheGeometry args={[BOTTLE_PROFILE, 96]} />
          <meshPhysicalMaterial
            ref={glassRef}
            side={DoubleSide}
            roughness={0.06}
            clearcoat={1}
            clearcoatRoughness={0.04}
          />
        </mesh>
        <mesh>
          <latheGeometry args={[CAPSULE_PROFILE, 64]} />
          <meshStandardMaterial
            ref={capsuleRef}
            side={DoubleSide}
            metalness={0.8}
            roughness={0.38}
            envMapIntensity={0.25}
          />
        </mesh>
        {labelSrc && (
          <Suspense fallback={null}>
            <Label src={labelSrc} />
          </Suspense>
        )}
      </group>
    </group>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * React Three Fiber rethrows errors from inside the canvas into the host tree:
 * no WebGL context, or a label image that fails to load, would take the whole
 * page down. The stage is decoration, so it renders nothing instead.
 */
class StageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function BottleStage({
  labelSrc,
  glassColor = 'oklch(0.08 0.025 150)',
  capsuleColor = 'var(--accent)',
  progress,
  turns = 0.75,
  followPointer = true,
  className,
  style,
}: BottleStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // A batch can hold several entries; only the latest one is current.
    const observer = new IntersectionObserver(entries => setInView(entries[entries.length - 1].isIntersecting))
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Reduced motion renders single frames on demand; otherwise the loop only
  // runs while the stage is on screen.
  const frameloop = reducedMotion ? 'demand' : inView ? 'always' : 'never'

  return (
    <div ref={containerRef} aria-hidden className={className} style={{ pointerEvents: 'none', ...style }}>
      <span data-color-probe style={{ display: 'none', color: glassColor }} />
      <span data-color-probe style={{ display: 'none', color: capsuleColor }} />
      <StageErrorBoundary>
        {/* R3F sets pointer-events: auto on its wrapper; the stage must not catch clicks. */}
        <Canvas frameloop={frameloop} camera={{ fov: 28, position: [0, 0, 8.2] }} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[-3, 2.5, 5]} intensity={2.2} />
          <Bottle
            labelSrc={labelSrc}
            progress={progress}
            turns={turns}
            followPointer={followPointer}
            reducedMotion={reducedMotion}
            containerRef={containerRef}
            colorKey={`${glassColor}|${capsuleColor}`}
          />
        </Canvas>
      </StageErrorBoundary>
    </div>
  )
}
