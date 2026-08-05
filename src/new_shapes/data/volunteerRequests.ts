import avrahamAvatarAnimation from '../assets/volunteer-avatar-avraham.json';
import davidAvatarAnimation from '../assets/volunteer-avatar-david.json';
import leviAvatarAnimation from '../assets/volunteer-avatar-levi.json';
import rachelAvatarAnimation from '../assets/volunteer-avatar-rachel.json';

export type VolunteerRequest = {
  id: string;
  name: string;
  avatarAnimation: object;
  taskEmoji: string;
  task: string;
  distance: string;
  duration: string;
  availability: string;
  position: {
    lat: number;
    lng: number;
  };
  dayOffset: number;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
};

export const VOLUNTEER_REQUESTS: VolunteerRequest[] = [
  {
    id: 'david',
    name: 'דוד',
    avatarAnimation: davidAvatarAnimation,
    taskEmoji: '💻',
    task: 'עזרה במחשב החדש',
    distance: '200 מ׳',
    duration: '30 דק׳',
    availability: 'מחר ב־14:00',
    position: { lat: 32.7222, lng: 35.2415 },
    dayOffset: 1,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 30,
  },
  {
    id: 'avraham',
    name: 'אברהם',
    avatarAnimation: avrahamAvatarAnimation,
    taskEmoji: '🐕',
    task: 'הוצאת הכלב',
    distance: '350 מ׳',
    duration: '20 דק׳',
    availability: 'מחר ב־14:00',
    position: { lat: 32.72, lng: 35.2458 },
    dayOffset: 1,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 20,
  },
  {
    id: 'levi',
    name: 'משפחת לוי',
    avatarAnimation: leviAvatarAnimation,
    taskEmoji: '👶',
    task: 'בייביסיטר לערב',
    distance: '450 מ׳',
    duration: '3 שע׳',
    availability: 'מחר ב־14:00',
    position: { lat: 32.7228, lng: 35.245 },
    dayOffset: 1,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 180,
  },
  {
    id: 'rachel',
    name: 'רחל',
    avatarAnimation: rachelAvatarAnimation,
    taskEmoji: '🔌',
    task: 'תיקון חשמל קטן',
    distance: '600 מ׳',
    duration: '45 דק׳',
    availability: 'מחר ב־14:00',
    position: { lat: 32.7224, lng: 35.251 },
    dayOffset: 1,
    startHour: 14,
    startMinute: 0,
    durationMinutes: 45,
  },
];
