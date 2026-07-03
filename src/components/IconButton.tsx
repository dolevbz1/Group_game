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

export function AiSparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2C12 2 12.8 7.2 14.5 9.5C16.8 11.2 22 12 22 12C22 12 16.8 12.8 14.5 15.1C12.8 16.8 12 22 12 22C12 22 11.2 16.8 9.5 15.1C7.2 12.8 2 12 2 12C2 12 7.2 11.2 9.5 9.5C11.2 7.2 12 2 12 2Z" fill="#1a1a1a" />
      <path d="M19 2C19 2 19.4 4.6 20.25 5.75C21.4 6.6 24 7 24 7C24 7 21.4 7.4 20.25 8.55C19.4 9.4 19 12 19 12C19 12 18.6 9.4 17.75 8.55C16.6 7.4 14 7 14 7C14 7 16.6 6.6 17.75 5.75C18.6 4.6 19 2 19 2Z" fill="#1a1a1a" />
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
