import { useEffect, useId, useRef, useState } from 'react';
import { useComponentMessages } from '../i18n';
import { MESSAGES, type HeartLikeMessages } from './messages';

const STYLE_ID = '__heart-like-styles__';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes heart-like-fill {
      0%   { transform: scale(0); }
      25%  { transform: scale(1.2); filter: brightness(1.3); }
      50%  { transform: scale(1); filter: brightness(1.5); }
      100% { transform: scale(1); filter: brightness(1); }
    }
    @keyframes heart-like-celebrate {
      0%   { transform: scale(0); opacity: 1; }
      50%  { opacity: 1; filter: brightness(1.5); }
      100% { transform: scale(1.4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export interface HeartLikeProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  /** i18n overrides for the `like` / `unlike` labels. */
  messages?: Partial<HeartLikeMessages>;
  className?: string;
}

export function HeartLike({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  size = 50,
  color = 'var(--accent)',
  disabled = false,
  messages,
  className,
}: HeartLikeProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [focusVisible, setFocusVisible] = useState(false);
  const id = useId();
  const injected = useRef(false);
  const m = useComponentMessages(MESSAGES, messages);

  useEffect(() => {
    if (!injected.current) {
      injectStyles();
      injected.current = true;
    }
  }, []);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  const label = checked ? m.unlike : m.like;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    if (next) setCelebrateKey((k) => k + 1);
    onChange?.(next);
  };

  return (
    <label
      htmlFor={id}
      title={label}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: size,
        height: size,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: 'transparent',
        borderRadius: '50%',
        boxShadow: focusVisible
          ? '0 0 0 2px var(--background, #fff), 0 0 0 4px var(--accent)'
          : 'none',
        transition: 'box-shadow 0.15s linear',
      }}
    >
      <input
        id={id}
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        onFocus={(e) => setFocusVisible(e.target.matches(':focus-visible'))}
        onBlur={() => setFocusVisible(false)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'inherit',
          zIndex: 2,
          margin: 0,
        }}
      />

      <span
        aria-hidden
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outline heart — always visible */}
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            fill: color,
            opacity: checked ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
        </svg>

        {/* Filled heart — only when checked */}
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            fill: color,
            display: checked ? 'block' : 'none',
            animation: checked ? 'heart-like-fill 0.6s ease forwards' : undefined,
          }}
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>

        {/* Celebrate burst — restarts on each check */}
        {checked && (
          <svg
            key={celebrateKey}
            width="200%"
            height="200%"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              stroke: color,
              fill: color,
              strokeWidth: 2,
              animation: 'heart-like-celebrate 0.5s ease-out forwards',
            }}
          >
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        )}
      </span>
    </label>
  );
}
