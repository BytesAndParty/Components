/**
 * AccentSwitcher - Accent Color Picker
 *
 * A dependency-free accent color picker dropdown with smooth oklch interpolation.
 * Theme mode toggling is handled separately by AnimatedThemeToggler.
 *
 * On hover, the palette icon dots show the configured accent colors using the
 * currentColor trick: <g style={{ color: oklch(...) }}> + fill="currentColor".
 * CSS `color` supports oklch, and `currentColor` resolves it for SVG `fill`.
 *
 * A11y: WAI-ARIA menu pattern with menuitemradio. Arrow keys cycle items,
 * Home/End jump to ends, Escape closes and returns focus to the trigger.
 *
 * Dependencies: none (lucide-react removed)
 */

import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { useAtelier } from '../atelier';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type AccentSwitcherMessages } from './messages';

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
	/**
	 * Transition duration in ms for the color fade between accents.
	 * Higher = longer & smoother, lower = faster & coarser. 0 = instant.
	 * Default: 400
	 */
	granularity?: number;
	/** Callback when accent palette changes. */
	onAccentChange?: (key: string) => void;
	/** i18n overrides for trigger label and current-item suffix. */
	messages?: Partial<AccentSwitcherMessages>;
	className?: string;
	style?: React.CSSProperties;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AccentSwitcher({
	palettes,
	defaultPalette: _defaultPalette,
	activePalette,
	accentAttribute: _accentAttribute = 'data-accent',
	granularity = 400,
	onAccentChange,
	messages,
	className,
	style,
}: AccentSwitcherProps) {
	const paletteKeys = Object.keys(palettes);
	const m = useComponentMessages(MESSAGES, messages);
	const menuId = useId();

	const { accent, setAccent: setAtelierAccent } = useAtelier();

	const [open, setOpen] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [focusVisible, setFocusVisible] = useState(false);

	// currentAccent respects controlled prop first, then internal synced state
	const currentAccent = activePalette && palettes[activePalette] ? activePalette : accent;

	const animRef = useRef(0);
	const currentOklchRef = useRef<Oklch | null>(null);
	const styleRef = useRef<HTMLStyleElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Persistent <style> element for transition overrides + seed initial oklch.
	// Mount-only by design: re-creating the style element on every accent
	// change would tear down the in-flight rAF transition. Subsequent oklch
	// updates flow through selectAccent, not this effect.
	useEffect(() => {
		const styleEl = document.createElement('style');
		document.head.appendChild(styleEl);
		styleRef.current = styleEl;

		if (!currentOklchRef.current) {
			currentOklchRef.current = parseOklch(palettes[currentAccent]?.oklch ?? '');
		}

		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			styleEl.remove();
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		const handleClick = (e: MouseEvent) => {
			const target = e.target as Node;
			if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [open]);

	// On open: focus the active item so arrow keys work immediately
	useEffect(() => {
		if (!open) return;
		const activeIdx = paletteKeys.indexOf(currentAccent);
		const target = itemRefs.current[activeIdx >= 0 ? activeIdx : 0];
		target?.focus();
	}, [open, currentAccent, paletteKeys]);

	const closeAndRestoreFocus = useCallback(() => {
		setOpen(false);
		triggerRef.current?.focus();
	}, []);

	function selectAccent(key: string) {
		const target = palettes[key];
		if (!target) return;

		const toOklch = parseOklch(target.oklch);
		const fromOklch = currentOklchRef.current ?? parseOklch(palettes[currentAccent]?.oklch ?? '');

		setAtelierAccent(key);
		closeAndRestoreFocus();
		onAccentChange?.(key);

		// Instant switch if no interpolation possible or granularity is 0
		if (!toOklch || !fromOklch || granularity <= 0) {
			if (styleRef.current) styleRef.current.textContent = '';
			if (toOklch) currentOklchRef.current = toOklch;
			return;
		}

		if (animRef.current) cancelAnimationFrame(animRef.current);

		const writeAccent = (value: string) => {
			if (styleRef.current) {
				styleRef.current.textContent = `:root { --accent: ${value} !important; }`;
			}
		};

		// Pin to start color — AtelierProvider already set the attribute via setAtelierAccent
		writeAccent(lerpOklch(fromOklch, toOklch, 0));

		// performance.now is impure but this whole function is invoked from
		// onClick (selectAccent). The lint rule is line-based and can't see
		// that — it's not actually called during render.
		// eslint-disable-next-line react-hooks/purity
		const start = performance.now();

		const step = (now: number) => {
			const t = Math.min((now - start) / granularity, 1);
			writeAccent(lerpOklch(fromOklch, toOklch, easeInOutCubic(t)));

			if (t < 1) {
				animRef.current = requestAnimationFrame(step);
			} else {
				if (styleRef.current) styleRef.current.textContent = '';
				currentOklchRef.current = toOklch;
				animRef.current = 0;
			}
		};

		animRef.current = requestAnimationFrame(step);
	}

	function focusItemAt(idx: number) {
		const last = paletteKeys.length - 1;
		const clamped = idx < 0 ? last : idx > last ? 0 : idx;
		itemRefs.current[clamped]?.focus();
	}

	function handleMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		const activeIdx = itemRefs.current.findIndex((el) => el === document.activeElement);
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				focusItemAt(activeIdx + 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusItemAt(activeIdx - 1);
				break;
			case 'Home':
				e.preventDefault();
				focusItemAt(0);
				break;
			case 'End':
				e.preventDefault();
				focusItemAt(paletteKeys.length - 1);
				break;
			case 'Escape':
				e.preventDefault();
				closeAndRestoreFocus();
				break;
			case 'Tab':
				setOpen(false);
				break;
		}
	}

	function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setOpen(true);
		}
	}

	// First 4 palette colors for the icon dots
	const dotColors = paletteKeys.slice(0, 4).map((key) => palettes[key]?.oklch ?? 'currentColor');

	return (
		<div
			className={className}
			style={{
				position: 'relative',
				display: 'inline-flex',
				alignItems: 'center',
				...style,
			}}
		>
			{/* Trigger */}
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((v: boolean) => !v)}
				onKeyDown={handleTriggerKeyDown}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				onFocus={(e) => setFocusVisible(e.target.matches(':focus-visible'))}
				onBlur={() => setFocusVisible(false)}
				aria-label={m.label}
				aria-haspopup="menu"
				aria-expanded={open}
				aria-controls={menuId}
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '2.25rem',
					height: '2.25rem',
					borderRadius: '0.375rem',
					border: 'none',
					background: hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
					color: 'inherit',
					cursor: 'pointer',
					transition: 'background 0.15s, box-shadow 0.15s linear',
					boxShadow: focusVisible
						? '0 0 0 2px var(--background, #fff), 0 0 0 4px var(--accent)'
						: 'none',
				}}
			>
				<svg
					width="18" height="18"
					viewBox="0 0 24 24" fill="none" stroke="currentColor"
					strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
					aria-hidden
				>
					<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
					{/* oklch trick: CSS `color` supports oklch, fill="currentColor" resolves it */}
					<g style={{ color: hovered ? dotColors[0] : 'inherit', transition: 'color 0.3s ease' }}>
						<circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
					</g>
					<g style={{ color: hovered ? dotColors[1] : 'inherit', transition: 'color 0.3s ease' }}>
						<circle cx="13.5" cy="6.5" r="1" fill="currentColor" />
					</g>
					<g style={{ color: hovered ? dotColors[2] : 'inherit', transition: 'color 0.3s ease' }}>
						<circle cx="17.5" cy="10.5" r="1" fill="currentColor" />
					</g>
					<g style={{ color: hovered ? dotColors[3] : 'inherit', transition: 'color 0.3s ease' }}>
						<circle cx="6.5" cy="12.5" r="1" fill="currentColor" />
					</g>
				</svg>
			</button>

			{/* Dropdown */}
			{open && (
				<div
					ref={menuRef}
					id={menuId}
					role="menu"
					aria-label={m.label}
					onKeyDown={handleMenuKeyDown}
					style={{
						position: 'absolute',
						top: '100%',
						right: 0,
						marginTop: '0.25rem',
						zIndex: 50,
						minWidth: '11rem',
						borderRadius: '0.5rem',
						border: '1px solid var(--border)',
						background: 'var(--card)',
						padding: '0.25rem',
						boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
					}}
				>
					{/* Header */}
					<div
						style={{
							padding: '0.375rem 0.5rem',
							fontSize: '0.8125rem',
							fontWeight: 600,
							opacity: 0.6,
						}}
					>
						{m.label}
					</div>

					{/* Separator */}
					<div
						aria-hidden
						style={{
							height: '1px',
							margin: '0.25rem -0.25rem',
							background: 'rgba(255,255,255,0.08)',
						}}
					/>

					{/* Items */}
					{paletteKeys.map((key, idx) => {
						const { label, oklch } = palettes[key];
						const isActive = currentAccent === key;
						return (
							<button
								key={key}
								ref={(el) => { itemRefs.current[idx] = el; }}
								type="button"
								role="menuitemradio"
								aria-checked={isActive}
								onClick={() => selectAccent(key)}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.75rem',
									width: '100%',
									padding: '0.375rem 0.5rem',
									borderRadius: '0.25rem',
									border: 'none',
									background: 'transparent',
									color: 'inherit',
									fontSize: '0.875rem',
									cursor: 'pointer',
									transition: 'background 0.1s',
								}}
								onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
									(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
								}}
								onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
									(e.currentTarget as HTMLElement).style.background = 'transparent';
								}}
								onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
									(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
								}}
								onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
									(e.currentTarget as HTMLElement).style.background = 'transparent';
								}}
							>
								<span
									aria-hidden
									style={{
										width: '0.875rem',
										height: '0.875rem',
										flexShrink: 0,
										borderRadius: '9999px',
										boxShadow: '0 0 0 1px var(--border)',
										backgroundColor: oklch,
									}}
								/>
								<span>{label}</span>
								{isActive && (
									<>
										<span aria-hidden style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>
											&#10003;
										</span>
										<span style={{
											position: 'absolute',
											width: 1, height: 1, padding: 0, margin: -1,
											overflow: 'hidden', clip: 'rect(0,0,0,0)',
											whiteSpace: 'nowrap', border: 0,
										}}>
											{m.current}
										</span>
									</>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
