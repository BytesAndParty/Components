import { useId, useRef, useCallback, useState } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

import homeData from '../../_resources_/Home/home.json';
import searchToXData from '../../_resources_/Search to X/searchToX.json';
import menuV2Data from '../../_resources_/Menu V2/menuV2.json';
import menuV2AltData from '../../_resources_/Menu V2 (1)/menuV2.json';
import filterData from '../../_resources_/Filter/filter.json';
import notificationData from '../../_resources_/NotificationV3/notification-V3.json';
import visibilityData from '../../_resources_/Visibility V3/visibility-V3.json';
import checkmarkData from '../../_resources_/Checkmark/checkmark.json';
import copyData from '../../_resources_/Copy/copy.json';
import loadingData from '../../_resources_/Loading/loading.json';
import maximizeMinimizeData from '../../_resources_/Maximize-minimize V2/maximizeMinimizeV2.json';
import shareData from '../../_resources_/Share/share.json';
import trashData from '../../_resources_/Trash V2/trashV2.json';

interface AnimatedIconProps {
  size?: number;
  className?: string;
  /** Stroke color override. Default: currentColor */
  color?: string;
  /** Animation trigger. Default: 'hover' */
  trigger?: 'hover' | 'click';
  /**
   * Accessible name. When provided the wrapper becomes role=img and is
   * announced. When omitted the icon is treated as decorative (aria-hidden) —
   * the default, since these icons usually sit next to text labels.
   */
  'aria-label'?: string;
}

/**
 * A dotLottie icon that plays forward on hover and reverses on mouse leave.
 *
 * dotLottieRefCallback fires once nach WASM-Init mit der Player-Instanz und
 * erneut mit `null` beim Unmount — wir spiegeln das in einem Ref, damit die
 * Handler immer den aktuellen Player kennen, ohne State + Re-Render.
 */
function useLottieHover() {
  const playerRef = useRef<DotLottie | null>(null);
  const setPlayer = useCallback((d: DotLottie | null) => { playerRef.current = d; }, []);

  const onMouseEnter = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setMode('forward');
    p.play();
  }, []);

  const onMouseLeave = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setMode('reverse');
    p.play();
  }, []);

  const onClick = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    p.setMode('forward');
    p.play();
    // Click-Trigger: nach 1 s zurück abspielen, damit das Icon wieder im
    // Ruhezustand landet (Toggle-Verhalten ohne State).
    setTimeout(() => {
      p.setMode('reverse');
      p.play();
    }, 1000);
  }, []);

  return { setPlayer, onMouseEnter, onMouseLeave, onClick };
}

