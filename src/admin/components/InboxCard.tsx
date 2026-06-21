import type { InboxItem } from '../data/adminMockData';
import { TYPE_LABELS, SOURCE_LABELS, SECTION_COLORS } from '../data/adminMockData';

type InboxCardProps = {
  item: InboxItem;
  onApprove: () => void;
  onDismiss: () => void;
};

export default function InboxCard({ item, onApprove, onDismiss }: InboxCardProps) {
  const isUrgent = item.status === 'urgent';

  return (
    <article className={`admin-inbox-card${isUrgent ? ' is-urgent' : ''}`}>
      <div className="admin-inbox-card-top">
        <span
          className="admin-inbox-type text-tiny-bold"
          style={{ background: SECTION_COLORS[item.type] }}
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
          {item.confidence === 'high' ? 'ביטחון גבוה' : item.confidence === 'medium' ? 'ביטחון בינוני' : 'ביטחון נמוך'}
        </span>
      </div>

      <div className="admin-inbox-actions">
        <button type="button" className="admin-btn admin-btn--primary text-small-bold" onClick={onApprove}>
          אשר ופרסם
        </button>
        <button type="button" className="admin-btn admin-btn--ghost text-small-normal">
          ערוך
        </button>
        <button type="button" className="admin-btn admin-btn--ghost text-small-normal" onClick={onDismiss}>
          דחה
        </button>
      </div>
    </article>
  );
}
