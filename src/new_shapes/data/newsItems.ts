import noEntryAnim from '../assets/no-entry.json';
import snakeAnim from '../assets/snake.json';
import electricAnim from '../assets/electric-power.json';
import transmissionTowerAnim from '../assets/transmission-tower-hover-pinch.json';
import leviAvatarAnim from '../assets/volunteer-avatar-levi.json';
import rachelAvatarAnim from '../assets/volunteer-avatar-rachel.json';
import davidAvatarAnim from '../assets/volunteer-avatar-david.json';
import avrahamAvatarAnim from '../assets/volunteer-avatar-avraham.json';

export type NewsReply = {
  id: string;
  name: string;
  text: string;
  avatar?: object;
  isAiAvatar?: boolean;
  postedAt: string;
};

export type NewsComment = {
  id: string;
  name: string;
  text: string;
  avatar: object;
  replies?: NewsReply[];
  lastReplyAt?: string;
};

export type NewsItem = {
  id: string;
  noteClass: string;
  scatterClass: string;
  urgent?: boolean;
  label: string;
  time: string;
  color: string;
  pin: string;
  anim?: object;
  loopAnim?: boolean;
  hasLottie?: boolean;
  hasElectricLottie?: boolean;
  emoji?: string;
  title: string;
  storyTitle?: string;
  desc: string;
  author: {
    name: string;
    role: string;
    avatar: object;
  };
  postedAt: string;
  updatedAt: string;
  readMinutes: number;
  body: string;
  heroImage?: string;
  comments: NewsComment[];
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'street',
    noteClass: 'is-folder-frame',
    scatterClass: 'note-scatter-1',
    urgent: true,
    label: 'דחוף · הרחוב שלך',
    time: 'עכשיו',
    color: '#FFD4A8',
    pin: '#FF9F45',
    anim: noEntryAnim,
    loopAnim: true,
    emoji: '🚗',
    title: 'רחוב האלון יחסם מחר לעבודות בניה',
    storyTitle: 'אירוע פסח לנוער',
    desc: 'בין 7:00–14:00 · הזיזו את הרכב מהרחוב עד הבוקר',
    heroImage: '/street-closure-hero.png',
    author: {
      name: 'ועד גבעת אלה',
      role: 'עדכון רשמי',
      avatar: avrahamAvatarAnim,
    },
    postedAt: '20 ביוני 2026',
    updatedAt: '20 ביוני 2026 · 08:15',
    readMinutes: 2,
    body:
      'מחר, בין השעות 07:00–14:00, יבוצעו עבודות בניה ברחוב האלון. הגישה לרכבים תיחסם חלקית לאורך כל הקטע בין צומת הברוש לסוף הרחוב.\n\nאנא הזיזו את הרכבים מהרחוב עד סוף היום. במידה ולא ניתן יהיה לבצע פינוי, צוות האבטחה יפנה את הרכבים לחניון הסמוך.\n\nלשאלות ניתן לפנות למוקד הוועד בוואטסאפ או בטלפון 03-5551234.',
    comments: [
      {
        id: 'c1',
        name: 'מיכל לוי',
        text: 'תודה על העדכון! האם גם חניית האורחים תיחסם?',
        avatar: rachelAvatarAnim,
      },
      {
        id: 'c2',
        name: 'דוד כהן',
        text: 'הזזנו את הרכב. כדאי לשלוח תזכורת בבוקר.',
        avatar: davidAvatarAnim,
      },
      {
        id: 'c3',
        name: 'אבי שטרן',
        text: 'יש דרך חלופית לצאת מהשכונה בזמן החסימה?',
        avatar: leviAvatarAnim,
      },
    ],
  },
  {
    id: 'pool',
    noteClass: 'is-pinned',
    scatterClass: 'note-scatter-2',
    label: '✨ כי אתם חברי מועדון הבריכה',
    time: 'לפני שעתיים',
    color: '#C3ECF6',
    pin: '#4FC3E8',
    hasLottie: true,
    emoji: '🏊',
    title: 'שעות הבריכה לקיץ עודכנו!',
    desc: 'הבריכה הקהילתית פתוחה כעת עד 21:00 בכל ימות השבוע. בואו להתרענן!',
    author: {
      name: 'צוות הבריכה',
      role: 'מרכז קהילתי',
      avatar: rachelAvatarAnim,
    },
    postedAt: '20 ביוני 2026',
    updatedAt: '20 ביוני 2026 · 06:30',
    readMinutes: 1,
    heroImage: '/pool-hero.png',
    body:
      'השמחים לעדכן כי שעות הפעילות בבריכה הקהילתית הוארכו לקיץ: בימים א׳–ה׳ בין 06:30–21:00, ובימי שישי בין 08:00–19:00.\n\nשיעורי הארובה לילדים יתקיימו כרגיל בימי שני ורביעי. כרטיסייה לעונה תקפה לכל התושבים הרשומים למועדון.',
    comments: [
      {
        id: 'c1',
        name: 'נועה ברק',
        text: 'סוף סוף! האם צריך להירשם מראש לשיעורי שחייה?',
        avatar: rachelAvatarAnim,
        lastReplyAt: 'לפני שעה',
        replies: [
          {
            id: 'c1-r1',
            name: 'עוזר ה AI',
            text: 'לא צריך להירשם מראש — מגיעים בשעות השיעור ונרשמים במקום 🏊',
            isAiAvatar: true,
            postedAt: 'לפני שעה',
          },
        ],
      },
      {
        id: 'c2',
        name: 'יוסי אבידן',
        text: 'מעולה, נראה אתכם בערב 🏊',
        avatar: leviAvatarAnim,
      },
    ],
  },
  {
    id: 'snake',
    noteClass: 'is-pinned is-pinned-inset',
    scatterClass: 'note-scatter-3',
    urgent: true,
    label: 'עדכון שכונתי · כללי',
    time: 'לפני 3 שעות',
    color: '#D4F5D4',
    pin: '#5BBF5B',
    anim: snakeAnim,
    loopAnim: true,
    emoji: '🐍',
    title: 'נחש צפע בכניסה לאולם הספורט',
    desc: 'תיאור פלייסהולדר לכרטיס החדש. ניתן להחליף בתוכן אמיתי בהמשך.',
    author: {
      name: 'מוקד הביטחון',
      role: 'עדכון בטיחות',
      avatar: davidAvatarAnim,
    },
    postedAt: '20 ביוני 2026',
    updatedAt: '20 ביוני 2026 · 05:10',
    readMinutes: 2,
    body:
      'זוהה נחש צפע סמוך לכניסה לאולם הספורט. צוות לכידה מקומי הוזעק לזירה והנחש הוסר בהצלחה.\n\nאנא היזהרו בכניסה לאולם ובסביבתו עד הודעה נוספת, והימנעו מהתקרבות לשיחים ולעשב הגבוה באזור.',
    comments: [
      {
        id: 'c1',
        name: 'רונית גל',
        text: 'ראיתי את הצוות בדרך לעבודה. תודה על הטיפול המהיר.',
        avatar: rachelAvatarAnim,
      },
      {
        id: 'c2',
        name: 'עמית רז',
        text: 'האם האימון בערב מתקיים כרגיל?',
        avatar: leviAvatarAnim,
      },
      {
        id: 'c3',
        name: 'שרה מזרחי',
        text: 'נשמח להתראה אם יימצאו עוד מקרים באזור.',
        avatar: avrahamAvatarAnim,
      },
      {
        id: 'c4',
        name: 'אלון פרץ',
        text: 'שמרו על ילדים רחוק מהדשא בימים הקרובים.',
        avatar: davidAvatarAnim,
      },
    ],
  },
  {
    id: 'movie',
    noteClass: 'is-folder-frame',
    scatterClass: 'note-scatter-4',
    label: '🎬 כי נהניתם בערב הקולנוע הקודם',
    time: 'לפני 1 יום',
    color: '#D8C5FF',
    pin: '#9B7BE8',
    hasElectricLottie: true,
    emoji: '🎬',
    title: 'הפסקת חשמל מתוכננת ל 25/04 בין 09:00 - 13:00',
    desc: 'הצטרפו אלינו לערב סרטים מיוחד בפארק השכונתי, כניסה חופשית לכל התושבים',
    author: {
      name: 'חברת החשמל',
      role: 'בשיתוף הוועד',
      avatar: avrahamAvatarAnim,
    },
    postedAt: '19 ביוני 2026',
    updatedAt: '19 ביוני 2026 · 14:00',
    readMinutes: 3,
    body:
      'בתאריך 25/04 תתבצע הפסקת חשמל מתוכננת בשכונות המערביות של הישוב, בין השעות 09:00–13:00. ההפסקה נועדה לשדרוג תשתיות החשמל באזור.\n\nמומלץ לטעון מכשירים מראש ולהימנע משימוש במעליות בזמן ההפסקה. מקררים ומקפיאים יישארו פעילים כ-4 שעות בממוצע.',
    comments: [
      {
        id: 'c1',
        name: 'טל בן דוד',
        text: 'האם גם בניין 12 מושפע מההפסקה?',
        avatar: leviAvatarAnim,
      },
      {
        id: 'c2',
        name: 'דנה אהרון',
        text: 'תודה על ההתראה המוקדמת 🙏',
        avatar: rachelAvatarAnim,
      },
    ],
  },
];

