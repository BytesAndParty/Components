import type { ReactNode } from 'react'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

// Eine Karte, drei Verhalten: Link, Button oder deaktiviert. Aussehen bleibt
// identisch — nur das Wurzel-Element und der Badge/Pfeil rechts oben wechseln.
const SIZES = {
  md: {
    padding: 'p-6',
    icon: 22,
    gap: 'mb-5',
    Title: 'h2',
    title: 'font-display text-2xl font-medium tracking-tight',
    description: 'mt-3 text-sm',
  },
  sm: {
    padding: 'p-5',
    icon: 18,
    gap: 'mb-3',
    Title: 'span',
    title: 'text-sm font-medium',
    description: 'mt-2 text-xs',
  },
} as const

type LauncherCardAction =
  | { href: string }
  | { onClick: () => void }
  | { disabled: true; badge: string }

type LauncherCardProps = {
  title: string
  description: string
  tech?: string
  icon?: LucideIcon
  size?: keyof typeof SIZES
} & LauncherCardAction

const BASE = 'border-border bg-card flex h-full w-full flex-col rounded-2xl border text-left'
const INTERACTIVE =
  'group hover:border-accent/60 focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none'

export function LauncherCard({ title, description, tech, icon: Icon, size = 'md', ...action }: LauncherCardProps) {
  const s = SIZES[size]
  const disabled = 'disabled' in action

  const content: ReactNode = (
    <>
      <div className={`${s.gap} flex items-center justify-between`}>
        {Icon ? (
          <Icon
            size={s.icon}
            className={disabled ? 'text-muted-foreground/50' : 'text-muted-foreground group-hover:text-accent transition-colors'}
          />
        ) : <span />}
        {disabled ? (
          <span className="border-border text-muted-foreground/60 rounded-full border px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase">
            {action.badge}
          </span>
        ) : (
          <ArrowUpRight size={16} className="text-muted-foreground/40 group-hover:text-foreground transition-colors" />
        )}
      </div>
      <s.Title className={s.title}>{title}</s.Title>
      {tech && (
        <p className="text-muted-foreground/70 mt-0.5 text-[10px] tracking-[0.18em] uppercase">{tech}</p>
      )}
      <p className={`text-muted-foreground leading-relaxed ${s.description}`}>{description}</p>
    </>
  )

  if ('disabled' in action) {
    return (
      <div aria-disabled="true" className={`${BASE} ${s.padding} cursor-not-allowed opacity-55`}>
        {content}
      </div>
    )
  }

  if ('href' in action) {
    return (
      <a href={action.href} className={`${BASE} ${s.padding} ${INTERACTIVE}`}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={action.onClick} className={`${BASE} ${s.padding} ${INTERACTIVE}`}>
      {content}
    </button>
  )
}
