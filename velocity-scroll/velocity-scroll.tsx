import { useRef, useState, useEffect, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*  VelocityRow – single scrolling row                                        */
/* -------------------------------------------------------------------------- */

interface VelocityRowProps {
  children: ReactNode;
  baseVelocity: number;
  className?: string;
  style?: React.CSSProperties;
}

function VelocityRow({ children, baseVelocity, className, style }: VelocityRowProps) {
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

  // Calculate how many repetitions we need to fill the viewport seamlessly
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

    // Seamless wrap
    const innerW = innerRef.current.offsetWidth;
    if (baseX.get() < -innerW) baseX.set(baseX.get() + innerW);
    else if (baseX.get() > 0) baseX.set(baseX.get() - innerW);
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', overflow: 'hidden', ...style }}
    >
      <motion.div
        style={{
          display: 'flex',
          gap: '1rem',
          whiteSpace: 'nowrap',
          x: baseX,
        }}
      >
        {Array.from({ length: reps }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? innerRef : undefined}
            style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}
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
  style?: React.CSSProperties;
}

export function VelocityScroll({
  children,
  baseVelocity = -40,
  rows = 2,
  gap = '1rem',
  className,
  style,
}: VelocityScrollProps) {
  const velocities = [baseVelocity, -baseVelocity, baseVelocity];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap,
        ...style,
      }}
    >
      {velocities.slice(0, rows).map((v, i) => (
        <VelocityRow key={i} baseVelocity={v}>
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
  style?: React.CSSProperties;
}

export function TestimonialCard({ testimonial, style }: TestimonialCardProps) {
  const { name, role, content, avatar } = testimonial;

  return (
    <div
      style={{
        flexShrink: 0,
        width: 320,
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        whiteSpace: 'normal',
        ...style,
      }}
    >
      <p
        style={{
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        &ldquo;{content}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {name}
          </p>
          {role && (
            <p
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              {role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
