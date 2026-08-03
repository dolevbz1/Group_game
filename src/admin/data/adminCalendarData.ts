export type AdminCalendarCategory = 'event' | 'approval' | 'meeting' | 'task';

export type AdminCalendarItem = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  category: AdminCalendarCategory;
  categoryLabel: string;
  description: string;
  actionRequired?: string;
};

export const ADMIN_CALENDAR_TODAY = '2026-08-03';

export const ADMIN_CALENDAR_ITEMS: AdminCalendarItem[] = [
  {
    id: 'cal-1',
    date: '2026-08-03',
    startTime: '09:00',
    endTime: '09:30',
    title: 'אישור עדכון בטיחות — נחש באולם',
    location: 'אולם הספורט',
    category: 'approval',
    categoryLabel: 'אישור',
    description: '3 דיווחים דומים מקבוצת השכונה. יש לפרסם עדכון דחוף לכל התושבים.',
    actionRequired: 'לאשר ולפרסם עדכון',
  },
  {
    id: 'cal-2',
    date: '2026-08-03',
    startTime: '11:00',
    endTime: '12:00',
    title: 'סנכרון עם סוכן AI',
    location: 'משרד הוועד',
    category: 'meeting',
    categoryLabel: 'פגישה',
    description: 'סקירת 42 פעולות אוטומטיות מהיום ו-6 פריטים שממתינים לאישורך.',
    actionRequired: 'לעבור על תור האישורים',
  },
  {
    id: 'cal-3',
    date: '2026-08-03',
    startTime: '14:00',
    endTime: '15:30',
    title: 'ביקור בשטח — עבודות רחוב האלון',
    location: 'רחוב האלון',
    category: 'task',
    categoryLabel: 'משימה',
    description: 'לוודא שילוט זמני מוצב ושעות החסימה (07:00–14:00) מדויקות.',
    actionRequired: 'לצלם ולפרסם עדכון',
  },
  {
    id: 'cal-4',
    date: '2026-08-03',
    startTime: '18:30',
    endTime: '20:00',
    title: 'ערב קהילה — שיח תושבים',
    location: 'מרכז קהילתי',
    category: 'event',
    categoryLabel: 'אירוע',
    description: 'נוכחות של נציג הוועד, פתיחת הרשמה ומענה לשאלות תושבים.',
    actionRequired: 'להכין נאום פתיחה קצר',
  },
  {
    id: 'cal-5',
    date: '2026-08-04',
    startTime: '10:00',
    endTime: '11:00',
    title: 'פרסום עדכון שעות בריכה',
    location: 'בריכה קהילתית',
    category: 'approval',
    categoryLabel: 'אישור',
    description: '34 תושבים שאלו על שעות הבריכה השבוע — עדכון מוכן לפרסום.',
    actionRequired: 'לאשר טיוטת העדכון',
  },
  {
    id: 'cal-6',
    date: '2026-08-05',
    startTime: '16:00',
    endTime: '17:00',
    title: 'שיחת ועד שכונות',
    location: 'זום',
    category: 'meeting',
    categoryLabel: 'פגישה',
    description: 'תיאום אירועי קיץ וסגירת סקר שביעות רצון.',
  },
  {
    id: 'cal-7',
    date: '2026-08-06',
    startTime: '09:30',
    endTime: '10:30',
    title: 'בדיקת בקשת התנדבות IT',
    location: 'משרד הוועד',
    category: 'task',
    categoryLabel: 'משימה',
    description: 'בקשת דוד פתוחה 26 שעות — לשלוח תזכורת לקבוצת המתנדבים.',
    actionRequired: 'לשלוח תזכורת',
  },
  {
    id: 'cal-8',
    date: '2026-08-07',
    startTime: '08:00',
    endTime: '13:00',
    title: 'שוק איכרים ישובי',
    location: 'כיכר הישוב',
    category: 'event',
    categoryLabel: 'אירוע',
    description: 'נוכחות ועד, תיאום עמדות ופתיחת השוק.',
  },
];

const HEBREW_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HEBREW_DAYS_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const HEBREW_DAYS_FULL = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getSundayOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

export function formatDayHeading(iso: string, todayIso: string): string {
  const date = parseISODate(iso);
  const prefix = iso === todayIso ? 'היום · ' : '';
  return `${prefix}${HEBREW_DAYS_FULL[date.getDay()]}, ${date.getDate()} ב${HEBREW_MONTHS[date.getMonth()]}`;
}

export function formatWeekHeading(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  if (sameMonth) {
    return `${weekStart.getDate()}–${weekEnd.getDate()} ב${HEBREW_MONTHS[weekStart.getMonth()]}`;
  }
  return `${weekStart.getDate()} ב${HEBREW_MONTHS[weekStart.getMonth()]} – ${weekEnd.getDate()} ב${HEBREW_MONTHS[weekEnd.getMonth()]}`;
}

export { HEBREW_DAYS_SHORT };

export const CALENDAR_DAY_START_HOUR = 7;
export const CALENDAR_DAY_END_HOUR = 21;
export const CALENDAR_HOUR_HEIGHT = 40;

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function getCalendarHours(): number[] {
  return Array.from(
    { length: CALENDAR_DAY_END_HOUR - CALENDAR_DAY_START_HOUR + 1 },
    (_, index) => CALENDAR_DAY_START_HOUR + index,
  );
}

export type PositionedCalendarItem = {
  item: AdminCalendarItem;
  lane: number;
  laneCount: number;
};

export function layoutCalendarItems(items: AdminCalendarItem[]): PositionedCalendarItem[] {
  const sorted = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const lanes: AdminCalendarItem[][] = [];

  sorted.forEach((item) => {
    const start = parseTimeToMinutes(item.startTime);
    const end = parseTimeToMinutes(item.endTime);
    let laneIndex = lanes.findIndex((laneItems) =>
      laneItems.every((other) => {
        const otherStart = parseTimeToMinutes(other.startTime);
        const otherEnd = parseTimeToMinutes(other.endTime);
        return otherEnd <= start || otherStart >= end;
      }),
    );

    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push([]);
    }

    lanes[laneIndex].push(item);
  });

  const laneCount = Math.max(lanes.length, 1);

  return sorted.map((item) => ({
    item,
    lane: lanes.findIndex((laneItems) => laneItems.includes(item)),
    laneCount,
  }));
}

export function getEventTimelineStyle(
  item: AdminCalendarItem,
  lane: number,
  laneCount: number,
): { top: string; height: string; width: string; insetInlineStart: string } {
  const dayStart = CALENDAR_DAY_START_HOUR * 60;
  const dayEnd = CALENDAR_DAY_END_HOUR * 60;
  const range = dayEnd - dayStart;
  const start = Math.max(parseTimeToMinutes(item.startTime), dayStart);
  const end = Math.min(parseTimeToMinutes(item.endTime), dayEnd);
  const top = ((start - dayStart) / range) * 100;
  const height = Math.max(((end - start) / range) * 100, 6);
  const width = 100 / laneCount;
  const insetInlineStart = lane * width;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: `calc(${width}% - 4px)`,
    insetInlineStart: `calc(${insetInlineStart}% + 2px)`,
  };
}

