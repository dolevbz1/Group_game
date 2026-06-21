export type InboxSource = 'whatsapp' | 'email' | 'app' | 'ai-chat';
export type InboxType = 'news' | 'poll' | 'volunteer' | 'event' | 'marketplace' | 'question' | 'maintenance';
export type InboxStatus = 'pending' | 'urgent' | 'handled';

export type InboxItem = {
  id: string;
  type: InboxType;
  source: InboxSource;
  status: InboxStatus;
  title: string;
  summary: string;
  aiReason: string;
  time: string;
  confidence: 'high' | 'medium' | 'low';
};

export type TopicStat = {
  id: string;
  emoji: string;
  label: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendLabel: string;
  pct: number;
};

export type AIAdvice = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  emoji: string;
  title: string;
  body: string;
  actionLabel: string;
  actionType: 'news' | 'event' | 'poll' | 'volunteer';
  relatedTopicId?: string;
};

export type AIActivityEntry = {
  id: string;
  time: string;
  action: string;
  source: InboxSource;
  auto: boolean;
};

export const METRICS = {
  pending: 7,
  autoHandledToday: 42,
  engagementPct: 78,
};

export const SOURCE_BREAKDOWN = [
  { id: 'whatsapp', label: 'WhatsApp', pct: 38, color: '#25D366' },
  { id: 'app', label: 'אפליקציה', pct: 28, color: '#4FC3E8' },
  { id: 'ai-chat', label: 'שיחות AI', pct: 22, color: '#9B7BE8' },
  { id: 'email', label: 'דוא״ל', pct: 12, color: '#FF9F45' },
];

export const AUTOMATION_SPLIT = {
  autoPublished: 28,
  autoClosed: 14,
  escalated: 7,
};

export const INBOX_ITEMS: InboxItem[] = [
  {
    id: '1',
    type: 'news',
    source: 'whatsapp',
    status: 'urgent',
    title: 'רחוב האלון יחסם מחר לעבודות בניה',
    summary: 'הודעה מקבוצת הוואטסאפ של רחוב האלון — עבודות בין 7:00–14:00',
    aiReason: 'זיהיתי עדכון תשתית דחוף. מומלץ לפרסם לכל התושבים בעדכונים.',
    time: 'לפני 12 דק׳',
    confidence: 'high',
  },
  {
    id: '2',
    type: 'news',
    source: 'ai-chat',
    status: 'pending',
    title: 'שעות הבריכה לקיץ — עדכון מומלץ',
    summary: '34 תושבים שאלו על שעות הבריכה השבוע. אין עדכון פעיל בקטגוריית עדכונים.',
    aiReason: 'נושא חוזר בשאלות. מומלץ לפרסם עדכון קבוע כדי להפחית פניות.',
    time: 'לפני שעה',
    confidence: 'high',
  },
  {
    id: '3',
    type: 'volunteer',
    source: 'app',
    status: 'pending',
    title: 'דוד מבקש עזרה במחשב — ללא התאמה',
    summary: 'בקשת התנדבות פתוחה 26 שעות, אף מתנדב לא נרשם.',
    aiReason: 'לא מצאתי מתנדב מתאים אוטומטית. כדאי לשלוח תזכורת לקבוצת IT בשכונה.',
    time: 'לפני 3 שעות',
    confidence: 'medium',
  },
  {
    id: '4',
    type: 'event',
    source: 'email',
    status: 'pending',
    title: 'ערב קהילה — שיח תושבים עם הוועד',
    summary: 'הזמנה מייל מהוועד המקומי ל-20 ביוני, 18:30',
    aiReason: 'טיוטת אירוע מוכנה. אשר לפרסום באפליקציה.',
    time: 'לפני 5 שעות',
    confidence: 'high',
  },
  {
    id: '5',
    type: 'marketplace',
    source: 'app',
    status: 'pending',
    title: 'אופני ילדים 16″ — מודעה חדשה',
    summary: 'מודעה ממשפחת לוי, ₪350. ללא דגלים חשודים.',
    aiReason: 'המודעה עומדת בכללי הקהילה. ניתן לאשר אוטומטית.',
    time: 'אתמול',
    confidence: 'high',
  },
  {
    id: '6',
    type: 'maintenance',
    source: 'whatsapp',
    status: 'urgent',
    title: 'נחש צפע בכניסה לאולם הספורט',
    summary: '3 דיווחים דומים מקבוצת השכונה בוואטסאפ',
    aiReason: 'דיווח בטיחות חוזר. חובה לאשר פרסום עדכון דחוף.',
    time: 'לפני 3 שעות',
    confidence: 'high',
  },
  {
    id: '7',
    type: 'question',
    source: 'ai-chat',
    status: 'handled',
    title: 'אילו אירועים השבוע?',
    summary: 'נענתה אוטומטית — 3 אירועים הוצגו למשתמש',
    aiReason: 'מידע קיים במערכת. לא נדרש מעורבות מנהל.',
    time: 'היום',
    confidence: 'high',
  },
];

