import leviAvatarAnim from '../assets/volunteer-avatar-levi.json';
import rachelAvatarAnim from '../assets/volunteer-avatar-rachel.json';
import davidAvatarAnim from '../assets/volunteer-avatar-david.json';
import avrahamAvatarAnim from '../assets/volunteer-avatar-avraham.json';
import catToyBoxAnim from '../assets/cat-toy-box.json';
import catSmartphoneAnim from '../assets/cat-smartphone.json';
import catBicycleAnim from '../assets/cat-bicycle.json';
import catSofaAnim from '../assets/cat-sofa.json';
import catFootballAnim from '../assets/cat-football.json';
import catPaletteAnim from '../assets/cat-palette.json';
import catSparklesAnim from '../assets/cat-sparkles.json';

export type MarketplaceCategory =
  | 'all'
  | 'kids'
  | 'electric'
  | 'bikes'
  | 'furniture'
  | 'sport'
  | 'art'
  | 'other';

export type ListingCondition = 'new' | 'like-new' | 'used';

export type SortOption = 'newest' | 'price-asc' | 'views';

export type MarketplaceListing = {
  id: string;
  emoji: string;
  images?: string[];
  title: string;
  price: string;
  priceValue: number;
  free: boolean;
  category: Exclude<MarketplaceCategory, 'all'>;
  condition: ListingCondition;
  seller: string;
  avatar: object;
  views: number;
  time: string;
  postedAt: number;
  cta: string;
};

export type MarketplaceCategoryItem =
  | { id: MarketplaceCategory; label: string; emoji: string }
  | { id: MarketplaceCategory; label: string; lottie: object; idleFrame: number };

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryItem[] = [
  { id: 'all', lottie: catSparklesAnim, idleFrame: 69, label: 'בשבילך' },
  { id: 'kids', lottie: catToyBoxAnim, idleFrame: 100, label: 'ילדים' },
  { id: 'electric', lottie: catSmartphoneAnim, idleFrame: 69, label: 'חשמל' },
  { id: 'bikes', lottie: catBicycleAnim, idleFrame: 100, label: 'אופניים' },
  { id: 'furniture', lottie: catSofaAnim, idleFrame: 100, label: 'ריהוט' },
  { id: 'sport', lottie: catFootballAnim, idleFrame: 100, label: 'ספורט' },
  { id: 'art', lottie: catPaletteAnim, idleFrame: 100, label: 'אמנות' },
  { id: 'other', emoji: '📦', label: 'אחר' },
];

export const CONDITION_OPTIONS: { id: ListingCondition; label: string }[] = [
  { id: 'new', label: 'חדש' },
  { id: 'like-new', label: 'כמו חדש' },
  { id: 'used', label: 'משומש' },
];

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'חדש ביותר' },
  { id: 'price-asc', label: 'מחיר נמוך לגבוה' },
  { id: 'views', label: 'הכי נצפה' },
];

const DAY = 86400000;
const now = Date.now();

