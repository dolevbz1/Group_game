import { NEWS_ITEMS } from '../../new_shapes/data/newsItems';
import { VOLUNTEER_REQUESTS } from '../../new_shapes/data/volunteerRequests';
import { EVENTS_BY_DATE } from '../../new_shapes/data/eventsData';

export type PollStatus = 'active' | 'scheduled' | 'closed' | 'draft';

export type AdminPollOption = {
  id: string;
  label: string;
  votes: number;
};

export type AdminPoll = {
  id: string;
  question: string;
  status: PollStatus;
  options: AdminPollOption[];
  endsLabel: string;
  createdLabel: string;
  audienceLabel: string;
  participationPct: number;
};

export const POLL_STATUS_LABELS: Record<PollStatus, string> = {
  active: 'פעיל',
  scheduled: 'מתוזמן',
  closed: 'נסגר',
  draft: 'טיוטה',
};

export const ADMIN_POLLS: AdminPoll[] = [
  {
    id: 'poll-pool-food',
    question: 'מה נאכל בערב הורים בבריכה?',
    status: 'active',
    options: [
      { id: 'burgers', label: 'המבורגרים', votes: 478 },
      { id: 'pizza', label: 'פיצות', votes: 151 },
      { id: 'salad', label: 'סלטים', votes: 42 },
    ],
    endsLabel: 'נותרו 3 ימים',
    createdLabel: 'לפני 5 ימים',
    audienceLabel: 'חברי מועדון הבריכה',
    participationPct: 68,
  },
  {
    id: 'poll-flag-color',
    question: 'איזה צבע לדגל הישוב החדש?',
    status: 'scheduled',
    options: [
      { id: 'green', label: 'ירוק ולבן', votes: 0 },
      { id: 'blue', label: 'כחול וזהב', votes: 0 },
      { id: 'purple', label: 'סגול וכסף', votes: 0 },
    ],
    endsLabel: 'ייפתח ב-12 באוגוסט',
    createdLabel: 'לפני יומיים',
    audienceLabel: 'כל התושבים',
    participationPct: 0,
  },
  {
    id: 'poll-center-hours',
    question: 'שעות פעילות המרכז הקהילתי',
    status: 'closed',
    options: [
      { id: 'morning', label: 'בוקר בלבד', votes: 89 },
      { id: 'evening', label: 'ערב בלבד', votes: 134 },
      { id: 'both', label: 'בוקר וערב', votes: 312 },
    ],
    endsLabel: 'נסגר לפני שבוע',
    createdLabel: 'לפני חודש',
    audienceLabel: 'כל התושבים',
    participationPct: 54,
  },
  {
    id: 'poll-club-satisfaction',
    question: 'סקר שביעות רצון מהמועדון',
    status: 'draft',
    options: [
      { id: 'great', label: 'מצוין', votes: 0 },
      { id: 'ok', label: 'בסדר', votes: 0 },
      { id: 'bad', label: 'צריך שיפור', votes: 0 },
    ],
    endsLabel: 'לא נקבע',
    createdLabel: 'היום',
    audienceLabel: 'חברי מועדון',
    participationPct: 0,
  },
];

export type VolunteerRequestStatus = 'open' | 'matched' | 'completed';

export type AdminVolunteerRequest = {
  id: string;
  name: string;
  avatarAnimation: object;
  task: string;
  taskEmoji: string;
  distance: string;
  duration: string;
  availability: string;
  status: VolunteerRequestStatus;
  helperName?: string;
  postedLabel: string;
  street: string;
};

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerRequestStatus, string> = {
  open: 'ממתין לעזרה',
  matched: 'שובץ מתנדב',
  completed: 'הושלם',
};

export const ADMIN_VOLUNTEER_REQUESTS: AdminVolunteerRequest[] = [
  ...VOLUNTEER_REQUESTS.map((request, index) => ({
    id: request.id,
    name: request.name,
    avatarAnimation: request.avatarAnimation,
    task: request.task,
    taskEmoji: request.taskEmoji,
    distance: request.distance,
    duration: request.duration,
    availability: request.availability,
    status: (index === 0 ? 'open' : index === 1 ? 'matched' : 'open') as VolunteerRequestStatus,
    helperName: index === 1 ? 'גל כהן' : undefined,
    postedLabel: index === 0 ? 'לפני שעה' : index === 1 ? 'לפני 3 שעות' : 'אתמול',
    street: ['רחוב האלון', 'רחוב הברוש', 'רחוב הזית', 'רחוב התמר'][index] ?? 'רחוב האלון',
  })),
  {
    id: 'vol-completed-1',
    name: 'מרים',
    avatarAnimation: VOLUNTEER_REQUESTS[3].avatarAnimation,
    task: 'קניות מהסופר',
    taskEmoji: '🛒',
    distance: '180 מ׳',
    duration: '40 דק׳',
    availability: 'הושלם אתמול',
    status: 'completed',
    helperName: 'טל בן דוד',
    postedLabel: 'לפני 3 ימים',
    street: 'רחוב הדקל',
  },
];

