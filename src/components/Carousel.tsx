import { useState, useRef, useEffect } from 'react';
import NewsNav from './NewsNav';
import VolunteerNav from './VolunteerNav';
import PollsNav from './PollsNav';
import EventsNav from './EventsNav';
import MarketplaceNav from './MarketplaceNav';
import NewsCard from './NewsCard';
import VolunteerCard from './VolunteerCard';
import PollsCard from './PollsCard';
import EventsCard from './EventsCard';
import MarketplaceCard from './MarketplaceCard';
import './Carousel.css';

const SECTIONS = [
  { id: 'polls',      title: 'הצבעות',          ctaLabel: 'לכל הסקרים',  navLabel: 'תצביע, תשפיע',  color: '#D8C5FF', hasPolls: true,     Component: PollsNav },
  { id: 'volunteer',  title: 'התנדבות',         ctaLabel: 'לכל הבקשות',  navLabel: 'התנדבות',       color: '#FFC9D9', hasVolunteer: true, Component: VolunteerNav },
  { id: 'news',        title: 'עדכונים',        ctaLabel: 'לעדכונים ישנים', navLabel: 'עדכונים',       color: '#CEFF7E', hasNews: true,      Component: NewsNav },
  { id: 'events',     title: 'אירועים',  ctaLabel: 'לכל האירועים', navLabel: 'אירועים',       color: '#C3ECF6', hasEvents: true,    Component: EventsNav },
  { id: 'marketplace',title: 'מרקטפלייס', ctaLabel: 'לכל המודעות', navLabel: 'מרקטפלייס',     color: '#FFD4A8', hasMarketplace: true, Component: MarketplaceNav },
];

const N = SECTIONS.length;
const CIRCLE_BASE = 56;
const CIRCLE_MAX = 108;
const SLOT_BASE = 72;
const SLOT_MAX = 124;
const GAP = 12;
const INACTIVE_DROP = 24;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// How "focused" circle i is for a given continuous progress p (1 at center, 0 once a full step away)
const closeAt = (i: number, p: number) => Math.max(0, 1 - Math.abs(i - p));
const slotAt = (i: number, p: number) =>
  i < 0 || i > N - 1 ? SLOT_BASE : SLOT_BASE + (SLOT_MAX - SLOT_BASE) * closeAt(i, p);
const pitchAt = (k: number, p: number) => GAP + slotAt(k, p) / 2 + slotAt(k + 1, p) / 2;

// Screen-x offset of circle i from the centered position (+ = right). Higher index sits to the left (RTL).
const offsetFromCenter = (i: number, p: number) => {
  if (i === p) return 0;
  let sum = 0;
  if (i > p) {
    let s = p;
    while (s < i) {
      const next = Math.min(Math.floor(s) + 1, i);
      sum += pitchAt(Math.floor(s), p) * (next - s);
      s = next;
    }
    return -sum;
  }
  let s = p;
  while (s > i) {
    const prev = Math.max(Math.ceil(s) - 1, i);
    sum += pitchAt(prev, p) * (s - prev);
    s = prev;
  }
  return sum;
};

interface CarouselProps {
  isReady?: boolean;
  onEventsOpen?: () => void;
  onMarketplaceOpen?: () => void;
  onNewsOpen?: (id: string) => void;
}

