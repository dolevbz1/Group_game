import { useMemo, useState } from 'react';
import ContentPageHeader from '../../components/ContentPageHeader';
import SidePanel from '../../components/SidePanel';
import {
  ADMIN_EVENTS,
  EVENT_STATUS_LABELS,
  formatHebrewEventDate,
  getEventsByDate,
  type AdminEvent,
  type EventAdminStatus,
} from '../../data/contentAdminData';

type EventFilter = 'all' | EventAdminStatus | 'upcoming';

const FILTERS: Array<{ id: EventFilter; label: string }> = [
  { id: 'upcoming', label: 'קרובים' },
  { id: 'all', label: 'הכול' },
  { id: 'published', label: 'פורסמו' },
  { id: 'draft', label: 'טיוטות' },
];

const WEEKDAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const MONTH_ANCHOR = new Date('2026-06-01T12:00:00');

function getMonthDays(anchor: Date) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const days: Array<{ iso: string; day: number; inMonth: boolean }> = [];

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(year, month, -startOffset + i + 1);
    days.push({ iso: toIso(date), day: date.getDate(), inMonth: false });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push({ iso: toIso(new Date(year, month, day)), day, inMonth: true });
  }

  while (days.length % 7 !== 0) {
    const next = new Date(year, month + 1, days.length - lastDay.getDate() - startOffset + 1);
    days.push({ iso: toIso(next), day: next.getDate(), inMonth: false });
  }

  return days;
}

