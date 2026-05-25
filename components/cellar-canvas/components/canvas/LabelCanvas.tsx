import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'

export const LabelCanvas = forwardRef<HTMLCanvasElement, { className?: string }>(
  ({ className }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <canvas ref={ref} />
      </div>
    )
  }
)

LabelCanvas.displayName = 'LabelCanvas'
