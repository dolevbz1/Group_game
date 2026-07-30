export type FlowSourceId = 'whatsapp' | 'email' | 'app';
export type SourceLogStatus = 'processed' | 'review' | 'escalated';

export type SourceLogEntry = {
  id: string;
  actor: string;
  context: string;
  receivedAt: string;
  title: string;
  content: string;
  status: SourceLogStatus;
  intent: string;
  confidence: number;
  aiDecision: string;
  metadata: string[];
};

export type SourceLog = {
  id: FlowSourceId;
  title: string;
  subtitle: string;
  contentLabel: string;
  todayCount: number;
  lastSync: string;
  entries: SourceLogEntry[];
};

export const SOURCE_LOG_STATUS_LABELS: Record<SourceLogStatus, string> = {
  processed: 'טופל אוטומטית',
  review: 'ממתין לבדיקה',
  escalated: 'הועבר למנהל',
};

export const SOURCE_LOGS: Record<FlowSourceId, SourceLog> = {
  whatsapp: {
    id: 'whatsapp',
    title: 'יומן WhatsApp',
    subtitle: 'מקור קלט · מחובר',
    contentLabel: 'הודעה מקורית',
    todayCount: 18,
    lastSync: 'עכשיו',
    entries: [
      {
        id: 'wa-1042',
        actor: 'שרון קדם',
        context: 'קבוצת גבעת אלה – תושבים',
        receivedAt: '10:42',
        title: 'חסימת רחוב האלון מחר',
        content: 'מחר בין 07:00 ל־14:00 רחוב האלון יהיה חסום בגלל עבודות תשתית. כדאי לעדכן את כל התושבים ולהציע דרך חלופית.',
        status: 'review',
        intent: 'עדכון תשתית',
        confidence: 93,
        aiDecision: 'נוצרה טיוטת עדכון דחוף ונשלחה לאישור מנהל הקהילה.',
        metadata: ['הודעת קבוצה', 'עברית', 'ללא קובץ מצורף'],
      },
      {
        id: 'wa-0918',
        actor: 'יוסי רז',
        context: 'שיחה פרטית',
        receivedAt: '09:18',
        title: 'שאלה על שעות הבריכה',
        content: 'היי, הבריכה פתוחה גם ביום שישי אחר הצהריים? לא מצאתי את השעות המעודכנות.',
        status: 'processed',
        intent: 'שאלה נפוצה',
        confidence: 98,
        aiDecision: 'נשלחה תשובה אוטומטית מתוך עדכון שעות הבריכה הפעיל.',
        metadata: ['שיחה פרטית', 'תושב מאומת', 'נענה תוך 4 שניות'],
      },
      {
        id: 'wa-0856',
        actor: 'מאיה בר',
        context: 'קבוצת אוהבי כלבים',
        receivedAt: '08:56',
        title: 'כלב נמצא ליד המגרש',
        content: 'מצאנו כלב חום קטן ליד מגרש הכדורסל, עם קולר כחול וללא מספר טלפון. מצרפת תמונה.',
        status: 'processed',
        intent: 'אבדה ומציאה',
        confidence: 91,
        aiDecision: 'המידע סווג כעדכון קהילתי ונוסף ללוח האבידות עם התמונה המקורית.',
        metadata: ['הודעת קבוצה', 'תמונה אחת', 'מיקום זוהה'],
      },
      {
        id: 'wa-0812',
        actor: 'ענת שחר',
        context: 'קבוצת הורי בית הספר',
        receivedAt: '08:12',
        title: 'שינוי בהסעות הבוקר',
        content: 'האוטובוס של קו 3 לא הגיע הבוקר. יש מידע אם זה שינוי קבוע או תקלה חד־פעמית?',
        status: 'escalated',
        intent: 'תחבורה והסעות',
        confidence: 78,
        aiDecision: 'לא נמצא מקור רשמי מעודכן. הפנייה הועברה למנהל לבירור מול המועצה.',
        metadata: ['הודעת קבוצה', 'נושא חוזר', 'נדרש מקור רשמי'],
      },
    ],
  },
  email: {
    id: 'email',
    title: 'יומן מייל',
    subtitle: 'מקור קלט · מסונכרן',
    contentLabel: 'תוכן המייל',
    todayCount: 7,
    lastSync: 'לפני 2 דק׳',
    entries: [
      {
        id: 'mail-1015',
        actor: 'ועד מקומי גבעת אלה',
        context: 'vaad@givat-elah.org',
        receivedAt: '10:15',
        title: 'פרוטוקול ועד והחלטות לפרסום',
        content: 'שלום, מצורף סיכום ישיבת הוועד מאתמול. אנא פרסמו לתושבים את ההחלטה על הארכת שעות הספרייה ואת מועד מפגש הקהילה הבא.',
        status: 'review',
        intent: 'פרסום רשמי',
        confidence: 96,
        aiDecision: 'חולצו שתי החלטות ונוצרו שתי טיוטות נפרדות לבדיקת מנהל.',
        metadata: ['PDF מצורף', 'שולח מאומת', '2 נושאים זוהו'],
      },
      {
        id: 'mail-0940',
        actor: 'ועדת ביטחון',
        context: 'security@givat-elah.org',
        receivedAt: '09:40',
        title: 'תרגיל חירום ביום חמישי',
        content: 'ביום חמישי בשעה 18:00 יתקיים תרגיל חירום באזור המזכירות. במהלך התרגיל תישמע אזעקה קצרה ואין צורך לפנות למוקד.',
        status: 'processed',
        intent: 'הודעת ביטחון',
        confidence: 99,
        aiDecision: 'תוזמן עדכון לכל התושבים ליום רביעי בשעה 19:00.',
        metadata: ['שולח מאומת', 'תאריך ושעה חולצו', 'תזמון נוצר'],
      },
      {
        id: 'mail-0834',
        actor: 'רכזת תרבות',
        context: 'culture@givat-elah.org',
        receivedAt: '08:34',
        title: 'ערב קהילה – תוכן מעודכן',
        content: 'מצורפים הטקסט והתמונה הסופיים לערב הקהילה ב־20 ביולי. ההרשמה פתוחה עד יום שישי ומספר המקומות מוגבל ל־80.',
        status: 'review',
        intent: 'יצירת אירוע',
        confidence: 94,
        aiDecision: 'נוצר אירוע עם תמונה, מועד וסגירת הרשמה. ממתין לאישור לפני פרסום.',
        metadata: ['תמונה מצורפת', '80 מקומות', 'מועד הרשמה זוהה'],
      },
      {
        id: 'mail-0748',
        actor: 'מיכל לביא',
        context: 'michal.lavi@example.com',
        receivedAt: '07:48',
        title: 'תאורה לא עובדת ברחוב הגפן',
        content: 'כבר שלושה לילות ששני פנסי הרחוב ליד בתים 8–10 לא עובדים. האזור חשוך מאוד ונשמח לטיפול בהקדם.',
        status: 'escalated',
        intent: 'דיווח תשתית',
        confidence: 97,
        aiDecision: 'נפתח דיווח תחזוקה והפנייה הועברה למנהל בגלל היבט בטיחותי.',
        metadata: ['תושבת מאומתת', 'מיקום חולץ', 'סיכון בטיחותי'],
      },
    ],
  },
  app: {
    id: 'app',
    title: 'יומן בוט טלפוני',
    subtitle: 'מקור קלט · פעיל',
    contentLabel: 'תמלול השיחה',
    todayCount: 11,
    lastSync: 'לפני דקה',
    entries: [
      {
        id: 'call-1008',
        actor: 'רבקה פרידמן',
        context: '050-555-0142 · שיחה 01:24',
        receivedAt: '10:08',
        title: 'בירור אירועים השבוע',
        content: 'שלום, רציתי לדעת אילו פעילויות יש השבוע שמתאימות גם לנכדים. בעיקר משהו בשעות אחר הצהריים.',
        status: 'processed',
        intent: 'בירור אירועים',
        confidence: 95,
        aiDecision: 'הבוט הקריא שלושה אירועים מתאימים ושלח סיכום ב־SMS לאחר השיחה.',
        metadata: ['תושבת מאומתת', 'עברית', 'SMS נשלח'],
      },
      {
        id: 'call-0922',
        actor: 'דוד לוי',
        context: '052-555-6801 · שיחה 02:11',
        receivedAt: '09:22',
        title: 'בקשת עזרה במחשב',
        content: 'המחשב שלי לא מתחבר לאינטרנט מאז אתמול. אני צריך עזרה ממישהו שמבין בזה, עדיף היום אחרי ארבע.',
        status: 'review',
        intent: 'בקשת התנדבות',
        confidence: 89,
        aiDecision: 'נוצרה בקשת התנדבות עם חלון זמן מועדף. נדרש אישור לפני שליחה למתנדבים.',
        metadata: ['תושב מאומת', 'זמן מועדף חולץ', 'נדרשת התאמה'],
      },
      {
        id: 'call-0845',
        actor: 'מתקשר לא מזוהה',
        context: 'מספר חסוי · שיחה 00:46',
        receivedAt: '08:45',
        title: 'דיווח על נחש ליד אולם הספורט',
        content: 'יש נחש שנראה כמו צפע ליד הכניסה לאולם הספורט. יש שם ילדים עכשיו, צריך שמישהו יגיע מהר.',
        status: 'escalated',
        intent: 'אירוע בטיחות',
        confidence: 92,
        aiDecision: 'הופעלה הסלמת חירום למנהל ולצוות הביטחון. לא בוצע פרסום אוטומטי.',
        metadata: ['מתקשר לא מזוהה', 'דחיפות גבוהה', 'התראה נשלחה'],
      },
      {
        id: 'call-0730',
        actor: 'משה קפלן',
        context: '054-555-3310 · שיחה 01:07',
        receivedAt: '07:30',
        title: 'שעות פתיחת השער',
        content: 'באילו שעות השער המזרחי פתוח היום? אני מחכה למשלוח גדול ולא רוצה שהנהג יגיע כשהשער סגור.',
        status: 'processed',
        intent: 'מידע תפעולי',
        confidence: 99,
        aiDecision: 'הבוט הקריא את שעות השער המעודכנות ואישר שהמידע התקבל.',
        metadata: ['תושב מאומת', 'תשובה ממאגר ידע', 'נענה תוך 3 שניות'],
      },
    ],
  },
};
