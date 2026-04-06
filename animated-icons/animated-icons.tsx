import { useRef, useCallback } from 'react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { cn } from '@/lib/utils';

import homeData from '../_resources_/Home/home.json';
import searchToXData from '../_resources_/Search to X/searchToX.json';
import menuV2Data from '../_resources_/Menu V2/menuV2.json';
import menuV2AltData from '../_resources_/Menu V2 (1)/menuV2.json';
import filterData from '../_resources_/Filter/filter.json';
import notificationData from '../_resources_/NotificationV3/notification-V3.json';
import visibilityData from '../_resources_/Visibility V3/visibility-V3.json';
import checkmarkData from '../_resources_/Checkmark/checkmark.json';
import copyData from '../_resources_/Copy/copy.json';
import loadingData from '../_resources_/Loading/loading.json';
import maximizeMinimizeData from '../_resources_/Maximize-minimize V2/maximizeMinimizeV2.json';
import shareData from '../_resources_/Share/share.json';
import trashData from '../_resources_/Trash V2/trashV2.json';

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
} as const;
