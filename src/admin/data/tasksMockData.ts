export type TaskPriority = 'urgent' | 'high' | 'normal';
export type TaskDueGroup = 'overdue' | 'today' | 'upcoming';

export type AdminTask = {
  id: string;
  title: string;
  description: string;
  context: string;
  dueLabel: string;
  dueGroup: TaskDueGroup;
  priority: TaskPriority;
  completed: boolean;
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: 'דחוף',
  high: 'גבוהה',
  normal: 'רגילה',
};

export const ADMIN_TASKS: AdminTask[] = [
  {
    id: 'task-1',
    title: 'לעדכן את התושבים על חסימת רחוב האלון',
    description: 'לאשר את הטיוטה ולפרסם לפני תחילת העבודות.',
    context: 'תשתיות · WhatsApp',
    dueLabel: 'באיחור של שעה',
    dueGroup: 'overdue',
    priority: 'urgent',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'לתאם מתנדב לעזרה לדוד במחשב',
    description: 'הבקשה פתוחה מאתמול ועדיין לא נמצא מתנדב מתאים.',
    context: 'דוד לוי · התנדבות',
    dueLabel: 'היום, 16:00',
    dueGroup: 'today',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'לאשר את אירוע מפגש הקהילה',
    description: 'לעבור על התמונה, מועד האירוע וסגירת ההרשמה.',
    context: 'רכזת תרבות · מייל',
    dueLabel: 'היום, 18:00',
    dueGroup: 'today',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'לחזור למיכל לגבי תאורת הרחוב',
    description: 'לעדכן שהדיווח הועבר למחלקת התחזוקה.',
    context: 'מיכל לביא · רחוב הגפן',
    dueLabel: 'מחר',
    dueGroup: 'upcoming',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'להכין סיכום שבועי לוועד',
    description: 'לצרף מגמות פניות, פעילות קהילתית ונושאים חוזרים.',
    context: 'ועד מקומי · דוח שבועי',
    dueLabel: 'יום חמישי',
    dueGroup: 'upcoming',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-6',
    title: 'לבדוק את שעות פתיחת הבריכה',
    description: 'המידע אומת מול רכז הספורט ועודכן במאגר הידע.',
    context: 'מאגר ידע · בריכה',
    dueLabel: 'הושלם היום',
    dueGroup: 'today',
    priority: 'normal',
    completed: true,
  },
];
