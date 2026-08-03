import { useMemo, useState } from 'react';
import ResidentAvatar from '../../components/ResidentAvatar';
import ContentPageHeader from '../../components/ContentPageHeader';
import SidePanel from '../../components/SidePanel';
import {
  ADMIN_VOLUNTEER_REQUESTS,
  VOLUNTEER_MATCH_FEED,
  VOLUNTEER_STATUS_LABELS,
  type AdminVolunteerRequest,
  type VolunteerRequestStatus,
} from '../../data/contentAdminData';

type VolunteerFilter = 'all' | VolunteerRequestStatus;

const FILTERS: Array<{ id: VolunteerFilter; label: string }> = [
  { id: 'all', label: 'הכול' },
  { id: 'open', label: 'פתוחות' },
  { id: 'matched', label: 'שובצו' },
  { id: 'completed', label: 'הושלמו' },
];

export default function VolunteerContentView() {
  const [filter, setFilter] = useState<VolunteerFilter>('open');
  const [panelOpen, setPanelOpen] = useState(false);
  const [requests, setRequests] = useState(ADMIN_VOLUNTEER_REQUESTS);
  const [feedIndex, setFeedIndex] = useState(0);

  const visibleRequests = useMemo(
    () => requests.filter((request) => filter === 'all' || request.status === filter),
    [filter, requests]
  );

  const openCount = requests.filter((request) => request.status === 'open').length;
  const matchedToday = requests.filter((request) => request.status === 'matched').length;
  const completedWeek = requests.filter((request) => request.status === 'completed').length + 9;

  const feedItem = VOLUNTEER_MATCH_FEED[feedIndex % VOLUNTEER_MATCH_FEED.length];

  const handlePublishRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const task = String(form.get('task') ?? '').trim();
    const name = String(form.get('name') ?? '').trim();
    if (!task || !name) return;

    const template = requests[0];
    setRequests((current) => [
      {
        id: `vol-${Date.now()}`,
        name,
        avatarAnimation: template.avatarAnimation,
        task,
        taskEmoji: '🤝',
        distance: '300 מ׳',
        duration: String(form.get('duration') ?? '30 דק׳'),
        availability: String(form.get('availability') ?? 'היום'),
        status: 'open',
        postedLabel: 'עכשיו',
        street: String(form.get('street') ?? 'רחוב האלון'),
      },
      ...current,
    ]);
    setPanelOpen(false);
  };

  const cycleFeed = () => {
    setFeedIndex((current) => current + 1);
  };

  return (
    <div className="admin-view admin-view--content-section admin-view--content-volunteer">
      <ContentPageHeader
        title="התנדבות"
        subtitle="בקשות עזרה מהשכונה — ניהול, שיבוץ ומעקב"
        ctaLabel="פרסום בקשה"
        onCta={() => setPanelOpen(true)}
      />

      <section className="content-summary" aria-label="סיכום התנדבות">
        <div className="content-summary-item content-summary-item--volunteer">
          <strong className="text-h2-bold">{openCount}</strong>
          <span className="text-small-normal">בקשות פתוחות</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{matchedToday}</strong>
          <span className="text-small-normal">שובצו היום</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{completedWeek}</strong>
          <span className="text-small-normal">הושלמו השבוע</span>
        </div>
      </section>

      <button type="button" className="content-ticker text-small-normal" onClick={cycleFeed}>
        <strong>{feedItem.helper}</strong> עזר/ה ל{feedItem.helpee} עם {feedItem.task}
        <span className="content-ticker-time"> · {feedItem.time}</span>
      </button>

      <section className="content-card" aria-labelledby="volunteer-list-title">
        <div className="content-card-head">
          <div>
            <h2 id="volunteer-list-title" className="text-small-bold">בקשות עזרה</h2>
            <p className="text-tiny-normal">{visibleRequests.length} בקשות בתצוגה</p>
          </div>
          <div className="content-filters" aria-label="סינון בקשות">
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

        <div className="content-request-list">
          {visibleRequests.map((request) => (
            <VolunteerRequestRow key={request.id} request={request} />
          ))}
          {visibleRequests.length === 0 && (
            <p className="content-empty text-small-normal">אין בקשות בסינון הזה כרגע.</p>
          )}
        </div>
      </section>

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="פרסום בקשת עזרה"
        subtitle="הבקשה תופיע במפת ההתנדבות באפליקציית התושבים"
      >
        <form className="content-form" onSubmit={handlePublishRequest}>
          <label className="content-form-field">
            <span className="text-tiny-bold">שם המבקש/ה</span>
            <input name="name" className="content-form-input text-small-normal" placeholder="למשל: דוד" required />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">מה צריך?</span>
            <input name="task" className="content-form-input text-small-normal" placeholder="למשל: עזרה במחשב" required />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">רחוב</span>
            <input name="street" className="content-form-input text-small-normal" placeholder="רחוב האלון" />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">משך משוער</span>
            <input name="duration" className="content-form-input text-small-normal" placeholder="30 דק׳" />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">זמינות</span>
            <input name="availability" className="content-form-input text-small-normal" placeholder="מחר ב־14:00" />
          </label>
          <div className="content-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost text-small-bold" onClick={() => setPanelOpen(false)}>
              ביטול
            </button>
            <button type="submit" className="admin-btn admin-btn--primary text-small-bold">
              פרסום בקשה
            </button>
          </div>
        </form>
      </SidePanel>
    </div>
  );
}

function VolunteerRequestRow({ request }: { request: AdminVolunteerRequest }) {
  return (
    <article className={`content-request-row content-request-row--${request.status}`}>
      <ResidentAvatar animationData={request.avatarAnimation} engagement="medium" />
      <div className="content-request-copy">
        <div className="content-request-title">
          <h3 className="text-small-bold">
            {request.taskEmoji} {request.name} · {request.task}
          </h3>
          <span className={`content-status content-status--${request.status} text-tiny-bold`}>
            {VOLUNTEER_STATUS_LABELS[request.status]}
          </span>
        </div>
        <p className="text-tiny-normal">
          {request.street} · {request.distance} · {request.duration} · {request.availability}
        </p>
        {request.helperName && (
          <p className="content-request-helper text-tiny-bold">מתנדב/ת: {request.helperName}</p>
        )}
      </div>
      <div className="content-request-actions">
        {request.status === 'open' && (
          <button type="button" className="admin-btn admin-btn--primary text-tiny-bold">
            שיבוץ מתנדב
          </button>
        )}
        {request.status === 'matched' && (
          <button type="button" className="admin-btn admin-btn--ghost text-tiny-bold">
            פרטי שיבוץ
          </button>
        )}
        <span className="text-tiny-normal">{request.postedLabel}</span>
      </div>
    </article>
  );
}
