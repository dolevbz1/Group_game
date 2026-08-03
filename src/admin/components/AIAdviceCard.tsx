import { useState } from 'react';
import type { AIAdvice } from '../data/adminMockData';

type AIAdviceCardProps = {
  advice: AIAdvice;
  defaultExpanded?: boolean;
  onDismiss: () => void;
};

const PRIORITY_LABELS = {
  high: 'עדיפות גבוהה',
  medium: 'עדיפות בינונית',
  low: 'המלצה',
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`admin-advice-chevron${expanded ? ' is-expanded' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function AIAdviceCard({
  advice,
  defaultExpanded = false,
  onDismiss,
}: AIAdviceCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelId = `advice-panel-${advice.id}`;

  return (
    <article
      className={`admin-advice-item priority-${advice.priority}${expanded ? ' is-expanded' : ''}`}
    >
      <button
        type="button"
        className="admin-advice-item__trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className={`admin-advice-priority text-tiny-bold priority-${advice.priority}`}>
          {PRIORITY_LABELS[advice.priority]}
        </span>
        <span className="admin-advice-item__title text-small-bold">{advice.title}</span>
        <span className="admin-advice-emoji" aria-hidden="true">{advice.emoji}</span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="admin-advice-item__body" id={panelId}>
          <div className="admin-advice-top">
            <span className="admin-advice-emoji" aria-hidden="true">{advice.emoji}</span>
            <span className={`admin-advice-priority text-tiny-bold priority-${advice.priority}`}>
              {PRIORITY_LABELS[advice.priority]}
            </span>
          </div>
          <h3 className="admin-advice-title text-small-bold">{advice.title}</h3>
          <p className="admin-advice-body text-tiny-normal">{advice.body}</p>
          <div className="admin-advice-actions">
            <button type="button" className="admin-btn admin-btn--primary text-small-bold">
              {advice.actionLabel}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost text-small-normal"
              onClick={onDismiss}
            >
              לא עכשיו
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