const PUBLISHED_NEWS_ITEMS: NewsItem[] = [];

export type ReportedNewsInput = {
  title: string;
  location: string;
  description: string;
  label: string;
  urgent: boolean;
  emoji: string;
  photoUrl?: string | null;
};

export function createNewsItemFromReport(input: ReportedNewsInput): NewsItem {
  return {
    id: `report-${Date.now()}`,
    noteClass: '',
    scatterClass: '',
    urgent: input.urgent,
    label: input.label,
    time: 'עכשיו',
    color: '#CEFF7E',
    pin: '#222233',
    anim: transmissionTowerAnim,
    loopAnim: true,
    emoji: input.emoji,
    title: input.title,
    desc: input.description,
    author: {
      name: 'טל לויסנקי',
      role: 'תושב/ת השכונה',
      avatar: davidAvatarAnim,
    },
    postedAt: 'עכשיו',
    updatedAt: 'עכשיו',
    readMinutes: 1,
    body: input.location ? `${input.description}\n\nמיקום: ${input.location}` : input.description,
    heroImage: input.photoUrl ?? undefined,
    comments: [],
  };
}

export function addPublishedNewsItem(item: NewsItem) {
  PUBLISHED_NEWS_ITEMS.unshift(item);
}

export function getNewsById(id: string): NewsItem | undefined {
  return (
    PUBLISHED_NEWS_ITEMS.find((item) => item.id === id) ??
    NEWS_ITEMS.find((item) => item.id === id)
  );
}