function createLottieIcon(animationData: unknown, displayName: string, options: { loop?: boolean; autoplay?: boolean } = {}) {
  const { loop = false, autoplay = false } = options;

  function Icon({ size = 32, className, color, trigger = 'hover', 'aria-label': ariaLabel }: AnimatedIconProps) {
    const { setPlayer, onMouseEnter, onMouseLeave, onClick } = useLottieHover();

    const isHover = trigger === 'hover' && !loop;
    const isClick = trigger === 'click' && !loop;
    const a11y = ariaLabel
      ? { role: 'img' as const, 'aria-label': ariaLabel }
      : { 'aria-hidden': true };

    return (
      <div
        {...a11y}
        className={cn(
          'inline-flex items-center justify-center cursor-pointer',
          className
        )}
        onMouseEnter={isHover ? onMouseEnter : undefined}
        onMouseLeave={isHover ? onMouseLeave : undefined}
        onClick={isClick ? onClick : undefined}
        style={{
          width: size,
          height: size,
          filter: color ? 'none' : 'var(--icon-invert, invert(1))',
        }}
      >
        <DotLottieReact
          dotLottieRefCallback={setPlayer}
          data={animationData as Record<string, unknown>}
          loop={loop}
          autoplay={autoplay}
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  Icon.displayName = displayName;
  return Icon;
}

export const HomeIcon = createLottieIcon(homeData, 'HomeIcon');
export const SearchToXIcon = createLottieIcon(searchToXData, 'SearchToXIcon');
export const MenuIcon = createLottieIcon(menuV2Data, 'MenuIcon');
export const MenuAltIcon = createLottieIcon(menuV2AltData, 'MenuAltIcon');
export const FilterIcon = createLottieIcon(filterData, 'FilterIcon');
export const NotificationIcon = createLottieIcon(notificationData, 'NotificationIcon');
export const VisibilityIcon = createLottieIcon(visibilityData, 'VisibilityIcon');
export const CheckmarkIcon = createLottieIcon(checkmarkData, 'CheckmarkIcon');
export const CopyIcon = createLottieIcon(copyData, 'CopyIcon');
export const LoadingIcon = createLottieIcon(loadingData, 'LoadingIcon', { loop: true, autoplay: true });
export const MaximizeMinimizeIcon = createLottieIcon(maximizeMinimizeData, 'MaximizeMinimizeIcon');
export const ShareIcon = createLottieIcon(shareData, 'ShareIcon');
export const TrashIcon = createLottieIcon(trashData, 'TrashIcon');

/* ── CSS-animated SVG icons (not Lottie) ── */

interface CssIconProps {
  size?: number;
  className?: string;
  /** Accessible name. Omit for purely decorative usage (default aria-hidden). */
  'aria-label'?: string;
}

const cssIconStyles = `
@keyframes sun-rays-rotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(30deg) scale(1.15); }
  100% { transform: rotate(0deg) scale(1); }
}
@keyframes moon-rock {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(5deg); }
}
@keyframes moon-star-twinkle1 {
  0%, 100% { opacity: 0; transform: scale(0); }
  40%, 70% { opacity: 1; transform: scale(1.5); }
}
@keyframes moon-star-twinkle2 {
  0%, 100% { opacity: 0; transform: scale(0); }
  50%, 80% { opacity: 1; transform: scale(1.3); }
}
@keyframes moon-star-twinkle3 {
  0%, 100% { opacity: 0; transform: scale(0); }
  30%, 60% { opacity: 1; transform: scale(1.8); }
}
@keyframes star-spin-glow {
  0% { transform: rotate(0) scale(1); filter: drop-shadow(0 0 0 transparent); }
  50% { transform: rotate(180deg) scale(1.15); filter: drop-shadow(0 0 4px var(--accent, #6366f1)); }
  100% { transform: rotate(360deg) scale(1); filter: drop-shadow(0 0 0 transparent); }
}
@keyframes wine-tilt {
  0%, 100% { transform: rotate(0); }
  30% { transform: rotate(8deg); }
  60% { transform: rotate(-4deg); }
}
@keyframes wine-slosh {
  0%, 100% { transform: rotate(0) scaleY(1); }
  25% { transform: rotate(6deg) scaleY(1.3); }
  50% { transform: rotate(-4deg) scaleY(0.8); }
  75% { transform: rotate(2deg) scaleY(1.1); }
}
@keyframes chevron-down-bounce {
  0%, 100% { transform: translateY(0); }
  35% { transform: translateY(4px); }
  65% { transform: translateY(1px); }
}
@keyframes chevron-right-bounce {
  0%, 100% { transform: translateX(0); }
  35% { transform: translateX(4px); }
  65% { transform: translateX(1px); }
}
@keyframes user-pop {
  0%, 100% { transform: scale(1) translateY(0); }
  35% { transform: scale(1.12) translateY(-2px); }
  70% { transform: scale(0.97) translateY(0); }
}
@keyframes plus-rotate-pop {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(45deg) scale(1.2); }
  100% { transform: rotate(0deg) scale(1); }
}
@keyframes minus-stretch {
  0%, 100% { transform: scaleX(1); }
  40% { transform: scaleX(1.35); }
  70% { transform: scaleX(0.88); }
}
@keyframes truck-roll {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(5px); }
  60% { transform: translateX(2px); }
}
@keyframes heart-pulse {
  0% { transform: scale(1); }
  25% { transform: scale(1.25); }
  50% { transform: scale(1); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes heart-pop {
  0% { transform: scale(1); }
  15% { transform: scale(1.35); }
  30% { transform: scale(0.9); }
  45% { transform: scale(1.15); }
  60% { transform: scale(0.97); }
  100% { transform: scale(1); }
}

.css-icon:hover .icon-sun-rays { animation: sun-rays-rotate 0.8s ease; }
.css-icon:hover .icon-moon-body { animation: moon-rock 0.7s ease; }
.css-icon:hover .icon-moon-star1 { animation: moon-star-twinkle1 0.7s ease forwards; }
.css-icon:hover .icon-moon-star2 { animation: moon-star-twinkle2 0.7s ease 0.1s forwards; }
.css-icon:hover .icon-moon-star3 { animation: moon-star-twinkle3 0.7s ease 0.2s forwards; }
.css-icon:hover .icon-star-shape { animation: star-spin-glow 0.7s ease; }
.css-icon:hover .icon-wine-svg { animation: wine-tilt 0.7s ease; }
.css-icon:hover .icon-wine-liquid { animation: wine-slosh 0.8s ease; }
.css-icon:hover .icon-chevron-down { animation: chevron-down-bounce 0.45s ease; }
.css-icon:hover .icon-chevron-right { animation: chevron-right-bounce 0.45s ease; }
.css-icon:hover .icon-user { animation: user-pop 0.5s ease; }
.css-icon:hover .icon-plus { animation: plus-rotate-pop 0.5s ease; }
.css-icon:hover .icon-minus { animation: minus-stretch 0.4s ease; }
.css-icon:hover .icon-truck { animation: truck-roll 0.55s ease; }
.css-icon:hover .icon-heart { animation: heart-pulse 0.6s ease; }
@media (prefers-reduced-motion: reduce) {
  .css-icon:hover .icon-sun-rays,
  .css-icon:hover .icon-moon-body,
  .css-icon:hover .icon-moon-star1,
  .css-icon:hover .icon-moon-star2,
  .css-icon:hover .icon-moon-star3,
  .css-icon:hover .icon-star-shape,
  .css-icon:hover .icon-wine-svg,
  .css-icon:hover .icon-wine-liquid,
  .css-icon:hover .icon-chevron-down,
  .css-icon:hover .icon-chevron-right,
  .css-icon:hover .icon-user,
  .css-icon:hover .icon-plus,
  .css-icon:hover .icon-minus,
  .css-icon:hover .icon-truck,
  .css-icon:hover .icon-heart { animation: none !important; }
}
`;

let cssInjected = false;
function injectCssOnce() {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = cssIconStyles;
  document.head.appendChild(style);
  cssInjected = true;
}

function CssIconWrapper({ size = 32, className, children, 'aria-label': ariaLabel }: CssIconProps & { children: React.ReactNode }) {
  injectCssOnce();
  const a11y = ariaLabel
    ? { role: 'img' as const, 'aria-label': ariaLabel }
    : { 'aria-hidden': true };
  return (
    <div
      {...a11y}
      className={cn('css-icon inline-flex items-center justify-center cursor-pointer', className)}
      style={{ width: size, height: size, color: 'var(--foreground, currentColor)' }}
    >
      {children}
    </div>
  );
}

export function SunIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <g className="icon-sun-rays" style={{ transformOrigin: '12px 12px' }}>
          <path d="M12 2v2" /><path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" /><path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" />
        </g>
      </svg>
    </CssIconWrapper>
  );
}
SunIconCss.displayName = 'SunIconCss';

