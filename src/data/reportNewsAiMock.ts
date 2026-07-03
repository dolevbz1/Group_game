export type ReportNewsDraft = {
  title: string;
  location: string;
  description: string;
  label: string;
  urgent: boolean;
  emoji: string;
};

export const EMPTY_REPORT_DRAFT: ReportNewsDraft = {
  title: '',
  location: '',
  description: '',
  label: 'עדכון שכונתי · כללי',
  urgent: true,
  emoji: '📸',
};

export const MOCK_AI_REPORT: ReportNewsDraft = {
  title: 'עמוד חשמל התקפל בכניסה ליישוב',
  location: 'כניסה ליישוב ליד השער',
  description:
    'עמוד החשמל הראשי של היישוב התקפל ונראה שיוצאים ממנו גיצים, יש סכנה לכל מה שנמצא בסביבה',
  label: 'עדכון שכונתי · בטיחות',
  urgent: true,
  emoji: '🚧',
};

export const AI_ANALYZE_MS = 3800;
