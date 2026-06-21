import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import QuickActions from './components/QuickActions';
import AddMenu from './components/AddMenu';
import AIBot from './components/AIBot';
import Profile from './components/Profile';
import EventsPage from './components/EventsPage';
import MarketplacePage from './components/MarketplacePage';
import NewsDetailPage from './components/NewsDetailPage';
import LoadingScreen from './components/LoadingScreen';
import GateSuccessModal from './components/GateSuccessModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [aiBotOpen, setAiBotOpen] = useState(false);
  const [searchRect, setSearchRect] = useState<DOMRect | null>(null);
  const [botInitialMessage, setBotInitialMessage] = useState<string | undefined>();
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarRect, setAvatarRect] = useState<DOMRect | null>(null);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [newsDetailOpen, setNewsDetailOpen] = useState(false);
  const [newsDetailId, setNewsDetailId] = useState<string | null>(null);

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
            onNewsOpen={(id) => {
              setNewsDetailId(id);
              setNewsDetailOpen(true);
            }}
          />
        </div>
        <QuickActions open={quickActionsOpen} onClose={() => setQuickActionsOpen(false)} onGateOpen={() => setGateOpen(true)} />
        <AddMenu open={addMenuOpen} onClose={() => setAddMenuOpen(false)} />
        <GateSuccessModal open={gateOpen} onClose={() => setGateOpen(false)} />
        <AIBot open={aiBotOpen} startRect={searchRect} onClose={() => { setAiBotOpen(false); setBotInitialMessage(undefined); }} initialMessage={botInitialMessage} />
        <Profile open={profileOpen} startRect={avatarRect} onClose={() => setProfileOpen(false)} />
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
      </div>
    </div>
  );
}
