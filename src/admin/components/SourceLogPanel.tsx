import { useMemo, useState } from 'react';
import {
  SOURCE_LOG_STATUS_LABELS,
  type SourceLog,
  type SourceLogStatus,
} from '../data/sourceLogsData';

type SourceLogPanelProps = {
  source: SourceLog;
  onOpenInbox: () => void;
};

function SourceIcon({ sourceId }: { sourceId: SourceLog['id'] }) {
  if (sourceId === 'email') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (sourceId === 'app') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4.2-.9L3 20.5l1.4-4.6A8.4 8.4 0 1 1 21 11.5z" />
      <path d="M8.5 9.5c.8 2 2 3.2 4 4" />
    </svg>
  );
}

export default function SourceLogPanel({ source, onOpenInbox }: SourceLogPanelProps) {
  const [status, setStatus] = useState<'all' | SourceLogStatus>('all');

  const filteredEntries = useMemo(
    () => source.entries.filter((entry) => status === 'all' || entry.status === status),
    [source.entries, status]
  );
  const reviewCount = source.entries.filter((entry) => entry.status !== 'processed').length;

  return (
    <div className={`source-log-panel source-log-panel--${source.id}`}>
      <div className="source-log-overview">
        <div className="source-log-channel-icon">
          <SourceIcon sourceId={source.id} />
        </div>
        <div>
          <p className="text-small-bold">החיבור פעיל</p>
          <p className="source-log-muted text-tiny-normal">סנכרון אחרון: {source.lastSync}</p>
        </div>
      </div>

      <section className="source-log-stats" aria-label="סיכום קליטת מידע">
        <div>
          <strong className="text-h3-bold">{source.todayCount}</strong>
          <span className="text-tiny-normal">פריטים היום</span>
        </div>
        <div>
          <strong className="text-h3-bold">{reviewCount}</strong>
          <span className="text-tiny-normal">דורשים בדיקה</span>
        </div>
        <div>
          <strong className="text-h3-bold">{source.entries.length}</strong>
          <span className="text-tiny-normal">מוצגים ביומן</span>
        </div>
      </section>

      <div className="source-log-filters" aria-label="סינון יומן">
        {([
          ['all', 'הכול'],
          ['processed', 'טופל'],
          ['review', 'לבדיקה'],
          ['escalated', 'הועבר'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`source-log-filter text-tiny-bold${status === value ? ' is-active' : ''}`}
            onClick={() => setStatus(value)}
            aria-pressed={status === value}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="source-log-list">
        {filteredEntries.map((entry) => (
          <article key={entry.id} className={`source-log-entry status-${entry.status}`}>
            <div className="source-log-entry-head">
              <div>
                <p className="source-log-actor text-small-bold">{entry.actor}</p>
                <p className="source-log-muted text-tiny-normal">{entry.context}</p>
              </div>
              <time className="source-log-muted text-tiny-normal">{entry.receivedAt}</time>
            </div>

            <div className="source-log-title-row">
              <h3 className="text-small-bold">{entry.title}</h3>
              <span className={`source-log-status status-${entry.status} text-tiny-bold`}>
                {SOURCE_LOG_STATUS_LABELS[entry.status]}
              </span>
            </div>

            <div className="source-log-original">
              <span className="source-log-label text-tiny-bold">{source.contentLabel}</span>
              <p className="text-small-normal">{entry.content}</p>
            </div>

            <div className="source-log-classification">
              <div>
                <span className="source-log-muted text-tiny-normal">סיווג</span>
                <strong className="text-tiny-bold">{entry.intent}</strong>
              </div>
              <div>
                <span className="source-log-muted text-tiny-normal">ביטחון</span>
                <strong className="text-tiny-bold">{entry.confidence}%</strong>
              </div>
            </div>

            <div className="source-log-ai-decision">
              <span aria-hidden="true">✦</span>
              <div>
                <p className="source-log-label text-tiny-bold">החלטת שומר הסף</p>
                <p className="text-tiny-normal">{entry.aiDecision}</p>
              </div>
            </div>

            <div className="source-log-metadata">
              {entry.metadata.map((item) => (
                <span key={item} className="text-tiny-normal">{item}</span>
              ))}
            </div>

            {entry.status !== 'processed' && (
              <button type="button" className="admin-btn admin-btn--ghost source-log-action text-small-bold" onClick={onOpenInbox}>
                פתיחה בתיבת פעולות
              </button>
            )}
          </article>
        ))}

        {filteredEntries.length === 0 && (
          <div className="source-log-empty">
            <p className="text-small-bold">אין פריטים בסטטוס הזה</p>
            <button type="button" className="admin-btn admin-btn--ghost text-small-normal" onClick={() => setStatus('all')}>
              הצגת כל היומן
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
