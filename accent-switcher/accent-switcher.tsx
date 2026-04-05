/**
 * AccentSwitcher - Accent Color Picker
 *
 * A shadcn-style component providing an accent color picker dropdown
 * with smooth oklch color interpolation between accents.
 * Theme mode toggling is handled separately by AnimatedThemeToggler.
 *
 * Dependencies: lucide-react, @radix-ui/react-dropdown-menu,
 *               shadcn Button + DropdownMenu, cn() utility
 *
 * Usage:
 *   <AccentSwitcher
 *     palettes={{
 *       amber:     { label: 'Amber',     oklch: 'oklch(0.555 0.146 49)' },
 *       emerald:   { label: 'Emerald',   oklch: 'oklch(0.511 0.086 186.4)' },
 *     }}
 *     defaultPalette="amber"
 *     granularity={400}
 *     onAccentChange={(key) => { ... }}
 *   />
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  oklch interpolation helpers                                               */
/* -------------------------------------------------------------------------- */

type Oklch = [l: number, c: number, h: number];

function parseOklch(str: string): Oklch | null {
	const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
	if (!m) return null;
	return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
}

function lerpOklch(from: Oklch, to: Oklch, t: number): string {
	const l = from[0] + (to[0] - from[0]) * t;
	const c = from[1] + (to[1] - from[1]) * t;
	// Shortest path around the hue circle
	let dh = to[2] - from[2];
	if (dh > 180) dh -= 360;
	if (dh < -180) dh += 360;
	const h = from[2] + dh * t;
	return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PaletteConfig {
	label: string;
	oklch: string;
}

export interface AccentSwitcherProps {
	/** Map of palette key -> config. Keys are used as `data-accent` attribute values. */
	palettes: Record<string, PaletteConfig>;
	/** Initial/default palette key (must exist in `palettes`). */
	defaultPalette?: string;
	/** Currently active palette key (controlled mode). Falls back to defaultPalette. */
	activePalette?: string;
	/** HTML attribute name set on <html> for the accent. Default: "data-accent". */
	accentAttribute?: string;
	/** Label for the dropdown header. */
	dropdownLabel?: string;
	/**
	 * Transition duration in ms for the color fade between accents.
	 * Higher = longer & smoother, lower = faster & coarser. 0 = instant.
	 * Default: 400
	 */
	granularity?: number;
	/** Callback when accent palette changes. */
	onAccentChange?: (key: string) => void;
	className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AccentSwitcher({
	palettes,
	defaultPalette,
	activePalette,
	accentAttribute = 'data-accent',
	dropdownLabel = 'Accent color',
	granularity = 400,
	onAccentChange,
	className,
}: AccentSwitcherProps) {
	const paletteKeys = Object.keys(palettes);
	const fallback = defaultPalette && palettes[defaultPalette] ? defaultPalette : paletteKeys[0];

	const [accent, setAccent] = useState(fallback);
	const currentAccent = activePalette && palettes[activePalette] ? activePalette : accent;

	const animRef = useRef(0);
	const currentOklchRef = useRef<Oklch | null>(null);

	// Seed the ref with the initial palette color
	useEffect(() => {
		if (!currentOklchRef.current) {
			currentOklchRef.current = parseOklch(palettes[currentAccent]?.oklch ?? '');
		}
	}, []);

	const selectAccent = useCallback(
		(key: string) => {
			const target = palettes[key];
			if (!target) return;

			const toOklch = parseOklch(target.oklch);
			const fromOklch = currentOklchRef.current ?? parseOklch(palettes[currentAccent]?.oklch ?? '');

			// Update state & attribute immediately
			setAccent(key);
			document.documentElement.setAttribute(accentAttribute, key);
			onAccentChange?.(key);

			// Instant switch if no interpolation possible or granularity is 0
			if (!toOklch || !fromOklch || granularity <= 0) {
				if (toOklch) currentOklchRef.current = toOklch;
				document.documentElement.style.removeProperty('--accent');
				return;
			}

			// Cancel any running animation
			if (animRef.current) cancelAnimationFrame(animRef.current);

			const start = performance.now();

			const step = (now: number) => {
				const t = Math.min((now - start) / granularity, 1);
				const value = lerpOklch(fromOklch, toOklch, easeInOutCubic(t));
				document.documentElement.style.setProperty('--accent', value);

				if (t < 1) {
					animRef.current = requestAnimationFrame(step);
				} else {
					// Let CSS rule take over
					document.documentElement.style.removeProperty('--accent');
					currentOklchRef.current = toOklch;
					animRef.current = 0;
				}
			};

			animRef.current = requestAnimationFrame(step);
		},
		[palettes, currentAccent, accentAttribute, granularity, onAccentChange]
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
		};
	}, []);

	return (
		<div className={cn('flex items-center gap-1', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" aria-label={dropdownLabel}>
						<Palette className="h-[1.125rem] w-[1.125rem]" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-44">
					<DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{paletteKeys.map((key) => {
						const { label, oklch } = palettes[key];
						return (
							<DropdownMenuItem key={key} onClick={() => selectAccent(key)} className="flex cursor-pointer items-center gap-3">
								<span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-border" style={{ backgroundColor: oklch }} />
								<span>{label}</span>
								{currentAccent === key && <span className="ml-auto text-xs opacity-70">&#10003;</span>}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
