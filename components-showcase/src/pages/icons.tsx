import { Section } from '../components/section'
import {
  SunIcon, MoonIcon, CloudIcon, RainIcon, HeavyRainIcon, SnowIcon,
  ThunderIcon, WindIcon, FogIcon, PartlyCloudyIcon, SunriseIcon, RainbowIcon,
} from '@components/animated-weather-icons/animated-weather-icons'
import {
  HomeIcon, SearchToXIcon, MenuIcon, MenuAltIcon,
  FilterIcon, NotificationIcon, VisibilityIcon,
  CheckmarkIcon, CopyIcon, LoadingIcon, MaximizeMinimizeIcon,
  ShareIcon, TrashIcon,
  SunIconCss, MoonIconCss, StarIconCss, WineIconCss, HeartIconCss, Heart3DIconCss,
} from '@components/animated-icons/animated-icons'

export function IconsPage() {
  return (
    <>
      <Section title="AnimatedWeatherIcons" description="12 animated SVG weather icons with framer-motion.">
        <div className="grid grid-cols-6 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
          {([
            ['Sun', SunIcon], ['Moon', MoonIcon], ['Cloud', CloudIcon],
            ['Rain', RainIcon], ['Heavy Rain', HeavyRainIcon], ['Snow', SnowIcon],
            ['Thunder', ThunderIcon], ['Wind', WindIcon], ['Fog', FogIcon],
            ['Partly Cloudy', PartlyCloudyIcon], ['Sunrise', SunriseIcon], ['Rainbow', RainbowIcon],
          ] as const).map(([label, Icon]) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={40} />
              <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="AnimatedIcons" description="Lottie-based animated icons and CSS-animated SVG icons.">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">Trigger: Hover</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Home', HomeIcon],
                ['Search/X', SearchToXIcon],
                ['Menu', MenuIcon],
                ['Menu Alt', MenuAltIcon],
                ['Filter', FilterIcon],
                ['Notification', NotificationIcon],
                ['Visibility', VisibilityIcon],
                ['Checkmark', CheckmarkIcon],
                ['Copy', CopyIcon],
                ['Loading', LoadingIcon],
                ['Maximize', MaximizeMinimizeIcon],
                ['Share', ShareIcon],
                ['Trash', TrashIcon],
              ] as const).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} trigger="hover" />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">Trigger: Click</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Home', HomeIcon],
                ['Search/X', SearchToXIcon],
                ['Menu', MenuIcon],
                ['Menu Alt', MenuAltIcon],
                ['Filter', FilterIcon],
                ['Notification', NotificationIcon],
                ['Visibility', VisibilityIcon],
                ['Checkmark', CheckmarkIcon],
                ['Copy', CopyIcon],
                ['Loading', LoadingIcon],
                ['Maximize', MaximizeMinimizeIcon],
                ['Share', ShareIcon],
                ['Trash', TrashIcon],
              ] as const).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} trigger="click" />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-4">CSS-Animated SVG Icons</p>
            <div className="grid grid-cols-7 gap-y-8 gap-4 border border-border rounded-xl bg-card p-6 shadow-sm">
              {([
                ['Sun', SunIconCss],
                ['Moon', MoonIconCss],
                ['Star', StarIconCss],
                ['Wine', WineIconCss],
                ['Heart', HeartIconCss],
                ['Heart 3D', Heart3DIconCss],
              ] as [string, typeof SunIconCss][]).map(([label, Icon]) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon size={32} />
                  <span className="text-[0.625rem] text-muted-foreground text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
