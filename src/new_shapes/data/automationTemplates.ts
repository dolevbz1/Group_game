export type AutomationTemplate = {
  id: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  emoji: string;
  tone: 'events' | 'marketplace' | 'news' | 'custom';
  enabled?: boolean;
};

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'marketplace-new-item',
    title: 'פריט חדש במרקטפלייס',
    description: 'לקבל התראה כשמתפרסם פריט חדש',
    trigger: 'מתפרסם פריט חדש במרקטפלייס',
    action: 'לשלוח לי התראת Push',
    emoji: '🛍️',
    tone: 'marketplace',
  },
  {
    id: 'marketplace-free-item',
    title: 'פריט חינם חדש במרקטפלייס',
    description: 'לקבל התראה כשמתפרסם או מתעדכן פריט חינם',
    trigger: 'מתפרסם, נוסף או מתעדכן פריט חינם במרקטפלייס',
    action: 'לשלוח לי התראת Push מיד',
    emoji: '🎁',
    tone: 'marketplace',
  },
  {
    id: 'matching-event',
    title: 'אירוע חדש שמתאים לי',
    description: 'לדעת כשנוסף אירוע לפי תחומי העניין שלי',
    trigger: 'נוסף אירוע שמתאים לתחומי העניין שלי',
    action: 'לשלוח לי התראה',
    emoji: '🎟️',
    tone: 'events',
  },
  {
    id: 'urgent-update',
    title: 'עדכון דחוף מהיישוב',
    description: 'לא לפספס עדכונים חשובים מהקהילה',
    trigger: 'מתפרסם עדכון דחוף',
    action: 'לשלוח לי התראה מיד',
    emoji: '📣',
    tone: 'news',
  },
];
