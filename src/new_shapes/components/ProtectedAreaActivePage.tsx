import { useEffect, useState } from 'react';
import { IconButton, CloseIcon } from './IconButton';
import {
  PROTECTED_AREA_ALERT_GROUPS,
  PROTECTED_AREA_FOOTER_LINK,
  PROTECTED_AREA_STATUS,
} from '../data/protectedAreaAlertsData';
import './ProtectedAreaActivePage.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

function AlertIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 8.5V15.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="14" cy="18.75" r="1" fill="currentColor" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 5h5v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L19 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export default function ProtectedAreaActivePage({ open, onClose }: Props) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!open) {
      setElapsedSeconds(0);
      return;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.clearInterval(timer);
    };
  }, [open, onClose]);

  return (
    <div
      className={`protected-area-active-page${open ? ' is-open' : ''}`}
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="שטח מוגן פעיל"
      aria-hidden={!open}
    >
      <div className="protected-area-active-bg" />

      <div className="protected-area-active-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <span className="protected-area-active-top-title">התראות</span>
      </div>

      <div className="protected-area-active-scroll">
        <section className="protected-area-reveal protected-area-status-card" aria-label="סטטוס התרעה פעילה">
          <span className="protected-area-status-elapsed text-tiny-bold" aria-live="polite">
            {formatElapsed(elapsedSeconds)}
          </span>
          <div className="protected-area-status-main">
            <div className="protected-area-status-copy">
              <h2 className="protected-area-status-title">{PROTECTED_AREA_STATUS.headline}</h2>
              <p className="protected-area-status-sub text-small-normal">
                {PROTECTED_AREA_STATUS.subline}
              </p>
            </div>
            <div className="protected-area-status-divider" aria-hidden="true" />
            <div className="protected-area-status-meta">
              <span className="protected-area-status-icon" aria-hidden="true">
                <AlertIcon />
              </span>
              <time className="protected-area-status-time text-small-bold">
                {PROTECTED_AREA_STATUS.startedAt}
              </time>
            </div>
          </div>
        </section>

        {PROTECTED_AREA_ALERT_GROUPS.map((group) => (
          <section
            key={group.id}
            className="protected-area-reveal protected-area-block"
            aria-label={`התראות ${group.label}`}
          >
            <h3 className="protected-area-block-title">{group.label}</h3>
            <div className="protected-area-list">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`protected-area-row${item.muted ? ' is-muted' : ''}`}
                >
                  <span className="protected-area-row-icon" aria-hidden="true">
                    <AlertIcon />
                  </span>
                  <span className="protected-area-row-text">
                    <span className="protected-area-row-label text-small-bold">{item.type}</span>
                    <span className="protected-area-row-sub text-tiny-normal">{item.region}</span>
                  </span>
                  <span className="protected-area-row-value text-tiny-bold">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="protected-area-reveal protected-area-footer">
          <a
            className="protected-area-footer-link text-small-normal"
            href={PROTECTED_AREA_FOOTER_LINK.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon />
            <span>{PROTECTED_AREA_FOOTER_LINK.label}</span>
          </a>
        </footer>
      </div>
    </div>
  );
}