export function MoonIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path className="icon-moon-body" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" style={{ transformOrigin: '10px 14px' }} />
        <circle className="icon-moon-star1" cx="19" cy="5" r="0.6" fill="currentColor" opacity="0" />
        <circle className="icon-moon-star2" cx="21" cy="9" r="0.4" fill="currentColor" opacity="0" />
        <circle className="icon-moon-star3" cx="17" cy="3" r="0.5" fill="currentColor" opacity="0" />
      </svg>
    </CssIconWrapper>
  );
}
MoonIconCss.displayName = 'MoonIconCss';

export function StarIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon className="icon-star-shape" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
StarIconCss.displayName = 'StarIconCss';

export function WineIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="icon-wine-svg">
        <path d="M8 22h8M12 15v7" />
        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z" />
        <path className="icon-wine-liquid" d="M7.5 10.5c1.5 1 3 .5 4.5 1s3 0 4.5-1" opacity="0.6" style={{ transformOrigin: '12px 10px' }} />
      </svg>
    </CssIconWrapper>
  );
}
WineIconCss.displayName = 'WineIconCss';

export function ChevronDownIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline className="icon-chevron-down" points="6 9 12 15 18 9" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
ChevronDownIconCss.displayName = 'ChevronDownIconCss';

export function ChevronRightIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline className="icon-chevron-right" points="9 6 15 12 9 18" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
ChevronRightIconCss.displayName = 'ChevronRightIconCss';

export function UserIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-user" style={{ transformOrigin: '12px 11px' }}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </g>
      </svg>
    </CssIconWrapper>
  );
}
UserIconCss.displayName = 'UserIconCss';

export function PlusIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-plus" style={{ transformOrigin: '12px 12px' }}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </g>
      </svg>
    </CssIconWrapper>
  );
}
PlusIconCss.displayName = 'PlusIconCss';

