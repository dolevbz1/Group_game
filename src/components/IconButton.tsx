import type { ReactNode } from 'react';
import './IconButton.css';

type IconButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
};

export function IconButton({ ariaLabel, onClick, children }: IconButtonProps) {
  return (
    <button type="button" className="screen-icon-btn" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

type ScreenTextButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
};

export function ScreenTextButton({ ariaLabel, onClick, icon, children }: ScreenTextButtonProps) {
  return (
    <button
      type="button"
      className="screen-text-btn text-small-bold"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
