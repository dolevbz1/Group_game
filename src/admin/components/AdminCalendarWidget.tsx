import { useMemo, useState } from 'react';
import {
  ADMIN_CALENDAR_ITEMS,
  ADMIN_CALENDAR_TODAY,
  CALENDAR_DAY_END_HOUR,
  CALENDAR_DAY_START_HOUR,
  CALENDAR_HOUR_HEIGHT,
  HEBREW_DAYS_SHORT,
  addDays,
  formatDayHeading,
  formatHourLabel,
  formatWeekHeading,
  getCalendarHours,
  getEventTimelineStyle,
  getSundayOfWeek,
  layoutCalendarItems,
  parseISODate,
  toISODate,
  type AdminCalendarItem,
  type PositionedCalendarItem,
} from '../data/adminCalendarData';

type ViewMode = 'day' | 'week';

const TIMELINE_HEIGHT = (CALENDAR_DAY_END_HOUR - CALENDAR_DAY_START_HOUR) * CALENDAR_HOUR_HEIGHT;

function ChevronIcon({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'next'
        ? <polyline points="9 18 15 12 9 6" />
        : <polyline points="15 18 9 12 15 6" />}
    </svg>
  );
}

function CalendarEventBlock({ positioned }: { positioned: PositionedCalendarItem }) {
  const { item, lane, laneCount } = positioned;
  const style = getEventTimelineStyle(item, lane, laneCount);

  return (
    <button
      type="button"
      className={`admin-cal-event admin-cal-event--${item.category}`}
      style={style}
      title={`${item.startTime}–${item.endTime} · ${item.title} · ${item.location}`}
    >
      <span className="admin-cal-event-time text-tiny-bold">
        {item.startTime}–{item.endTime}
      </span>
      <span className="admin-cal-event-title text-tiny-bold">{item.title}</span>
      <span className="admin-cal-event-location text-tiny-normal">{item.location}</span>
    </button>
  );
}