export function MinusIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <line className="icon-minus" x1="5" y1="12" x2="19" y2="12" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
MinusIconCss.displayName = 'MinusIconCss';

export function TruckIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className} aria-label={ariaLabel}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <g className="icon-truck" style={{ transformOrigin: '12px 12px' }}>
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 4v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
          <line x1="8" y1="18.5" x2="3" y2="18.5" />
          <line x1="16" y1="18.5" x2="14" y2="18.5" />
        </g>
      </svg>
    </CssIconWrapper>
  );
}
TruckIconCss.displayName = 'TruckIconCss';

export function HeartIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  const [liked, setLiked] = useState(false);
  injectCssOnce();
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={ariaLabel ?? 'Like'}
      className={cn('css-icon inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0', className)}
      style={{ width: size, height: size, overflow: 'visible', color: 'var(--foreground, currentColor)' }}
      onClick={() => setLiked(v => !v)}
    >
      <svg width={size} height={size} viewBox="-3 -1 30 26" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ overflow: 'visible', filter: liked ? 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.45))' : 'none', transition: 'filter 300ms ease' }}>
        <path className="icon-heart" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" style={{ transformOrigin: '12px 13px', transition: 'fill 200ms ease, stroke 200ms ease', animation: liked ? 'heart-pop 0.5s ease' : undefined }} />
      </svg>
    </button>
  );
}
HeartIconCss.displayName = 'HeartIconCss';

export function Heart3DIconCss({ size = 32, className, 'aria-label': ariaLabel }: CssIconProps) {
  const [liked, setLiked] = useState(false);
  // useId is the React-native source of stable, unique IDs across mounts;
  // the colons it returns are valid in SVG id refs but stripped here so
  // the values are also safe for any downstream CSS selector use.
  const id = `heart3d-${useId().replace(/:/g, '')}`;
  injectCssOnce();
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={ariaLabel ?? 'Like'}
      className={cn('css-icon inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0', className)}
      style={{ width: size, height: size, overflow: 'visible', color: 'var(--foreground, currentColor)' }}
      onClick={() => setLiked(v => !v)}
    >
      <svg width={size} height={size} viewBox="-3 -1 30 26" fill="none" strokeWidth={0} aria-hidden style={{ overflow: 'visible', filter: liked ? 'drop-shadow(0 3px 6px rgba(239, 68, 68, 0.5))' : 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25))', transition: 'filter 300ms ease' }}>
        <defs>
          {/* Idle gradient — subtle metallic grey */}
          <radialGradient id={`${id}-idle`} cx="0.35" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="#b0b0b0" />
            <stop offset="50%" stopColor="#787878" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </radialGradient>
          {/* Active gradient — rich red 3D */}
          <radialGradient id={`${id}-active`} cx="0.35" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="#ff8a8a" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          {/* Highlight specular */}
          <radialGradient id={`${id}-shine`} cx="0.3" cy="0.25" r="0.35">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* Base shape */}
        <path
          className="icon-heart"
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          fill={liked ? `url(#${id}-active)` : `url(#${id}-idle)`}
          style={{ transformOrigin: '12px 13px', transition: 'fill 300ms ease', animation: liked ? 'heart-pop 0.5s ease' : undefined }}
        />
        {/* Specular highlight overlay */}
        <path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          fill={`url(#${id}-shine)`}
          style={{ pointerEvents: 'none' }}
        />
        {/* Bottom edge shadow for depth */}
        <path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          fill="none"
          stroke={liked ? '#7f1d1d' : '#333'}
          strokeWidth={0.6}
          opacity={0.4}
          style={{ pointerEvents: 'none' }}
        />
      </svg>
    </button>
  );
}
Heart3DIconCss.displayName = 'Heart3DIconCss';

export const animatedIcons = {
  HomeIcon,
  SearchToXIcon,
  MenuIcon,
  MenuAltIcon,
  FilterIcon,
  NotificationIcon,
  VisibilityIcon,
  CheckmarkIcon,
  CopyIcon,
  LoadingIcon,
  MaximizeMinimizeIcon,
  ShareIcon,
  TrashIcon,
  SunIconCss,
  MoonIconCss,
  StarIconCss,
  WineIconCss,
  ChevronDownIconCss,
  ChevronRightIconCss,
  UserIconCss,
  PlusIconCss,
  MinusIconCss,
  TruckIconCss,
  HeartIconCss,
  Heart3DIconCss,
} as const;
