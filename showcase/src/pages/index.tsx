import { Link } from 'react-router'
import { groups } from '../data'

export function IndexPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {groups.map((group) => (
        <Link
          key={group.path}
          to={group.path}
          viewTransition
          className="group border border-border rounded-xl bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md no-underline"
        >
          <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {group.title}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            {group.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {group.components.map((c) => (
              <span
                key={c}
                className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}