export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'bike',
    emoji: '🚲',
    images: ['/listing-bike-1.jpg', '/listing-bike-2.jpg', '/listing-bike-3.jpg'],
    title: 'אופני ילדים 16″',
    price: '₪120',
    priceValue: 120,
    free: false,
    category: 'bikes',
    condition: 'like-new',
    seller: 'משפחת לוי',
    avatar: leviAvatarAnim,
    views: 43,
    time: 'לפני שעה',
    postedAt: now - 3600000,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'sofa',
    emoji: '🛋️',
    images: ['/listing-sofa-1.webp', '/listing-sofa-2.webp', '/listing-sofa-3.jpg'],
    title: 'ספה תלת-מושבית אפורה',
    price: '₪450',
    priceValue: 450,
    free: false,
    category: 'furniture',
    condition: 'used',
    seller: 'דנה כהן',
    avatar: rachelAvatarAnim,
    views: 156,
    time: 'לפני 4 שעות',
    postedAt: now - 4 * 3600000,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'stroller',
    emoji: '👶',
    images: ['/listing-stroller-1.jpg', '/listing-stroller-2.jpg', '/listing-stroller-3.jpg'],
    title: 'עגלת תינוק במצב מצוין',
    price: '₪300',
    priceValue: 300,
    free: false,
    category: 'kids',
    condition: 'like-new',
    seller: 'משפחת מזרחי',
    avatar: davidAvatarAnim,
    views: 327,
    time: 'אתמול',
    postedAt: now - DAY,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'heater',
    emoji: '🔥',
    title: 'מפזר חום לחורף',
    price: '₪80',
    priceValue: 80,
    free: false,
    category: 'electric',
    condition: 'used',
    seller: 'יוסי אברהם',
    avatar: avrahamAvatarAnim,
    views: 61,
    time: 'לפני יומיים',
    postedAt: now - 2 * DAY,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'ball',
    emoji: '⚽',
    title: 'כדורגל + משקולות יד',
    price: '₪60',
    priceValue: 60,
    free: false,
    category: 'sport',
    condition: 'used',
    seller: 'עידו שמש',
    avatar: leviAvatarAnim,
    views: 28,
    time: 'לפני 3 ימים',
    postedAt: now - 3 * DAY,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'baby-clothes',
    emoji: '👕',
    images: [
      '/baby thing/725085039_27380358251583605_5495266966152367353_n.jpg',
      '/baby thing/726317919_27380358248250272_7663020806734629934_n.jpg',
      '/baby thing/727621041_27380358241583606_2331646136757046882_n.jpg',
    ],
    title: 'בגדי תינוקות גיל 0–6',
    price: 'חינם',
    priceValue: 0,
    free: true,
    category: 'kids',
    condition: 'like-new',
    seller: 'מיכל רוזן',
    avatar: rachelAvatarAnim,
    views: 89,
    time: 'לפני 5 שעות',
    postedAt: now - 5 * 3600000,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'books',
    emoji: '📚',
    title: 'ספרי ילדים בעברית — מארז',
    price: 'חינם',
    priceValue: 0,
    free: true,
    category: 'kids',
    condition: 'used',
    seller: 'משפחת כהן',
    avatar: davidAvatarAnim,
    views: 52,
    time: 'אתמול',
    postedAt: now - DAY,
    cta: 'לפרטים ויצירת קשר',
  },
  {
    id: 'shelf',
    emoji: '🗄️',
    title: 'מדף קיר מעץ — למסירה',
    price: 'חינם',
    priceValue: 0,
    free: true,
    category: 'furniture',
    condition: 'used',
    seller: 'רונית לוי',
    avatar: avrahamAvatarAnim,
    views: 114,
    time: 'לפני יומיים',
    postedAt: now - 2 * DAY,
    cta: 'לפרטים ויצירת קשר',
  },
];

export type MarketplaceFilters = {
  priceMin: string;
  priceMax: string;
  conditions: ListingCondition[];
  sort: SortOption;
};

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  priceMin: '',
  priceMax: '',
  conditions: [],
  sort: 'newest',
};

export function filtersAreActive(filters: MarketplaceFilters) {
  return (
    filters.priceMin.trim() !== '' ||
    filters.priceMax.trim() !== '' ||
    filters.conditions.length > 0 ||
    filters.sort !== 'newest'
  );
}

export function filterMarketplaceListings(
  listings: MarketplaceListing[],
  {
    tab,
    category,
    query,
    filters,
  }: {
    tab: 'sale' | 'giveaway';
    category: Exclude<MarketplaceCategory, 'all'>;
    query: string;
    filters: MarketplaceFilters;
  }
) {
  const q = query.trim();
  const min = filters.priceMin.trim() ? Number(filters.priceMin) : null;
  const max = filters.priceMax.trim() ? Number(filters.priceMax) : null;

  let result = listings.filter((listing) => {
    if (tab === 'giveaway' ? !listing.free : listing.free) return false;
    if (listing.category !== category) return false;
    if (q && !listing.title.includes(q) && !listing.seller.includes(q)) return false;
    if (filters.conditions.length > 0 && !filters.conditions.includes(listing.condition)) return false;
    if (min !== null && !Number.isNaN(min) && listing.priceValue < min) return false;
    if (max !== null && !Number.isNaN(max) && listing.priceValue > max) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === 'price-asc') return a.priceValue - b.priceValue;
    if (filters.sort === 'views') return b.views - a.views;
    return b.postedAt - a.postedAt;
  });

  return result;
}

