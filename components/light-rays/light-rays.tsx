import { useEffect, useRef, type CSSProperties } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right'

export interface LightRaysProps {
  /** Origin point of the rays (default: 'top-center') */
  raysOrigin?: RaysOrigin
  /** CSS color for the rays (default: '#ffffff') */
  raysColor?: string
  /** Animation speed multiplier (default: 1) */
  raysSpeed?: number
  /** How wide the light cone spreads — lower = tighter (default: 1) */
  lightSpread?: number
  /** Length of the rays — higher = rays reach further (default: 2) */
  rayLength?: number
  /** Enable pulsating brightness (default: false) */
  pulsating?: boolean
  /** Base ray fade distance in UV units (default: 1) */
  fadeDistance?: number
  /** Saturation boost on final color (default: 1) */
  saturation?: number
  /** React to mouse position (default: false) */
  followMouse?: boolean
  /** Strength of mouse influence 0..1 (default: 0.1) */
  mouseInfluence?: number
  /** Noise amount added to rays 0..1 (default: 0) */
  noiseAmount?: number
  /** Random ray distortion 0..1 (default: 0) */
  distortion?: number
  className?: string
  style?: CSSProperties
}

// ─── Shaders ────────────────────────────────────────────────────────────────────

const vertexShaderSource = /* glsl */ `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = /* glsl */ `
precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rayStrength(
  vec2 raySource,
  vec2 rayRefDirection,
  vec2 coord,
  float seedA,
  float seedB,
  float speed
) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(length(sourceToCoord) * 0.01 + iTime * speed) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);

  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3  + 0.2  * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void main() {
  vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreen = mousePos * iResolution;
    vec2 mouseDir    = normalize(mouseScreen - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDir, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
    rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.1120, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
    rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);

  vec4 fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  // Vertical brightness curve
  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.r *= 0.1 + brightness * 0.8;
  fragColor.g *= 0.3 + brightness * 0.6;
  fragColor.b *= 0.5 + brightness * 0.5;

  // Tint with user color
  fragColor.rgb *= raysColor;

  // Saturation
  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  gl_FragColor = fragColor;
}
`

// ─── Helpers ────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '').trim()
  if (m.length === 3) {
    return [
      parseInt(m[0] + m[0], 16) / 255,
      parseInt(m[1] + m[1], 16) / 255,
      parseInt(m[2] + m[2], 16) / 255,
    ]
  }
  if (m.length === 6) {
    return [
      parseInt(m.slice(0, 2), 16) / 255,
      parseInt(m.slice(2, 4), 16) / 255,
      parseInt(m.slice(4, 6), 16) / 255,
    ]
  }
  return [1, 1, 1]
}

function getAnchorAndDir(origin: RaysOrigin, w: number, h: number) {
  const outside = 0.2
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h] as [number, number], dir: [0, 1] as [number, number] }
    case 'top-right':
      return { anchor: [w, -outside * h] as [number, number], dir: [0, 1] as [number, number] }
    case 'left':
      return { anchor: [-outside * w, 0.5 * h] as [number, number], dir: [1, 0] as [number, number] }
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h] as [number, number], dir: [-1, 0] as [number, number] }
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h] as [number, number], dir: [0, -1] as [number, number] }
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h] as [number, number], dir: [0, -1] as [number, number] }
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h] as [number, number], dir: [0, -1] as [number, number] }
    case 'top-center':
    default:
      return { anchor: [0.5 * w, -outside * h] as [number, number], dir: [0, 1] as [number, number] }
  }
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    throw new Error('Shader compile failed')
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    throw new Error('Program link failed')
  }
  return program
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = false,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  className,
  style,
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Canvas + GL context ───────────────────────────────────────────────
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    })
    if (!gl) {
      console.warn('LightRays: WebGL not supported')
      return
    }

    gl.clearColor(0, 0, 0, 0)

    // ── Compile shaders / link program ────────────────────────────────────
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vs, fs)
    gl.useProgram(program)

    // ── Fullscreen triangle ───────────────────────────────────────────────
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    // ── Uniform locations ─────────────────────────────────────────────────
    const u = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      rayPos: gl.getUniformLocation(program, 'rayPos'),
      rayDir: gl.getUniformLocation(program, 'rayDir'),
      raysColor: gl.getUniformLocation(program, 'raysColor'),
      raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
      lightSpread: gl.getUniformLocation(program, 'lightSpread'),
      rayLength: gl.getUniformLocation(program, 'rayLength'),
      pulsating: gl.getUniformLocation(program, 'pulsating'),
      fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
      saturation: gl.getUniformLocation(program, 'saturation'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
      noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
      distortion: gl.getUniformLocation(program, 'distortion'),
    }

    // ── Static uniforms (don't change during the loop) ────────────────────
    const [cr, cg, cb] = hexToRgb(raysColor)
    gl.uniform3f(u.raysColor, cr, cg, cb)
    gl.uniform1f(u.raysSpeed, raysSpeed)
    gl.uniform1f(u.lightSpread, lightSpread)
    gl.uniform1f(u.rayLength, rayLength)
    gl.uniform1f(u.pulsating, pulsating ? 1 : 0)
    gl.uniform1f(u.fadeDistance, fadeDistance)
    gl.uniform1f(u.saturation, saturation)
    gl.uniform1f(u.mouseInfluence, followMouse ? mouseInfluence : 0)
    gl.uniform1f(u.noiseAmount, noiseAmount)
    gl.uniform1f(u.distortion, distortion)

    // ── Resize handling ───────────────────────────────────────────────────
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u.iResolution, canvas.width, canvas.height)
      const { anchor, dir } = getAnchorAndDir(raysOrigin, canvas.width, canvas.height)
      gl.uniform2f(u.rayPos, anchor[0], anchor[1])
      gl.uniform2f(u.rayDir, dir[0], dir[1])
    }

    onResize()
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    // ── Mouse tracking ────────────────────────────────────────────────────
    const mouse = { x: 0.5, y: 0.5 }
    const smoothed = { x: 0.5, y: 0.5 }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) / rect.width
      mouse.y = (e.clientY - rect.top) / rect.height
    }
    if (followMouse) window.addEventListener('mousemove', onMouseMove)

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId = 0
    const start = performance.now()
    const loop = (now: number) => {
      gl.uniform1f(u.iTime, (now - start) * 0.001)

      if (followMouse && mouseInfluence > 0) {
        const k = 0.08
        smoothed.x += (mouse.x - smoothed.x) * k
        smoothed.y += (mouse.y - smoothed.y) * k
        gl.uniform2f(u.mousePos, smoothed.x, smoothed.y)
      }

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      if (followMouse) window.removeEventListener('mousemove', onMouseMove)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      const loseCtx = gl.getExtension('WEBGL_lose_context')
      loseCtx?.loseContext()
      if (canvas.parentElement === container) container.removeChild(canvas)
    }
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