function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EventsContentView() {
  const [filter, setFilter] = useState<EventFilter>('upcoming');
  const [panelOpen, setPanelOpen] = useState(false);
  const [events, setEvents] = useState(ADMIN_EVENTS);
  const [monthAnchor, setMonthAnchor] = useState(MONTH_ANCHOR);
  const [selectedDate, setSelectedDate] = useState('2026-06-15');

  const eventsByDate = useMemo(() => getEventsByDate(events), [events]);
  const monthDays = useMemo(() => getMonthDays(monthAnchor), [monthAnchor]);

  const visibleEvents = useMemo(() => {
    const today = '2026-08-03';
    return events
      .filter((event) => {
        if (filter === 'upcoming') return event.date >= today && event.status !== 'cancelled';
        if (filter === 'all') return true;
        return event.status === filter;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }, [events, filter]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];
  const upcomingCount = events.filter((event) => event.date >= '2026-08-03' && event.status === 'published').length;
  const registrations = events.reduce((sum, event) => sum + event.registrations, 0);
  const thisWeek = events.filter((event) => event.date >= '2026-08-03' && event.date <= '2026-08-09').length;

  const monthLabel = monthAnchor.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

  const handleCreateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    if (!title) return;

    const date = String(form.get('date') ?? selectedDate);
    setEvents((current) => [
      ...current,
      {
        id: `event-${Date.now()}`,
        date,
        title,
        startTime: String(form.get('startTime') ?? '18:00'),
        endTime: String(form.get('endTime') ?? '20:00'),
        category: String(form.get('category') ?? 'קהילה'),
        categoryColor: '#C3ECF6',
        location: String(form.get('location') ?? 'מרכז קהילתי'),
        price: String(form.get('price') ?? 'חינם'),
        registrations: 0,
        capacity: Number(form.get('capacity') ?? 40),
        status: 'draft',
        description: String(form.get('description') ?? ''),
      },
    ]);
    setSelectedDate(date);
    setPanelOpen(false);
  };

  return (
    <div className="admin-view admin-view--content-section admin-view--content-events">
      <ContentPageHeader
        title="אירועים"
        subtitle="לוח אירועים קהילתי — תזמון, הרשמות ופרסום"
        ctaLabel="אירוע חדש"
        onCta={() => setPanelOpen(true)}
      />

      <section className="content-summary" aria-label="סיכום אירועים">
        <div className="content-summary-item content-summary-item--events">
          <strong className="text-h2-bold">{upcomingCount}</strong>
          <span className="text-small-normal">אירועים קרובים</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{registrations}</strong>
          <span className="text-small-normal">הרשמות סה״כ</span>
        </div>
        <div className="content-summary-item">
          <strong className="text-h2-bold">{thisWeek}</strong>
          <span className="text-small-normal">השבוע</span>
        </div>
      </section>

      <div className="content-events-layout">
        <section className="content-card content-events-calendar" aria-label="לוח שנה">
          <div className="content-events-calendar-head">
            <button
              type="button"
              className="content-cal-nav"
              onClick={() => setMonthAnchor((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              aria-label="חודש קודם"
            >
              ‹
            </button>
            <h2 className="text-small-bold">{monthLabel}</h2>
            <button
              type="button"
              className="content-cal-nav"
              onClick={() => setMonthAnchor((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              aria-label="חודש הבא"
            >
              ›
            </button>
          </div>

          <div className="content-cal-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-tiny-normal">{day}</span>
            ))}
          </div>

          <div className="content-cal-grid">
            {monthDays.map((day) => {
              const hasEvents = Boolean(eventsByDate[day.iso]?.length);
              const isSelected = day.iso === selectedDate;
              return (
                <button
                  key={day.iso}
                  type="button"
                  className={`content-cal-day${isSelected ? ' is-selected' : ''}${!day.inMonth ? ' is-muted' : ''}`}
                  onClick={() => setSelectedDate(day.iso)}
                >
                  <span className="text-small-normal">{day.day}</span>
                  <span className={`content-cal-dot${hasEvents ? ' has-events' : ''}`} />
                </button>
              );
            })}
          </div>

          <div className="content-events-day-list">
            <h3 className="text-small-bold">{formatHebrewEventDate(selectedDate)}</h3>
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => <EventCompactCard key={event.id} event={event} />)
            ) : (
              <p className="content-empty text-tiny-normal">אין אירועים בתאריך הזה.</p>
            )}
          </div>
        </section>

        <section className="content-card content-events-list" aria-labelledby="events-list-title">
          <div className="content-card-head">
            <div>
              <h2 id="events-list-title" className="text-small-bold">כל האירועים</h2>
              <p className="text-tiny-normal">{visibleEvents.length} אירועים בתצוגה</p>
            </div>
            <div className="content-filters" aria-label="סינון אירועים">
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

          <div className="content-event-groups">
            {groupEventsByDate(visibleEvents).map(([date, dayEvents]) => (
              <div key={date} className="content-event-group">
                <p className="content-event-group-label text-tiny-bold">{formatHebrewEventDate(date)}</p>
                {dayEvents.map((event) => (
                  <article key={event.id} className="content-event-row">
                    <div className="content-event-time">
                      <span className="text-small-bold">{event.startTime}</span>
                      <span className="text-tiny-normal">{event.endTime}</span>
                    </div>
                    <div className="content-event-copy">
                      <div className="content-event-title">
                        <h3 className="text-small-bold">{event.title}</h3>
                        <span className="content-event-tag text-tiny-bold" style={{ background: event.categoryColor }}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-tiny-normal">{event.location} · {event.price}</p>
                      <p className="text-tiny-normal">
                        {event.registrations}/{event.capacity} נרשמו · {EVENT_STATUS_LABELS[event.status]}
                      </p>
                    </div>
                    <button type="button" className="admin-btn admin-btn--ghost text-tiny-bold">
                      ניהול
                    </button>
                  </article>
                ))}
              </div>
            ))}
            {visibleEvents.length === 0 && (
              <p className="content-empty text-small-normal">אין אירועים בסינון הזה.</p>
            )}
          </div>
        </section>
      </div>

      <SidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="אירוע חדש"
        subtitle="האירוע יופיע בלוח האירועים באפליקציית התושבים"
      >
        <form className="content-form" onSubmit={handleCreateEvent}>
          <label className="content-form-field">
            <span className="text-tiny-bold">שם האירוע</span>
            <input name="title" className="content-form-input text-small-normal" placeholder="למשל: ערב קהילה" required />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">תאריך</span>
            <input name="date" type="date" className="content-form-input text-small-normal" defaultValue={selectedDate} />
          </label>
          <div className="content-form-row">
            <label className="content-form-field">
              <span className="text-tiny-bold">התחלה</span>
              <input name="startTime" type="time" className="content-form-input text-small-normal" defaultValue="18:00" />
            </label>
            <label className="content-form-field">
              <span className="text-tiny-bold">סיום</span>
              <input name="endTime" type="time" className="content-form-input text-small-normal" defaultValue="20:00" />
            </label>
          </div>
          <label className="content-form-field">
            <span className="text-tiny-bold">מיקום</span>
            <input name="location" className="content-form-input text-small-normal" placeholder="מרכז קהילתי" />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">קטגוריה</span>
            <select name="category" className="content-form-input text-small-normal" defaultValue="קהילה">
              <option value="קהילה">קהילה</option>
              <option value="גינון">גינון</option>
              <option value="תרבות">תרבות</option>
              <option value="בריאות">בריאות</option>
            </select>
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">מחיר</span>
            <input name="price" className="content-form-input text-small-normal" defaultValue="חינם" />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">קיבולת</span>
            <input name="capacity" type="number" className="content-form-input text-small-normal" defaultValue={40} min={1} />
          </label>
          <label className="content-form-field">
            <span className="text-tiny-bold">תיאור</span>
            <textarea name="description" className="content-form-textarea text-small-normal" rows={4} placeholder="פרטים נוספים לאירוע" />
          </label>
          <div className="content-form-actions">
            <button type="button" className="admin-btn admin-btn--ghost text-small-bold" onClick={() => setPanelOpen(false)}>
              ביטול
            </button>
            <button type="submit" className="admin-btn admin-btn--primary text-small-bold">
              שמירה כטיוטה
            </button>
          </div>
        </form>
      </SidePanel>
    </div>
  );
}

function groupEventsByDate(events: AdminEvent[]) {
  const groups = new Map<string, AdminEvent[]>();
  events.forEach((event) => {
    const current = groups.get(event.date) ?? [];
    current.push(event);
    groups.set(event.date, current);
  });
  return Array.from(groups.entries());
}

function EventCompactCard({ event }: { event: AdminEvent }) {
  return (
    <article className="content-event-compact">
      <span className="content-event-tag text-tiny-bold" style={{ background: event.categoryColor }}>
        {event.category}
      </span>
      <strong className="text-small-bold">{event.title}</strong>
      <p className="text-tiny-normal">{event.startTime}–{event.endTime} · {event.location}</p>
    </article>
  );
}
