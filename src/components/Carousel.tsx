import { useState, useRef, useEffect, useCallback } from 'react';
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

const closeAt = (i: number, p: number) => Math.max(0, 1 - Math.abs(i - p));
const slotAt = (i: number, p: number) =>
  i < 0 || i > N - 1 ? SLOT_BASE : SLOT_BASE + (SLOT_MAX - SLOT_BASE) * closeAt(i, p);
const pitchAt = (k: number, p: number) => GAP + slotAt(k, p) / 2 + slotAt(k + 1, p) / 2;

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
  const NEWS_INDEX = SECTIONS.findIndex((s) => s.id === 'news');

  const [activeIndex, setActiveIndex] = useState(NEWS_INDEX);
  const [navAnimDone, setNavAnimDone] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const pitchRef = useRef(0);
  const activeIndexRef = useRef(NEWS_INDEX);
  const scrollRafRef = useRef(0);
  const scrollEndTimerRef = useRef(0);

  const measurePitch = useCallback(() => {
    const c0 = cardRefs.current[0];
    const c1 = cardRefs.current[1];
    if (!c0 || !c1) return;
    const pitch = Math.abs(c1.offsetLeft - c0.offsetLeft);
    if (pitch > 0) pitchRef.current = pitch;
  }, []);

  const getProgressFromScroll = useCallback(() => {
    const track = trackRef.current;
    const pitch = pitchRef.current;
    if (!track || !pitch) return activeIndexRef.current;

    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return 0;

    const sl = track.scrollLeft;
    const traveled = sl <= 0 ? -sl : max - sl;
    return clamp(traveled / pitch, 0, N - 1);
  }, []);

  const measureProgressExact = useCallback(() => {
    const track = trackRef.current;
    const c0 = cardRefs.current[0];
    const c1 = cardRefs.current[1];
    if (!track || !c0 || !c1) return activeIndexRef.current;

    const tr = track.getBoundingClientRect();
    const center = tr.left + tr.width / 2;
    const r0 = c0.getBoundingClientRect();
    const r1 = c1.getBoundingClientRect();
    const cen0 = r0.left + r0.width / 2;
    const cen1 = r1.left + r1.width / 2;
    const pitch = cen1 - cen0;
    if (!pitch) return activeIndexRef.current;
    return clamp((center - cen0) / pitch, 0, N - 1);
  }, []);

  const applyVisuals = useCallback((p: number) => {
    const active = clamp(Math.round(p), 0, N - 1);
    const indexChanged = active !== activeIndexRef.current;

    for (let i = 0; i < N; i++) {
      const card = cardRefs.current[i];
      if (card) {
        const cardFocus = closeAt(i, p);
        card.style.transform = `scale3d(1, ${0.8 + 0.2 * cardFocus}, 1)`;
        card.style.opacity = String(0.55 + 0.45 * cardFocus);
        if (indexChanged) {
          card.classList.toggle('is-active', i === active);
          card.dataset.inactive = i === active ? 'false' : 'true';
        }
      }

      const tab = tabRefs.current[i];
      const circle = circleRefs.current[i];
      const icon = iconRefs.current[i];
      const label = labelRefs.current[i];
      if (!tab || !circle || !icon) continue;

      const c = closeAt(i, p);
      const circleSize = CIRCLE_BASE + (CIRCLE_MAX - CIRCLE_BASE) * c;
      const x = offsetFromCenter(i, p);
      const y = (1 - c) * INACTIVE_DROP;

      tab.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`;
      circle.style.width = `${circleSize}px`;
      circle.style.height = `${circleSize}px`;
      icon.style.transform = `scale(${circleSize / CIRCLE_BASE})`;

      if (indexChanged) {
        tab.classList.toggle('is-active', i === active);
        if (i === active) tab.setAttribute('aria-current', 'true');
        else tab.removeAttribute('aria-current');
        if (label) label.style.display = i === active ? 'none' : 'block';
      }
    }

    if (indexChanged) {
      activeIndexRef.current = active;
      setActiveIndex(active);
    }
  }, []);

  useEffect(() => {
    cardRefs.current[NEWS_INDEX]?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
    requestAnimationFrame(() => {
      measurePitch();
      applyVisuals(NEWS_INDEX);
    });
  }, [NEWS_INDEX, applyVisuals, measurePitch]);

  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => setNavAnimDone(true), 1550);
    return () => clearTimeout(t);
  }, [isReady]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (!scrollRafRef.current) {
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = 0;
          applyVisuals(getProgressFromScroll());
        });
      }

      window.clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = window.setTimeout(() => {
        measurePitch();
        applyVisuals(measureProgressExact());
      }, 100);
    };

    const onResize = () => {
      measurePitch();
      applyVisuals(getProgressFromScroll());
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    measurePitch();
    applyVisuals(getProgressFromScroll());

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      window.clearTimeout(scrollEndTimerRef.current);
    };
  }, [applyVisuals, getProgressFromScroll, measurePitch, measureProgressExact]);

  const goTo = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <section className="carousel" dir="rtl">
      <div className="carousel-track" ref={trackRef}>
        {SECTIONS.map((section, i) => (
          <article
            key={section.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            data-index={i}
            data-inactive={i === activeIndex ? 'false' : 'true'}
            className={`carousel-card${i === activeIndex ? ' is-active' : ''}`}
            style={{ background: section.color }}
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
                <NewsCard onOpenDetails={onNewsOpen} isActive={i === activeIndex} />
              ) : section.hasVolunteer ? (
                <VolunteerCard isActive={i === activeIndex} />
              ) : section.hasPolls ? (
                <PollsCard isActive={i === activeIndex} />
              ) : section.hasEvents ? (
                <EventsCard isActive={i === activeIndex} />
              ) : section.hasMarketplace ? (
                <MarketplaceCard />
              ) : (
                <p className="carousel-card-placeholder text-small-normal">
                  בקרוב — תוכן ופרטים נוספים על {section.title}.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <nav className={`carousel-nav${isReady ? ' is-ready' : ''}${navAnimDone ? ' nav-anim-done' : ''}`} aria-label="ניווט בין הקטגוריות">
        {SECTIONS.map((section, i) => {
          const isActive = i === activeIndex;
          const distAbs = Math.abs(i - NEWS_INDEX);
          const NavComponent = section.Component;
          return (
            <button
              key={section.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              className={`carousel-tab${isActive ? ' is-active' : ''}`}
              style={{ '--dist-abs': distAbs } as React.CSSProperties}
              onClick={() => { setNavAnimDone(true); goTo(i); }}
              aria-label={section.title}
              aria-current={isActive ? true : undefined}
            >
              <span
                ref={(el) => { circleRefs.current[i] = el; }}
                className="carousel-tab-circle"
                style={{
                  '--tab-color': section.color,
                  '--x-offset': '0px',
                  '--dist-abs': distAbs,
                  width: CIRCLE_BASE,
                  height: CIRCLE_BASE,
                } as React.CSSProperties}
              >
                <span ref={(el) => { iconRefs.current[i] = el; }} className="carousel-tab-circle-icon">
                  <NavComponent isActive={isActive} />
                </span>
              </span>
              <span
                ref={(el) => { labelRefs.current[i] = el; }}
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
