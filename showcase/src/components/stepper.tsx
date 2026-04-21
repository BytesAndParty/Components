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
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isPending = stepNum > currentStep

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isCompleted || isActive ? 'bg-accent text-white border-2 border-accent' : 'bg-transparent text-muted-foreground border-2 border-border'}
                  ${isPending ? 'border-border' : 'border-accent'}
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
              {titles[i] && (
                <span
                  className={`
                    text-[12px] whitespace-nowrap transition-colors duration-300
                    ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground font-normal'}
                  `}
                >
                  {titles[i]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 transition-colors duration-300
                  ${titles[i] ? 'mb-[22px]' : 'mb-0'}
                  ${stepNum < currentStep ? 'bg-accent' : 'bg-border'}
                `}
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

  return (
    <div className={className} style={style}>
      <StepIndicator totalSteps={totalSteps} currentStep={currentStep} titles={titles} />

      {/* Step content with animation */}
      <div className="relative overflow-hidden min-h-[120px]">
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
      <div className="flex justify-between mt-6 gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          className={`
            px-6 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200
            ${isFirstStep 
              ? 'bg-transparent text-muted-foreground border-border opacity-50 cursor-not-allowed' 
              : 'bg-transparent text-foreground border-border cursor-pointer hover:bg-white/5'}
          `}
        >
          {backButtonText}
        </button>

        <button
          type="button"
          onClick={goNext}
          className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:opacity-90"
        >
          {isLastStep ? finalButtonText : nextButtonText}
        </button>
      </div>
    </div>
  )
}
