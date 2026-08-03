export type ContentSectionId = 'polls' | 'volunteer' | 'news' | 'events';

export type ContentSection = {
  id: ContentSectionId;
  title: string;
  navLabel: string;
};

export const CONTENT_SECTIONS: ContentSection[] = [
  { id: 'polls', title: 'הצבעות', navLabel: 'תצביע, תשפיע' },
  { id: 'volunteer', title: 'התנדבות', navLabel: 'התנדבות' },
  { id: 'news', title: 'לוח מודעות', navLabel: 'עדכונים' },
  { id: 'events', title: 'אירועים', navLabel: 'אירועים' },
];

export type ContentAdminSection = `content-${ContentSectionId}`;

export function toContentAdminSection(id: ContentSectionId): ContentAdminSection {
  return `content-${id}`;
}

export function isContentAdminSection(section: string): section is ContentAdminSection {
  return section.startsWith('content-');
}

export function getContentSectionId(section: ContentAdminSection): ContentSectionId {
  return section.replace('content-', '') as ContentSectionId;
}

export function getContentSection(section: ContentAdminSection): ContentSection | undefined {
  const id = getContentSectionId(section);
  return CONTENT_SECTIONS.find((item) => item.id === id);
}
