import { useRef, useCallback } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
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
}

/**
 * A Lottie icon that plays forward on hover and reverses on mouse leave.
 */
function useLottieHover() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const onMouseEnter = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.setDirection(1);
    anim.play();
  }, []);

  const onMouseLeave = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.setDirection(-1);
    anim.play();
  }, []);

  const onClick = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.setDirection(1);
    anim.play();
    // For click trigger, we often want it to return to start after a bit
    // But since these are mostly toggle-like or action-like, 
    // maybe we just play it once or play/reverse.
    // Let's implement a simple "play then return" for non-looping click icons.
    setTimeout(() => {
      anim.setDirection(-1);
      anim.play();
    }, 1000);
  }, []);

  return { lottieRef, onMouseEnter, onMouseLeave, onClick };
}

function createLottieIcon(animationData: unknown, displayName: string, options: { loop?: boolean; autoplay?: boolean } = {}) {
  const { loop = false, autoplay = false } = options;

  function Icon({ size = 32, className, color, trigger = 'hover' }: AnimatedIconProps) {
    const { lottieRef, onMouseEnter, onMouseLeave, onClick } = useLottieHover();

    const isHover = trigger === 'hover' && !loop;
    const isClick = trigger === 'click' && !loop;

    return (
      <div
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
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
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
  .css-icon:hover .icon-truck { animation: none !important; }
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

function CssIconWrapper({ size = 32, className, children }: CssIconProps & { children: React.ReactNode }) {
  injectCssOnce();
  return (
    <div
      className={cn('css-icon inline-flex items-center justify-center cursor-pointer', className)}
      style={{ width: size, height: size, color: 'var(--text, currentColor)' }}
    >
      {children}
    </div>
  );
}

export function SunIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
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

export function MoonIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
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

export function StarIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon className="icon-star-shape" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
StarIconCss.displayName = 'StarIconCss';

export function WineIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="icon-wine-svg">
        <path d="M8 22h8M12 15v7" />
        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z" />
        <path className="icon-wine-liquid" d="M7.5 10.5c1.5 1 3 .5 4.5 1s3 0 4.5-1" opacity="0.6" style={{ transformOrigin: '12px 10px' }} />
      </svg>
    </CssIconWrapper>
  );
}
WineIconCss.displayName = 'WineIconCss';

export function ChevronDownIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline className="icon-chevron-down" points="6 9 12 15 18 9" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
ChevronDownIconCss.displayName = 'ChevronDownIconCss';

export function ChevronRightIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline className="icon-chevron-right" points="9 6 15 12 9 18" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
ChevronRightIconCss.displayName = 'ChevronRightIconCss';

export function UserIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
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

export function PlusIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
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

export function MinusIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <line className="icon-minus" x1="5" y1="12" x2="19" y2="12" style={{ transformOrigin: '12px 12px' }} />
      </svg>
    </CssIconWrapper>
  );
}
MinusIconCss.displayName = 'MinusIconCss';

export function TruckIconCss({ size = 32, className }: CssIconProps) {
  return (
    <CssIconWrapper size={size} className={className}>
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
} as const;
