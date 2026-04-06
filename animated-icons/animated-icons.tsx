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

interface AnimatedIconProps {
  size?: number;
  className?: string;
  /** Stroke color override. Default: currentColor */
  color?: string;
}

/**
 * A Lottie icon that plays forward on hover and reverses on mouse leave.
 */
function useLottieHover() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const directionRef = useRef<1 | -1>(1);

  const onMouseEnter = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    directionRef.current = 1;
    anim.setDirection(1);
    anim.play();
  }, []);

  const onMouseLeave = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    directionRef.current = -1;
    anim.setDirection(-1);
    anim.play();
  }, []);

  return { lottieRef, onMouseEnter, onMouseLeave };
}

function createLottieIcon(animationData: unknown, displayName: string) {
  function Icon({ size = 32, className, color }: AnimatedIconProps) {
    const { lottieRef, onMouseEnter, onMouseLeave } = useLottieHover();

    return (
      <div
        className={cn(
          'inline-flex items-center justify-center cursor-pointer',
          'dark:invert',
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: size, height: size, ...(color ? { filter: 'none', color } : {}) }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
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

export const animatedIcons = {
  HomeIcon,
  SearchToXIcon,
  MenuIcon,
  MenuAltIcon,
  FilterIcon,
  NotificationIcon,
  VisibilityIcon,
} as const;
