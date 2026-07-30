export type ProtectedAreaAlertItem = {
  id: string;
  time: string;
  type: string;
  region: string;
  muted?: boolean;
};

export type ProtectedAreaAlertGroup = {
  id: string;
  label: string;
  items: ProtectedAreaAlertItem[];
};

export const PROTECTED_AREA_ALERT_GROUPS: ProtectedAreaAlertGroup[] = [
  {
    id: 'today',
    label: 'היום',
    items: [
      { id: 'today-1', time: '12:34', type: 'ירי רקטות וטילים', region: 'לבנון', muted: true },
      { id: 'today-2', time: '11:14', type: 'ירי רקטות וטילים', region: 'איראן' },
      { id: 'today-3', time: '05:02', type: 'כלי טייס בלתי מאויש', region: 'לבנון' },
    ],
  },
  {
    id: 'yesterday',
    label: 'אתמול',
    items: [
      { id: 'yesterday-1', time: '21:41', type: 'ירי רקטות וטילים', region: 'לבנון' },
      { id: 'yesterday-2', time: '16:22', type: 'כלי טייס בלתי מאויש', region: 'לבנון' },
    ],
  },
  {
    id: 'feb-2',
    label: '2 בפברואר, 2026',
    items: [
      { id: 'feb-2-1', time: '08:01', type: 'ירי רקטות וטילים', region: 'לבנון' },
      { id: 'feb-2-2', time: '10:22', type: 'ירי רקטות וטילים', region: 'איראן' },
    ],
  },
];

export const PROTECTED_AREA_STATUS = {
  headline: 'נא להישאר במרחב המוגן',
  subline: 'הכל בסדר, כמה דקי׳ ואנחנו אחרי :(',
  startedAt: '12:34',
};

export const PROTECTED_AREA_FOOTER_LINK = {
  label: 'לכל ההתראות באתר פיקוד העורף',
  href: 'https://www.oref.org.il/',
};
