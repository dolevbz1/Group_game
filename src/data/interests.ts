export type InterestOption = {
  id: string;
  label: string;
  emoji: string;
};

export const INTEREST_CATALOG: InterestOption[] = [
  { id: 'pool', label: 'מועדון הבריכה', emoji: '🏊' },
  { id: 'cinema', label: 'ערבי קולנוע', emoji: '🎬' },
  { id: 'garden', label: 'גינון קהילתי', emoji: '🌳' },
  { id: 'sport', label: 'ספורט שכונתי', emoji: '⚽' },
  { id: 'yoga', label: 'יוגה ומיינדפולנס', emoji: '🧘' },
  { id: 'music', label: 'מוזיקה חיה', emoji: '🎵' },
  { id: 'books', label: 'מועדון ספרים', emoji: '📚' },
  { id: 'food', label: 'בישול ואפייה', emoji: '🍰' },
  { id: 'dogs', label: 'כלבים', emoji: '🐕' },
  { id: 'kids', label: 'פעילות עם ילדים', emoji: '👨‍👩‍👧' },
  { id: 'volunteer', label: 'התנדבות', emoji: '🤝' },
  { id: 'tech', label: 'טכנולוגיה', emoji: '💻' },
];

export const DEFAULT_INTEREST_IDS = ['pool', 'cinema', 'garden', 'sport'];

export const MAX_INTERESTS = 5;

export function getInterestById(id: string): InterestOption | undefined {
  return INTEREST_CATALOG.find((item) => item.id === id);
}
