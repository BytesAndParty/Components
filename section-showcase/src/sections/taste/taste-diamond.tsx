import { useEffect, useId } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@components/lib/utils'
import { AXES, AXIS_COUNT, AXIS_LABEL } from './taste-data'

/**
 * The taste diamond: a hand-drawn SVG radar over the six axes (0–10), shared by all variants of the
 * taste section. The polygon morphs between wines instead of jumping; axis names are real buttons
 * (hover, tap or keyboard focus mark the axis), so the chart works without a pointer.
 */

const VIEW = 400
const CENTER = VIEW / 2
const RADIUS = 130
const LABEL_RADIUS = RADIUS + 40
const RINGS = [2, 4, 6, 8, 10]

const angle = (index: number) => ((-90 + (index * 360) / AXIS_COUNT) * Math.PI) / 180

function pointAt(index: number, value: number, radius = RADIUS) {
  const r = (value / 10) * radius
  return { x: CENTER + r * Math.cos(angle(index)), y: CENTER + r * Math.sin(angle(index)) }
}

const toPoints = (values: number[]) =>
  values
    .map((value, i) => {
      const { x, y } = pointAt(i, value)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

/** Eases the six values towards `values` whenever they change; jumps when reduced motion is on. */
function useMorph(values: number[]): MotionValue<number[]> {
  const reduce = useReducedMotion()
  const current = useMotionValue(values)
  const key = values.join(',')

  useEffect(() => {
    const to = key.split(',').map(Number)
    if (reduce) {
      current.set(to)
      return
    }
    const from = current.get()
    const controls = animate(0, 1, {
      type: 'spring',
      duration: 0.9,
      bounce: 0,
      onUpdate: t => current.set(from.map((f, i) => f + (to[i] - f) * t)),
    })
    return () => controls.stop()
  }, [key, reduce, current])

  return current
}

export interface DiamondSeries {
  /** Spoken name of the series, only used when several series share one diamond. */
  name: string
  values: number[]
  fill: string
  stroke: string
  dot: string
}

export interface DiamondTheme {
  grid: string
  gridOuter: string
  spoke: string
  spokeActive: string
  dotRing: string
  /** Tailwind classes for the axis buttons. */
  label: string
  labelActive: string
  value: string
  focus: string
}

function Vertex({ index, values, series, ring, highlighted }: { index: number; values: MotionValue<number[]>; series: DiamondSeries; ring: string; highlighted: boolean }) {
  const reduce = useReducedMotion()
  const cx = useTransform(values, v => pointAt(index, v[index]).x)
  const cy = useTransform(values, v => pointAt(index, v[index]).y)
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      fill={series.dot}
      stroke={ring}
      strokeWidth={1.5}
      initial={false}
      animate={{ r: highlighted ? 7 : 4 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    />
  )
}

function Series({ series, theme, active, glowId }: { series: DiamondSeries; theme: DiamondTheme; active: number | null; glowId?: string }) {
  const values = useMorph(series.values)
  const points = useTransform(values, toPoints)
  return (
    <g>
      {glowId && <motion.polygon points={points} fill="none" stroke={series.stroke} strokeWidth={6} opacity={0.7} filter={`url(#${glowId})`} />}
      <motion.polygon points={points} fill={series.fill} stroke={series.stroke} strokeWidth={2} strokeLinejoin="round" />
      {AXES.map((key, i) => (
        <Vertex key={key} index={i} values={values} series={series} ring={theme.dotRing} highlighted={active === i} />
      ))}
    </g>
  )
}

export function TasteDiamond({
  series,
  theme,
  active,
  onActive,
  ariaLabel,
  glow = false,
  showValues = false,
  className,
}: {
  series: DiamondSeries[]
  theme: DiamondTheme
  active: number | null
  onActive: (index: number | null) => void
  ariaLabel: string
  glow?: boolean
  /** Shows the value of the first series under each axis name. */
  showValues?: boolean
  className?: string
}) {
  const glowId = `taste-glow-${useId().replace(/\W/g, '')}`

  return (
    <div role="group" aria-label={ariaLabel} className={cn('relative mx-auto aspect-square w-full max-w-[34rem]', className)}>
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        {glow && (
          <defs>
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
        )}
        {RINGS.map(step => (
          <polygon
            key={step}
            points={toPoints(AXES.map(() => step))}
            fill="none"
            stroke={step === 10 ? theme.gridOuter : theme.grid}
            strokeWidth={step === 10 ? 1.2 : 0.7}
          />
        ))}
        {AXES.map((key, i) => {
          const end = pointAt(i, 10)
          return (
            <line
              key={key}
              x1={CENTER}
              y1={CENTER}
              x2={end.x}
              y2={end.y}
              stroke={active === i ? theme.spokeActive : theme.spoke}
              strokeWidth={active === i ? 1.6 : 0.7}
              style={{ transition: 'stroke 200ms, stroke-width 200ms' }}
            />
          )
        })}
        {/* Keyed by position: the series slot stays mounted when its wine changes, so the polygon morphs. */}
        {series.map((s, i) => (
          <Series key={i} series={s} theme={theme} active={active} glowId={glow ? glowId : undefined} />
        ))}
      </svg>

      {AXES.map((key, i) => {
        const x = CENTER + LABEL_RADIUS * Math.cos(angle(i))
        const y = CENTER + LABEL_RADIUS * Math.sin(angle(i))
        const spoken =
          series.length === 1
            ? `${series[0].values[i]} von 10`
            : `${series.map(s => `${s.name} ${s.values[i]}`).join(', ')} von 10`
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active === i}
            aria-label={`${AXIS_LABEL[key]}: ${spoken}`}
            onPointerEnter={e => e.pointerType === 'mouse' && onActive(i)}
            onPointerLeave={e => e.pointerType === 'mouse' && onActive(null)}
            onFocus={e => e.currentTarget.matches(':focus-visible') && onActive(i)}
            onBlur={() => onActive(null)}
            onClick={() => onActive(i)}
            style={{ left: `${(x / VIEW) * 100}%`, top: `${(y / VIEW) * 100}%` }}
            className={cn(
              'absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 px-1.5 transition-[color,transform] duration-200 active:scale-95',
              theme.focus,
              active === i ? theme.labelActive : theme.label,
            )}
          >
            <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase">{AXIS_LABEL[key]}</span>
            {showValues && <span className={cn('leading-none tabular-nums', theme.value)}>{series[0].values[i]}</span>}
          </button>
        )
      })}
    </div>
  )
}
