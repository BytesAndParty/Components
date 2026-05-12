import { motion } from 'motion/react';

interface WeatherIconProps {
  size?: number;
  /**
   * Accessible name for the icon. When provided, the SVG becomes `role="img"`
   * and is announced. When omitted, the icon is treated as decorative
   * (`aria-hidden`) — the default, since weather icons usually accompany text.
   */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Returns the props ScreenReader-relevant for the outer <svg>. */
function svgA11y(label?: string) {
  return label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true };
}

export function SunIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      {/* Kreis + Strahlen in EINER Gruppe → drehen sich gemeinsam als Einheit */}
      <motion.g
        stroke="#FBBF24" strokeWidth={2} strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <circle cx="24" cy="24" r="8" fill="#FBBF24" fillOpacity={0.35} stroke="#FBBF24" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r1 = 12, r2 = 16, rad = (a * Math.PI) / 180;
          return <line key={a} x1={24 + r1 * Math.cos(rad)} y1={24 + r1 * Math.sin(rad)} x2={24 + r2 * Math.cos(rad)} y2={24 + r2 * Math.sin(rad)} />;
        })}
      </motion.g>
    </svg>
  );
}

export function MoonIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  // Stars positioned away from the crescent body (tips at ~20,16 and ~34,30)
  const stars = [[10, 10], [38, 8], [8, 34], [40, 30]] as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      {/*
        Crescent via two arcs, both geometrically valid:
        1. a10 10 0 0 0 14 14  – chord=14√2≈19.8 < 2r=20 ✓  (near-impossible → near-straight face)
        2. 14 14 0 1 1-14-14  – chord=19.8 < 2r=28 ✓         (large CW arc = outer boundary)
      */}
      <motion.path
        d="M20 16a10 10 0 0 0 14 14 14 14 0 1 1-14-14Z"
        fill="#A78BFA" fillOpacity={0.15} stroke="#A78BFA" strokeWidth={2}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '24px', originY: '24px' }}
      />
      {stars.map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={1.2} fill="#A78BFA"
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </svg>
  );
}

export function CloudIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <motion.path d="M14 30a6 6 0 0 1 0-12h1a8 8 0 0 1 15.5-2A6 6 0 0 1 34 28H14Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2}
        animate={{ x: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity }} />
    </svg>
  );
}

export function RainIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <path d="M14 26a6 6 0 0 1 0-12h1a8 8 0 0 1 15.5-2A6 6 0 0 1 34 24H14Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2} />
      {[16, 22, 28, 34].map((x, i) => (
        <motion.line key={x} x1={x} y1={30} x2={x} y2={36} stroke="#60A5FA" strokeWidth={2} strokeLinecap="round"
          animate={{ y: [0, 6], opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </svg>
  );
}

export function SnowIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  const flakes = [[16, 30], [22, 32], [28, 30], [34, 32], [19, 36], [31, 36]] as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <path d="M14 26a6 6 0 0 1 0-12h1a8 8 0 0 1 15.5-2A6 6 0 0 1 34 24H14Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2} />
      {flakes.map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={1.5} fill="#CBD5E1"
          animate={{ y: [0, 8], x: [0, i % 2 === 0 ? 3 : -3], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </svg>
  );
}

export function ThunderIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <path d="M14 24a6 6 0 0 1 0-12h1a8 8 0 0 1 15.5-2A6 6 0 0 1 34 22H14Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2} />
      <motion.path d="M26 20l-4 8h6l-4 10" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
        animate={{ opacity: [0, 1, 1, 0, 0, 1, 0, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity }} />
    </svg>
  );
}

export function WindIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  const paths = ['M8 20h24c4 0 4-6 0-6', 'M8 26h20c3 0 3 5 0 5', 'M8 32h16c3 0 3-5 0-5'];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      {paths.map((d, i) => (
        <motion.path key={i} d={d} stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </svg>
  );
}

export function FogIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  const bars = [{ y: 16, w: 28 }, { y: 22, w: 32 }, { y: 28, w: 24 }, { y: 34, w: 30 }];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      {bars.map((b, i) => (
        <motion.line key={i} x1={(48 - b.w) / 2} y1={b.y} x2={(48 + b.w) / 2} y2={b.y}
          stroke="#94A3B8" strokeWidth={2} strokeLinecap="round"
          animate={{ x: [-3, 3, -3], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }} />
      ))}
    </svg>
  );
}

export function PartlyCloudyIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ originX: '16px', originY: '16px' }}>
        <circle cx="16" cy="16" r="6" fill="#FBBF24" fillOpacity={0.2} stroke="#FBBF24" strokeWidth={1.5} />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={16 + 8 * Math.cos(rad)} y1={16 + 8 * Math.sin(rad)} x2={16 + 11 * Math.cos(rad)} y2={16 + 11 * Math.sin(rad)} stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round" />;
        })}
      </motion.g>
      <motion.path d="M18 34a5 5 0 0 1 0-10h1a7 7 0 0 1 13.5-1.5A5 5 0 0 1 36 32H18Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2}
        animate={{ x: [-1.5, 1.5, -1.5] }} transition={{ duration: 5, repeat: Infinity }} />
    </svg>
  );
}

export function SunriseIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <line x1="8" y1="34" x2="40" y2="34" stroke="#94A3B8" strokeWidth={2} />
      <motion.g animate={{ y: [4, 0, 4] }} transition={{ duration: 3, repeat: Infinity }}>
        <circle cx="24" cy="28" r="6" fill="#FBBF24" fillOpacity={0.2} stroke="#FBBF24" strokeWidth={2} />
        {[-90, -60, -30, 0, 30, 60, 90].map((a) => {
          const rad = ((a - 90) * Math.PI) / 180;
          return <line key={a} x1={24 + 8 * Math.cos(rad)} y1={28 + 8 * Math.sin(rad)} x2={24 + 11 * Math.cos(rad)} y2={28 + 11 * Math.sin(rad)} stroke="#FBBF24" strokeWidth={2} strokeLinecap="round" />;
        })}
      </motion.g>
      <motion.path d="M24 14v-4M24 10l-2 2M24 10l2 2" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round"
        animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  );
}

export function RainbowIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  const arcs = [
    { r: 16, color: '#EF4444' },
    { r: 13, color: '#F59E0B' },
    { r: 10, color: '#22C55E' },
    { r: 7, color: '#3B82F6' },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      {arcs.map((arc, i) => (
        <motion.path key={i} d={`M${24 - arc.r} 34 A${arc.r} ${arc.r} 0 0 1 ${24 + arc.r} 34`}
          stroke={arc.color} strokeWidth={2} strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, repeatDelay: 1 }} />
      ))}
    </svg>
  );
}

export function HeavyRainIcon({ size = 48, 'aria-label': label, className, style }: WeatherIconProps) {
  const drops = [14, 19, 24, 29, 34, 38];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={style} {...svgA11y(label)}>
      <path d="M14 24a6 6 0 0 1 0-12h1a8 8 0 0 1 15.5-2A6 6 0 0 1 34 22H14Z" fill="#94A3B8" fillOpacity={0.12} stroke="#94A3B8" strokeWidth={2} />
      {drops.map((x, i) => (
        <motion.line key={x} x1={x} y1={28} x2={x - 2} y2={36} stroke="#3B82F6" strokeWidth={2} strokeLinecap="round"
          animate={{ y: [0, 8], opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
      ))}
    </svg>
  );
}

export const weatherIcons = {
  SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon, SnowIcon,
  ThunderIcon, WindIcon, FogIcon, PartlyCloudyIcon, SunriseIcon, RainbowIcon,
};
