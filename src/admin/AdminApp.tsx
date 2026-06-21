import { useState } from 'react';
import Sidebar, { type AdminSection } from './components/Sidebar';
import HomeView from './views/HomeView';
import AIAgentView from './views/AIAgentView';
import PlaceholderView from './views/PlaceholderView';
import { INBOX_ITEMS } from './data/adminMockData';

export default function AdminApp() {
  const [section, setSection] = useState<AdminSection>('inbox');
  const [inbox, setInbox] = useState(INBOX_ITEMS);
  const pendingCount = inbox.filter((i) => i.status !== 'handled').length;

  const handleApprove = (id: string) => {
    setInbox((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'handled' as const } : item))
    );
  };

  const handleDismiss = (id: string) => {
    setInbox((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="admin-stage">
      <div className="admin-device">
        <div className="admin-screen" dir="rtl">
          <Sidebar
            active={section}
            onNavigate={setSection}
            pendingCount={pendingCount}
          />
          <main className="admin-main">
            {section === 'inbox' && (
              <HomeView
                inbox={inbox}
                onApprove={handleApprove}
                onDismiss={handleDismiss}
              />
            )}
            {section === 'ai' && <AIAgentView />}
            {section === 'content' && (
              <PlaceholderView
                title="תוכן"
                subtitle="ניהול עדכונים, סקרים, התנדבות, אירועים ומרקטפלייס"
                emoji="📝"
              />
            )}
            {section === 'residents' && (
              <PlaceholderView
                title="תושבים"
                subtitle="חיפוש תושבים, היסטוריית פעילות ותחומי עניין"
                emoji="👥"
              />
            )}
            {section === 'insights' && (
              <PlaceholderView
                title="תובנות"
                subtitle="מגמות מעורבות, סקרים ואירועים"
                emoji="📈"
              />
            )}
            {section === 'settings' && (
              <PlaceholderView
                title="הגדרות"
                subtitle="כללי אוטומציה, אינטגרציות והרשאות"
                emoji="⚙️"
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
