import { useEffect, useRef, type ReactNode } from 'react';

type SidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function SidePanel({ isOpen, onClose, title, subtitle, children }: SidePanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 400);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`admin-sidepanel-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`admin-sidepanel${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="admin-sidepanel-title"
      >
        <div className="admin-sidepanel-head">
          <h2 id="admin-sidepanel-title" className="admin-sidepanel-title text-h3-bold">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="admin-sidepanel-close"
            onClick={onClose}
            aria-label="סגור"
            tabIndex={isOpen ? 0 : -1}
          >
            ✕
          </button>
        </div>
        {subtitle && <p className="admin-sidepanel-subtitle text-tiny-bold">{subtitle}</p>}
        <div className="admin-sidepanel-body text-small-normal">{children}</div>
      </aside>
    </>
  );
}
