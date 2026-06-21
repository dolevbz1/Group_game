import type { AIAdvice } from '../data/adminMockData';

type AIAdviceCardProps = {
  advice: AIAdvice;
  onDismiss: () => void;
};

const PRIORITY_LABELS = {
  high: 'עדיפות גבוהה',
  medium: 'עדיפות בינונית',
  low: 'המלצה',
};

export default function AIAdviceCard({ advice, onDismiss }: AIAdviceCardProps) {
  return (
    <article className={`admin-advice-card priority-${advice.priority}`}>
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
        <button type="button" className="admin-btn admin-btn--ghost text-small-normal" onClick={onDismiss}>
          לא עכשיו
        </button>
      </div>
    </article>
  );
}
