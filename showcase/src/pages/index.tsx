import { Link } from 'react-router'
import { BlurFade } from '@components/blur-fade/blur-fade'
import { groups } from '../data'

// Stagger-Delay zwischen den Karten in Millisekunden.
// 80ms ergibt bei 9 Karten ~640ms Gesamtdauer — schnell genug, dass es
// nicht träge wirkt, langsam genug für ein deutliches Wellen-Pattern.
const STAGGER_MS = 80

export function IndexPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {groups.map((group, i) => (
        // Jede Karte bekommt ihr eigenes BlurFade mit ansteigendem `delay`.
        // BlurFade kümmert sich intern um IntersectionObserver +
        // prefers-reduced-motion, daher reicht hier der Wrapper.
        <BlurFade key={group.path} delay={i * STAGGER_MS}>
          <Link
            to={group.path}
            viewTransition
            className="group border border-border rounded-xl bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md no-underline block"
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
        </BlurFade>
      ))}
    </div>
  )
}
