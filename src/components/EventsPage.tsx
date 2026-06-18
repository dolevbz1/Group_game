import { useState } from 'react';
import './EventsPage.css';

const HEBREW_DAYS_SHORT = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const HEBREW_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

type Event = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  categoryColor: string;
  location: string;
  price: string;
  description: string;
  friendsCount: number;
  totalCount: number;
};

const EVENTS_BY_DATE: Record<string, Event[]> = {
  '2026-06-15': [
    {
      id: 'community-evening',
      title: 'ערב קהילה – שיח תושבים עם הוועד',
      startTime: '18:30',
      endTime: '20:00',
      category: 'קהילה',
      categoryColor: '#C3ECF6',
      location: 'מרכז קהילתי',
      price: 'חינם',
      description: 'שיחה פתוחה עם חברי הוועד המקומי על תוכניות הפיתוח הישוביות לשנת 2026. כל אחד מוזמן לשאול ולהשפיע.',
      friendsCount: 3,
      totalCount: 22,
    },
  ],
  '2026-06-16': [
    {
      id: 'compost',
      title: 'סדנת קומפוסט קהילתית',
      startTime: '17:00',
      endTime: '19:00',
      category: 'גינון',
      categoryColor: '#CEFF7E',
      location: 'הגינה הצפונית',
      price: 'חינם',
      description: 'איך הופכים שאריות מזון לקומפוסט עשיר. הביאו רק סקרנות וכפות.',
      friendsCount: 2,
      totalCount: 14,
    },
    {
      id: 'yoga',
      title: 'שיעור יוגה בפארק',
      startTime: '19:30',
      endTime: '20:30',
      category: 'בריאות',
      categoryColor: '#FFC9D9',
      location: 'פארק הצפון',
      price: '₪30',
      description: 'שיעור יוגה לכל הרמות בחוץ עם מדריכה מוסמכת. הביאו מזרן ומים.',
      friendsCount: 1,
      totalCount: 8,
    },
  ],
  '2026-06-18': [
    {
      id: 'residents-meeting',
      title: 'אסיפת תושבים – תכנית הפיתוח',
      startTime: '19:00',
      endTime: '21:00',
      category: 'קהילה',
      categoryColor: '#C3ECF6',
      location: 'אולם התרבות',
      price: 'חינם',
      description: 'דיון ציבורי בתוכנית הבינוי החדשה. הוועד מזמין כל תושב להשמיע את דעתו.',
      friendsCount: 6,
      totalCount: 40,
    },
  ],
  '2026-06-19': [
    {
      id: 'market',
      title: 'שוק איכרים ישובי',
      startTime: '08:00',
      endTime: '13:00',
      category: 'שוק',
      categoryColor: '#FFD4A8',
      location: 'כיכר הישוב',
      price: 'כניסה חופשית',
      description: 'תוצרת מקומית, אפייה ביתית ומוצרי אומנות מתושבי הישוב.',
      friendsCount: 5,
      totalCount: 60,
    },
  ],
  '2026-06-20': [
    {
      id: 'volunteer-day',
      title: 'יום התנדבות – טיפוח גינות ציבוריות',
      startTime: '09:00',
      endTime: '12:00',
      category: 'גינון',
      categoryColor: '#CEFF7E',
      location: 'גינות הישוב',
      price: 'חינם',
      description: 'נתאחד לטפח את הגינות הציבוריות יחד. ציוד יסופק על ידי הוועד, הביאו כפפות.',
      friendsCount: 4,
      totalCount: 18,
    },
    {
      id: 'culture',
      title: 'הצגת ילדים – "הנסיך הקטן"',
      startTime: '17:00',
      endTime: '18:30',
      category: 'תרבות',
      categoryColor: '#D8C5FF',
      location: 'אולם התרבות',
      price: '₪25',
      description: 'הצגה מקסימה לכל המשפחה, מבית הלהקה הקהילתית של הישוב.',
      friendsCount: 3,
      totalCount: 45,
    },
  ],
};

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getSundayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ChevronIcon({ dir }: { dir: 'right' | 'left' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'right'
        ? <polyline points="9 18 15 12 9 6" />
        : <polyline points="15 18 9 12 15 6" />}
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

type EventsPageProps = {
  open: boolean;
  onClose: () => void;
};

const TODAY = new Date(2026, 5, 15); // June 15, 2026
const TODAY_ISO = toISO(TODAY);

export default function EventsPage({ open, onClose }: EventsPageProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = addDays(getSundayOfWeek(TODAY), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthLabel = (() => {
    const mid = weekDays[3];
    return `${HEBREW_MONTHS[mid.getMonth()]} ${mid.getFullYear()}`;
  })();

  const selectedEvents = EVENTS_BY_DATE[selectedDate] ?? [];
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const isToday = selectedDate === TODAY_ISO;

  const dayLabel = (() => {
    const day = HEBREW_DAYS_SHORT[selectedDateObj.getDay()];
    const num = selectedDateObj.getDate();
    const month = HEBREW_MONTHS[selectedDateObj.getMonth()];
    const prefix = isToday ? 'היום · ' : '';
    const count = selectedEvents.length;
    const countLabel = count === 0 ? 'אין אירועים' : count === 1 ? 'אירוע 1' : `${count} אירועים`;
    return `${prefix}${day}, ${num} ב${month} · ${countLabel}`;
  })();

  return (
    <div className={`events-page${open ? ' is-open' : ''}`} dir="rtl" aria-hidden={!open}>
      <div className="events-page-top">
        <button type="button" className="events-page-back" onClick={onClose} aria-label="חזרה">
          <ChevronIcon dir="right" />
        </button>
        <h1 className="events-page-title text-h2-bold">אירועים</h1>
        <div className="events-page-back-spacer" />
      </div>

      <div className="events-calendar">
        <div className="events-calendar-month">
          <button type="button" className="events-calendar-nav" onClick={() => setWeekOffset(w => w - 1)} aria-label="שבוע קודם">
            <ChevronIcon dir="left" />
          </button>
          <span className="events-calendar-month-label text-medium-bold">{monthLabel}</span>
          <button type="button" className="events-calendar-nav" onClick={() => setWeekOffset(w => w + 1)} aria-label="שבוע הבא">
            <ChevronIcon dir="right" />
          </button>
        </div>

        <div className="events-calendar-grid">
          {weekDays.map((date) => {
            const iso = toISO(date);
            const isSelected = iso === selectedDate;
            const isTodayDay = iso === TODAY_ISO;
            const hasEvents = Boolean(EVENTS_BY_DATE[iso]?.length);
            return (
              <button
                key={iso}
                type="button"
                className={`events-calendar-day${isSelected ? ' is-selected' : ''}${isTodayDay ? ' is-today' : ''}`}
                onClick={() => setSelectedDate(iso)}
              >
                <span className="events-calendar-day-name text-tiny-normal">
                  {HEBREW_DAYS_SHORT[date.getDay()]}
                </span>
                <span className="events-calendar-day-num text-small-bold">
                  {date.getDate()}
                </span>
                <span className={`events-calendar-dot${hasEvents ? ' has-events' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      <p className="events-day-label text-small-normal">{dayLabel}</p>

      <div className="events-list">
        {selectedEvents.length === 0 ? (
          <div className="events-empty">
            <p className="text-medium-normal">אין אירועים ביום זה</p>
          </div>
        ) : (
          selectedEvents.map((ev) => (
            <div key={ev.id} className="events-event-card">
              <div className="events-event-header">
                <span className="events-event-time text-tiny-bold">{ev.startTime}–{ev.endTime}</span>
                <span className="events-event-tag text-tiny-bold" style={{ background: ev.categoryColor }}>
                  {ev.category}
                </span>
              </div>

              <div className="events-event-image" style={{ background: ev.categoryColor + '55' }}>
                <span className="events-event-image-placeholder" aria-hidden="true" />
              </div>

              <div className="events-event-body">
                <h2 className="events-event-title text-medium-bold">{ev.title}</h2>

                <p className="events-event-location text-small-normal">
                  <PinIcon />
                  {ev.location}
                  <span className="events-event-price"> · {ev.price}</span>
                </p>

                <p className="events-event-desc text-small-normal">{ev.description}</p>

                <p className="events-event-attendees text-tiny-normal">
                  <UsersIcon />
                  {ev.friendsCount > 0
                    ? `${ev.friendsCount} חברים שלך מגיעים · ${ev.totalCount} בסך הכל`
                    : `${ev.totalCount} משתתפים`}
                </p>

                <button type="button" className="events-event-cta text-small-normal">
                  לפרטים והרשמה ›
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
