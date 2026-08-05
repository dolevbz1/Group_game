import type { VolunteerRequest } from '../data/volunteerRequests';

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function toIcsDate(date: Date): string {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

export function getVolunteerRequestStart(request: VolunteerRequest): Date {
  const start = new Date();
  start.setDate(start.getDate() + request.dayOffset);
  start.setHours(request.startHour, request.startMinute, 0, 0);
  return start;
}

export function downloadVolunteerCalendarEvent(request: VolunteerRequest) {
  const start = getVolunteerRequestStart(request);
  const end = new Date(start.getTime() + request.durationMinutes * 60000);
  const uid = `volunteer-${request.id}-${start.getTime()}@shchuna`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Shchuna//Volunteer//HE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:עזרה ל${request.name} \u2013 ${request.task}`,
    `DESCRIPTION:נקבע דרך האפליקציה: עוזרים ל${request.name} עם ${request.task}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `help-${request.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
