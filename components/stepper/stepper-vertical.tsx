import {
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
  Children,
  isValidElement,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface VerticalStepperProps {
  children: ReactNode
  /** Starting step (1-based, default: 1) */
  initialStep?: number
  /** Callback when step changes */
  onStepChange?: (step: number) => void
  /** Callback when all steps are completed */
  onFinalStepCompleted?: () => void
  /** Back button text (default: 'Zurück') */
  backButtonText?: string
  /** Next button text (default: 'Weiter') */
  nextButtonText?: string
  /** Final step button text (default: 'Abschließen') */
  finalButtonText?: string
  className?: string
  style?: CSSProperties
}

export interface VerticalStepProps {
  children?: ReactNode
  /** Step title shown in every state */
  title: string
}

export interface StepListProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export interface StepListItemProps {
  children: ReactNode
}

// ─── StepList ───────────────────────────────────────────────────────────────────
// Connected bullet-list – use inside a VerticalStep for the MUI-style sub-list.

export function StepListItem({ children }: StepListItemProps) {
  // Rendered by StepList – this wrapper is just a type-safe slot.
  return <>{children}</>
}

export function StepList({ children, className, style }: StepListProps) {
  const items = Children.toArray(children)

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {/* Dot + vertical connector */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                width: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent, #6366f1)',
                  marginTop: '5px',
                  flexShrink: 0,
                }}
              />
              {!isLast && (
                <div
                  style={{
                    width: '2px',
                    flexGrow: 1,
                    minHeight: '20px',
                    background: 'var(--border, #3f3f46)',
                    margin: '4px 0',
                  }}
                />
              )}
            </div>

            {/* Item text */}
            <span
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'var(--foreground, #e4e4e7)',
                paddingBottom: isLast ? '0' : '16px',
              }}
            >
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── VerticalStep ───────────────────────────────────────────────────────────────
// Slot component – rendering happens inside VerticalStepper.

export function VerticalStep(_props: VerticalStepProps) {
  return null
}

// ─── VerticalStepper ────────────────────────────────────────────────────────────

const BADGE_SIZE = 36 // px – width & height of the step number badge
const CONNECTOR_OFFSET = BADGE_SIZE / 2 - 1 // align 2 px line under badge centre

export function VerticalStepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Zurück',
  nextButtonText = 'Weiter',
  finalButtonText = 'Abschließen',
  className,
  style,
}: VerticalStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  // Collect VerticalStep children
  const steps = Children.toArray(children).filter(
    child => isValidElement(child) && child.type === VerticalStep,
  ) as React.ReactElement<VerticalStepProps>[]

  const totalSteps = steps.length

  const goNext = useCallback(() => {
    if (currentStep >= totalSteps) {
      onFinalStepCompleted?.()
      return
    }
    const next = currentStep + 1
    setCurrentStep(next)
    onStepChange?.(next)
  }, [currentStep, totalSteps, onStepChange, onFinalStepCompleted])

  const goBack = useCallback(() => {
    if (currentStep <= 1) return
    const prev = currentStep - 1
    setCurrentStep(prev)
    onStepChange?.(prev)
  }, [currentStep, onStepChange])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  const buttonBase: CSSProperties = {
    padding: '9px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 200ms ease',
    fontFamily: 'inherit',
  }

  return (
    <div className={className} style={style}>
      {steps.map((step, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep
        const isPending = stepNum > currentStep
        const isLast = i === totalSteps - 1

        return (
          <div key={i}>
            {/* ── Step card ── */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '12px',
                border: `1px solid ${
                  isActive
                    ? 'var(--accent, #6366f1)'
                    : 'var(--border, #3f3f46)'
                }`,
                background: isActive
                  ? 'color-mix(in oklch, var(--accent, #6366f1) 6%, var(--card, #18181b))'
                  : 'var(--card, #18181b)',
                transition: 'border-color 300ms ease, background 300ms ease',
              }}
            >
              {/* Badge */}
              <div
                style={{
                  width: `${BADGE_SIZE}px`,
                  height: `${BADGE_SIZE}px`,
                  borderRadius: '8px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  transition: 'background 300ms ease, color 300ms ease',
                  background: isCompleted || isActive
                    ? 'var(--accent, #6366f1)'
                    : 'var(--muted, #27272a)',
                  color: isCompleted || isActive
                    ? '#ffffff'
                    : 'var(--muted-foreground, #71717a)',
                }}
              >
                {isCompleted ? (
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.polyline
                      points="20 6 9 17 4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </motion.svg>
                ) : (
                  stepNum
                )}
              </div>

              {/* Content column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.55',
                    fontWeight: isActive ? 500 : 400,
                    color: isPending
                      ? 'var(--muted-foreground, #71717a)'
                      : 'var(--foreground, #e4e4e7)',
                    transition: 'color 300ms ease',
                  }}
                >
                  {step.props.title}
                </p>

                {/* Expandable content (active step only) */}
                <AnimatePresence initial={false}>
                  {isActive && step.props.children && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ paddingTop: '12px' }}>
                        {step.props.children}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation buttons – inline in the active step */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="nav"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          paddingTop: '16px',
                        }}
                      >
                        {!isFirstStep && (
                          <button
                            type="button"
                            onClick={goBack}
                            style={{
                              ...buttonBase,
                              background: 'transparent',
                              color: 'var(--foreground, #e4e4e7)',
                              border: '1px solid var(--border, #3f3f46)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                          >
                            {backButtonText}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={goNext}
                          style={{
                            ...buttonBase,
                            background: 'var(--accent, #6366f1)',
                            color: '#ffffff',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                          {isLastStep ? finalButtonText : nextButtonText}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Vertical connector between steps ── */}
            {!isLast && (
              <div
                style={{
                  marginLeft: `${20 + CONNECTOR_OFFSET}px`,
                  width: '2px',
                  height: '20px',
                  background: 'var(--border, #3f3f46)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: isCompleted ? '100%' : '0%',
                    background: 'var(--accent, #6366f1)',
                    transition: 'height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 'inherit',
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
