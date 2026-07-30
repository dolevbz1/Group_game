import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import QuickActions from './components/QuickActions';
import AddMenu from './components/AddMenu';
import AIBot from './components/AIBot';
import AutomationsPage from './components/AutomationsPage';
import Profile from './components/Profile';
import EventsPage from './components/EventsPage';
import MarketplacePage from './components/MarketplacePage';
import NewsDetailPage from './components/NewsDetailPage';
import StoryViewer from './components/StoryViewer';
import ReportNewsPage from './components/ReportNewsPage';
import ReportNewsSuccessModal from './components/ReportNewsSuccessModal';
import LoadingScreen from './components/LoadingScreen';
import GateSuccessModal from './components/GateSuccessModal';
import ProtectedAreaAlertModal from './components/ProtectedAreaAlertModal';
import ProtectedAreaActivePage from './components/ProtectedAreaActivePage';
import type { AutomationTemplate } from './data/automationTemplates';
import { addPublishedNewsItem, createNewsItemFromReport, type NewsItem } from './data/newsItems';
import type { ReportNewsDraft } from './data/reportNewsAiMock';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [aiBotOpen, setAiBotOpen] = useState(false);
  const [automationsOpen, setAutomationsOpen] = useState(false);
  const [activeAutomations, setActiveAutomations] = useState<AutomationTemplate[]>([]);
  const [searchRect, setSearchRect] = useState<DOMRect | null>(null);
  const [botInitialMessage, setBotInitialMessage] = useState<string | undefined>();
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarRect, setAvatarRect] = useState<DOMRect | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [newsDetailOpen, setNewsDetailOpen] = useState(false);
  const [newsDetailId, setNewsDetailId] = useState<string | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [reportNewsOpen, setReportNewsOpen] = useState(false);
  const [reportNewsSuccessOpen, setReportNewsSuccessOpen] = useState(false);
  const [newNewsItems, setNewNewsItems] = useState<NewsItem[]>([]);
  const [protectedAreaAlertOpen, setProtectedAreaAlertOpen] = useState(false);
  const [protectedAreaActiveOpen, setProtectedAreaActiveOpen] = useState(false);

  const handleSearchClick = (rect: DOMRect) => {
    setSearchRect(rect);
    setBotInitialMessage(undefined);
    setAiBotOpen(true);
  };

  const handleSearchSubmit = (text: string, rect: DOMRect) => {
    setSearchRect(rect);
    setBotInitialMessage(text);
    setAiBotOpen(true);
  };

  const handleProfileClick = (rect: DOMRect) => {
    setAvatarRect(rect);
    setProfileOpen(true);
  };

  const handleEventOpenFromBot = () => {
    setAiBotOpen(false);
    setBotInitialMessage(undefined);
    setEventsOpen(true);
  };

  const handleNewsOpenFromBot = (id: string) => {
    setAiBotOpen(false);
    setBotInitialMessage(undefined);
    setNewsDetailId(id);
    setNewsDetailOpen(true);
  };

  const handleAutomationActivate = (automation: AutomationTemplate) => {
    setActiveAutomations((automations) =>
      automations.some((item) => item.id === automation.id)
        ? automations
        : [...automations, { ...automation, enabled: true }]
    );
  };

  const handleAutomationUpdate = (automation: AutomationTemplate) => {
    setActiveAutomations((automations) =>
      automations.map((item) => (item.id === automation.id ? automation : item))
    );
  };

  const handleAutomationDelete = (id: string) => {
    setActiveAutomations((automations) =>
      automations.filter((automation) => automation.id !== id)
    );
  };

  const handleAutomationDuplicate = (automation: AutomationTemplate) => {
    setActiveAutomations((automations) => [...automations, automation]);
  };

  const handleAutomationsOpenFromBot = () => {
    setAiBotOpen(false);
    setBotInitialMessage(undefined);
    setAutomationsOpen(true);
  };

  const handleAutomationsOpenFromProfile = () => {
    setProfileOpen(false);
    setAutomationsOpen(true);
  };

  const handleAutomationCreate = () => {
    setAutomationsOpen(false);
    setSearchRect(null);
    setBotInitialMessage('אני רוצה ליצור אוטומציה');
    setAiBotOpen(true);
  };

  const handleNewsPublished = (draft: ReportNewsDraft, photoUrl: string | null) => {
    const item = createNewsItemFromReport({ ...draft, photoUrl });
    addPublishedNewsItem(item);
    setNewNewsItems((prev) => [item, ...prev]);
    setReportNewsOpen(false);
    setReportNewsSuccessOpen(true);
  };

  const handleProtectedAreaConfirm = () => {
    setProtectedAreaAlertOpen(false);
    setProtectedAreaActiveOpen(true);
  };

  const handleProtectedAreaClose = () => {
    setProtectedAreaActiveOpen(false);
    setProtectedAreaAlertOpen(false);
  };

  return (
    <div className="stage">
      <div className="device">
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
        <div className={`screen${loading ? '' : ' is-ready'}`}>
          <Header
            onMenuClick={() => {
              setAddMenuOpen(false);
              setQuickActionsOpen(true);
            }}
            onAddClick={() => {
              setQuickActionsOpen(false);
              setAddMenuOpen(true);
            }}
            onSearchClick={handleSearchClick}
            onProfileClick={handleProfileClick}
          />
          <Hero onSearchSubmit={handleSearchSubmit} />
          <Carousel
            isReady={!loading}
            onEventsOpen={() => setEventsOpen(true)}
            onMarketplaceOpen={() => setMarketplaceOpen(true)}
            onStoryOpen={setStoryId}
            onNewsOpen={(id) => {
              setNewsDetailId(id);
              setNewsDetailOpen(true);
            }}
            newNewsItems={newNewsItems}
          />
        </div>
        <QuickActions
          open={quickActionsOpen}
          onClose={() => setQuickActionsOpen(false)}
          onGateOpen={() => setGateOpen(true)}
          onEmergencyOpen={() => setProtectedAreaAlertOpen(true)}
        />
        <AddMenu
          open={addMenuOpen}
          onClose={() => setAddMenuOpen(false)}
          onNewsReport={() => setReportNewsOpen(true)}
        />
        <GateSuccessModal open={gateOpen} onClose={() => setGateOpen(false)} />
        <ProtectedAreaAlertModal
          open={protectedAreaAlertOpen}
          onConfirm={handleProtectedAreaConfirm}
        />
        <ProtectedAreaActivePage
          open={protectedAreaActiveOpen}
          onClose={handleProtectedAreaClose}
        />
        <AIBot
          open={aiBotOpen}
          startRect={searchRect}
          onClose={() => {
            setAiBotOpen(false);
            setBotInitialMessage(undefined);
          }}
          onAutomationActivate={handleAutomationActivate}
          onAutomationsOpen={handleAutomationsOpenFromBot}
          onEventsOpen={handleEventOpenFromBot}
          onNewsOpen={handleNewsOpenFromBot}
          initialMessage={botInitialMessage}
        />
        <Profile
          open={profileOpen}
          startRect={avatarRect}
          onClose={() => setProfileOpen(false)}
          automationCount={
            activeAutomations.filter((automation) => automation.enabled !== false).length
          }
          onAutomationsOpen={handleAutomationsOpenFromProfile}
        />
        <AutomationsPage
          open={automationsOpen}
          automations={activeAutomations}
          onClose={() => setAutomationsOpen(false)}
          onCreate={handleAutomationCreate}
          onDelete={handleAutomationDelete}
          onDuplicate={handleAutomationDuplicate}
          onUpdate={handleAutomationUpdate}
        />
        <EventsPage open={eventsOpen} onClose={() => setEventsOpen(false)} />
        <MarketplacePage open={marketplaceOpen} onClose={() => setMarketplaceOpen(false)} />
        <NewsDetailPage
          open={newsDetailOpen}
          newsId={newsDetailId}
          onClose={() => {
            setNewsDetailOpen(false);
            setNewsDetailId(null);
          }}
        />
        <StoryViewer open={storyId !== null} storyId={storyId} onClose={() => setStoryId(null)} />
        <ReportNewsPage
          open={reportNewsOpen}
          onClose={() => setReportNewsOpen(false)}
          onPublished={handleNewsPublished}
        />
        <ReportNewsSuccessModal
          open={reportNewsSuccessOpen}
          onClose={() => setReportNewsSuccessOpen(false)}
        />
      </div>
    </div>
  );
}
