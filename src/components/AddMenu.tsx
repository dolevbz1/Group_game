import { useEffect, useState } from 'react';
import './AddMenu.css';

type AddItem = {
  id: 'news' | 'events' | 'polls' | 'volunteer' | 'marketplace';
  label: string;
  Icon: () => React.ReactElement;
};

function AddMenuIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="add-row-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function HomePinchIcon() {
  return (
    <AddMenuIcon>
      <path
        fill="#121331"
        d="M19.5 8.329a.25.25 0 0 0-.125-.217l-7.25-4.174a.25.25 0 0 0-.25 0l-7.25 4.174a.25.25 0 0 0-.125.217V19.25c0 .139.112.25.25.25h4a.25.25 0 0 0 .25-.25v-5.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v5.5c0 .139.112.25.25.25h4a.25.25 0 0 0 .25-.25zM21 19.25A1.75 1.75 0 0 1 19.25 21h-4a1.75 1.75 0 0 1-1.75-1.75V14.5h-3v4.75A1.75 1.75 0 0 1 8.75 21h-4A1.75 1.75 0 0 1 3 19.25V8.33c0-.626.334-1.205.877-1.517l7.25-4.174a1.75 1.75 0 0 1 1.746 0l7.25 4.174c.543.312.877.89.877 1.517z"
      />
    </AddMenuIcon>
  );
}

function CalendarHoverIcon() {
  return (
    <svg
      className="add-row-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      aria-hidden="true"
    >
      <path stroke="#121331" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M4.5 8.75h16" />
      <path stroke="#121331" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 2.75v2m8-2v2" />
      <rect width="16.5" height="15.5" x="4.25" y="4.75" stroke="#121331" strokeWidth="1.5" rx="1" />
      <circle cx="8.5" cy="16.5" r="1" fill="#121331" />
      <circle cx="12.5" cy="16.5" r="1" fill="#121331" />
      <circle cx="16.5" cy="16.5" r="1" fill="#121331" />
      <circle cx="16.5" cy="13" r="1" fill="#121331" />
      <circle cx="12.5" cy="13" r="1" fill="#121331" />
      <circle cx="8.5" cy="13" r="1" fill="#121331" />
    </svg>
  );
}

function AnalyticsHoverIcon() {
  return (
    <svg
      className="add-row-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#121331" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M5.25 20.25h1.5a1 1 0 0 0 1-1v-5.5a1 1 0 0 0-1-1h-1.5a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1m13 0h1.5a1 1 0 0 0 1-1v-9.5a1 1 0 0 0-1-1h-1.5a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1m-6.5 0h1.5a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1h-1.5a1 1 0 0 0-1 1v13.5a1 1 0 0 0 1 1" />
      </g>
    </svg>
  );
}

function HeartHoverIcon() {
  return (
    <AddMenuIcon>
      <path
        fill="#121331"
        d="M12.595 5.094a5.877 5.877 0 0 1 8.433 8.184l-7.79 7.795a1.75 1.75 0 0 1-2.475 0L2.97 13.28a1 1 0 0 1-.06-.068A5.877 5.877 0 1 1 12 5.789q.265-.366.595-.695m7.25 1.06a4.376 4.376 0 0 0-7.15 1.446.75.75 0 0 1-1.39 0 4.377 4.377 0 1 0-7.23 4.663l7.748 7.75.02.017a.25.25 0 0 0 .334-.017l7.779-7.784a4.376 4.376 0 0 0-.111-6.074"
      />
    </AddMenuIcon>
  );
}

function StoreHoverIcon() {
  return (
    <svg
      className="add-row-svg"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="#121331"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 19.25V11.25"
      />
      <path
        stroke="#121331"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 11.25V19.25H10.75V11.25"
      />
      <path
        stroke="#121331"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 11.25H19.25c1.32 0 2.27-1.25 1.93-2.52l-1.07-3.98H3.82l-1.07 3.98c-.34 1.27.61 2.52 1.93 2.52Z"
      />
    </svg>
  );
}

const ADD_ITEMS: AddItem[] = [
  { id: 'news', label: 'עדכון חדש', Icon: HomePinchIcon },
  { id: 'events', label: 'אירוע חדש', Icon: CalendarHoverIcon },
  { id: 'polls', label: 'סקר חדש', Icon: AnalyticsHoverIcon },
  { id: 'volunteer', label: 'בקשת התנדבות חדשה', Icon: HeartHoverIcon },
  { id: 'marketplace', label: 'מוצר חדש במרקטפלייס', Icon: StoreHoverIcon },
];

type AddMenuProps = {
  open: boolean;
  onClose: () => void;
};

const THEME_META = () => document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

export default function AddMenu({ open, onClose }: AddMenuProps) {
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
              onClick={onClose}
            >
              <span className="add-row-icon" aria-hidden="true">
                <item.Icon />
              </span>
              <span className="add-row-label text-small-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
