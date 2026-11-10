import { useEffect, useRef, type CSSProperties } from 'react'
import { cssColorToRgb } from '@components/lib/css-color'
import { usePrefersReducedMotion } from '@components/lib/use-prefers-reduced-motion'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ShaderBackdropProps {
  /**
   * Base, fold and sheen color as CSS colors — `var(…)`, `oklch(…)` and
   * `color-mix(…)` all work and follow theme and accent changes.
   */
  colors?: [string, string, string]
  /** Flow speed multiplier (default: 1) */
  speed?: number
  /** Size of the folds — higher = more, smaller folds (default: 1) */
  scale?: number
  /** Film grain amount 0..1; also hides banding in dark gradients (default: 0.05) */
  grain?: number
  className?: string
  style?: CSSProperties
}

const DEFAULT_COLORS: [string, string, string] = [
  'var(--background)',
  'color-mix(in oklch, var(--accent) 38%, var(--background))',
  'var(--accent)',
]

/** The frame shown under `prefers-reduced-motion` — picked for a balanced composition. */
const STILL_FRAME_TIME = 40

// ─── Shaders ────────────────────────────────────────────────────────────────────

const vertexShaderSource = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

// Domain-warped fbm: the noise field is fed back into its own lookup twice,
// which turns blobs into the long, folded streaks that read as silk or liquid.
const fragmentShaderSource = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform float uScale;
uniform float uGrain;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.02 + vec2(17.3, 9.1);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // Divide by height only, so the folds keep their shape at any aspect ratio.
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  vec2 p = uv * uScale * 1.5;
  float t = uTime * 0.05;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.5)
  );
  float f = fbm(p + 2.6 * r);

  float fold = smoothstep(0.28, 0.82, f);
  float sheen = pow(clamp(length(r) * 0.82, 0.0, 1.0), 4.0) * fold;

  vec3 color = mix(uColorA, uColorB, fold);
  color = mix(color, uColorC, sheen * 0.6);

  color += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * uGrain;

  gl_FragColor = vec4(color, 1.0);
}
`

// ─── Helpers ────────────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`ShaderBackdrop: shader compile failed: ${log}`)
  }
  return shader
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ShaderBackdrop({
  colors = DEFAULT_COLORS,
  speed = 1,
  scale = 1,
  grain = 0.05,
  className,
  style,
}: ShaderBackdropProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  // The effect reads the colors from the probes, not from the prop; the key
  // re-runs it when a color changes without reacting to a new array identity.
  const colorKey = colors.join('|')

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) {
      // Without WebGL the wrapper's CSS background stays visible.
      console.warn('ShaderBackdrop: WebGL not supported')
      return
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Fullscreen triangle
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'uTime')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uColors = ['uColorA', 'uColorB', 'uColorC'].map(name => gl.getUniformLocation(program, name))
    gl.uniform1f(gl.getUniformLocation(program, 'uScale'), scale)
    gl.uniform1f(gl.getUniformLocation(program, 'uGrain'), grain)

    let time = reducedMotion ? STILL_FRAME_TIME : 0
    const draw = () => {
      gl.uniform1f(uTime, time)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    // ── Colors: resolved through hidden probe elements, so var() and
    //    color-mix() work and follow the cascade at this place in the DOM. ──
    const probes = Array.from(container.querySelectorAll<HTMLElement>('[data-color-probe]'))
    const sampleColors = () => {
      probes.forEach((probe, i) => {
        gl.uniform3f(uColors[i], ...cssColorToRgb(getComputedStyle(probe).color))
      })
    }
    sampleColors()

    // The smooth field needs no retina resolution; 1.5 keeps the grain fine enough.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const onResize = () => {
      canvas.width = Math.max(1, Math.floor(container.clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(container.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      draw()
    }
    onResize()
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)

    // Theme and accent are attributes on <html>. While the AccentSwitcher
    // interpolates, it rewrites a <style> in <head> instead, so watch that too.
    const themeObserver = new MutationObserver(() => {
      sampleColors()
      draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true })
    themeObserver.observe(document.head, { subtree: true, childList: true, characterData: true })

    // ── Loop: only while visible, and not at all under reduced motion ──────
    let rafId = 0
    let last = 0
    const loop = (now: number) => {
      // Clamp the step so a background tab does not make the field jump.
      time += Math.min((now - last) / 1000, 0.1) * speed
      last = now
      draw()
      rafId = requestAnimationFrame(loop)
    }
    const visibilityObserver = new IntersectionObserver(entries => {
      cancelAnimationFrame(rafId)
      // A batch can hold several entries; only the latest one is current.
      if (entries[entries.length - 1].isIntersecting && !reducedMotion) {
        last = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    })
    visibilityObserver.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      visibilityObserver.disconnect()
      themeObserver.disconnect()
      resizeObserver.disconnect()
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [speed, scale, grain, reducedMotion, colorKey])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{ overflow: 'hidden', pointerEvents: 'none', ...style }}
    >
      {colors.map((color, i) => (
        <span key={i} data-color-probe style={{ display: 'none', color }} />
      ))}
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
