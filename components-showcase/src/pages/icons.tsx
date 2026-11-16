import { Section } from '../components/section'
import {
  HomeIcon, SearchToXIcon, MenuIcon, MenuAltIcon,
  FilterIcon, NotificationIcon, VisibilityIcon,
  CheckmarkIcon, CopyIcon, LoadingIcon, MaximizeMinimizeIcon,
  ShareIcon, TrashIcon,
  SunIconCss, MoonIconCss, StarIconCss, WineIconCss, HeartIconCss, Heart3DIconCss,
} from '@components/animated-icons/animated-icons'

/** Rendered at the end of the "Effekte" route (/cards); /icons redirects there. */
export function IconsSections() {
  return (
    <>
      <Section title="AnimatedIcons" description="Lottie-based animated icons and CSS-animated SVG icons.">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-muted-foreground mb-4 text-[0.7rem] tracking-wider uppercase">Trigger: Hover</p>
            <div className="border-border bg-card grid grid-cols-7 gap-4 gap-y-8 rounded-xl border p-6 shadow-sm">
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
                  <span className="text-muted-foreground text-center text-[0.625rem] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-4 text-[0.7rem] tracking-wider uppercase">Trigger: Click</p>
            <div className="border-border bg-card grid grid-cols-7 gap-4 gap-y-8 rounded-xl border p-6 shadow-sm">
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
                  <span className="text-muted-foreground text-center text-[0.625rem] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-4 text-[0.7rem] tracking-wider uppercase">CSS-Animated SVG Icons</p>
            <div className="border-border bg-card grid grid-cols-7 gap-4 gap-y-8 rounded-xl border p-6 shadow-sm">
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
                  <span className="text-muted-foreground text-center text-[0.625rem] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