export default function Carousel({ isReady = false, onEventsOpen, onMarketplaceOpen, onNewsOpen }: CarouselProps) {
  const [progress, setProgress] = useState(0);
  const [navAnimDone, setNavAnimDone] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const activeIndex = clamp(Math.round(progress), 0, N - 1);

  // Continuous progress read straight from the cards' real positions — RTL-safe.
  const measureProgress = () => {
    const track = trackRef.current;
    const c0 = cardRefs.current[0];
    const c1 = cardRefs.current[1];
    if (!track || !c0 || !c1) return 0;
    const tr = track.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    const r0 = c0.getBoundingClientRect();
    const r1 = c1.getBoundingClientRect();
    const cen0 = r0.left + r0.width / 2;
    const cen1 = r1.left + r1.width / 2;
    const pitch = cen1 - cen0;
    if (!pitch) return 0;
    return clamp((center - cen0) / pitch, 0, N - 1);
  };

  const NEWS_INDEX = SECTIONS.findIndex(s => s.id === 'news');


  useEffect(() => {
    cardRefs.current[NEWS_INDEX]?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => setNavAnimDone(true), 1550);
    return () => clearTimeout(t);
  }, [isReady]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setProgress(measureProgress());
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    setProgress(measureProgress());
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <section className="carousel" dir="rtl">
      <div className="carousel-track" ref={trackRef}>
        {SECTIONS.map((section, i) => {
          const cardFocus = closeAt(i, progress);
          const cardScale = 0.8 + 0.2 * cardFocus;

          return (
            <article
              key={section.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              data-index={i}
              className={`carousel-card${i === activeIndex ? ' is-active' : ''}`}
              style={{
                background: section.color,
                transform: `scaleY(${cardScale})`,
              }}
              onClick={() => i !== activeIndex && goTo(i)}
            >
              <header className="carousel-card-header">
                <h3 className="carousel-card-title text-h2-bold">{section.title}</h3>
                <button
                  type="button"
                  className="btn-secondary carousel-card-cta text-small-thin"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (section.id === 'events') onEventsOpen?.();
                    else if (section.id === 'marketplace') onMarketplaceOpen?.();
                  }}
                  aria-label={section.ctaLabel}
                >
                  {section.ctaLabel}
                </button>
              </header>
              <div className={`carousel-card-body${section.hasVolunteer ? ' is-full-bleed' : ''}${section.hasNews ? ' is-centered' : ''}${section.hasPolls ? ' is-polls' : ''}`}>
                {section.hasNews ? (
                  <NewsCard onOpenDetails={onNewsOpen} />
                ) : section.hasVolunteer ? (
                  <VolunteerCard />
                ) : section.hasPolls ? (
                  <PollsCard isActive={i === activeIndex} />
                ) : section.hasEvents ? (
                  <EventsCard />
                ) : section.hasMarketplace ? (
                  <MarketplaceCard />
                ) : (
                  <p className="carousel-card-placeholder text-small-normal">
                    בקרוב — תוכן ופרטים נוספים על {section.title}.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <nav className={`carousel-nav${isReady ? ' is-ready' : ''}${navAnimDone ? ' nav-anim-done' : ''}`} aria-label="ניווט בין הקטגוריות">
        {SECTIONS.map((section, i) => {
          const c = closeAt(i, progress);
          const isActive = i === activeIndex;
          const circleSize = CIRCLE_BASE + (CIRCLE_MAX - CIRCLE_BASE) * c;
          const iconScale = circleSize / CIRCLE_BASE;
          const x = offsetFromCenter(i, progress);
          const y = (1 - c) * INACTIVE_DROP;
          const distAbs = Math.abs(i - NEWS_INDEX);
          const NavComponent = section.Component;
          return (
            <button
              key={section.id}
              type="button"
              className={`carousel-tab${isActive ? ' is-active' : ''}`}
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, '--dist-abs': distAbs } as React.CSSProperties}
              onClick={() => { setNavAnimDone(true); goTo(i); }}
              aria-label={section.title}
              aria-current={isActive}
            >
              <span
                className="carousel-tab-circle"
                style={{
                  '--tab-color': section.color,
                  '--x-offset': `${x}px`,
                  '--dist-abs': distAbs,
                  width: circleSize,
                  height: circleSize,
                } as React.CSSProperties}
              >
                <span
                  className="carousel-tab-circle-icon"
                  style={{ transform: `scale(${iconScale})` }}
                >
                  <NavComponent isActive={isActive} />
                </span>
              </span>
              <span
                className="carousel-tab-label text-tiny-normal"
                style={{ display: isActive ? 'none' : 'block' }}
              >
                {section.navLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
