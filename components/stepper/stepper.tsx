/* eslint-disable no-restricted-imports -- useCallback keeps step-navigation handlers stable across renders. */
import {
  useCallback,
  useState,
  type ReactNode,
  type CSSProperties,
  Children,
  isValidElement,
} from 'react'
/* eslint-enable no-restricted-imports */
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../lib/utils'
import { useComponentMessages, interpolate } from '../i18n'
import { MESSAGES, type StepperMessages } from './messages'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface StepperProps {
  children: ReactNode
  /** Starting step (1-based, default: 1) */
  initialStep?: number
  /** Callback when step changes */
  onStepChange?: (step: number) => void
  /** Callback when all steps are completed */
  onFinalStepCompleted?: () => void
  /** i18n overrides for button labels and SR step counter. */
  messages?: Partial<StepperMessages>
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
  completedLabel,
}: {
  totalSteps: number
  currentStep: number
  titles: (string | undefined)[]
  completedLabel: string
}) {
  return (
    <ol className="m-0 mb-8 flex list-none flex-wrap items-center justify-center gap-x-0 gap-y-4 p-0">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <li
            key={i}
            className="flex items-center"
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                  isCompleted || isActive
                    ? "bg-(--accent,#6366f1) text-white border-(--accent,#6366f1)"
                    : "bg-transparent text-(--muted-foreground,#71717a) border-(--border,#2a2a2e)"
                )}
                aria-label={isCompleted ? `${titles[i] ?? stepNum} ${completedLabel}` : undefined}
              >
                {isCompleted ? (
                  <motion.svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden
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
              {titles[i] && (
                <span
                  className={cn(
                    "text-2.5 md:text-xs transition-colors duration-300 whitespace-nowrap",
                    isActive
                      ? "text-(--foreground,#e4e4e7) font-semibold"
                      : "text-(--muted-foreground,#71717a) font-normal"
                  )}
                >
                  {titles[i]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                aria-hidden
                className={cn(
                  "w-8 md:w-12 h-0.5 mx-1 md:mx-2 bg-(--border,#2a2a2e) rounded-sm overflow-hidden",
                  titles[i] ? "mb-4.5 md:mb-5.5" : "mb-0"
                )}
              >
                <div
                  className="h-full bg-(--accent,#6366f1) transition-[width] duration-450 ease-in-out"
                  style={{ width: stepNum < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ─── Stepper Component ──────────────────────────────────────────────────────────

export function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  messages,
  className,
  style,
}: StepperProps) {
  const m = useComponentMessages(MESSAGES, messages)
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
      <StepIndicator
        totalSteps={totalSteps}
        currentStep={currentStep}
        titles={titles}
        completedLabel={m.completed}
      />

      {/* Step content with animation */}
      <div
        className="relative min-h-30 overflow-hidden"
        role="group"
        aria-label={interpolate(m.stepOfTotal, { current: currentStep, total: totalSteps })}
        aria-live="polite"
      >
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
      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          className={cn(
            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer",
            isFirstStep
              ? "bg-transparent text-(--muted-foreground,#71717a) border-(--border,#2a2a2e) opacity-50 cursor-not-allowed"
              : "bg-transparent text-(--foreground,#e4e4e7) border-(--border,#2a2a2e) hover:bg-white/5"
          )}
        >
          {m.back}
        </button>

        <button
          type="button"
          onClick={goNext}
          className="cursor-pointer rounded-lg border-none bg-(--accent,#6366f1) px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
        >
          {isLastStep ? m.finalize : m.next}
        </button>
      </div>
    </div>
  )
}