export type RecommendationGroupId =
  | 'top-pick'
  | 'nearby'
  | 'interest'
  | 'price'
  | 'fresh'
  | 'explore';

const RECOMMENDATION_GROUP_META: Record<
  RecommendationGroupId,
  { title: string; subtitle: string; order: number }
> = {
  'top-pick': { title: 'ממש בשבילך', subtitle: 'נבחר במיוחד עבורך', order: 0 },
  nearby: { title: 'קרוב אליך', subtitle: 'בשכונה שלך', order: 1 },
  interest: { title: 'לפי מה שמעניין אותך', subtitle: 'מה שחיפשת ועקבת אחריו', order: 2 },
  price: { title: 'בתקציב שלך', subtitle: 'במחיר שחיפשת לאחרונה', order: 3 },
  fresh: { title: 'חדש עכשיו', subtitle: 'פורסם לאחרונה', order: 4 },
  explore: { title: 'אולי גם תאהב', subtitle: 'הצעות דומות', order: 5 },
};

export type MarketplaceRecommendation = {
  listingId: string;
  group: RecommendationGroupId;
  reason: string;
  rank: number;
};

const FOR_YOU_SALE_RECOMMENDATIONS: MarketplaceRecommendation[] = [
  { listingId: 'stroller', group: 'top-pick', reason: 'כי חיפשת עגלות בשבוע האחרון', rank: 1 },
  { listingId: 'sofa', group: 'top-pick', reason: 'כי עקבת אחרי ריהוט לסלון', rank: 2 },
  { listingId: 'bike', group: 'nearby', reason: '3 דקות הליכה ממך · בניין 2', rank: 3 },
  { listingId: 'heater', group: 'nearby', reason: 'באותה שכונה · פורסם אתמול', rank: 4 },
  { listingId: 'ball', group: 'price', reason: 'במחיר שחיפשת (עד ₪80)', rank: 5 },
];

export type ForYouSection = {
  id: RecommendationGroupId;
  title: string;
  subtitle: string;
  items: { listing: MarketplaceListing; reason: string }[];
};

export function getForYouSections(tab: 'sale' | 'giveaway'): ForYouSection[] {
  const recs = tab === 'sale' ? FOR_YOU_SALE_RECOMMENDATIONS : [];
  const listingMap = new Map(MARKETPLACE_LISTINGS.map((listing) => [listing.id, listing]));

  const grouped = new Map<RecommendationGroupId, { listing: MarketplaceListing; reason: string; rank: number }[]>();
  const usedListingIds = new Set<string>();

  recs
    .sort((a, b) => a.rank - b.rank)
    .forEach((rec) => {
      const listing = listingMap.get(rec.listingId);
      if (!listing || usedListingIds.has(listing.id)) return;
      if (tab === 'giveaway' ? !listing.free : listing.free) return;

      usedListingIds.add(listing.id);
      const bucket = grouped.get(rec.group) ?? [];
      bucket.push({ listing, reason: rec.reason, rank: rec.rank });
      grouped.set(rec.group, bucket);
    });

  return (Object.keys(RECOMMENDATION_GROUP_META) as RecommendationGroupId[])
    .sort((a, b) => RECOMMENDATION_GROUP_META[a].order - RECOMMENDATION_GROUP_META[b].order)
    .flatMap((groupId) => {
      const items = grouped.get(groupId);
      if (!items?.length) return [];

      const meta = RECOMMENDATION_GROUP_META[groupId];
      return [{
        id: groupId,
        title: meta.title,
        subtitle: meta.subtitle,
        items: [...items]
          .sort((a, b) => a.rank - b.rank)
          .map(({ listing, reason }) => ({ listing, reason })),
      }];
    });
}

export function countForYouListings(tab: 'sale' | 'giveaway') {
  return getForYouSections(tab).reduce((sum, section) => sum + section.items.length, 0);
}

export function getGiveawayListings() {
  return [...MARKETPLACE_LISTINGS]
    .filter((listing) => listing.free)
    .sort((a, b) => b.postedAt - a.postedAt);
}
