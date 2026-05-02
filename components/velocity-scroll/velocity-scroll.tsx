import { useRef, useState, useEffect, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

/* -------------------------------------------------------------------------- */
/*  VelocityRow – single scrolling row                                        */
/* -------------------------------------------------------------------------- */

interface VelocityRowProps {
  children: ReactNode;
  baseVelocity: number;
  className?: string;
  gap?: string;
}

function VelocityRow({ children, baseVelocity, className, gap = '1rem' }: VelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [reps, setReps] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !innerRef.current) return;
      const containerW = containerRef.current.offsetWidth;
      const innerW = innerRef.current.offsetWidth;
      if (innerW > 0) {
        setReps(Math.ceil(containerW / innerW) + 2);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  useAnimationFrame((_t, delta) => {
    if (!innerRef.current) return;

    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;

    moveBy += directionRef.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);

    const innerW = innerRef.current.offsetWidth;
    if (baseX.get() < -innerW) baseX.set(baseX.get() + innerW);
    else if (baseX.get() > 0) baseX.set(baseX.get() - innerW);
  });

  return (
    <div
      ref={containerRef}
      className={cn('w-full overflow-hidden', className)}
    >
      <motion.div
        className="flex whitespace-nowrap"
        style={{ gap, x: baseX }}
      >
        {Array.from({ length: reps }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? innerRef : undefined}
            className="flex flex-shrink-0"
            style={{ gap }}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  VelocityScroll – two opposing rows                                        */
/* -------------------------------------------------------------------------- */

interface VelocityScrollProps {
  children: ReactNode;
  baseVelocity?: number;
  rows?: 1 | 2 | 3;
  gap?: string;
  className?: string;
}

export function VelocityScroll({
  children,
  baseVelocity = -40,
  rows = 2,
  gap = '1rem',
  className,
}: VelocityScrollProps) {
  const velocities = [baseVelocity, -baseVelocity, baseVelocity];

  return (
    <div className={cn('relative w-full flex flex-col', className)} style={{ gap }}>
      {velocities.slice(0, rows).map((v, i) => (
        <VelocityRow key={i} baseVelocity={v} gap={gap}>
          {children}
        </VelocityRow>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TestimonialCard                                                           */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { name, role, content, avatar } = testimonial;

  return (
    <div className={cn(
      'flex-shrink-0 w-52 p-4 rounded-xl border border-border bg-card flex flex-col gap-2.5 whitespace-normal shadow-sm',
      className
    )}>
      <p className="text-sm leading-relaxed text-muted-foreground m-0 italic">
        &ldquo;{content}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 mt-auto">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent/70 flex items-center justify-center text-[0.75rem] font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="leading-tight">
          <p className="text-[0.8125rem] font-semibold text-foreground m-0">
            {name}
          </p>
          {role && (
            <p className="text-[0.7rem] text-muted-foreground m-0">
              {role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
