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

export function StepListItem({ children }: StepListItemProps) {
  return <>{children}</>
}

export function StepList({ children, className, style }: StepListProps) {
  const items = Children.toArray(children)

  return (
    <div className={`flex flex-col ${className || ''}`} style={style}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div key={i} className="flex items-start gap-3">
            {/* Dot + vertical connector */}
            <div className="flex flex-col items-center shrink-0 w-2">
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
              {!isLast && (
                <div className="w-[2px] grow min-h-[20px] bg-border my-1" />
              )}
            </div>

            {/* Item text */}
            <span className={`text-sm leading-relaxed text-foreground ${isLast ? 'pb-0' : 'pb-4'}`}>
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── VerticalStep ───────────────────────────────────────────────────────────────

export function VerticalStep(_props: VerticalStepProps) {
  return null
}

// ─── VerticalStepper ────────────────────────────────────────────────────────────

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
              className={`
                flex gap-4 p-4 sm:p-5 rounded-xl border transition-all duration-300
                ${isActive ? 'border-accent bg-accent/[0.06]' : 'border-border bg-card'}
              `}
            >
              {/* Badge */}
              <div
                className={`
                  w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold transition-colors duration-300
                  ${isCompleted || isActive ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}
                `}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>

              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <p
                  className={`
                    m-0 text-sm leading-relaxed transition-colors duration-300
                    ${isActive ? 'font-medium' : 'font-normal'}
                    ${isPending ? 'text-muted-foreground' : 'text-foreground'}
                  `}
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
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
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
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2 pt-4">
                        {!isFirstStep && (
                          <button
                            type="button"
                            onClick={goBack}
                            className="px-5 py-2 rounded-lg bg-transparent text-foreground border border-border text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
                          >
                            {backButtonText}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={goNext}
                          className="px-5 py-2 rounded-lg bg-accent text-white border-none text-sm font-medium cursor-pointer transition-opacity hover:opacity-90"
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
                className={`
                  w-[2px] h-5 mx-[17px] transition-colors duration-400
                  ${isCompleted ? 'bg-accent' : 'bg-border'}
                `}
                style={{ marginLeft: 'calc(1rem + 17px)' }} // badge is 36px, center is 18px. card padding is 1rem (16px) or 1.25rem (20px). 
                // Badge is 36px. Center is 18px from start of card content.
                // Card padding is 16px. So badge center is 16 + 18 = 34px from card edge.
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
