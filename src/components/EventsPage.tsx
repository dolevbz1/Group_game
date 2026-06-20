import React, { useLayoutEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { IconButton, CloseIcon } from './IconButton';
import calendarAnim from '../assets/tab-calendar.json';
import ticketAnim from '../assets/tab-ticket.json';
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

function formatDayLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const day = HEBREW_DAYS_SHORT[d.getDay()];
  const num = d.getDate();
  const month = HEBREW_MONTHS[d.getMonth()];
  const prefix = iso === TODAY_ISO ? 'היום · ' : '';
  const count = EVENTS_BY_DATE[iso]?.length ?? 0;
  const countLabel = count === 1 ? 'אירוע 1' : `${count} אירועים`;
  return `${prefix}${day}, ${num} ב${month} · ${countLabel}`;
}

export default function EventsPage({ open, onClose }: EventsPageProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'mine'>('upcoming');
  // progress: 0 = collapsed (one week), 1 = expanded (full month)
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [metrics, setMetrics] = useState({ cell: 0, pitch: 0, full: 0 });
  const calendarRef = useRef<LottieRefCurrentProps>(null);
  const ticketRef = useRef<LottieRefCurrentProps>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startProgress: number; moved: boolean } | null>(null);

  const expanded = progress > 0.5;

  const weekStart = addDays(getSundayOfWeek(TODAY), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const monthAnchor = weekDays[3];
  const monthIndex = monthAnchor.getMonth();

  const monthLabel = `${HEBREW_MONTHS[monthIndex]} ${monthAnchor.getFullYear()}`;

  // Full-month grid (whole weeks covering the anchor's month) — always rendered, clipped when collapsed
  const gridStart = getSundayOfWeek(new Date(monthAnchor.getFullYear(), monthIndex, 1));
  const lastOfMonth = new Date(monthAnchor.getFullYear(), monthIndex + 1, 0);
  const weeksInGrid = Math.ceil((Math.round((lastOfMonth.getTime() - gridStart.getTime()) / 86400000) + 1) / 7);
  const monthDays = Array.from({ length: weeksInGrid * 7 }, (_, i) => addDays(gridStart, i));

  // Which week row is shown when collapsed
  const currentWeekIndex = Math.min(
    weeksInGrid - 1,
    Math.max(0, Math.round((weekStart.getTime() - gridStart.getTime()) / (7 * 86400000)))
  );

  // Measure one row's height + the natural full-month height, so the drag can interpolate between them
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const firstCell = el.firstElementChild as HTMLElement | null;
    const cell = firstCell ? firstCell.offsetHeight : 0;
    const gap = parseFloat(getComputedStyle(el).rowGap) || 0;
    setMetrics({ cell, pitch: cell + gap, full: el.scrollHeight });
  }, [weeksInGrid, monthIndex, monthAnchor.getFullYear()]);

  const handleDragStart = (e: React.PointerEvent) => {
    dragRef.current = { startY: e.clientY, startProgress: progress, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleDragMove = (e: React.PointerEvent) => {
    const s = dragRef.current;
    if (!s) return;
    const expandable = metrics.full - metrics.cell;
    if (expandable <= 0) return;
    const dy = e.clientY - s.startY;
    if (Math.abs(dy) > 3) s.moved = true;
    setProgress(Math.min(1, Math.max(0, s.startProgress + dy / expandable)));
  };
  const handleDragEnd = () => {
    const s = dragRef.current;
    setDragging(false);
    if (s && !s.moved) {
      setProgress((p) => (p > 0.5 ? 0 : 1)); // tap toggles
    } else {
      setProgress((p) => (p > 0.3 ? 1 : 0)); // snap to nearest
    }
    dragRef.current = null;
  };

  const rowsHeight = metrics.cell + (metrics.full - metrics.cell) * progress;
  const gridShift = -currentWeekIndex * metrics.pitch * (1 - progress);
  const easeTransition = 'height 0.32s cubic-bezier(0.22, 1, 0.36, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)';

  // The whole agenda is always shown; the calendar just scrolls to a day
  const eventDates = Object.keys(EVENTS_BY_DATE).sort();
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToDate = (iso: string) => {
    const target = dayRefs.current[iso]
      ? iso
      : eventDates.find((d) => d >= iso) ?? eventDates[eventDates.length - 1];
    dayRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`events-page${open ? ' is-open' : ''}`} dir="rtl" aria-hidden={!open}>
      <div className="events-page-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h1 className="events-page-title text-small-bold">אירועים</h1>
        <div className="events-page-back-spacer" />
      </div>

      <div className="events-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          className={`events-tab text-medium-normal${activeTab === 'upcoming' ? ' is-active' : ''}`}
          onClick={() => {
            setActiveTab('upcoming');
            calendarRef.current?.playSegments([70, 130], true);
          }}
        >
          <Lottie
            lottieRef={calendarRef}
            animationData={calendarAnim}
            loop={false}
            autoplay={false}
            onDOMLoaded={() => calendarRef.current?.goToAndStop(69, true)}
            className="events-tab-icon"
          />
          אירועים הבאים
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'mine'}
          className={`events-tab text-medium-normal${activeTab === 'mine' ? ' is-active' : ''}`}
          onClick={() => {
            setActiveTab('mine');
            ticketRef.current?.playSegments([70, 130], true);
          }}
        >
          <Lottie
            lottieRef={ticketRef}
            animationData={ticketAnim}
            loop={false}
            autoplay={false}
            onDOMLoaded={() => ticketRef.current?.goToAndStop(69, true)}
            className="events-tab-icon"
          />
          הכרטיסים שלי
        </button>
      </div>

      {activeTab === 'upcoming' && (
      <>
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

        <div className="events-calendar-weekdays">
          {HEBREW_DAYS_SHORT.map((name) => (
            <span key={name} className="events-calendar-weekday text-tiny-normal">{name}</span>
          ))}
        </div>

        <div
          className="events-calendar-rows"
          style={{ height: rowsHeight, transition: dragging ? 'none' : easeTransition }}
        >
          <div
            className="events-calendar-grid"
            ref={gridRef}
            style={{ transform: `translateY(${gridShift}px)`, transition: dragging ? 'none' : easeTransition }}
          >
            {monthDays.map((date) => {
              const iso = toISO(date);
              const isSelected = iso === selectedDate;
              const isTodayDay = iso === TODAY_ISO;
              const hasEvents = Boolean(EVENTS_BY_DATE[iso]?.length);
              const isOtherMonth = date.getMonth() !== monthIndex;
              return (
                <button
                  key={iso}
                  type="button"
                  className={`events-calendar-day${isSelected ? ' is-selected' : ''}${isTodayDay ? ' is-today' : ''}${isOtherMonth ? ' is-other-month' : ''}`}
                  onClick={() => {
                    setSelectedDate(iso);
                    scrollToDate(iso);
                  }}
                >
                  <span className="events-calendar-day-num text-small-bold">
                    {date.getDate()}
                  </span>
                  <span className={`events-calendar-dot${hasEvents ? ' has-events' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="events-calendar-handle"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          role="button"
          aria-label={expanded ? 'כיווץ ללוח שבועי' : 'הרחבה ללוח חודשי'}
          aria-expanded={expanded}
        >
          <span className="events-calendar-handle-bar" />
        </div>
      </div>

      <div className="events-list">
        {eventDates.map((iso) => (
          <div
            key={iso}
            className="events-day-group"
            ref={(el) => { dayRefs.current[iso] = el; }}
          >
            <p className={`events-day-label text-small-normal${iso === selectedDate ? ' is-selected' : ''}`}>
              {formatDayLabel(iso)}
            </p>

            {EVENTS_BY_DATE[iso].map((ev) => (
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
            ))}
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
