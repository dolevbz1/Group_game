import { useState } from 'react';
import type { InboxItem } from '../data/adminMockData';
import { TYPE_LABELS, SOURCE_LABELS } from '../data/adminMockData';

type InboxCardProps = {
  item: InboxItem;
  defaultExpanded?: boolean;
  onApprove: () => void;
  onDismiss: () => void;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`admin-inbox-chevron${expanded ? ' is-expanded' : ''}`}
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

export default function InboxCard({
  item,
  defaultExpanded = false,
  onApprove,
  onDismiss,
}: InboxCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isUrgent = item.status === 'urgent';
  const panelId = `inbox-panel-${item.id}`;
  const collapsedLabel = isUrgent ? 'דחוף' : TYPE_LABELS[item.type];

  return (
    <article
      className={`admin-inbox-item${expanded ? ' is-expanded' : ''}${isUrgent ? ' is-urgent' : ''}`}
    >
      <button
        type="button"
        className="admin-inbox-item__trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span
          className={`admin-inbox-type admin-inbox-type--${isUrgent ? 'urgent' : item.type} text-tiny-bold`}
        >
          {collapsedLabel}
        </span>
        <span className="admin-inbox-item__title text-small-bold">{item.title}</span>
        <span className="admin-inbox-item__time text-tiny-normal">{item.time}</span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="admin-inbox-item__body" id={panelId}>
          <div className="admin-inbox-card-top">
            <span
              className={`admin-inbox-type admin-inbox-type--${item.type} text-tiny-bold`}
            >
              {isUrgent && 'דחוף · '}
              {TYPE_LABELS[item.type]}
            </span>
            <span className="admin-inbox-source text-tiny-normal">
              {SOURCE_LABELS[item.source]} · {item.time}
            </span>
          </div>

          <h3 className="admin-inbox-title text-small-bold">{item.title}</h3>
          <p className="admin-inbox-summary text-tiny-normal">{item.summary}</p>

          <div className="admin-inbox-ai">
            <span className="admin-inbox-ai-icon" aria-hidden="true">✦</span>
            <p className="admin-inbox-ai-text text-tiny-normal">{item.aiReason}</p>
            <span className={`admin-inbox-confidence text-tiny-bold confidence-${item.confidence}`}>
              {item.confidence === 'high'
                ? 'ביטחון גבוה'
                : item.confidence === 'medium'
                  ? 'ביטחון בינוני'
                  : 'ביטחון נמוך'}
            </span>
          </div>

          <div className="admin-inbox-actions">
            <button
              type="button"
              className="admin-btn admin-btn--primary text-small-bold"
              onClick={onApprove}
            >
              אשר ופרסם
            </button>
            <button type="button" className="admin-btn admin-btn--ghost text-small-normal">
              ערוך
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost text-small-normal"
              onClick={onDismiss}
            >
              דחה
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
