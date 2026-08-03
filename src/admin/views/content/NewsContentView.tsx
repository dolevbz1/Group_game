import { useMemo, useState } from 'react';
import ContentPageHeader from '../../components/ContentPageHeader';
import SidePanel from '../../components/SidePanel';
import {
  ADMIN_NEWS_ITEMS,
  NEWS_STATUS_LABELS,
  type AdminNewsItem,
  type NewsAdminStatus,
} from '../../data/contentAdminData';

type NewsFilter = 'all' | NewsAdminStatus | 'urgent';

const FILTERS: Array<{ id: NewsFilter; label: string }> = [
  { id: 'all', label: 'הכול' },
  { id: 'published', label: 'פורסמו' },
  { id: 'pending', label: 'ממתינים' },
  { id: 'urgent', label: 'דחופים' },
  { id: 'archived', label: 'ארכיון' },
];

export default function NewsContentView() {
  const [filter, setFilter] = useState<NewsFilter>('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [items, setItems] = useState(ADMIN_NEWS_ITEMS);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'urgent') return item.urgent;
      if (filter === 'all') return item.status !== 'archived';
      return item.status === filter;
    });
  }, [filter, items]);

  const publishedCount = items.filter((item) => item.status === 'published').length;
  const pendingCount = items.filter((item) => item.status === 'pending').length;
  const urgentCount = items.filter((item) => item.urgent && item.status !== 'archived').length;

  const handleApprove = (id: string) => {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, status: 'published', views: 12 } : item)
    );
  };

  const handlePublish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    if (!title) return;

    setItems((current) => [
      {
        id: `news-${Date.now()}`,
        title,
        label: 'עדכון רשמי · ועד',
        urgent: form.get('urgent') === 'on',
        pinned: form.get('pinned') === 'on',
        authorName: 'ועד גבעת אלה',
        authorRole: 'עדכון רשמי',
        postedLabel: 'עכשיו',
        status: 'published',
        views: 0,
        commentsCount: 0,
        accentColor: '#CEFF7E',
        emoji: String(form.get('emoji') ?? '📢'),
      },
      ...current,
    ]);
    setPanelOpen(false);
  };

  return (
    <div className="admin-view admin-view--content-section admin-view--content-news">
      <ContentPageHeader
        title="לוח מודעות"
        subtitle="עדכונים לתושבים — פרסום, אישור וניהול תגובות"
        ctaLabel="עדכון חדש"
        onCta={() => setPanelOpen(true)}
        secondaryAction={pendingCount > 0 ? {
          label: `${pendingCount} ממתינים לאישור`,
          onClick: () => setFilter('pending'),
        } : undefined}
      />

      <section className="content-summary" aria-label="סיכום לוח מודעות">
        <div className="content-summary-item content-summary-item--news">
          <strong className="text-h2-bold">{publishedCount}</strong>
          <span className="text-small-normal">עדכונים פעילים</span>
        </div>
        <div className={`content-summary-item${pendingCount ? ' is-urgent' : ''}`}>
          <strong className="text-h2-bold">{pendingCount}</strong>
          <span className="text-small-normal">ממתינים לאישור</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{urgentCount}</strong>
          <span className="text-small-normal">דחופים</span>
        </div>
      </section>

      <section className="content-card" aria-labelledby="news-list-title">
        <div className="content-card-head">
          <div>
            <h2 id="news-list-title" className="text-small-bold">עדכונים</h2>
            <p className="text-tiny-normal">{visibleItems.length} פריטים בתצוגה</p>
          </div>
          <div className="content-filters" aria-label="סינון עדכונים">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`content-filter text-tiny-bold${filter === item.id ? ' is-active' : ''}`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="content-news-list">
          {visibleItems.map((item) => (
            <NewsRow key={item.id} item={item} onApprove={handleApprove} />
          ))}
          {visibleItems.length === 0 && (
            <p className="content-empty text-small-normal">אין עדכונים בסינון הזה.</p>
          )}
        </div>
      </section>

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="עדכון חדש"
        subtitle="העדכון יופיע בלוח המודעות באפליקציית התושבים"
      >
        <form className="content-form" onSubmit={handlePublish}>
          <label className="content-form-field">
            <span className="text-tiny-bold">כותרת</span>
            <input name="title" className="content-form-input text-small-normal" placeholder="למשל: רחוב האלון יחסם מחר" required />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">אימוג׳י</span>
            <input name="emoji" className="content-form-input text-small-normal" defaultValue="📢" />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">תוכן העדכון</span>
            <textarea name="body" className="content-form-textarea text-small-normal" rows={5} placeholder="פרטי העדכון לתושבים" />
          </label>
          <label className="content-form-check">
            <input type="checkbox" name="urgent" />
            <span className="text-small-normal">סמן כדחוף</span>
          </label>
          <label className="content-form-check">
            <input type="checkbox" name="pinned" defaultChecked />
            <span className="text-small-normal">הצמד לראש הלוח</span>
          </label>
          <div className="content-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost text-small-bold" onClick={() => setPanelOpen(false)}>
              ביטול
            </button>
            <button type="submit" className="admin-btn admin-btn--primary text-small-bold">
              פרסום עדכון
            </button>
          </div>
        </form>
      </SidePanel>
    </div>
  );
}

function NewsRow({
  item,
  onApprove,
}: {
  item: AdminNewsItem;
  onApprove: (id: string) => void;
}) {
  return (
    <article className={`content-news-row${item.urgent ? ' is-urgent' : ''}`}>
      <span className="content-news-accent" style={{ background: item.accentColor }} aria-hidden="true" />
      <div className="content-news-emoji" aria-hidden="true">{item.emoji}</div>
      <div className="content-news-copy">
        <div className="content-news-title">
          <h3 className="text-small-bold">{item.title}</h3>
          <div className="content-news-badges">
            {item.pinned && <span className="content-badge text-tiny-bold">מוצמד</span>}
            {item.urgent && <span className="content-badge content-badge--urgent text-tiny-bold">דחוף</span>}
            <span className={`content-status content-status--${item.status} text-tiny-bold`}>
              {NEWS_STATUS_LABELS[item.status]}
            </span>
          </div>
        </div>
        <p className="text-tiny-normal">{item.label}</p>
        <p className="text-tiny-normal">
          {item.authorName} · {item.authorRole} · {item.postedLabel}
        </p>
      </div>
      <div className="content-news-stats">
        <span className="text-tiny-bold">{item.views.toLocaleString('he-IL')}</span>
        <span className="text-tiny-normal">צפיות</span>
        <span className="text-tiny-bold">{item.commentsCount}</span>
        <span className="text-tiny-normal">תגובות</span>
      </div>
      <div className="content-news-actions">
        {item.status === 'pending' ? (
          <button type="button" className="admin-btn admin-btn--primary text-tiny-bold" onClick={() => onApprove(item.id)}>
            אישור ופרסום
          </button>
        ) : (
          <button type="button" className="admin-btn admin-btn--ghost text-tiny-bold">
            עריכה
          </button>
        )}
      </div>
    </article>
  );
}