export const TOPIC_STATS: TopicStat[] = [
  { id: 'pool', emoji: '🏊', label: 'שעות בריכה', count: 34, trend: 'up', trendLabel: '+18 השבוע', pct: 100 },
  { id: 'events', emoji: '📅', label: 'אירועים קרובים', count: 22, trend: 'stable', trendLabel: 'יציב', pct: 65 },
  { id: 'volunteer', emoji: '🤝', label: 'התנדבות', count: 18, trend: 'up', trendLabel: '+5 השבוע', pct: 53 },
  { id: 'gate', emoji: '🚗', label: 'פתיחת שער', count: 15, trend: 'down', trendLabel: '-3 השבוע', pct: 44 },
  { id: 'payment', emoji: '💳', label: 'תשלום לוועד', count: 12, trend: 'stable', trendLabel: 'יציב', pct: 35 },
  { id: 'packages', emoji: '📦', label: 'סטטוס חבילות', count: 9, trend: 'up', trendLabel: '+4 השבוע', pct: 26 },
  { id: 'polls', emoji: '📊', label: 'סקרים והצבעות', count: 7, trend: 'down', trendLabel: '-2 השבוע', pct: 21 },
];

export const AI_ADVICE: AIAdvice[] = [
  {
    id: 'adv-pool',
    priority: 'high',
    emoji: '🏊',
    title: 'פרסמו עדכון על שעות הבריכה',
    body: '34 תושבים שאלו על שעות הבריכה השבוע — פי 3 מהשבוע שעבר. אין עדכון פעיל. עדכון קצר בעדכונים יפחית פניות חוזרות.',
    actionLabel: 'צור עדכון מומלץ',
    actionType: 'news',
    relatedTopicId: 'pool',
  },
  {
    id: 'adv-volunteer',
    priority: 'medium',
    emoji: '🤝',
    title: 'שלחו תזכורת להתנדבות IT',
    body: 'בקשת דוד (עזרה במחשב) פתוחה 26 שעות. 8 מתנדבים עם מיומנות IT בשכונה — שליחת תזכורת מגדילה סיכוי להתאמה.',
    actionLabel: 'שלח תזכורת',
    actionType: 'volunteer',
    relatedTopicId: 'volunteer',
  },
  {
    id: 'adv-events',
    priority: 'medium',
    emoji: '📅',
    title: 'הדגישו את ערב הקהילה ב-20 ביוני',
    body: '22 שאלות על אירועים השבוע, אך רק 12 הרשמות לערב הקרוב. מומלץ push או עדכון מודגש.',
    actionLabel: 'צור עדכון אירוע',
    actionType: 'event',
    relatedTopicId: 'events',
  },
  {
    id: 'adv-poll',
    priority: 'low',
    emoji: '📊',
    title: 'סקר חדש על ארוחת ערב הורים',
    body: 'הסקר הקודם הסתיים (המבורגרים 76%). תושבים ממשיכים לשאול — סקר המשך ישמור על מעורבות.',
    actionLabel: 'צור סקר',
    actionType: 'poll',
    relatedTopicId: 'polls',
  },
];

export const AI_ACTIVITY: AIActivityEntry[] = [
  { id: 'a1', time: '10:42', action: 'פרסם עדכון: הפסקת חשמל 25/04', source: 'email', auto: true },
  { id: 'a2', time: '10:38', action: 'ענה על שאלה: שעות בריכה', source: 'ai-chat', auto: true },
  { id: 'a3', time: '10:15', action: 'העלה לאישור: חסימת רחוב האלון', source: 'whatsapp', auto: false },
  { id: 'a4', time: '09:55', action: 'אישר מודעת מרקטפלייס: עגלת תינוק', source: 'app', auto: true },
  { id: 'a5', time: '09:30', action: 'התאים מתנדב לרחל (תיקון חשמל)', source: 'app', auto: true },
  { id: 'a6', time: '09:12', action: 'ענה על שאלה: אירועים השבוע', source: 'ai-chat', auto: true },
  { id: 'a7', time: '08:45', action: 'העלה לאישור: נחש באולם ספורט', source: 'whatsapp', auto: false },
];

export const HEATMAP_WEEKS = 12;
export const HEATMAP_LEVELS = [0, 1, 2, 3, 4];

export function generateHeatmapData(): number[][] {
  const rows: number[][] = [];
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const row: number[] = [];
    for (let d = 0; d < 7; d++) {
      const base = Math.sin((w + d) * 0.5) * 2 + 2;
      const noise = ((w * 7 + d) * 17) % 3;
      row.push(Math.min(4, Math.max(0, Math.round(base + noise - 1))));
    }
    rows.push(row);
  }
  return rows;
}

export const TYPE_LABELS: Record<InboxType, string> = {
  news: 'עדכון',
  poll: 'סקר',
  volunteer: 'התנדבות',
  event: 'אירוע',
  marketplace: 'מרקטפלייס',
  question: 'שאלה',
  maintenance: 'תקלה',
};

export const SOURCE_LABELS: Record<InboxSource, string> = {
  whatsapp: 'WhatsApp',
  email: 'דוא״ל',
  app: 'אפליקציה',
  'ai-chat': 'שיחת AI',
};

export const SECTION_COLORS: Record<InboxType, string> = {
  news: '#CEFF7E',
  poll: '#D8C5FF',
  volunteer: '#FFC9D9',
  event: '#C3ECF6',
  marketplace: '#FFD4A8',
  question: '#E8E8F0',
  maintenance: '#FFD4A8',
};
