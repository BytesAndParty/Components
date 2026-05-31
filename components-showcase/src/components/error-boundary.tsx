import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-destructive/5 border-destructive/20 flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border p-8 text-center">
          <div className="bg-destructive/10 text-destructive mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-foreground mb-2 text-xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md text-sm">
            An unexpected error occurred in this component. We've logged the details and will investigate.
          </p>
          <div className="bg-destructive/10 mb-6 max-w-full overflow-auto rounded-lg p-4 text-left">
            <code className="text-destructive font-mono text-xs whitespace-pre-wrap">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-medium transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