function DayTimeline({
  items,
  showHeading,
  heading,
}: {
  items: AdminCalendarItem[];
  showHeading?: boolean;
  heading?: string;
}) {
  const hours = getCalendarHours();
  const positionedItems = useMemo(() => layoutCalendarItems(items), [items]);

  return (
    <div className="admin-cal-timeline admin-cal-timeline--day">
      {showHeading && heading && (
        <h3 className="admin-cal-day-heading text-tiny-bold">{heading}</h3>
      )}
      <div className="admin-cal-timeline-scroll">
        <div className="admin-cal-timeline-body" style={{ height: TIMELINE_HEIGHT }}>
          <div className="admin-cal-hours" aria-hidden="true">
            {hours.map((hour) => (
              <span
                key={hour}
                className="admin-cal-hour-label text-tiny-normal"
                style={{ height: CALENDAR_HOUR_HEIGHT }}
              >
                {formatHourLabel(hour)}
              </span>
            ))}
          </div>
          <div className="admin-cal-grid">
            {hours.map((hour) => (
              <div
                key={hour}
                className="admin-cal-grid-line"
                style={{ height: CALENDAR_HOUR_HEIGHT }}
              />
            ))}
            <div className="admin-cal-events-layer">
              {positionedItems.map((positioned) => (
                <CalendarEventBlock key={positioned.item.id} positioned={positioned} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekTimeline({
  weekDays,
  itemsByDate,
  todayIso,
}: {
  weekDays: Date[];
  itemsByDate: Map<string, AdminCalendarItem[]>;
  todayIso: string;
}) {
  const hours = getCalendarHours();

  return (
    <div className="admin-cal-timeline admin-cal-timeline--week">
      <div className="admin-cal-timeline-scroll">
        <div className="admin-cal-timeline-body admin-cal-timeline-body--week" style={{ height: TIMELINE_HEIGHT }}>
          <div className="admin-cal-hours" aria-hidden="true">
            {hours.map((hour) => (
              <span
                key={hour}
                className="admin-cal-hour-label text-tiny-normal"
                style={{ height: CALENDAR_HOUR_HEIGHT }}
              >
                {formatHourLabel(hour)}
              </span>
            ))}
          </div>
          <div className="admin-cal-week-columns">
            {weekDays.map((day) => {
              const iso = toISODate(day);
              const dayItems = itemsByDate.get(iso) ?? [];
              const positionedItems = layoutCalendarItems(dayItems);
              const isToday = iso === todayIso;

              return (
                <div key={iso} className={`admin-cal-week-col${isToday ? ' is-today' : ''}`}>
                  <div className="admin-cal-week-col-head text-tiny-bold">
                    <span>{HEBREW_DAYS_SHORT[day.getDay()]}</span>
                    <span>{day.getDate()}</span>
                  </div>
                  <div className="admin-cal-week-col-grid" style={{ height: TIMELINE_HEIGHT }}>
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="admin-cal-grid-line"
                        style={{ height: CALENDAR_HOUR_HEIGHT }}
                      />
                    ))}
                    <div className="admin-cal-events-layer">
                      {positionedItems.map((positioned) => (
                        <CalendarEventBlock key={positioned.item.id} positioned={positioned} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCalendarWidget() {
  const today = useMemo(() => parseISODate(ADMIN_CALENDAR_TODAY), []);
  const [view, setView] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(ADMIN_CALENDAR_TODAY);
  const [weekOffset, setWeekOffset] = useState(0);
  const items = ADMIN_CALENDAR_ITEMS;

  const weekStart = useMemo(
    () => addDays(getSundayOfWeek(today), weekOffset * 7),
    [today, weekOffset],
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  );

  const itemsByDate = useMemo(() => {
    const map = new Map<string, AdminCalendarItem[]>();
    items.forEach((item) => {
      const list = map.get(item.date) ?? [];
      list.push(item);
      map.set(item.date, list);
    });
    map.forEach((list) => list.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return map;
  }, [items]);

  const dayItems = itemsByDate.get(selectedDate) ?? [];
  const weekHasItems = weekDays.some((day) => (itemsByDate.get(toISODate(day)) ?? []).length > 0);

  const heading = view === 'day'
    ? formatDayHeading(selectedDate, ADMIN_CALENDAR_TODAY)
    : formatWeekHeading(weekStart);

  const shiftPeriod = (direction: -1 | 1) => {
    if (view === 'day') {
      const next = addDays(parseISODate(selectedDate), direction);
      setSelectedDate(toISODate(next));
      return;
    }
    setWeekOffset((offset) => offset + direction);
  };

  return (
    <section className="admin-card admin-card--calendar" dir="rtl">
      <div className="admin-cal-head">
        <div>
          <h2 className="admin-card-title text-medium-bold">יומן פעולות</h2>
          <p className="admin-card-sub text-tiny-normal">מה צריך לעשות היום ואיפה</p>
        </div>
        <div className="admin-cal-head-actions">
          <div className="admin-cal-view-toggle" role="tablist" aria-label="תצוגת יומן">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'day'}
              className={`admin-cal-view-btn text-tiny-bold${view === 'day' ? ' is-active' : ''}`}
              onClick={() => setView('day')}
            >
              יום
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'week'}
              className={`admin-cal-view-btn text-tiny-bold${view === 'week' ? ' is-active' : ''}`}
              onClick={() => setView('week')}
            >
              שבוע
            </button>
          </div>
        </div>
      </div>

      <div className="admin-cal-nav">
        <button type="button" className="admin-cal-nav-btn" onClick={() => shiftPeriod(-1)} aria-label="הקודם">
          <ChevronIcon dir="prev" />
        </button>
        <span className="admin-cal-nav-label text-small-bold">{heading}</span>
        <button type="button" className="admin-cal-nav-btn" onClick={() => shiftPeriod(1)} aria-label="הבא">
          <ChevronIcon dir="next" />
        </button>
      </div>

      {view === 'week' && (
        <div className="admin-cal-week-strip">
          {weekDays.map((day) => {
            const iso = toISODate(day);
            const count = itemsByDate.get(iso)?.length ?? 0;
            const isSelected = iso === selectedDate;
            const isToday = iso === ADMIN_CALENDAR_TODAY;
            return (
              <button
                key={iso}
                type="button"
                className={`admin-cal-week-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                onClick={() => setSelectedDate(iso)}
              >
                <span className="admin-cal-week-day-name text-tiny-normal">{HEBREW_DAYS_SHORT[day.getDay()]}</span>
                <span className="admin-cal-week-day-num text-small-bold">{day.getDate()}</span>
                <span className={`admin-cal-week-dot${count > 0 ? ' has-items' : ''}`} />
              </button>
            );
          })}
        </div>
      )}

      {view === 'day' ? (
        dayItems.length === 0 ? (
          <div className="admin-cal-timeline admin-cal-timeline--day">
            <h3 className="admin-cal-day-heading text-tiny-bold">
              {formatDayHeading(selectedDate, ADMIN_CALENDAR_TODAY)}
            </h3>
            <p className="admin-empty text-small-normal">אין פריטים ביומן ליום זה</p>
          </div>
        ) : (
          <DayTimeline
            items={dayItems}
            showHeading
            heading={formatDayHeading(selectedDate, ADMIN_CALENDAR_TODAY)}
          />
        )
      ) : weekHasItems ? (
        <WeekTimeline
          weekDays={weekDays}
          itemsByDate={itemsByDate}
          todayIso={ADMIN_CALENDAR_TODAY}
        />
      ) : (
        <p className="admin-empty text-small-normal">אין פריטים ביומן לשבוע זה</p>
      )}
    </section>
  );
}
