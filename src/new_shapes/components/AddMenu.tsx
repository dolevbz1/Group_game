import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import eventsAnimation from '../assets/add-events-calendar.json';
import newsAnimation from '../assets/add-news-megaphone.json';
import pollsAnimation from '../assets/add-polls-bar-chart.json';
import marketplaceAnimation from '../assets/add-marketplace-shop.json';
import volunteerAnimation from '../assets/add-volunteer-heart-wings.json';
import './AddMenu.css';

type AddItem = {
  id: 'news' | 'events' | 'polls' | 'volunteer' | 'marketplace';
  label: string;
  animation: object;
  segment: [number, number];
};

const ADD_ITEMS: AddItem[] = [
  { id: 'news', label: 'עדכון חדש', animation: newsAnimation, segment: [0, 60] },
  { id: 'events', label: 'אירוע חדש', animation: eventsAnimation, segment: [0, 65] },
  { id: 'polls', label: 'סקר חדש', animation: pollsAnimation, segment: [0, 90] },
  { id: 'volunteer', label: 'בקשת התנדבות חדשה', animation: volunteerAnimation, segment: [0, 90] },
  { id: 'marketplace', label: 'מוצר חדש במרקטפלייס', animation: marketplaceAnimation, segment: [0, 60] },
];

type AddMenuProps = {
  open: boolean;
  onClose: () => void;
  onNewsReport?: () => void;
};

const THEME_META = () => document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

export default function AddMenu({ open, onClose, onNewsReport }: AddMenuProps) {
  const [listKey, setListKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setListKey((key) => key + 1);
  }, [open]);

  useEffect(() => {
    const meta = THEME_META();
    if (!meta) return;
    meta.content = open ? '#ffffff' : '#F5F5F5';
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div className={`add-root${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="add-backdrop" onClick={onClose} />
      <div className="add-sheet" dir="rtl" role="dialog" aria-label="הוספה">
        <div className="add-head">
          <h2 className="add-title text-h2-bold">מה להוסיף?</h2>
          <button type="button" className="add-close text-small-bold" onClick={onClose}>
            סגירה
          </button>
        </div>

        <div className="add-list" key={listKey}>
          {ADD_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`add-row add-row--${item.id}`}
              onClick={() => {
                onClose();
                if (item.id === 'news') onNewsReport?.();
              }}
            >
              <span className="add-row-icon" aria-hidden="true">
                <Lottie
                  animationData={item.animation}
                  initialSegment={item.segment}
                  loop={false}
                  autoplay
                  className="add-row-lottie"
                />
              </span>
              <span className="add-row-label text-small-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