export const VOLUNTEER_MATCH_FEED = [
  { helper: 'טל', helpee: 'מרים', task: 'קניות מהסופר', time: 'לפני 20 דק׳' },
  { helper: 'גל', helpee: 'שולה', task: 'האייפון החדש', time: 'לפני שעה' },
  { helper: 'נועה', helpee: 'משפחת כהן', task: 'בייביסיטר', time: 'אתמול' },
];

export type NewsAdminStatus = 'published' | 'pending' | 'archived';

export type AdminNewsItem = {
  id: string;
  title: string;
  label: string;
  urgent: boolean;
  pinned: boolean;
  authorName: string;
  authorRole: string;
  postedLabel: string;
  status: NewsAdminStatus;
  views: number;
  commentsCount: number;
  accentColor: string;
  emoji: string;
};

export const NEWS_STATUS_LABELS: Record<NewsAdminStatus, string> = {
  published: 'פורסם',
  pending: 'ממתין לאישור',
  archived: 'בארכיון',
};

export const ADMIN_NEWS_ITEMS: AdminNewsItem[] = [
  ...NEWS_ITEMS.map((item, index) => ({
    id: item.id,
    title: item.title,
    label: item.label,
    urgent: Boolean(item.urgent),
    pinned: index === 0 || index === 2,
    authorName: item.author.name,
    authorRole: item.author.role,
    postedLabel: item.time,
    status: (index === 3 ? 'pending' : 'published') as NewsAdminStatus,
    views: [842, 1204, 2103, 0][index] ?? 0,
    commentsCount: item.comments.length,
    accentColor: item.color,
    emoji: item.emoji ?? '📌',
  })),
  {
    id: 'news-pending-playground',
    title: 'תיקון גדר במגרש המשחקים',
    label: 'דיווח תושב · ממתין',
    urgent: false,
    pinned: false,
    authorName: 'יוסי אבידן',
    authorRole: 'תושב/ת',
    postedLabel: 'לפני 40 דק׳',
    status: 'pending',
    views: 0,
    commentsCount: 0,
    accentColor: '#CEFF7E',
    emoji: '🛝',
  },
];

export type EventAdminStatus = 'published' | 'draft' | 'cancelled';

export type AdminEvent = {
  id: string;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  categoryColor: string;
  location: string;
  price: string;
  registrations: number;
  capacity: number;
  status: EventAdminStatus;
  description: string;
};

export const EVENT_STATUS_LABELS: Record<EventAdminStatus, string> = {
  published: 'פורסם',
  draft: 'טיוטה',
  cancelled: 'בוטל',
};

const flatEvents = Object.entries(EVENTS_BY_DATE).flatMap(([date, events]) =>
  events.map((event) => ({
    ...event,
    date,
    registrations: event.totalCount,
    capacity: Math.max(event.totalCount + 12, 30),
    status: 'published' as EventAdminStatus,
  }))
);

export const ADMIN_EVENTS: AdminEvent[] = [
  ...flatEvents,
  {
    id: 'event-draft-film',
    date: '2026-08-10',
    title: 'ערב סרטים בפארק',
    startTime: '20:00',
    endTime: '22:30',
    category: 'תרבות',
    categoryColor: '#D8C5FF',
    location: 'פארק הצפון',
    price: 'חינם',
    registrations: 0,
    capacity: 80,
    status: 'draft',
    description: 'הקרנת סרט משפחתי בחוץ. נדרש אישור סופי לגבי רישיון הקרנה.',
  },
];

export function getPollTotalVotes(poll: AdminPoll) {
  return poll.options.reduce((sum, option) => sum + option.votes, 0);
}

export function getPollLeadingOption(poll: AdminPoll) {
  return [...poll.options].sort((a, b) => b.votes - a.votes)[0];
}

export function getEventsByDate(events: AdminEvent[]) {
  return events.reduce<Record<string, AdminEvent[]>>((groups, event) => {
    if (!groups[event.date]) groups[event.date] = [];
    groups[event.date].push(event);
    return groups;
  }, {});
}

export function formatHebrewEventDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
