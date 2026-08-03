import { getContentSectionId, type ContentAdminSection } from '../data/contentSectionsData';
import PollsContentView from './content/PollsContentView';
import VolunteerContentView from './content/VolunteerContentView';
import NewsContentView from './content/NewsContentView';
import EventsContentView from './content/EventsContentView';

type ContentSectionViewProps = {
  section: ContentAdminSection;
};

export default function ContentSectionView({ section }: ContentSectionViewProps) {
  const sectionId = getContentSectionId(section);

  switch (sectionId) {
    case 'polls':
      return <PollsContentView />;
    case 'volunteer':
      return <VolunteerContentView />;
    case 'news':
      return <NewsContentView />;
    case 'events':
      return <EventsContentView />;
    default:
      return null;
  }
}
