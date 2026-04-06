/**
 * AccentSwitcher - Accent Color Picker
 *
 * A dependency-free accent color picker dropdown with smooth oklch interpolation.
 * Theme mode toggling is handled separately by AnimatedThemeToggler.
 *
 * Dependencies: lucide-react (Palette icon only)
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
	style?: React.CSSProperties;
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
	style,
}: AccentSwitcherProps) {
	const paletteKeys = Object.keys(palettes);
	
	// Internal state should be initialized from DOM if possible, otherwise fallback
	const [accent, setAccent] = useState(() => {
		if (typeof document === 'undefined') return defaultPalette ?? paletteKeys[0];
		return document.documentElement.getAttribute(accentAttribute) ?? defaultPalette ?? paletteKeys[0];
	});
	
	const [open, setOpen] = useState(false);
	
	// currentAccent respects controlled prop first, then internal synced state
	const currentAccent = activePalette && palettes[activePalette] ? activePalette : accent;

	const animRef = useRef(0);
	const currentOklchRef = useRef<Oklch | null>(null);
	const styleRef = useRef<HTMLStyleElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	// Persistent <style> element for transition overrides + seed initial oklch
	useEffect(() => {
		const styleEl = document.createElement('style');
		document.head.appendChild(styleEl);
		styleRef.current = styleEl;

		if (!currentOklchRef.current) {
			currentOklchRef.current = parseOklch(palettes[currentAccent]?.oklch ?? '');
		}

		// Initial sync
		const attrValue = document.documentElement.getAttribute(accentAttribute);
		if (attrValue && palettes[attrValue] && attrValue !== accent) {
			setAccent(attrValue);
		}

		// MutationObserver to sync multiple instances via the DOM attribute
		const observer = new MutationObserver(() => {
			const val = document.documentElement.getAttribute(accentAttribute);
			if (val && palettes[val]) {
				setAccent(val);
			}
		});
		
		observer.observe(document.documentElement, { 
			attributes: true, 
			attributeFilter: [accentAttribute] 
		});

		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			styleEl.remove();
			observer.disconnect();
		};
	}, [accentAttribute, palettes, currentAccent, accent]);

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

	const selectAccent = useCallback(
		(key: string) => {
			const target = palettes[key];
			if (!target) return;

			const toOklch = parseOklch(target.oklch);
			const fromOklch = currentOklchRef.current ?? parseOklch(palettes[currentAccent]?.oklch ?? '');

			setAccent(key);
			setOpen(false);
			onAccentChange?.(key);

			// Instant switch if no interpolation possible or granularity is 0
			if (!toOklch || !fromOklch || granularity <= 0) {
				if (styleRef.current) styleRef.current.textContent = '';
				document.documentElement.setAttribute(accentAttribute, key);
				if (toOklch) currentOklchRef.current = toOklch;
				return;
			}

			if (animRef.current) cancelAnimationFrame(animRef.current);

			const writeAccent = (value: string) => {
				if (styleRef.current) {
					styleRef.current.textContent = `:root { --accent: ${value} !important; }`;
				}
			};

			// Pin to start color, then switch attribute (CSS rule changes but !important wins)
			writeAccent(lerpOklch(fromOklch, toOklch, 0));
			document.documentElement.setAttribute(accentAttribute, key);

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
		},
		[palettes, currentAccent, accentAttribute, granularity, onAccentChange]
	);

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
				className="accent-trigger"
				onClick={() => setOpen((v) => !v)}
				aria-label={dropdownLabel}
				aria-expanded={open}
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '2.25rem',
					height: '2.25rem',
					borderRadius: '0.375rem',
					border: 'none',
					background: 'transparent',
					color: 'inherit',
					cursor: 'pointer',
					transition: 'background 0.15s',
				}}
				onMouseEnter={(e) => {
					(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
				}}
				onMouseLeave={(e) => {
					(e.currentTarget as HTMLElement).style.background = 'transparent';
				}}
			>
				<svg
					className="accent-palette-icon"
					width="18" height="18"
					viewBox="0 0 24 24" fill="none" stroke="currentColor"
					strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
				>
					<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
					<circle className="accent-dot-1" cx="8.5" cy="7.5" r="1" fill="currentColor" />
					<circle className="accent-dot-2" cx="13.5" cy="6.5" r="1" fill="currentColor" />
					<circle className="accent-dot-3" cx="17.5" cy="10.5" r="1" fill="currentColor" />
					<circle className="accent-dot-4" cx="6.5" cy="12.5" r="1" fill="currentColor" />
				</svg>
				<style>{`
					.accent-palette-icon .accent-dot-1,
					.accent-palette-icon .accent-dot-2,
					.accent-palette-icon .accent-dot-3,
					.accent-palette-icon .accent-dot-4 {
						transition: fill 0.3s ease;
					}
					.accent-trigger:hover .accent-dot-1 { fill: oklch(0.585 0.233 277) !important; }
					.accent-trigger:hover .accent-dot-2 { fill: oklch(0.555 0.146 49) !important; }
					.accent-trigger:hover .accent-dot-3 { fill: oklch(0.511 0.086 186.4) !important; }
					.accent-trigger:hover .accent-dot-4 { fill: oklch(0.585 0.22 5) !important; }
				`}</style>
			</button>

			{/* Dropdown */}
			{open && (
				<div
					ref={menuRef}
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
						{dropdownLabel}
					</div>

					{/* Separator */}
					<div
						style={{
							height: '1px',
							margin: '0.25rem -0.25rem',
							background: 'rgba(255,255,255,0.08)',
						}}
					/>

					{/* Items */}
					{paletteKeys.map((key) => {
						const { label, oklch } = palettes[key];
						return (
							<button
								key={key}
								type="button"
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
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.background = 'transparent';
								}}
							>
								<span
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
								{currentAccent === key && (
									<span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>
										&#10003;
									</span>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
