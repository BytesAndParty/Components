import {
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
  Children,
  isValidElement,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface StepperProps {
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

export interface StepProps {
  children: ReactNode
  /** Step title (shown in indicator) */
  title?: string
}

// ─── Step Component ─────────────────────────────────────────────────────────────

export function Step({ children }: StepProps) {
  return <>{children}</>
}

// ─── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({
  totalSteps,
  currentStep,
  titles,
}: {
  totalSteps: number
  currentStep: number
  titles: (string | undefined)[]
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        marginBottom: '32px',
      }}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isPending = stepNum > currentStep

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 300ms ease',
                  background: isCompleted
                    ? 'var(--accent, #6366f1)'
                    : isActive
                      ? 'var(--accent, #6366f1)'
                      : 'transparent',
                  color: isCompleted || isActive
                    ? '#ffffff'
                    : 'var(--muted-foreground, #71717a)',
                  border: isPending
                    ? '2px solid var(--border, #2a2a2e)'
                    : '2px solid var(--accent, #6366f1)',
                }}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {titles[i] && (
                <span
                  style={{
                    fontSize: '12px',
                    color: isActive
                      ? 'var(--foreground, #e4e4e7)'
                      : 'var(--muted-foreground, #71717a)',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'color 300ms ease',
                  }}
                >
                  {titles[i]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                style={{
                  width: '48px',
                  height: '2px',
                  marginLeft: '8px',
                  marginRight: '8px',
                  marginBottom: titles[i] ? '22px' : '0',
                  background: stepNum < currentStep
                    ? 'var(--accent, #6366f1)'
                    : 'var(--border, #2a2a2e)',
                  transition: 'background 300ms ease',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Stepper Component ──────────────────────────────────────────────────────────

export function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Zurück',
  nextButtonText = 'Weiter',
  finalButtonText = 'Abschließen',
  className,
  style,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  const steps = Children.toArray(children).filter(
    child => isValidElement(child) && child.type === Step
  )
  const totalSteps = steps.length
  const titles = steps.map(step => (isValidElement(step) ? (step.props as StepProps).title : undefined))

  const goNext = useCallback(() => {
    if (currentStep >= totalSteps) {
      onFinalStepCompleted?.()
      return
    }
    setDirection(1)
    const next = currentStep + 1
    setCurrentStep(next)
    onStepChange?.(next)
  }, [currentStep, totalSteps, onStepChange, onFinalStepCompleted])

  const goBack = useCallback(() => {
    if (currentStep <= 1) return
    setDirection(-1)
    const prev = currentStep - 1
    setCurrentStep(prev)
    onStepChange?.(prev)
  }, [currentStep, onStepChange])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  }

  const buttonBase: CSSProperties = {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    fontFamily: 'inherit',
  }

  return (
    <div className={className} style={style}>
      <StepIndicator totalSteps={totalSteps} currentStep={currentStep} titles={titles} />

      {/* Step content with animation */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '120px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          style={{
            ...buttonBase,
            background: 'transparent',
            color: isFirstStep ? 'var(--muted-foreground, #71717a)' : 'var(--foreground, #e4e4e7)',
            border: `1px solid ${isFirstStep ? 'var(--border, #2a2a2e)' : 'var(--border, #2a2a2e)'}`,
            opacity: isFirstStep ? 0.5 : 1,
            cursor: isFirstStep ? 'not-allowed' : 'pointer',
          }}
        >
          {backButtonText}
        </button>

        <button
          type="button"
          onClick={goNext}
          style={{
            ...buttonBase,
            background: 'var(--accent, #6366f1)',
            color: '#ffffff',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {isLastStep ? finalButtonText : nextButtonText}
        </button>
      </div>
    </div>
  )
}
