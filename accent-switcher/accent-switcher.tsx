/**
 * AccentSwitcher - Reusable Theme Mode & Accent Color Picker
 *
 * A shadcn-style component providing:
 *   1. Light/Dark mode toggle (Sun/Moon icon)
 *   2. Accent color picker dropdown (configurable palettes)
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
 *     themeStorageKey="my_theme_pref"
 *     onThemeChange={(mode) => { ... }}
 *     onAccentChange={(key) => { ... }}
 *   />
 */

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
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
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PaletteConfig {
	label: string;
	oklch: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AccentSwitcherProps {
	/** Map of palette key -> config. Keys are used as `data-accent` attribute values. */
	palettes: Record<string, PaletteConfig>;
	/** Initial/default palette key (must exist in `palettes`). */
	defaultPalette?: string;
	/** Currently active palette key (controlled mode). Falls back to defaultPalette. */
	activePalette?: string;
	/** localStorage key for persisting theme mode. */
	themeStorageKey?: string;
	/** HTML attribute name set on <html> for the accent. Default: "data-accent". */
	accentAttribute?: string;
	/** HTML attribute name set on <html> for theme mode. Default: "data-theme". */
	themeAttribute?: string;
	/** Whether to also toggle the "dark" CSS class on <html>. Default: true. */
	toggleDarkClass?: boolean;
	/** Label for the dropdown header. */
	dropdownLabel?: string;
	/** Callback when theme mode changes. */
	onThemeChange?: (mode: ThemeMode) => void;
	/** Callback when accent palette changes. */
	onAccentChange?: (key: string) => void;
	className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function readTheme(key: string): ThemeMode {
	try {
		const stored = localStorage.getItem(key);
		if (stored === 'dark' || stored === 'light') return stored;
	} catch {}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AccentSwitcher({
	palettes,
	defaultPalette,
	activePalette,
	themeStorageKey = 'theme_pref',
	accentAttribute = 'data-accent',
	themeAttribute = 'data-theme',
	toggleDarkClass = true,
	dropdownLabel = 'Accent color',
	onThemeChange,
	onAccentChange,
	className,
}: AccentSwitcherProps) {
	const paletteKeys = Object.keys(palettes);
	const fallback = defaultPalette && palettes[defaultPalette] ? defaultPalette : paletteKeys[0];
	const currentAccent = activePalette && palettes[activePalette] ? activePalette : fallback;

	const [theme, setTheme] = useState<ThemeMode>(() => readTheme(themeStorageKey));

	// Apply theme to DOM
	const applyTheme = useCallback(
		(mode: ThemeMode) => {
			document.documentElement.setAttribute(themeAttribute, mode);
			if (toggleDarkClass) document.documentElement.classList.toggle('dark', mode === 'dark');
			try {
				localStorage.setItem(themeStorageKey, mode);
			} catch {}
		},
		[themeAttribute, themeStorageKey, toggleDarkClass]
	);

	// Init
	useEffect(() => {
		const initial = readTheme(themeStorageKey);
		setTheme(initial);
		applyTheme(initial);
	}, [themeStorageKey, applyTheme]);

	// System preference listener
	useEffect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = (e: MediaQueryListEvent) => {
			try {
				if (localStorage.getItem(themeStorageKey)) return;
			} catch {}
			const next: ThemeMode = e.matches ? 'dark' : 'light';
			setTheme(next);
			applyTheme(next);
			onThemeChange?.(next);
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, [themeStorageKey, applyTheme, onThemeChange]);

	const toggleTheme = useCallback(() => {
		setTheme((prev) => {
			const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			onThemeChange?.(next);
			return next;
		});
	}, [applyTheme, onThemeChange]);

	const selectAccent = useCallback(
		(key: string) => {
			document.documentElement.setAttribute(accentAttribute, key);
			onAccentChange?.(key);
		},
		[accentAttribute, onAccentChange]
	);

	const isDark = theme === 'dark';

	return (
		<div className={cn('flex items-center gap-1', className)}>
			{/* Theme mode toggle */}
			<Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className="relative overflow-hidden">
				<Sun
					className={cn('h-[1.125rem] w-[1.125rem] transition-transform duration-200', isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0')}
					style={{ position: isDark ? 'relative' : 'absolute' }}
				/>
				<Moon
					className={cn('h-[1.125rem] w-[1.125rem] transition-transform duration-200', isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100')}
					style={{ position: isDark ? 'absolute' : 'relative' }}
				/>
			</Button>

			{/* Accent palette picker */}
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
