export type CommunityEvent = {
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

export const EVENTS_BY_DATE: Record<string, CommunityEvent[]> = {
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
