import { useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import arrowRightAnim from '../assets/arrow-right.json';
import { MARKETPLACE_LISTINGS } from '../data/marketplaceListings';
import { overridePrimaryColor, BLACK } from '../utils/lottieColor';
import './MarketplaceCard.css';

const navArrowAnim = overridePrimaryColor(arrowRightAnim, BLACK);

const LISTINGS = MARKETPLACE_LISTINGS.filter((listing) => !listing.free);

function EyeIcon() {
  return (
    <svg className="market-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="market-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function NavButton({
  side,
  label,
  onActivate,
}: {
  side: 'prev' | 'next';
  label: string;
  onActivate: () => void;
}) {
  const ref = useRef<LottieRefCurrentProps>(null);
  const handleClick = () => {
    onActivate();
    ref.current?.playSegments([140, 200], true);
  };
  return (
    <button
      type="button"
      className={`market-ticket-nav market-ticket-nav--${side}`}
      onClick={handleClick}
      aria-label={label}
    >
      <Lottie
        lottieRef={ref}
        animationData={navArrowAnim}
        loop={false}
        autoplay={false}
        onDOMLoaded={() => ref.current?.goToAndStop(60, true)}
        className="market-ticket-nav-icon"
      />
    </button>
  );
}

function ListingHero({ listing }: { listing: (typeof LISTINGS)[number] }) {
  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const images = listing.images ?? [];
  const hasCarousel = images.length > 0 && !imgFailed;
  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div className="market-ticket-image">
      {hasCarousel ? (
        <>
          {images.map((src, i) => (
            <img
              key={src}
              className={`market-ticket-photo${i === index ? ' is-active' : ''}`}
              src={src}
              alt={listing.title}
              onError={() => setImgFailed(true)}
            />
          ))}
          <div className="market-ticket-scrim" aria-hidden="true" />
          {images.length > 1 && (
            <>
              <NavButton side="prev" label="התמונה הקודמת" onActivate={() => go(-1)} />
              <NavButton side="next" label="התמונה הבאה" onActivate={() => go(1)} />
              <div className="market-ticket-dots">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`market-ticket-dot${i === index ? ' is-active' : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`תמונה ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <span className="market-ticket-emoji">{listing.emoji}</span>
      )}
    </div>
  );
}

function MarketplaceTicket({ listing }: { listing: (typeof LISTINGS)[number] }) {
  return (
    <article className="market-ticket">
      <ListingHero listing={listing} />

      <div className="market-ticket-content">
        <div className="market-ticket-titlerow">
          <p className="market-ticket-title text-medium-bold">{listing.title}</p>
          <span className={`market-ticket-price${listing.free ? ' is-free' : ''}`}>
            {listing.price}
          </span>
        </div>

        <div className="market-ticket-seller">
          <span className="market-ticket-avatar" aria-hidden="true">
            <Lottie animationData={listing.avatar} loop={false} autoplay className="market-ticket-avatar-lottie" />
          </span>
          <div className="market-ticket-seller-text">
            <span className="market-ticket-seller-name text-small-normal">{listing.seller}</span>
            <p className="market-ticket-meta text-tiny-normal">
              <ClockIcon />
              <span>{listing.time}</span>
              <span className="market-ticket-meta-sep">·</span>
              <EyeIcon />
              <span>{listing.views} צפיות</span>
            </p>
          </div>
        </div>
      </div>

      <button type="button" className="market-ticket-cta text-medium-normal">
        {listing.cta}
      </button>
    </article>
  );
}

export default function MarketplaceCard() {
  return (
    <div className="market-body" dir="rtl">
      {LISTINGS.map((listing) => (
        <MarketplaceTicket key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
