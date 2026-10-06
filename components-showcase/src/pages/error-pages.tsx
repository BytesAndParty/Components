import type { CSSProperties, ReactNode } from 'react'
import { Link, isRouteErrorResponse, useLocation, useRouteError } from 'react-router'
import { ArrowLeft, RotateCw } from 'lucide-react'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { cn } from '@components/lib/utils'
import { useComponentMessages, type ComponentMessages } from '@components/i18n'

interface ErrorPageMessages {
  notFoundEyebrow: string
  notFoundTitle: string
  notFoundBody: string
  errorEyebrow: string
  errorTitle: string
  errorBody: string
  backHome: string
  reload: string
}

const MESSAGES = {
  de: {
    notFoundEyebrow: 'Fehler 404',
    notFoundTitle: 'Hier gibt es nichts zu sehen.',
    notFoundBody: 'Wirklich nicht. Wir haben zweimal nachgeschaut.',
    errorEyebrow: 'Fehler',
    errorTitle: 'Hier ist etwas schiefgegangen.',
    errorBody: 'Die Seite konnte nicht angezeigt werden. Lade sie neu oder geh zurück zur Übersicht.',
    backHome: 'Zur Übersicht',
    reload: 'Neu laden',
  },
  en: {
    notFoundEyebrow: 'Error 404',
    notFoundTitle: 'Nothing to see here.',
    notFoundBody: 'Really. We checked twice.',
    errorEyebrow: 'Error',
    errorTitle: 'Something went wrong here.',
    errorBody: 'The page could not be displayed. Reload it or head back to the overview.',
    backHome: 'Back to overview',
    reload: 'Reload',
  },
} satisfies ComponentMessages<ErrorPageMessages>

const serif: CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", "Cormorant Garamond", serif',
  letterSpacing: '-0.02em',
}

const actionClass =
  'group border-border text-foreground hover:border-accent/50 hover:text-accent inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm no-underline transition-colors focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:outline-none'

const iconClass = 'size-4 transition-transform motion-reduce:transition-none'

function ErrorShell({ eyebrow, title, body, detail, children }: {
  eyebrow: string
  title: string
  body: string
  detail?: string
  children: ReactNode
}) {
  return (
    <BlurFade>
      <section className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">{eyebrow}</p>
        <h1 className="text-foreground mt-6 text-4xl leading-[1.1] text-balance sm:text-5xl" style={serif}>
          {title}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-sm">{body}</p>
        {detail && (
          <code className="text-muted-foreground bg-card border-border mt-4 max-w-full rounded-md border px-2 py-1 font-mono text-xs break-all">
            {detail}
          </code>
        )}
        <div className="mt-12 flex flex-wrap justify-center gap-3">{children}</div>
      </section>
    </BlurFade>
  )
}

function BackHomeLink({ label }: { label: string }) {
  return (
    <Link to="/" viewTransition className={actionClass}>
      <ArrowLeft aria-hidden className={cn(iconClass, 'group-hover:-translate-x-0.5')} />
      {label}
    </Link>
  )
}

/** Catch-all-Route im Layout: unbekannte Pfade landen hier statt im React-Router-Standardfehler. */
export function NotFoundPage() {
  const m = useComponentMessages(MESSAGES)
  const { pathname } = useLocation()
  return (
    <ErrorShell eyebrow={m.notFoundEyebrow} title={m.notFoundTitle} body={m.notFoundBody} detail={pathname}>
      <BackHomeLink label={m.backHome} />
    </ErrorShell>
  )
}

/** Root-`errorElement`: fängt alles ab, was nicht schon das ErrorBoundary im Layout behandelt (z. B. ein Absturz des Layouts selbst). */
export function RouteErrorPage() {
  const m = useComponentMessages(MESSAGES)
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error ? error.message : String(error)
  return (
    <div className="mx-auto max-w-3xl px-6">
      <ErrorShell eyebrow={m.errorEyebrow} title={m.errorTitle} body={m.errorBody} detail={detail}>
        <button type="button" onClick={() => window.location.reload()} className={cn(actionClass, 'cursor-pointer')}>
          <RotateCw aria-hidden className={cn(iconClass, 'group-hover:rotate-45')} />
          {m.reload}
        </button>
        <BackHomeLink label={m.backHome} />
      </ErrorShell>
    </div>
  )
}
