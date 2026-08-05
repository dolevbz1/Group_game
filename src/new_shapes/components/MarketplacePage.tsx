import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import shoppingAnim from '../assets/marketplace-shopping.json';
import { IconButton, CloseIcon, AiSparkleIcon } from './IconButton';
import MarketplaceFilterSheet from './MarketplaceFilterSheet';
import {
  countForYouListings,
  DEFAULT_MARKETPLACE_FILTERS,
  filterMarketplaceListings,
  filtersAreActive,
  getForYouSections,
  getGiveawayListings,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_LISTINGS,
  MarketplaceCategory,
  MarketplaceCategoryItem,
  MarketplaceFilters,
  MarketplaceListing,
} from '../data/marketplaceListings';
import './MarketplacePage.css';

const SCREEN_COLOR = '#E9F8EE';
const AI_PROMO_DISMISSED_KEY = 'marketplace-free-ai-promo-dismissed';

type MarketplacePageProps = {
  open: boolean;
  onClose: () => void;
  onOpenFreeItemsAutomation: () => void;
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

function CategoryButton({
  item,
  active,
  onSelect,
}: {
  item: MarketplaceCategoryItem;
  active: boolean;
  onSelect: () => void;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const hasLottie = 'lottie' in item;

  const playLottie = () => {
    lottieRef.current?.goToAndPlay(0);
  };

  return (
    <button
      type="button"
      role="listitem"
      className={`marketplace-cat${active ? ' is-active' : ''}${hasLottie ? ' has-lottie' : ''}`}
      onClick={() => {
        onSelect();
        playLottie();
      }}
      onMouseEnter={() => {
        if (hasLottie) playLottie();
      }}
    >
      {hasLottie ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={item.lottie}
          loop={false}
          autoplay={false}
          onDOMLoaded={() => lottieRef.current?.goToAndStop(item.idleFrame, true)}
          className="marketplace-cat-lottie"
        />
      ) : (
        <span className="marketplace-cat-emoji" aria-hidden="true">{item.emoji}</span>
      )}
      <span className="marketplace-cat-label text-tiny-normal">{item.label}</span>
    </button>
  );
}

function ListingRow({ listing, reason }: { listing: MarketplaceListing; reason?: string }) {
  const [pressed, setPressed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const thumb = listing.images?.[0];

  return (
    <button
      type="button"
      className={`marketplace-row${pressed ? ' is-pressed' : ''}${reason ? ' has-reason' : ''}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      <span className="marketplace-row-thumb">
        {thumb && !imgFailed ? (
          <img
            src={thumb}
            alt=""
            className="marketplace-row-photo"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="marketplace-row-emoji" aria-hidden="true">{listing.emoji}</span>
        )}
      </span>
      <span className="marketplace-row-text">
        <span className="marketplace-row-title text-small-bold">{listing.title}</span>
        <span className={`marketplace-row-price text-small-normal${listing.free ? ' is-free' : ''}`}>
          {listing.price}
        </span>
        {reason ? (
          <span className="marketplace-row-reason text-tiny-normal">
            <span className="marketplace-row-reason-mark" aria-hidden="true">✦</span>
            {reason}
          </span>
        ) : (
          <span className="marketplace-row-meta text-tiny-normal">
            {listing.seller} · {listing.time}
          </span>
        )}
        {reason && (
          <span className="marketplace-row-meta text-tiny-normal">
            {listing.seller} · {listing.time}
          </span>
        )}
      </span>
      <span className="marketplace-row-avatar" aria-hidden="true">
        <Lottie animationData={listing.avatar} loop={false} autoplay className="marketplace-row-avatar-lottie" />
      </span>
    </button>
  );
}

function FreeItemsAiPromo({
  visible,
  onOpenAutomation,
  onDismiss,
}: {
  visible: boolean;
  onOpenAutomation: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      className={`marketplace-ai-promo${visible ? ' is-visible' : ''}`}
      role="note"
      aria-hidden={!visible}
      aria-label="הצעה להפעלת אוטומציה"
    >
      <button
        type="button"
        className="marketplace-ai-promo-dismiss"
        aria-label="סגירת ההודעה"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
      <div className="marketplace-ai-promo-body">
        <span className="marketplace-ai-promo-icon" aria-hidden="true">
          <AiSparkleIcon className="marketplace-ai-promo-icon-svg" />
        </span>
        <span className="marketplace-ai-promo-copy">
          <strong className="marketplace-ai-promo-title text-medium-bold">
            פריטים חינם מתפרסמים כל הזמן
          </strong>
          <span className="marketplace-ai-promo-text text-small-normal">
            תנו לעוזר החכם לעדכן אתכם ברגע שמתפרסם, נוסף או מתחדש פריט חינם במרקטפלייס.
          </span>
        </span>
      </div>
      <button
        type="button"
        className="marketplace-ai-promo-cta text-small-bold"
        data-hook="marketplace-ai-promo-cta"
        onClick={onOpenAutomation}
      >
        <AiSparkleIcon className="marketplace-ai-promo-cta-icon" />
        להפעיל התראה על פריטים חינם
      </button>
    </div>
  );
}

function ForYouFeed({ tab }: { tab: 'sale' | 'giveaway' }) {
  const sections = useMemo(() => getForYouSections(tab), [tab]);
  const totalCount = useMemo(() => countForYouListings(tab), [tab]);

  if (sections.length === 0) {
    return (
      <div className="marketplace-for-you-empty">
        <p className="marketplace-for-you-empty-title text-medium-bold">עדיין לומדים מה מעניין אותך</p>
        <p className="marketplace-for-you-empty-text text-small-normal">
          חפשו, עקבו אחרי קטגוריות — ונשפר את ההמלצות עבורכם.
        </p>
      </div>
    );
  }

  return (
    <div className="marketplace-for-you">
      <header className="marketplace-for-you-head">
        <h2 className="marketplace-for-you-title text-small-bold">בשבילך</h2>
        <p className="marketplace-for-you-sub text-tiny-normal">
          מודעות שנבחרו עבורך לפי העניין, השכונה והפעילות שלך
        </p>
        <p className="marketplace-for-you-meta text-tiny-normal">
          מעודכן היום · {totalCount} מודעות
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="marketplace-for-you-section">
          <div className="marketplace-for-you-section-head">
            <h3 className="marketplace-for-you-section-title text-small-bold">{section.title}</h3>
            <p className="marketplace-for-you-section-sub text-tiny-normal">{section.subtitle}</p>
          </div>
          <div className="marketplace-list">
            {section.items.map(({ listing, reason }) => (
              <ListingRow key={`${section.id}-${listing.id}`} listing={listing} reason={reason} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function MarketplacePage({
  open,
  onClose,
  onOpenFreeItemsAutomation,
}: MarketplacePageProps) {
  const [activeTab, setActiveTab] = useState<'sale' | 'giveaway'>('giveaway');
  const [category, setCategory] = useState<MarketplaceCategory>('all');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(
    () => localStorage.getItem(AI_PROMO_DISMISSED_KEY) === '1'
  );
  const saleTabLottieRef = useRef<LottieRefCurrentProps>(null);

  const handleDismissPromo = () => {
    setPromoDismissed(true);
    localStorage.setItem(AI_PROMO_DISMISSED_KEY, '1');
  };

  const isSaleTab = activeTab === 'sale';
  const isForYou = isSaleTab && category === 'all';

  const giveawayListings = useMemo(() => getGiveawayListings(), []);

  const results = useMemo(() => {
    if (!isSaleTab || isForYou) return [];

    return filterMarketplaceListings(MARKETPLACE_LISTINGS, {
      tab: 'sale',
      category,
      query,
      filters,
    });
  }, [isSaleTab, isForYou, category, query, filters]);

  const hasActiveFilters = filtersAreActive(filters);

  useEffect(() => {
    if (!open) return;
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute('content') ?? null;
    meta?.setAttribute('content', SCREEN_COLOR);
    return () => {
      if (prev !== null) meta?.setAttribute('content', prev);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !filterOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filterOpen, onClose]);

  return (
    <div className={`marketplace-page${open ? ' is-open' : ''}`} dir="rtl" aria-hidden={!open}>
      <div className="marketplace-page-top">
        <IconButton ariaLabel="סגירה" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <h1 className="marketplace-page-title text-small-bold">מרקטפלייס</h1>
        <div className="marketplace-page-spacer" />
      </div>

      <div className="marketplace-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'giveaway'}
          className={`marketplace-tab text-medium-normal${activeTab === 'giveaway' ? ' is-active' : ''}`}
          onClick={() => {
            setActiveTab('giveaway');
            setFilterOpen(false);
          }}
        >
          <img
            src="/icons/lucide/gift.svg"
            alt=""
            className="marketplace-tab-icon"
            aria-hidden="true"
          />
          בחינם
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sale'}
          className={`marketplace-tab text-medium-normal${activeTab === 'sale' ? ' is-active' : ''}`}
          onClick={() => {
            setActiveTab('sale');
            saleTabLottieRef.current?.playSegments([70, 130], true);
          }}
        >
          <Lottie
            lottieRef={saleTabLottieRef}
            animationData={shoppingAnim}
            loop={false}
            autoplay={false}
            onDOMLoaded={() => saleTabLottieRef.current?.goToAndStop(69, true)}
            className="marketplace-tab-icon marketplace-tab-icon--flip"
          />
          למכירה
        </button>
      </div>

      {isSaleTab && (
        <div className="marketplace-sale-tools">
          <div className="marketplace-toolbar">
            <label className="marketplace-search">
              <SearchIcon />
              <input
                type="search"
                className="marketplace-search-input text-small-normal"
                placeholder="חיפוש מוצר..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={`marketplace-filter-btn${hasActiveFilters ? ' has-badge' : ''}`}
              aria-label="סינון"
              onClick={() => setFilterOpen(true)}
            >
              <FilterIcon />
            </button>
          </div>

          <div className="marketplace-categories" role="list">
            {MARKETPLACE_CATEGORIES.map((item, index) => (
              <Fragment key={item.id}>
                <CategoryButton
                  item={item}
                  active={category === item.id}
                  onSelect={() => setCategory(item.id)}
                />
                {index === 0 && <div className="marketplace-cat-divider" aria-hidden="true" />}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <div
        className={`marketplace-page-body${isSaleTab ? ' is-sale' : ' is-giveaway'}${
          !isSaleTab && !promoDismissed ? ' has-floating-promo' : ''
        }`}
      >
        {isForYou ? (
          <ForYouFeed tab="sale" />
        ) : !isSaleTab ? (
          giveawayListings.length > 0 ? (
            <div className="marketplace-list">
              {giveawayListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="marketplace-empty text-medium-normal">אין מודעות בחינם כרגע</p>
          )
        ) : results.length > 0 ? (
          <div className="marketplace-list">
            {results.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="marketplace-empty text-medium-normal">
            לא נמצאו מודעות — נסו לשנות חיפוש או סינון
          </p>
        )}
      </div>

      {!isSaleTab && (
        <FreeItemsAiPromo
          visible={!promoDismissed}
          onOpenAutomation={onOpenFreeItemsAutomation}
          onDismiss={handleDismissPromo}
        />
      )}

      <MarketplaceFilterSheet
        open={filterOpen && isSaleTab}
        filters={filters}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
}
